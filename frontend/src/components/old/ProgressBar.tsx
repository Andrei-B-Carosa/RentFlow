type Props = {
    total: number
    done: number
}

const ProgressBar = ({ total, done }: Props) => {
    const percent = total === 0 ? 0 : Math.round((done / total) * 100)

    const barColor = percent === 100
        ? 'bg-green-500'
        : percent >= 50
            ? 'bg-indigo-500'
            : 'bg-indigo-400'

    return (
        <div className="flex flex-col gap-2">
            {/* Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Labels */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{done} of {total} completed</p>
                <span className={`text-xs font-semibold
                    ${percent === 100 ? 'text-green-400' : 'text-indigo-400'}`}
                >
                    {percent}%
                </span>
            </div>
        </div>
    )
}

export default ProgressBar