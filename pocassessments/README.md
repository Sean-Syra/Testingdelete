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

## Score Calculation Logic

### PHQ-9 and GAD-7 Scoring

The project includes logic for calculating scores for the PHQ-9 and GAD-7 assessments, which are used to screen for depression and anxiety, respectively.

1. **PHQ-9 Score Calculation**:
   - The PHQ-9 score is calculated by summing the values of the responses to the PHQ-9 questions (questions 1-9).
   - Each response option has a corresponding value:
     - "Not at all" = 0
     - "Several days" = 1
     - "More than half the days" = 2
     - "Nearly every day" = 3
   - The total score is the sum of these values for all PHQ-9 questions.

2. **GAD-7 Score Calculation**:
   - The GAD-7 score is calculated similarly by summing the values of the responses to the GAD-7 questions (questions 10-16).
   - The response options and their values are the same as for the PHQ-9.

3. **Severity Calculation**:
   - The severity for both PHQ-9 and GAD-7 is determined based on the total score using predefined thresholds:
     - Minimal: 0-4
     - Mild: 5-9
     - Moderate: 10-14
     - Severe: 15-21 (for GAD-7) and 15-27 (for PHQ-9)

These calculations are implemented in the frontend application to provide users with an assessment of their mental health status.

## Running the Project

- Start the backend server and the frontend application as described above.
- Access the application via your web browser at `http://localhost:3000`.

## Running the Project

- Start the backend server and the frontend application as described above.
- Access the application via your web browser at `http://localhost:3000`.

