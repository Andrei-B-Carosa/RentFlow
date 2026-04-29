import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MeetingNote } from "../types/Meeting";

const API_URL = 'http://localhost:8000/api/';

const MeetingPage = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState<MeetingNote[]>([]);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        setIsLoading(true);
        axios.get(API_URL+'meetings')
        .then((res)=>setMeetings(res.data))
        .catch((err)=>console.log(err))
        .finally(()=>setIsLoading(false))
    },[])

    return (
        <div className="min-h-screen bg-gray-950">
            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Meetings</h1>
                        <p className="text-sm text-gray-400 mt-1">All your recorded and analyzed meetings</p>
                    </div>
                    <button
                        onClick={() => navigate('/upload')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                    >
                        + New Meeting
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 animate-pulse">
                                <div className="h-4 bg-gray-800 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-gray-800 rounded w-1/5 mb-4" />
                                <div className="h-3 bg-gray-800 rounded w-full mb-2" />
                                <div className="h-3 bg-gray-800 rounded w-4/5" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && meetings.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-3xl">
                            🎙️
                        </div>
                        <h2 className="text-lg font-semibold text-white">No Meetings yet ...</h2>
                        <p className="text-sm text-gray-500">Upload your first meeting audio to get started.</p>
                    </div>
                )}

                {/* Meeting cards */}
                {!isLoading && meetings.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {meetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                onClick={() => navigate('/meetings/' + meeting.id)}
                                className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition group"
                            >
                                <div className="flex items-start justify-between gap-4">

                                    {/* Left — title + summary */}
                                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                                        <h2 className="text-base font-semibold text-white group-hover:text-indigo-400 transition truncate">
                                            {meeting.title}
                                        </h2>
                                        <p className="text-xs text-gray-500">{meeting.formatted_date}</p>
                                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                                            {meeting.summary?.slice(0, 120)}...
                                        </p>
                                    </div>

                                    {/* Right — arrow */}
                                    <span className="text-gray-600 group-hover:text-indigo-400 transition text-xl shrink-0">
                                        →
                                    </span>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );

}

export default MeetingPage