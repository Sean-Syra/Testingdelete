Syrenity – Voice-Based PHQ-9 & GAD-7 Assessment (POC)
1. Objective
Develop a Proof of Concept (POC) for AI-assisted voice-based assessment using PHQ-9 and GAD-7 questionnaires in a ReactJS web application. The goal is to improve onboarding completion rates and user engagement while maintaining deterministic clinical scoring.

2. Scope (POC Only)
Included:
•	PHQ-9 assessment (9 questions)
•	GAD-7 assessment (7 questions)
•	Voice input using Web Speech API
•	Deterministic mapping logic
•	Backend scoring service
•	AI-generated summary
•	Database storage of results
Excluded:
•	Therapist dashboard
•	Advanced sentiment analysis
•	Telehealth escalation workflow

3. Architecture Plan
Frontend (ReactJS):
•	Assessment Flow Controller
•	Web Speech API (SpeechRecognition)
•	Text-to-Speech (SpeechSynthesis)
•	Deterministic Response Mapper
•	Progress Tracker & Confirmation UI
Backend (Python FastAPI):
•	Assessment Scoring Engine (deterministic)
•	Severity Classification Logic
•	Risk Flag Detection (Q9 handling)
•	AI Summary Service (LLM integration)
•	Database Storage API

4. Voice Processing Flow
    1. Question displayed and read aloud using TTS.
    2. User speaks response.
    3. Web Speech API converts speech to text.
    4. Deterministic mapping function maps transcript to numeric value (0–3).
    5. Confirmation step shown to user.
    6. Response stored in local state.
    7. Final responses sent to backend for scoring.


5. Deterministic Scoring Logic

PHQ-9 Scoring:
•	0–4: Minimal
•	5–9: Mild
•	10–14: Moderate
•	15–19: Moderately Severe
•	20–27: Severe

If Question 9 > 0 → risk_flag = TRUE

GAD-7 Scoring:
•	0–4: Minimal
•	5–9: Mild
•	10–14: Moderate
•	15–21: Severe

6. Database Plan
Table: user_assessments
Fields:
•	id (UUID)
•	user_id (UUID)
•	assessment_type (ENUM: PHQ9, GAD7)
•	responses_json (JSON)
•	total_score (INT)
•	severity (VARCHAR)
•	risk_flag (BOOLEAN)
•	created_at (TIMESTAMP)

7. Tech Stack
Frontend:
•	ReactJS
•	Web Speech API (SpeechRecognition)
•	SpeechSynthesis API (TTS)
•	Axios (API calls)
Backend:
•	Python FastAPI
•	PostgreSQL
•	OpenAI/Claude API (AI summary generation)
•	JWT Authentication

8. Security & Compliance Considerations
•	HTTPS enforced for all communication
•	No raw audio stored (POC phase)
•	Encrypt sensitive health data at rest
•	User consent before microphone access
•	Avoid diagnostic language in AI summaries

9. POC Success Metrics
•	Assessment completion rate increase ≥ 15%
•	Mapping accuracy ≥ 95%
•	Reduced drop-off between Q4–Q6
•	Improved Day-7 retention ≥ 10%
