import os
import subprocess
import sys
import mysql.connector
from mysql.connector import Error

def run_command(command, cwd=None):
    """Run a command in the terminal."""
    result = subprocess.run(command, cwd=cwd, shell=True)
    if result.returncode != 0:
        print(f"Command failed: {command}")
        sys.exit(1)

def create_database(host, user, password, database_name):
    """Create a MySQL database."""
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        cursor = connection.cursor()
        cursor.execute(f"SHOW DATABASES LIKE '{database_name}'")
        result = cursor.fetchone()
        if result:
            print(f"Database '{database_name}' already exists. Skipping database creation.")
        else:
            cursor.execute(f"CREATE DATABASE {database_name}")
            print(f"Database '{database_name}' created successfully.")
        cursor.close()
        connection.close()
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        sys.exit(1)

def create_users_table(host, user, password, database_name):
    """Create the 'users' table in the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database_name
        )
        cursor = connection.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100),
                bio TEXT,
                avatar VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        print(f"Table 'users' created successfully in the '{database_name}' database.")
        cursor.close()
        connection.close()
    except Error as e:
        print(f"Error while creating 'users' table: {e}")
        sys.exit(1)

def setup_model(os_type, mysql_host, mysql_user, mysql_password):
    # Step 1: Set the repository directory
    repo_dir = "Compass"

    if not os.path.exists(repo_dir):
        print(f"Directory '{repo_dir}' does not exist. Ensure the repository is already cloned.")
        sys.exit(1)

    os.chdir(repo_dir)

    # Step 2: Create the MySQL database
    database_name = "compass"
    create_database(mysql_host, mysql_user, mysql_password, database_name)

    # Step 3: Setup Model environment
    model_dir = os.path.join(os.getcwd(), 'model')
    venv_path = os.path.join(model_dir, 'venv')
    if not os.path.exists(venv_path):
        if os_type == "Windows":
            run_command("python -m venv venv", cwd=model_dir)
        else:
            run_command("python3 -m venv venv", cwd=model_dir)
    else:
        print("Virtual environment already set up. Skipping this step.")

    # Activate the virtual environment and install dependencies
    if os_type == "Windows":
        activate_venv_command = os.path.join(venv_path, 'Scripts', 'activate')
    else:
        activate_venv_command = f"source {os.path.join(venv_path, 'bin', 'activate')}"

    requirements_installed_file = os.path.join(venv_path, 'requirements_installed')

    if not os.path.exists(requirements_installed_file):
        run_command(f"{activate_venv_command} && pip install -r requirements.txt", cwd=model_dir)
        # Create the 'requirements_installed' marker file
        if os_type == "Windows":
            run_command(f"type nul > {requirements_installed_file}")
        else:
            run_command(f"touch {requirements_installed_file}")
    else:
        print("Model dependencies already installed. Skipping this step.")

    # Step 4: Transfer books data to the database
    data_transfer_file = os.path.join(model_dir, 'transfer_completed')
    if not os.path.exists(data_transfer_file):
        run_command(f"{activate_venv_command} && python transfer-from-csv-to-mysql.py", cwd=model_dir)
        # Create the 'transfer_completed' marker file
        if os_type == "Windows":
            run_command(f"type nul > {data_transfer_file}")
        else:
            run_command(f"touch {data_transfer_file}")
    else:
        print("Books data already transferred. Skipping this step.")

    # Step 5: Create the 'users' table
    create_users_table(mysql_host, mysql_user, mysql_password, database_name)

    # Step 6: Start Model Service
    if os_type == "Windows":
        flask_command = f"{activate_venv_command} && set FLASK_APP=app.py && flask run --host=0.0.0.0 --port=3002"
    else:
        flask_command = f"{activate_venv_command} && export FLASK_APP=app.py && flask run --host=0.0.0.0 --port=3002"
    run_command(flask_command, cwd=model_dir)

if __name__ == "__main__":
    os_type = input("Enter your OS type (Windows/Mac): ").strip().capitalize()

    if os_type not in ["Windows", "Mac"]:
        print("Invalid OS type. Please enter 'Windows' or 'Mac'.")
        sys.exit(1)

    mysql_host = input("Enter your MySQL host (e.g., localhost): ").strip()
    mysql_user = input("Enter your MySQL username: ").strip()
    mysql_password = input("Enter your MySQL password: ").strip()

    setup_model(os_type, mysql_host, mysql_user, mysql_password)
