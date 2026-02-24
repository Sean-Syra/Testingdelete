-- List of Tables and MySQL CREATE TABLE Commands for pocassessments

-- Table: Assessments
CREATE TABLE Assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(100) NOT NULL,
    phq9_score INT NOT NULL,
    gad7_score INT NOT NULL,
    phq9_severity VARCHAR(50) NOT NULL,
    gad7_severity VARCHAR(50) NOT NULL,
    depression_severity VARCHAR(50) NOT NULL,
    anxiety_severity VARCHAR(50) NOT NULL,
    insomnia_severity VARCHAR(50) NOT NULL,
    anger_severity VARCHAR(50) NOT NULL,
    responses_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Table: Users
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Responses
CREATE TABLE Responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    response_text VARCHAR(255) NOT NULL,
    response_value INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES Assessments(id)
);

-- Table: Questions
CREATE TABLE Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add more tables as needed for your project
