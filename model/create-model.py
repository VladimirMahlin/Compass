import os
import pandas as pd
import numpy as np
from joblib import dump
from sklearn.cluster import KMeans
from ast import literal_eval
import mysql.connector
from mysql.connector import Error

# MySQL connection parameters
db_params = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root1234',
    'database': 'compass'
}

def load_data_from_mysql():
    try:
        conn = mysql.connector.connect(**db_params)
        query = "SELECT * FROM books"
        df = pd.read_sql(query, conn)
        return df
    except Error as e:
        print(f"Error: {e}")
        return None
    finally:
        if conn.is_connected():
            conn.close()

# Load the data from the database
df = load_data_from_mysql()

if df is not None:
    print("Data loaded successfully. Shape:", df.shape)

    # Preprocess the data
    def preprocess_genre_dict(genre_dict_str):
        try:
            genre_dict = literal_eval(genre_dict_str)
            return {k.lower(): v for k, v in genre_dict.items()}
        except:
            return {}

    df['genre_dict'] = df['genre_dict'].apply(preprocess_genre_dict)

    # Create a set of all genres
    all_genres = set()
    for genre_dict in df['genre_dict']:
        all_genres.update(genre_dict.keys())

    # Create genre vectors
    def create_genre_vector(genre_dict):
        return [genre_dict.get(genre, 0) for genre in all_genres]

    df['genre_vector'] = df['genre_dict'].apply(create_genre_vector)

    # Normalize genre vectors
    genre_vectors = np.array(df['genre_vector'].tolist())
    genre_vectors = genre_vectors / (genre_vectors.sum(axis=1)[:, np.newaxis] + 1e-10)

    # Train the model
    n_clusters = 28
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    df['cluster'] = kmeans.fit_predict(genre_vectors)

    print(f"KMeans model created with {n_clusters} clusters.")
    print("Cluster distribution:")
    print(df['cluster'].value_counts())

    # Save the model
    model_dir = 'models'
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    model_path = os.path.join(model_dir, 'kmeans_model.joblib')
    dump(kmeans, model_path)
    print(f"Model saved to {model_path}")

    # Save the all_genres set
    genres_path = os.path.join(model_dir, 'all_genres.joblib')
    dump(all_genres, genres_path)
    print(f"All genres saved to {genres_path}")


else:
    print("Failed to load data from the database.")