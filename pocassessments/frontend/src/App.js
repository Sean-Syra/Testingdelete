import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const PHQ9_GAD7_QUESTIONS = [
  // PHQ-9 Questions (1-9)
  { id: 1, text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 2, text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 3, text: "Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 4, text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 5, text: "Over the last 2 weeks, how often have you had poor appetite or been overeating?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 6, text: "Over the last 2 weeks, how often have you felt bad about yourself or that you are a failure?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 7, text: "Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading the newspaper or watching television?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 8, text: "Over the last 2 weeks, how often have you been moving or speaking so slowly that other people could have noticed? Or the opposite, being so fidgety or restless that you have been moving around a lot more than usual?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 9, text: "Over the last 2 weeks, how often have you had thoughts that you would be better off dead, or of hurting yourself in some way?", type: "PHQ9", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  
  // GAD-7 Questions (10-16)
  { id: 10, text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious or on edge?", type: "GAD7", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 11, text: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?", type: "GAD7", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 12, text: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?", type: "GAD7", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 13, text: "Over the last 2 weeks, how often have you had trouble relaxing?", type: "GAD7", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 14, text: "Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?", type: "GAD7", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 15, text: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?", type: "GAD7", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 16, text: "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?", type: "GAD7", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
];

const getOptionValue = (option) => {
  const valueMap = {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
  };
  return valueMap[option] || 0;
};

function App() {
  const [stage, setStage] = useState('userInfo');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isMicAccessGranted, setIsMicAccessGranted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningFeedback, setListeningFeedback] = useState('');
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [submittingData, setSubmittingData] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize speech APIs
  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setListeningFeedback('Listening... Please speak your answer.');
      };

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        const currentQuestion = PHQ9_GAD7_QUESTIONS[currentQuestionIndex];
        const matchedOption = currentQuestion.options.find(option => option.toLowerCase() === speechResult);
        
        if (matchedOption) {
          setListeningFeedback(`Heard: "${matchedOption}". Saving...`);
          setTimeout(() => handleResponse(matchedOption), 500);
        } else {
          setListeningFeedback(`Sorry, I didn't understand. Please try again or click an option.`);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setListeningFeedback(`Error: ${event.error}. Please try again.`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [currentQuestionIndex]);

  const handleStartAssessment = async () => {
    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicAccessGranted(true);
      setStage('assessment');
      speakQuestion(0);
    } catch (error) {
      alert('Microphone access denied. You can still use the button options.');
      setIsMicAccessGranted(false);
      setStage('assessment');
    }
  };

  const speakQuestion = (index) => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    const question = PHQ9_GAD7_QUESTIONS[index];
    const utterance = new SpeechSynthesisUtterance(`Question ${index + 1}. ${question.text}`);
    utterance.rate = 0.9;
    if (synthRef.current) {
      synthRef.current.speak(utterance);
    }
  };

  const handleResponse = (selectedOption) => {
    const currentQuestion = PHQ9_GAD7_QUESTIONS[currentQuestionIndex];
    
    const newResponses = {
      ...responses,
      [currentQuestion.id]: selectedOption
    };
    setResponses(newResponses);
    setListeningFeedback('');

    if (currentQuestionIndex < PHQ9_GAD7_QUESTIONS.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => speakQuestion(nextIndex), 300);
    } else {
      submitAssessment(newResponses);
    }
  };

  const handleVoiceInput = () => {
    if (recognitionRef.current && isMicAccessGranted) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const submitAssessment = async (finalResponses) => {
    setSubmittingData(true);

    const phq9Score = Object.keys(finalResponses)
      .filter(qId => {
        const q = PHQ9_GAD7_QUESTIONS.find(q => q.id === parseInt(qId));
        return q && q.type === 'PHQ9';
      })
      .reduce((sum, qId) => sum + getOptionValue(finalResponses[qId]), 0);

    const gad7Score = Object.keys(finalResponses)
      .filter(qId => {
        const q = PHQ9_GAD7_QUESTIONS.find(q => q.id === parseInt(qId));
        return q && q.type === 'GAD7';
      })
      .reduce((sum, qId) => sum + getOptionValue(finalResponses[qId]), 0);

    const results = calculateSeverities(phq9Score, gad7Score, finalResponses);

    try {
      const responseValues = PHQ9_GAD7_QUESTIONS.map(q => getOptionValue(finalResponses[q.id]));
      
      const payload = {
        user_id: email,
        user_name: name,
        user_email: email,
        assessment_type: 'PHQ9_GAD7',
        responses_json: responseValues,
        phq9_score: phq9Score,
        gad7_score: gad7Score,
        phq9_severity: results.phq9Severity,
        gad7_severity: results.gad7Severity,
        depression_severity: results.depressionSeverity,
        anxiety_severity: results.anxietySeverity,
        insomnia_severity: results.insomniaSeverity,
        anger_severity: results.angerSeverity
      };

      const response = await fetch('http://localhost:8000/items2/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAssessmentResults(results);
        setStage('results');
      } else {
        alert('Error saving assessment. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting assessment: ' + error.message);
    } finally {
      setSubmittingData(false);
    }
  };

  const calculateSeverities = (phq9Score, gad7Score, finalResponses) => {
    const getSeverity = (score, maxScore, minMild, minModerate, minSevere) => {
      if (score === 0) return 'Minimal';
      if (score < minMild) return 'Minimal';
      if (score < minModerate) return 'Mild';
      if (score < minSevere) return 'Moderate';
      return 'Severe';
    };

    const phq9Severity = getSeverity(phq9Score, 27, 5, 10, 15);
    const gad7Severity = getSeverity(gad7Score, 21, 5, 10, 15);

    const insomniaScore = getOptionValue(finalResponses[3]);
    const insomniaSeverity = insomniaScore === 0 ? 'Minimal' : insomniaScore === 1 ? 'Mild' : insomniaScore <= 2 ? 'Moderate' : 'Severe';

    const angerScore = getOptionValue(finalResponses[15]);
    const angerSeverity = angerScore === 0 ? 'Minimal' : angerScore === 1 ? 'Mild' : angerScore <= 2 ? 'Moderate' : 'Severe';

    return {
      phq9Score,
      gad7Score,
      phq9Severity,
      gad7Severity,
      depressionSeverity: phq9Severity,
      anxietySeverity: gad7Severity,
      insomniaSeverity,
      angerSeverity
    };
  };

  const resetAssessment = () => {
    setStage('userInfo');
    setName('');
    setEmail('');
    setCurrentQuestionIndex(0);
    setResponses({});
    setAssessmentResults(null);
  };

  const currentQuestion = PHQ9_GAD7_QUESTIONS[currentQuestionIndex];

  return (
    <div className="App">
      {stage === 'userInfo' && (
        <div className="container user-info-container">
          <h1>Mental Health Assessment</h1>
          <p className="subtitle">PHQ-9 & GAD-7 Screening Tool</p>
          
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <p className="info-text">This assessment consists of 16 questions and takes approximately 5-10 minutes to complete. You can either speak your answers or click the buttons.</p>

          <button className="btn btn-primary" onClick={handleStartAssessment}>Start Assessment</button>
        </div>
      )}

      {stage === 'assessment' && (
        <div className="container assessment-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentQuestionIndex + 1) / PHQ9_GAD7_QUESTIONS.length) * 100}%` }}></div>
          </div>
          <p className="progress-text">Question {currentQuestionIndex + 1} of {PHQ9_GAD7_QUESTIONS.length}</p>

          <div className="question-section">
            <h2>{currentQuestion.text}</h2>
            <p className="question-type">{currentQuestion.type === 'PHQ9' ? 'Depression/Mood' : 'Anxiety'}</p>
          </div>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleResponse(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {isMicAccessGranted && (
            <div className="voice-section">
              <button 
                className={`btn ${isListening ? 'btn-listening' : 'btn-voice'}`}
                onClick={handleVoiceInput}
              >
                {isListening ? '🎤 Listening...' : '🎤 Speak Answer'}
              </button>
              {listeningFeedback && <p className="feedback">{listeningFeedback}</p>}
            </div>
          )}

          {submittingData && <p className="submitting-text">Submitting your assessment...</p>}
        </div>
      )}

      {stage === 'results' && assessmentResults && (
        <div className="container results-container">
          <h1>Your Assessment Results</h1>
          <p className="user-greeting">Thank you, {name}!</p>

          <div className="results-grid">
            <div className="result-card depression">
              <h3>Depression</h3>
              <p className="score">PHQ-9 Score: {assessmentResults.phq9Score} / 27</p>
              <p className={`severity severity-${assessmentResults.phq9Severity.toLowerCase().replace(' ', '-')}`}>
                {assessmentResults.phq9Severity}
              </p>
            </div>

            <div className="result-card anxiety">
              <h3>Anxiety</h3>
              <p className="score">GAD-7 Score: {assessmentResults.gad7Score} / 21</p>
              <p className={`severity severity-${assessmentResults.gad7Severity.toLowerCase().replace(' ', '-')}`}>
                {assessmentResults.gad7Severity}
              </p>
            </div>

            <div className="result-card insomnia">
              <h3>Insomnia</h3>
              <p className="score">Single Item: 0-3 Scale</p>
              <p className={`severity severity-${assessmentResults.insomniaSeverity.toLowerCase()}`}>
                {assessmentResults.insomniaSeverity}
              </p>
            </div>

            <div className="result-card anger">
              <h3>Anger/Irritability</h3>
              <p className="score">Single Item: 0-3 Scale</p>
              <p className={`severity severity-${assessmentResults.angerSeverity.toLowerCase()}`}>
                {assessmentResults.angerSeverity}
              </p>
            </div>
          </div>

          <div className="results-info">
            <h3>What do these results mean?</h3>
            <ul>
              <li><strong>Minimal:</strong> Minimal symptoms, no clinical concern</li>
              <li><strong>Mild:</strong> Mild symptoms, monitor and consider self-care</li>
              <li><strong>Moderate:</strong> Moderate symptoms, consider professional support</li>
              <li><strong>Severe:</strong> Severe symptoms, strongly recommend professional evaluation</li>
            </ul>
          </div>

          <p className="disclaimer">
            Disclaimer: This assessment is a screening tool and not a diagnostic instrument. Please consult a mental health professional for proper diagnosis and treatment.
          </p>

          <button className="btn btn-primary" onClick={resetAssessment}>Start New Assessment</button>
        </div>
      )}
    </div>
  );
}

export default App;
