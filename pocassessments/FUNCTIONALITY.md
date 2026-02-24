# POC Assessments - Functionality Document

## Project Overview
**pocassessments** is a voice-based mental health assessment application that enables users to complete standardized psychological assessments using speech recognition and text-to-speech technology. The application is designed for accessibility and ease of use, allowing users to respond to assessment questions using their voice.

---

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 with Web Speech API (Speech Recognition & Synthesis)
- **Backend**: FastAPI (Python)
- **Database**: MySQL with SQLAlchemy ORM
- **Additional**: Pydantic for data validation

---

## Backend Functionality

### 1. FastAPI Server (`main.py`)

#### Endpoints

##### POST `/items2/`
**Purpose**: Submit and score assessment responses
- **Request Body**:
  ```json
  {
    "user_id": "string",
    "assessment_type": "string",
    "responses_json": [0, 1, 2, 3, ...],
    "total_score": "integer",
    "severity": "string",
    "risk_flag": "boolean"
  }
  ```
- **Response**:
  ```json
  {
    "total_score": "integer"
  }
  ```
- **Function**: Accepts assessment responses and calculates scoring

##### POST `/openaitest/`
**Purpose**: OpenAI API integration (placeholder)
- **Request Body**:
  ```json
  {
    "input": "string"
  }
  ```
- **Response**:
  ```json
  {
    "summary": "AI-generated summary"
  }
  ```
- **Function**: Intended for AI-powered assessment summaries (not yet implemented)

---

### 2. Scoring Logic (`scoring.py`)

#### `score_assessment(responses_json)`
Calculates comprehensive assessment results from user responses.

**Inputs**: List of integer responses (0-3 scale per answer)

**Outputs**:
- `total_score`: Sum of all response values
- `severity`: Classification level based on score
- `risk_flag`: Boolean indicating high-risk response (9th question > 0)

#### Severity Classification
| Score Range | Severity Level |
|-------------|----------------|
| 0-4 | Minimal |
| 5-9 | Mild |
| 10-14 | Moderate |
| 15-19 | Moderately Severe |
| 20+ | Severe |

#### Risk Flag Detection
Triggered when the 9th question (index 8) response value is greater than 0, indicating potential safety concerns.

---

### 3. Data Models (`models.py`)

#### Item2 Model
Represents a complete assessment submission:
- `user_id`: Unique identifier for the user
- `assessment_type`: Type of assessment (e.g., "depression", "anxiety")
- `responses_json`: Array of 0-3 integer responses
- `total_score`: Calculated score
- `severity`: Classification outcome
- `risk_flag`: Safety indicator

#### openaichat Model
Placeholder for OpenAI integration:
- `input`: Text input for AI processing

---

### 4. Database Configuration (`database.py`)

**Database**: MySQL
**Default Connection String**: `mysql+pymysql://root:''@localhost/pocassessments`

**ORM**: SQLAlchemy with metadata-based table creation

---

## Frontend Functionality

### 1. Main Application (`App.js`)

#### Features
1. **User Information Collection**
   - Name and email input fields
   - User identification for assessment tracking

2. **Speech Recognition Integration**
   - Microphone access request and permission handling
   - Speech-to-text conversion for user responses
   - Automatic language detection (English-US)

3. **Speech Synthesis**
   - Text-to-speech for question delivery
   - Natural language question presentation
   - Automatic speech start after question narration

4. **Assessment Flow**
   - Sequential question presentation
   - Response validation against provided options
   - Navigation through question sequence
   - Assessment completion on final question

#### Assessment Questions
The application includes a question bank with multiple-choice options:
- Question 1: Depression assessment ("feeling down, depressed, or hopeless")
- Question 2: Anxiety assessment ("feeling nervous, anxious, or on edge")
- *Additional questions expandable as needed*

Each question has four response options:
- "Not at all" (0 points)
- "Several days" (1 point)
- "More than half the days" (2 points)
- "Nearly every day" (3 points)

#### Response Handling
- Accepts voice input matching predefined options
- Validates voice responses against option list
- Allows manual option selection via UI buttons
- Stores all responses in component state
- Submits complete response set upon assessment completion

---

### 2. Component Architecture

#### AssessmentFlowController
**Purpose**: Main orchestration component
- Composes VoiceInput, ProgressTracker, and ConfirmationUI
- Manages overall assessment flow coordination

#### VoiceInput
**Purpose**: Voice capture and processing
- Handles speech recognition setup
- Processes voice input from users
- Manages microphone interaction

#### ProgressTracker
**Purpose**: Assessment progress display
- Shows current question number/total
- Displays completion percentage
- Provides visual progress feedback

#### ConfirmationUI
**Purpose**: Response confirmation
- Displays detected responses
- Allows response correction
- Confirms before submission

---

## Database Schema

### Users Table
```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Assessments Table
```sql
CREATE TABLE Assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    severity_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Responses Table
```sql
CREATE TABLE Responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES Assessments(id)
);
```

### Questions Table
```sql
CREATE TABLE Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## User Workflows

### Complete Assessment Workflow
1. **Start**: User accesses application homepage
2. **User Info**: Enter name and email
3. **Request Permissions**: Grant microphone access
4. **Assessment Loop**:
   - Question is read aloud via text-to-speech
   - Speech recognition listens for user response
   - User provides voice response matching option
   - Response is validated and stored
   - Progress tracker updates
5. **Completion**: All questions answered
6. **Submission**: Responses sent to backend via `/items2/` endpoint
7. **Scoring**: Backend calculates score, severity, and risk flag
8. **Result**: Assessment result returned and displayed

### Alternative Response Method
- Users can click response buttons instead of speaking
- Useful for noisy environments or accessibility needs
- Same validation and storage as voice responses

---

## Data Flow Diagrams

### Frontend to Backend
```
User Voice Input
    ↓
