# Project Setup

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd pocassessments/backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd pocassessments/frontend
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Run the React app:**
   ```bash
   npm start
   ```

## Database Setup

1. **Database Configuration:**
   - The project uses MySQL as the default database.
   - The database URL is configured in `database.py` as `mysql+pymysql://username:password@localhost/dbname`.
   - Replace `username`, `password`, `localhost`, and `dbname` with your MySQL credentials and database name.
   - You can change the database URL to point to your preferred database.

2. **Initialize the Database:**
   - Navigate to the backend directory:
     ```bash
     cd pocassessments/backend
     ```
   - Ensure your MySQL server is running and accessible.
   - Run the database setup script:
     ```bash
     python setup_db.py
     ```
   - This will create the necessary tables in the database.

3. **Table Definitions:**
   - Define your database tables in `database.py` using SQLAlchemy.
   - Ensure all table definitions are added to the `metadata` object for proper initialization.

## Running the Project

- Start the backend server and the frontend application as described above.
- Access the application via your web browser at `http://localhost:3000`.

## Running the Project

- Start the backend server and the frontend application as described above.
- Access the application via your web browser at `http://localhost:3000`.

