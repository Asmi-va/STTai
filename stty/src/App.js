
import React, { useState } from "react";
import "./App.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const App = () => {
    const [detectionResult, setDetectionResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

    // Analyze entire transcript
    const analyzeTranscript = async () => {
        setLoading(true);
        setDetectionResult(null);
        
        if (!transcript.trim()) {
            setDetectionResult("No text to analyze.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ text: transcript })
            });
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                setDetectionResult(data.results[0].label);
            } else {
                setDetectionResult("No result available.");
            }
        } catch (error) {
            setDetectionResult("Error contacting backend.");
        }
        setLoading(false);
    };

    // Clear text and results
    const clearText = () => {
        resetTranscript();
        setDetectionResult(null);
    };

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    return (
        <div className="container">
            <h2>AI Detector</h2>
            
            <div className="main-content">
                {transcript}
            </div>

            <div className="btn-style">
                <button onClick={startListening}>Start Listening</button>
                <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
                <button onClick={clearText}>Clear Text</button>
                <button onClick={analyzeTranscript} disabled={!transcript || loading}>
                    {loading ? "Analyzing..." : "Analyze AI/Human"}
                </button>
            </div>

            {detectionResult && (
                <div className="result">
                    <h3>Result: {detectionResult}</h3>
                </div>
            )}
        </div>
    );
};

export default App;