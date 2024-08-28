from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from joblib import load
from sqlalchemy import create_engine
from ast import literal_eval
from scipy.spatial.distance import cosine

app = Flask(__name__)

# Load the KMeans model and all_genres set
kmeans_model = load('./models/kmeans_model.joblib')
all_genres = load('./models/all_genres.joblib')

# Database connection parameters
db_params = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root1234',
    'database': 'compass'
}

# Create SQLAlchemy engine
engine = create_engine(f"mysql+pymysql://{db_params['user']}:{db_params['password']}@{db_params['host']}/{db_params['database']}")

def load_data_from_mysql():
    try:
        query = "SELECT * FROM books"
        df = pd.read_sql(query, engine)
        return df
    except Exception as e:
        print(f"Error: {e}")
        return None

# Load the data
df = load_data_from_mysql()

if df is not None:
    # Preprocess the data
    def preprocess_genre_dict(genre_dict_str):
        try:
            genre_dict = literal_eval(genre_dict_str)
            return {k.lower(): v for k, v in genre_dict.items()}
        except:
            return {}

    df['genre_dict'] = df['genre_dict'].apply(preprocess_genre_dict)

    # Create genre vectors
    def create_genre_vector(genre_dict):
        return [genre_dict.get(genre, 0) for genre in all_genres]

    df['genre_vector'] = df['genre_dict'].apply(create_genre_vector)

    # Normalize genre vectors
    genre_vectors = np.array(df['genre_vector'].tolist())
    genre_vectors = genre_vectors / (genre_vectors.sum(axis=1)[:, np.newaxis] + 1e-10)

    # Assign clusters
    df['cluster'] = kmeans_model.predict(genre_vectors)

    def get_similar_books(input_books, n=10, less_known=False):
        input_vectors = genre_vectors[df['title'].isin(input_books)]
        if len(input_vectors) == 0:
            return []

        centroid = input_vectors.mean(axis=0)
        similarities = [1 - cosine(centroid, vec) for vec in genre_vectors]

        if less_known:
            popularity = df['rating_count'] * df['average_rating']
            adjusted_popularity = np.clip(popularity, 1, None)
            similarities = [sim / (pop ** 0.5) for sim, pop in zip(similarities, adjusted_popularity)]

        similar_indices = np.argsort(similarities)[::-1]
        similar_indices = [i for i in similar_indices if df.iloc[i]['title'] not in input_books]

        return df.iloc[similar_indices[:n]]['id'].tolist()

    def get_books_by_genre(genre, n=10):
        genre = genre.lower()
        genre_scores = df['genre_dict'].apply(lambda x: x.get(genre, 0))
        top_indices = genre_scores.nlargest(n).index
        return df.loc[top_indices, 'id'].tolist()

    @app.route('/recommend-similar-books', methods=['POST'])
    def api_recommend_similar_books():
        data = request.json
        book_titles = data.get('book_titles', [])
        recommendations = get_similar_books(book_titles)
        return jsonify(recommendations)

    @app.route('/recommend-books-by-sub-genre', methods=['POST'])
    def api_recommend_books_by_sub_genre():
        data = request.json
        sub_genre = data.get('sub_genre')
        recommendations = get_books_by_genre(sub_genre)
        return jsonify(recommendations)

else:
    print("Failed to load data from the database. The app will not function correctly.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)