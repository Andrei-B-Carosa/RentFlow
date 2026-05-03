import type { Messages } from "../types/Message"

type Props = {
  content: Messages
}

const badgeColor: Record<string, string> = {
  Pass:    'bg-green-600',
  Fail:    'bg-red-600',
  Partial: 'bg-yellow-500',
}

const AiBubble = ({ content }: Props) => {
  return (
    <div className="self-start flex flex-col gap-2 max-w-lg">

      {/* Question */}
      {content.question && (
        <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-white text-sm leading-relaxed">
          {content.question}
        </div>
      )}

      {/* Verdict + reason */}
      {content.verdict && (
        <div className="bg-gray-800 rounded-2xl px-4 py-3 flex flex-col gap-2">

          <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full text-white ${badgeColor[content.verdict] ?? 'bg-gray-600'}`}>
            {content.verdict}
          </span>

          {content.reason && (
            <p className="text-sm text-gray-300">{content.reason}</p>
          )}

          {content.suggested_answer && (
            <div className="border-t border-gray-700 pt-2">
              <p className="text-xs text-gray-500 mb-1">Suggested answer</p>
              <p className="text-sm text-gray-400 italic">{content.suggested_answer}</p>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default AiBubble