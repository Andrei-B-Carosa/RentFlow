import { useRef, useEffect, useState } from "react"
import type { FollowUp, Status } from "../types/Meeting"

type Props = {
    item: FollowUp
    onToggle: (id: number, status: Status, remarks: string) => void
}

const statusConfig: Record<Status, { label: string; badge: string; dot: string }> = {
    PENDING:   { label: 'Pending',   badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-600/40', dot: '●' },
    CLOSED:    { label: 'Closed',    badge: 'bg-green-500/20  text-green-400  border-green-600/40',  dot: '✓' },
    CANCELLED: { label: 'Cancelled', badge: 'bg-red-500/20    text-red-400    border-red-600/40',    dot: '✕' },
}

const borderColor: Record<Status, string> = {
    PENDING:   'border-gray-800',
    CLOSED:    'border-green-800/50',
    CANCELLED: 'border-red-800/50',
}

const FollowUpCard = ({ item, onToggle }: Props) => {
    const [status, setStatus]             = useState<Status>(item.status as Status)
    const [remarks, setRemarks]           = useState(item.remarks ?? '')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef                     = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleStatusChange = (newStatus: Status) => {
        setStatus(newStatus)
        setDropdownOpen(false)
        onToggle(item.id, newStatus, remarks)
    }

    return (
        <div className={`bg-gray-900 border rounded-xl px-5 py-4 flex flex-col gap-3 transition ${borderColor[status]}`}>

            {/* Top row — description + badge */}
            <div className="flex items-start justify-between gap-3">

                <span className={`text-sm font-medium flex-1 transition
                    ${status === 'CLOSED'    ? 'line-through text-gray-500' : ''}
                    ${status === 'CANCELLED' ? 'line-through text-red-500/60' : ''}
                    ${status === 'PENDING'   ? 'text-gray-200' : ''}
                `}>
                    {item.description}
                </span>

                {/* Badge dropdown */}
                <div className="relative shrink-0" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${statusConfig[status].badge}`}
                    >
                        <span>{statusConfig[status].dot}</span>
                        <span>{statusConfig[status].label}</span>
                        <span className="text-current opacity-50">▾</span>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-8 z-20 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden w-36">
                            {(Object.keys(statusConfig) as Status[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusChange(s)}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 transition hover:bg-gray-700
                                        ${status === s ? 'text-white bg-gray-700' : 'text-gray-400'}`}
                                >
                                    <span>{statusConfig[s].dot}</span>
                                    {statusConfig[s].label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Remarks */}
            {status !== 'PENDING' && (
                <input
                    type="text"
                    placeholder="Add a remark..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    onBlur={() => onToggle(item.id, status, remarks)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
            )}
        </div>
    )
}

export default FollowUpCard