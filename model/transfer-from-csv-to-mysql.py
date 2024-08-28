import pandas as pd
import mysql.connector
from mysql.connector import Error
import warnings

warnings.filterwarnings('ignore')

# MySQL connection parameters
db_params = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root1234',
    'database': 'compass'
}

def truncate_string(s, max_length):
    if isinstance(s, str):
        return s[:max_length]
    return s

def ensure_books_table_exists():
    try:
        # Create connection
        conn = mysql.connector.connect(**db_params)
        cursor = conn.cursor()

        # Check if table exists
        cursor.execute("SHOW TABLES LIKE 'books'")
        table_exists = cursor.fetchone()

        if not table_exists:
            print("Creating 'books' table...")
            # Create table with all columns, using TEXT for potentially long string fields
            create_table_query = """
            CREATE TABLE books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                link TEXT,
                series TEXT,
                cover_link TEXT,
                author TEXT,
                author_link TEXT,
                rating_count INT,
                review_count INT,
                average_rating FLOAT,
                five_star_ratings INT,
                four_star_ratings INT,
                three_star_ratings INT,
                two_star_ratings INT,
                one_star_ratings INT,
                number_of_pages INT,
                date_published DATE,
                publisher TEXT,
                original_title TEXT,
                genre_and_votes TEXT,
                isbn VARCHAR(20),
                isbn13 VARCHAR(20),
                asin VARCHAR(20),
                settings TEXT,
                characters TEXT,
                awards TEXT,
                amazon_redirect_link TEXT,
                worldcat_redirect_link TEXT,
                recommended_books TEXT,
                books_in_series TEXT,
                description TEXT,
                genre_dict TEXT,
                main_genres TEXT,
                sub_genres TEXT
            ) ENGINE=InnoDB;
            """
            cursor.execute(create_table_query)
            conn.commit()
            print("Table 'books' created successfully.")

            # Load data from CSV
            df = pd.read_csv('./models/main.csv')

            # Convert date_published to datetime
            df['date_published'] = pd.to_datetime(df['date_published'], errors='coerce')

            # Replace NaN values with None (NULL in SQL)
            df = df.where(pd.notnull(df), None)

            # Truncate string columns to prevent data too long errors
            string_columns = df.select_dtypes(include=['object']).columns
            for col in string_columns:
                df[col] = df[col].apply(lambda x: truncate_string(x, 65535))

            # Prepare data for insertion
            columns = df.columns.tolist()

            # Insert data into the table in chunks
            chunk_size = 1000  # Adjust this value based on your max_allowed_packet setting
            for i in range(0, len(df), chunk_size):
                chunk = df.iloc[i:i + chunk_size]
                values = [tuple(None if pd.isna(x) else x for x in row) for row in chunk.values]

                insert_query = f"INSERT INTO books ({','.join(columns)}) VALUES ({','.join(['%s'] * len(columns))})"
                cursor.executemany(insert_query, values)
                conn.commit()
                print(f"Inserted chunk {i // chunk_size + 1} of {(len(df) - 1) // chunk_size + 1}")

            print("Data loaded into 'books' table successfully.")
        else:
            print("Table 'books' already exists.")

    except Error as e:
        print(f"Error: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Ensure the table exists and data is loaded
ensure_books_table_exists()