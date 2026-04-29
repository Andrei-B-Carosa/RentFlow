export type Status = 'PENDING' | 'CLOSED' | 'CANCELLED'

export interface ActionItem {
    id: number
    meeting_id: number
    task: string
    owner: string | null
    deadline: string | null
    status: Status
    remarks: string | null
}

export interface FollowUp {
    id: number
    meeting_id: number
    description: string
    status: Status
    remarks: string | null
}

export interface Minutes {
    date: string
    attendees: string[]
    agenda: string[]
    discussions: string[]
    resolutions: string[]
}

export interface MeetingNote {
    id: number
    title: string
    audio_filename: string
    transcript: string
    summary: string
    key_points: string[]
    decisions: string[]
    minutes: Minutes
    highlighted_transcript: string
    duration: number | null
    action_items: ActionItem[]
    follow_ups: FollowUp[]
    created_at: string
    formatted_date?:string
}