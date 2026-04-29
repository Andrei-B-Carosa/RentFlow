import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ActionItem, FollowUp, MeetingNote, Status } from "../types/Meeting";
import axios from "axios";
import ActionItemCard from "../components/ActionItemCard";
import FollowUpCard from "../components/FollowUpCard";
import ProgressBar from "../components/ProgressBar";

const API_URL = 'http://localhost:8000/api/'; 

const tabLabels: Record<string, string> = {
    overview:   'Overview',
    action_items: 'Action Items',
    follow_ups:   'Follow-ups',
    minutes:      'Minutes',
    transcript:   'Transcript',
}

const MeetingDetailPage = () => {

    const { id } = useParams(); 
    const navigate = useNavigate();

    const [meeting, setMeeting] = useState<MeetingNote|null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [actionItems, setActionItems] =useState<ActionItem[]>([]);
    const [followUps, setFollowUps] =useState<FollowUp[]>([]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(()=>{
        axios.get(API_URL+'meetings/'+id)
        .then((res)=>{
            setMeeting(res.data)
            setActionItems(res.data.action_items ?? [])
            setFollowUps(res.data.follow_ups ?? [])

        })
        .catch((err)=>console.error(err))
        .finally(()=>setIsLoading(false))
    },[])

    const tabs = ['overview', 'action_items', 'follow_ups', 'minutes', 'transcript'];

    // ✅ simplified — no more 'as ActionItem[status]' casting needed
    const handleToggleAction = (id: number, status: Status, remarks: string) => {
        axios.patch(API_URL + 'action-items/' + id + '/toggle', { status, remarks })
            .then(() => {
                setActionItems((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, status, remarks } : item
                    )
                )
            })
    }

    const handleToggleFollowUp = (id: number, status: Status, remarks: string) => {
        axios.patch(API_URL + 'follow-ups/' + id + '/toggle', { status, remarks })
            .then(() => {
                setFollowUps((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, status, remarks } : item
                    )
                )
            })
    }

    const renderHighlighted = (text: string) => {
        if (!text) return null
        const parts = text.split(/\[HIGHLIGHT\]|\[\/HIGHLIGHT\]/)
        return parts.map((part, i) =>
            i % 2 === 1
                ? <mark key={i} className="bg-yellow-300 text-gray-900 rounded px-1">{part}</mark>
                : <span key={i}>{part}</span>
        )
    }

    // ✅ count CLOSED as done, PENDING as remaining
    const closedActions   = actionItems.filter(i => i.status === 'CLOSED').length
    const closedFollowUps = followUps.filter(i => i.status === 'CLOSED').length

    if (isLoading) return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading meeting...</p>
            </div>
        </div>
    )

    if (!meeting) return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <p className="text-gray-400">Meeting not found.</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-800 flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => navigate('/meetings')}
                        className="text-xs text-gray-500 hover:text-gray-300 transition mb-1 self-start"
                    >
                        ← Back to meetings
                    </button>
                    <h1 className="text-xl font-bold">{meeting.title}</h1>
                    <p className="text-xs text-gray-500">{meeting.formatted_date}</p>
                </div>
            </div>

            {/* Tab bar — sticky */}
            <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-6 py-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition
                                ${activeTab === tab
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            {tabLabels[tab]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="px-6 py-8 max-w-4xl mx-auto">

                {/* Overview — Summary + Key Points + Decisions */}
                {activeTab === 'overview' && (
                    <div className="flex flex-col gap-6">

                        {/* Summary */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Summary
                            </h2>
                            <p className="text-gray-200 text-sm leading-relaxed">{meeting.summary}</p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Key Points
                            </h2>
                            <div className="flex flex-col gap-3">
                                {meeting.key_points.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-indigo-400 font-bold text-sm shrink-0">{i + 1}.</span>
                                        <p className="text-sm text-gray-200">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decisions */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Decisions Made
                            </h2>
                            <div className="flex flex-col gap-3">
                                {meeting.decisions.map((decision, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-green-400 shrink-0">✓</span>
                                        <p className="text-sm text-gray-200">{decision}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* Action Items */}
                {activeTab === 'action_items' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Action Items
                            </h2>
                            <span className="text-xs text-gray-500">
                                {closedActions} / {actionItems.length} closed
                            </span>
                        </div>
                        <ProgressBar total={actionItems.length} done={closedActions} />
                        <div className="flex flex-col gap-3">
                            {actionItems.map((item,i) => (
                                <ActionItemCard
                                    key={i}
                                    item={item}
                                    onToggle={handleToggleAction}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Follow-ups */}
                {activeTab === 'follow_ups' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Follow-ups
                            </h2>
                            <span className="text-xs text-gray-500">
                                {closedFollowUps} / {followUps.length} closed
                            </span>
                        </div>
                        <ProgressBar total={followUps.length} done={closedFollowUps} />
                        <div className="flex flex-col gap-3">
                            {followUps.map((item,i) => (
                                <FollowUpCard
                                    key={i}
                                    item={item}
                                    onToggle={handleToggleFollowUp}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Minutes */}
                {activeTab === 'minutes' && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Meeting Minutes
                        </h2>

                        {[
                            { label: 'Date',      content: meeting.minutes.date },
                            { label: 'Attendees', content: meeting.minutes.attendees?.join(', ') },
                        ].map(({ label, content }) => (
                            <div key={label} className="bg-gray-900 rounded-xl px-5 py-4 border border-gray-800">
                                <p className="text-xs text-gray-500 mb-1">{label}</p>
                                <p className="text-sm text-gray-200">{content}</p>
                            </div>
                        ))}

                        {[
                            { label: 'Agenda',      items: meeting.minutes.agenda },
                            { label: 'Discussions', items: meeting.minutes.discussions },
                            { label: 'Resolutions', items: meeting.minutes.resolutions },
                        ].map(({ label, items }) => (
                            <div key={label} className="bg-gray-900 rounded-xl px-5 py-4 border border-gray-800">
                                <p className="text-xs text-gray-500 mb-3">{label}</p>
                                <ul className="flex flex-col gap-2">
                                    {items?.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                                            <span className="text-indigo-400 shrink-0">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* Transcript */}
                {activeTab === 'transcript' && (
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Transcript
                        </h2>
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {renderHighlighted(meeting.highlighted_transcript)}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );

}

export default MeetingDetailPage