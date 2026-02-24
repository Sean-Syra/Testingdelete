import React from 'react';
import VoiceInput from './VoiceInput';
import ProgressTracker from './ProgressTracker';
import ConfirmationUI from './ConfirmationUI';

function AssessmentFlowController() {
    return (
        <div>
            <h1>Voice-Based Assessment</h1>
            <ProgressTracker />
            <VoiceInput />
            <ConfirmationUI />
        </div>
    );
}

export default AssessmentFlowController;
