import React, { useState, useEffect } from 'react';

function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isMicAccessGranted, setIsMicAccessGranted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState([]);

    const questions = [
        { text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
        { text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
        // Add more questions as needed
    ];

    const synth = window.speechSynthesis;
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    useEffect(() => {
        if (isMicAccessGranted && currentQuestionIndex < questions.length) {
            askQuestion();
        }
    }, [isMicAccessGranted, currentQuestionIndex]);

    const askQuestion = () => {
        const utterThis = new SpeechSynthesisUtterance(questions[currentQuestionIndex].text);
        synth.speak(utterThis);
        utterThis.onend = () => {
            recognition.start();
        };
    };

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        const matchedOption = questions[currentQuestionIndex].options.find(option => option.toLowerCase() === speechResult);
        if (matchedOption) {
            handleResponse(matchedOption);
        } else {
            alert("Please provide a valid response.");
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
    };
    const handleMicAccess = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsMicAccessGranted(true);
            askQuestion();
        } catch (error) {
            alert("Microphone access denied");
        }
    };

    const handleResponse = (response) => {
        const updatedResponses = [...responses, response];
        setResponses(updatedResponses);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Submit responses to the backend
            console.log("Responses submitted:", updatedResponses);
            // Add code to send responses to the backend
        }
    };

    const handleOptionClick = (option) => {
        recognition.stop();
        handleResponse(option);
    };

    return (
        <div className="App">
            {!isMicAccessGranted ? (
                <div>
                    <h1>Enter your details</h1>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button onClick={handleMicAccess}>Grant Microphone Access</button>
                </div>
            ) : (
                <div>
                    <h2>{questions[currentQuestionIndex].text}</h2>
                    {questions[currentQuestionIndex].options.map((option, index) => (
                        <button key={index} onClick={() => handleOptionClick(option)}>{option}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
