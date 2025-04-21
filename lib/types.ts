export interface Note {
  id: string
  user_id: string
  content: string
  color: string
  is_pinned: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export interface Tag {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface NoteTag {
  note_id: string
  tag_id: string
}
