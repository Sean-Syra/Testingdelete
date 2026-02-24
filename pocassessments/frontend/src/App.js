import React, { useState } from 'react';

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

    const handleMicAccess = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsMicAccessGranted(true);
        } catch (error) {
            alert("Microphone access denied");
        }
    };

    const handleResponse = (response) => {
        setResponses([...responses, response]);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Submit responses to the backend
            console.log("Responses submitted:", responses);
        }
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
                        <button key={index} onClick={() => handleResponse(option)}>{option}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
