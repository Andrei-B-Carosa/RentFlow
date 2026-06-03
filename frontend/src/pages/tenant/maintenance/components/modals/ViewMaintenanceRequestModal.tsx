import type { Maintenance } from "../../core/types";

interface Props {
    data:Maintenance;
}

const priorityStyle: Record<string, string> = {
    LOW:    'text-gray-500 bg-gray-50 border-gray-200',
    MEDIUM: 'text-blue-600 bg-blue-50 border-blue-100',
    HIGH:   'text-orange-600 bg-orange-50 border-orange-100',
    URGENT: 'text-red-600 bg-red-50 border-red-100',
}

const statusStyle: Record<string, string> = {
    OPEN:        'text-blue-600 bg-blue-50 border-blue-100',
    IN_PROGRESS: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    RESOLVED:    'text-green-600 bg-green-50 border-green-100',
}

const ViewMaintenanceRequestModal = ({data}:Props) => {
    return (
        <div className="space-y-5">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">

                {/* Title */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Title
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                        {data?.title ?? '—'}
                    </p>
                </div>

                {/* Description */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Description
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {data?.description ?? '—'}
                    </p>
                </div>

                {/* Priority + Status side by side */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Priority
                        </p>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider
                            ${priorityStyle[data?.priority ?? ''] ?? 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                            {data?.priority ?? '—'}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Current Status
                        </p>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider
                            ${statusStyle[data?.status ?? ''] ?? 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                            {data?.status?.replace('_', ' ') ?? '—'}
                        </span>
                    </div>
                </div>

                {/* Submitted by + date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Submitted By
                        </p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center
                                justify-center text-white text-[9px] font-bold flex-shrink-0">
                                {data?.tenant?.name?.charAt(0).toUpperCase() ?? '?'}
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                {data?.tenant?.name ?? '—'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Request Date
                        </p>
                        <p className="text-sm text-gray-600">
                            {data?.formatted_date}
                        </p>
                    </div>
                </div>

                {/* Unit */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Unit
                        </p>
                        <p className="text-sm text-gray-600">
                            {data?.unit?.unit_number ?? '—'}
                            {data?.unit?.property?.name && (
                                <span className="text-gray-400 ml-1.5">
                                    — {data.unit.property.name}
                                </span>
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Resolved Date
                        </p>
                        <p className="text-sm text-gray-600">
                            {data?.formatted_resolved_at !=""?data.formatted_resolved_at:'—'}
                        </p>
                    </div>
                </div>

                {/* Photos */}
                {data?.photos && data.photos.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Photos
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {data.photos.map((photo, index) => (
                                <a
                                    key={index}
                                    href={`${import.meta.env.VITE_STORAGE_URL}/${photo}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        src={`${import.meta.env.VITE_STORAGE_URL}/${photo}`}
                                        alt={`photo ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200
                                            hover:opacity-80 transition cursor-pointer"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewMaintenanceRequestModal;