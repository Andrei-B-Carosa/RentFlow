import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {

    const [title, setTitle] = useState<string>('');
    const [audioFile, setAudioFile] = useState<File|null>(null); 
    const [error, setError] = useState('');

    const  navigate = useNavigate();

    const handleSubmit = () => {
        if(!audioFile || !title) return;
        navigate('/processing', {state:{audioFile,title}})
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-8 flex flex-col gap-6 border border-gray-800">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">New Meeting</h1>
                    <p className="text-sm text-gray-400">Upload your meeting audio and we'll transcribe and analyze it.</p>
                </div>

                {/* Title input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Meeting Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Q1 Planning, Team Standup..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* File upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Audio File</label>
                    <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl px-6 py-10 cursor-pointer transition
                        ${audioFile
                            ? 'border-indigo-500 bg-indigo-950/30'
                            : 'border-gray-700 hover:border-indigo-500 hover:bg-gray-800/50'
                        }`}
                    >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
                            🎙️
                        </div>

                        {audioFile ? (
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-sm text-indigo-400 font-medium">{audioFile.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-sm text-gray-300">Click to upload your audio</p>
                                <p className="text-xs text-gray-500">MP3, WAV, M4A, WEBM — max 25MB</p>
                            </div>
                        )}

                        {/* Hidden real input */}
                        <input
                            type="file"
                            accept=".mp3,.wav,.m4a,.webm"
                            className="hidden"
                            onChange={(e) => {
                                setAudioFile(e.target.files?.[0] ?? null)
                                setError('')
                            }}
                        />
                    </label>

                    {/* Change file link */}
                    {audioFile && (
                        <button
                            onClick={() => setAudioFile(null)}
                            className="text-xs text-gray-500 hover:text-red-400 self-start transition"
                        >
                            Remove file
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-400">{error}</p>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition disabled:bg-indigo-300"
                    disabled={!audioFile}
                >
                    Upload & Transcribe →
                </button>

            </div>
        </div>
    );
}

export default UploadPage