# First-Time Installation

Before installing change the MySQL password in the those files to your MySQL password.
- Compass/model/transfer-from-csv-to-mysql.py
- Compass/backend/.env
- Compass/model/app.py

1. **Set up a virtual environment (venv):**
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment:**
    - On Mac:
      ```bash
      source ./venv/bin/activate
      ```
    - On Windows:
      ```bash
      venv\Scripts\activate
      ```

3. **Install the required libraries:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the model:**
   ```bash
   python model.py
   ```
   or
   ```bash
   python3 model.py
   ```
   if the previous command doesn't work.

5. **During the setup process, you will be asked the following questions:**
    1. Windows or Mac?
    2. Enter your MySQL host (e.g., `localhost`): `localhost`
    3. Enter your MySQL username: *Your local MySQL database login*
    4. Enter your MySQL password: *Your local MySQL database password*

6. **After this, the server will start automatically.**

7. **In another terminal:**
   ```bash
   cd backend
   npm i
   node app
   ```

8. **In yet another terminal:**
   ```bash
   cd frontend
   npm i
   npm start
   ```

# Starting the Project

1. **In the `model` folder:**
    - On Windows:
      ```bash
      venv\Scripts\activate
      set FLASK_APP=app.py
      flask run --host=0.0.0.0 --port=3002
      ```
    - On Mac:
      ```bash
      source ./venv/bin/activate
      export FLASK_APP=app.py
      flask run --host=0.0.0.0 --port=3002
      ```

2. **In the `backend` folder:**
   ```bash
   node app
   ```

3. **In the `frontend` folder:**
   ```bash
   npm start
   ```