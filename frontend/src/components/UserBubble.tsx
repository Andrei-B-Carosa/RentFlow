interface Message {
  answer?: string
}

type Props = {
  content: Message
}

const UserBubble = ({ content }: Props) => {
  return (
    <div className="self-end bg-indigo-600 rounded-2xl rounded-tr-none px-4 py-3 max-w-lg">
      <p className="text-white text-sm leading-relaxed">{content.answer}</p>
    </div>
  )
}

export default UserBubble