Speech Recognition (Web API)
    ↓
Response Validation (Client)
    ↓
Store in State (App Component)
    ↓
Submit via POST /items2/
    ↓
Backend Scoring
    ↓
Return Results
```

### Database Persistence
```
Assessment Submission
    ↓
Create Assessment Record
    ↓
Create Response Records (1 per question)
    ↓
Link to User Account
    ↓
Store Metadata (timestamps, scores)
```

---

## Key Features Summary

| Feature | Implementation | Status |
|---------|---------------|----|
| Voice-based assessment | Web Speech API | ✅ Implemented |
| Multi-question flow | React state management | ✅ Implemented |
| Response scoring | Scoring algorithm | ✅ Implemented |
| Severity classification | Score thresholds | ✅ Implemented |
| Risk flag detection | Q9 response check | ✅ Implemented |
| User persistence | MySQL + SQLAlchemy | ✅ Setup ready |
| Speech synthesis | Web Speech API | ✅ Implemented |
| OpenAI integration | Placeholder endpoints | ⏳ Not implemented |
| Response validation | Client-side matching | ✅ Implemented |
| Progress tracking | UI component ready | ✅ Setup ready |
| Manual response entry | Button-based input | ✅ Implemented |

---

## API Contract Summary

### Request/Response Examples

**Assessment Submission Request**
```bash
POST http://localhost:8000/items2/
Content-Type: application/json

{
  "user_id": "user_123",
  "assessment_type": "depression_screening",
  "responses_json": [2, 1, 3, 0, 1, 2, 1, 0, 2],
  "total_score": 13,
  "severity": "Moderate",
  "risk_flag": false
}
```

**Assessment Submission Response**
```json
{
  "total_score": 13
}
```

---

## Configuration & Setup

### Backend Configuration
- **Port**: 8000 (default FastAPI)
- **Database URL**: Configurable in `database.py`
- **CORS**: May need configuration for cross-origin requests
- **Hot Reload**: Enabled in development mode

### Frontend Configuration
- **Port**: 3000 (default React)
- **API Base URL**: Currently hardcoded (should be parameterized)
- **Speech Recognition**: English-US language setting (configurable)
- **Browser Support**: Requires modern browser with Web Speech API support

---

## Future Enhancement Opportunities

1. **Persistence Integration**
   - Complete backend-database integration
   - User registration and authentication

2. **OpenAI Integration**
   - Implement AI-powered summary generation
   - Natural language processing of responses

3. **Advanced Analytics**
   - Historical assessment tracking
   - Trend analysis for users
   - Demographic reporting

4. **Additional Assessments**
   - Support multiple assessment types
   - Customizable question banks
   - Multi-language support

5. **Security & Privacy**
   - HTTPS enforcement
   - Data encryption
   - HIPAA compliance for healthcare data

6. **UI/UX Improvements**
   - Enhanced visual feedback during voice input
   - Result presentation dashboard
   - Export assessment reports
# Project Architecture and Functional Flow

## Overview

The `pocassessments` project is designed to provide a comprehensive mental health assessment tool using the PHQ-9 and GAD-7 questionnaires. It consists of a backend server built with FastAPI and a frontend application developed with React.

## Project Architecture

### Backend

- **Framework**: FastAPI
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **Key Components**:
  - `main.py`: Initializes the FastAPI application and defines API endpoints.
  - `database.py`: Configures the database connection and defines the database schema using SQLAlchemy.
  - `models.py`: Contains Pydantic models for request validation.
  - `scoring.py`: Implements the logic for scoring assessments.
  - `setup_db.py`: Script to initialize and populate the database.

### Frontend

- **Framework**: React
- **Key Components**:
  - `App.js`: Main application component that handles the assessment flow and user interactions.
  - `AssessmentFlowController.js`: Manages the flow of the assessment process.
  - `VoiceInput.js`: Handles voice input using the Web Speech API.
  - `ProgressTracker.js`: Displays the progress of the assessment.
  - `ConfirmationUI.js`: Provides a confirmation interface for user responses.

## Functional Flow

1. **User Registration**:
   - Users enter their name and email to start the assessment.
   - The frontend validates the input and requests microphone access for voice input.

2. **Assessment Process**:
   - The assessment consists of 16 questions (9 for PHQ-9 and 7 for GAD-7).
   - Users can respond by clicking options or using voice input.
   - Responses are recorded and displayed in real-time.

3. **Score Calculation**:
   - Scores for PHQ-9 and GAD-7 are calculated based on user responses.
   - Severity levels are determined using predefined thresholds.

4. **Result Submission**:
   - The final scores and severity levels are submitted to the backend.
   - The backend stores the results in the database and returns a confirmation.

5. **Result Display**:
   - The frontend displays the assessment results, including scores and severity levels.
   - Users can start a new assessment if desired.

## Technical Details

- **Speech Recognition**: Utilizes the Web Speech API for voice input.
- **Data Persistence**: Uses MySQL for storing user data and assessment results.
- **API Communication**: The frontend communicates with the backend via RESTful API endpoints.
- **Error Handling**: Implements error handling for network issues and invalid inputs.

This document provides a high-level overview of the project's architecture and functional flow. For more detailed information, refer to the source code and comments within the project files.
