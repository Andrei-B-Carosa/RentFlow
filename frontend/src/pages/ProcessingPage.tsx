import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:8000/api/';

const ProcessingPage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const {audioFile, title} = location.state;

    const [stage, setStage] = useState<'transcribing' | 'review' | 'analyzing' | 'done'>('transcribing');
    const [transcript, setTranscript] = useState<string>('');
    const [audioFilename, setAudioFilename]   = useState('');

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [error, setError] = useState<string|null>(null);
    const transcribeSteps = ['Uploading audio', 'Transcribing with Groq'];
    const analyzeSteps    = ['Analyzing meeting', 'Extracting action items', 'Saving notes'];

    const handleAnalyze = async() => {
        try{
            setStage('analyzing');
            setCurrentStep(0);
            const {data:analyzed} = await axios.post(API_URL+'meeting/analyze',{transcript});
            setCurrentStep(1);
            const {data:saved} = await axios.post(API_URL+'meeting/save',{
                title,
                audio_filename:          audioFilename,
                transcript,
                summary:                 analyzed.summary,
                key_points:              analyzed.key_points,
                decisions:               analyzed.decisions,
                action_items:            analyzed.action_items,
                follow_ups:              analyzed.follow_ups,
                minutes:                 analyzed.minutes,
                highlighted_transcript:  analyzed.highlighted_transcript,
            })
            setCurrentStep(2);
            navigate(`/meetings/${saved.id}`)
        }catch(err){
            setError('Something went wrong with '+stage+'. Try again later');
        }
    }

    useEffect(()=>{
        const transcribe = async() => {
            try {
                setCurrentStep(0);
                const formData = new FormData();
                formData.append('audio',audioFile);
                formData.append('title',title);
                setCurrentStep(1);
                const { data } = await axios.post(API_URL + 'meeting/transcribe', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                setTranscript(data.transcript);
                setAudioFilename(data.audio_filename);
                setStage('review');
            } catch (err){
                setError('Transcription failed. Please try again');
            }
        }
        transcribe()
    },[])

    const StepIndicator = ({ steps }: { steps: string[] }) => (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            {steps.map((step, i) => {
                const isDone    = i < currentStep;
                const isCurrent = i === currentStep;

                return (
                    <div key={i} className="flex items-center gap-4">

                        {/* Circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all
                            ${isDone    ? 'bg-green-500 text-white' : ''}
                            ${isCurrent ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/30' : ''}
                            ${!isDone && !isCurrent ? 'bg-gray-800 text-gray-500 border border-gray-700' : ''}
                        `}>
                            {isDone ? '✓' : i + 1}
                        </div>

                        {/* Label */}
                        <span className={`text-sm transition-all
                            ${isDone    ? 'text-green-400 line-through' : ''}
                            ${isCurrent ? 'text-white font-medium' : ''}
                            ${!isDone && !isCurrent ? 'text-gray-600' : ''}
                        `}>
                            {step}
                        </span>

                        {/* Spinner for current */}
                        {isCurrent && (
                            <div className="ml-auto w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        )}

                    </div>
                );
            })}
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">

            {/* Transcribing stage  */}
            {stage === 'transcribing' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center text-3xl mb-2">
                            🎙️
                        </div>
                        <h1 className="text-2xl font-bold">Transcribing</h1>
                        <p className="text-sm text-gray-400">
                            Converting your audio to text using Groq Whisper...
                        </p>
                    </div>
                    <StepIndicator steps={transcribeSteps} />
                </div>
            )}

            {/*  Review stage */}
            {stage === 'review' && (
                <div className="flex flex-col gap-6 w-full max-w-3xl">

                    {/* Header */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold">Review Transcript</h1>
                        <p className="text-sm text-gray-400">
                            Check for errors before analyzing — names, terms, and numbers are common mistakes.
                        </p>
                    </div>

                    {/* Transcript editor */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Transcript</label>
                            <span className="text-xs text-gray-600">
                                {transcript.length} characters
                            </span>
                        </div>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            rows={16}
                            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/upload')}
                            className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition"
                        >
                            ← Re-upload
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={!transcript.trim()}
                            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
                        >
                            Looks Good, Analyze →
                        </button>
                    </div>

                </div>
            )}

            {/* Analyzing stage */}
            {stage === 'analyzing' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center text-3xl mb-2">
                            🧠
                        </div>
                        <h1 className="text-2xl font-bold">Analyzing</h1>
                        <p className="text-sm text-gray-400">
                            Extracting insights from your meeting...
                        </p>
                    </div>
                    <StepIndicator steps={analyzeSteps} />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-900 border border-red-700 text-red-300 text-sm px-6 py-3 rounded-xl shadow-lg">
                    {error}
                    <button
                        onClick={() => navigate('/upload')}
                        className="ml-4 underline hover:text-white"
                    >
                        Go back
                    </button>
                </div>
            )}

        </div>
    )

}

export default ProcessingPage