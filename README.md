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

## Database Changes

- Ensure your database is running and accessible.
- Apply any necessary migrations or setup scripts as required by your backend.

## Running the Project

- Start the backend server and the frontend application as described above.
- Access the application via your web browser at `http://localhost:3000`.
