import React from 'react';

function VoiceInput() {
    const startListening = () => {
        // Implement Web Speech API logic here
    };

    return (
        <div>
            <button onClick={startListening}>Start Voice Input</button>
        </div>
    );
}

export default VoiceInput;
