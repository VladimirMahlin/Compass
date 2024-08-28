Before setup - change the password in the following files to your MySQL password:
- /model/transfer-from-csv-to-mysql.py
- /model/app.py
- /backend/.env

Requirements:
- Local MySQL server
- Local MongoDB server

### **Windows Setup Instructions**

#### Step 1: Set Up the Virtual Environment
1. Move to the `model` directory:
   ```bash
   cd model
   ```

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   ```bash
   venv\Scripts\activate
   ```

#### Step 2: Install Dependencies
With the virtual environment activated, install the required Python packages:

```bash
pip install -r requirements.txt
```

#### Step 3: Create the MySQL Database
1. Open another terminal.
2. Open your MySQL:

```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
```

```bash
.\mysql -u root -p
```

3. Create the `compass` database:

```sql
CREATE DATABASE compass;
```

4. Create the `users` table:

```sql
USE compass;
```

```sql
CREATE TABLE IF NOT EXISTS users (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    email VARCHAR(100) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   name VARCHAR(100),
   bio TEXT,
   avatar VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
```

5. Close this terminal.

#### Step 4: Run the Data Transfer Script
Ensure the virtual environment is activated, then run the data transfer script:

```bash
python transfer-from-csv-to-mysql.py
```

#### Step 5: Start the Flask Application
With everything set up, start your Flask application:

```bash
set FLASK_APP=app.py
flask run --host=0.0.0.0 --port=3002
```

#### Step 6: MongoDB Setup
1. Open another terminal.
2. Open your MongoDB:

```bash
cd "C:\Program Files\MongoDB\Server\7.0\bin"
```

```bash
mongod
```

3. If error:
```bash
md \data\db
```

```bash
mongod
```

Leave this terminal open.

#### Step 7: Start the Backend Server
1. Open another terminal.
2. Move to the `backend` directory:
   ```bash
   cd backend
   ```

3. Install the required Node.js packages:
   ```bash
    npm install
    ```

4. Start the backend server:
    ```bash
    node app
    ```

#### Step 8: Start the Frontend Server
1. Open another terminal.
2. Move to the `frontend` directory:
   ```bash
   cd frontend
   ```

3. Install the required Node.js packages:
   ```bash
    npm install
    ```

4. Start the frontend server:
    ```bash
    npm start
    ```

---

### **Mac Setup Instructions**

#### Step 1: Set Up the Virtual Environment
1. Move to the `model` directory:
   ```bash
   cd model
   ```

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   ```bash
    source venv/bin/activate
   ```

#### Step 2: Install Dependencies
With the virtual environment activated, install the required Python packages:

```bash
pip install -r requirements.txt
```

#### Step 3: Create the MySQL Database
1. Open another terminal.
2. Open your MySQL:
```bash
mysql -u root -p
```

3. Create the `compass` database:

```sql
CREATE DATABASE compass;
```

4. Create the `users` table:

```sql
USE compass;
```

```sql
CREATE TABLE IF NOT EXISTS users (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    email VARCHAR(100) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   name VARCHAR(100),
   bio TEXT,
   avatar VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
```

5. Close this terminal.

#### Step 4: Run the Data Transfer Script
Ensure the virtual environment is activated, then run the data transfer script:

```bash
python transfer-from-csv-to-mysql.py
```

#### Step 5: Start the Flask Application
With everything set up, start your Flask application:

```bash
export FLASK_APP=app.py
flask run --host=0.0.0.0 --port=3002
```

#### Step 6: Start the Backend Server
1. Open another terminal.
2. Move to the `backend` directory:
   ```bash
   cd backend
   ```

3. Install the required Node.js packages:
   ```bash
    npm install
    ```

4. Start the backend server:
    ```bash
    node app
    ```

#### Step 7: Start the Frontend Server
1. Open another terminal.
2. Move to the `frontend` directory:
   ```bash
   cd frontend
   ```

3. Install the required Node.js packages:
   ```bash
    npm install
    ```

4. Start the frontend server:
    ```bash
    npm start
    ```