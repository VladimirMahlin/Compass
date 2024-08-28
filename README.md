# Compass: Book Recommendation Web Application

## Introduction
This project is a web application that involves three main components: the model, backend, and frontend. This guide will walk you through the steps required to start each of these components on a Windows machine.

## Prerequisites

Before you begin, ensure that you have the following installed on your system:

- **Node.js** (v14.x or later)
- **Python** (v3.x) with necessary dependencies for the model
- **npm** (Node Package Manager, usually comes with Node.js)
- **pip** (Python Package Manager)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VladimirMahlin/Compass.git
cd Compass
```

### 2. Install Dependencies

#### Backend

Navigate to the `backend` directory and install the required dependencies:

```bash
cd backend
npm install
```

#### Frontend

Navigate to the `frontend` directory and install the required dependencies:

```bash
cd frontend
npm install
```

## Running the Application

### Step 1: Start the Model

1. Navigate to the `model` directory:

   ```bash
   cd model
   ```

2. Create a virtual environment and install the required dependencies:
    ```bash
    python -m venv venv
   
    # On Windows
    .\venv\Scripts\activate
   
    # On Linux/Mac
    source venv/bin/activate
    ```
   
   ```bash
   pip install -r requirements.txt
   ```
3. Transfer books data to the database:

   ```bash
   python transfer-from-csv-to-mysql.py
   ```

4. Start the model service:

   ```bash
   FLASK_APP=app.py flask run --host=0.0.0.0 --port=3002
   ```

   This will start the model on the configured port (default: `3002`).

### Step 2: Start the Backend

1. Navigate to the `backend` directory (if not already there):

   ```bash
   cd backend
   ```

2. Start the backend server:

   ```bash
   node app
   ```

   This will start the backend server on the configured port (default: `3001`).

### Step 3: Start the Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Start the frontend server:

   ```bash
   npm start
   ```

   This will start the frontend server on the configured port (default: `3000`).

## Accessing the Application

Once all the components are running:

- Open your web browser and go to `http://localhost:3000` to access the frontend.
- The frontend will communicate with the backend at `http://localhost:3001`.
- The backend will communicate with the model at `http://localhost:3002`.