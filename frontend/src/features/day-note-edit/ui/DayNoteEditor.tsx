import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ApiError } from '@/shared/api/http-client'
import { useToast } from '@/shared/ui/toast'
import { dayNotesApi } from '@/entities/day-note'

interface DayNoteEditorProps {
  date: string
}

export const DayNoteEditor = ({ date }: DayNoteEditorProps) => {
  const { notify } = useToast()
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const savedTextRef = useRef('')
  const requestIdRef = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const element = textareaRef.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }, [text, isLoading])

  const loadNote = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    try {
      const note = await dayNotesApi.getDayNote(date)
      if (requestIdRef.current !== requestId) return
      setText(note.text)
      savedTextRef.current = note.text
    } catch (err) {
      if (requestIdRef.current !== requestId) return
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to load notes',
      })
    } finally {
      if (requestIdRef.current === requestId) setIsLoading(false)
    }
  }, [date, notify])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNote()
  }, [loadNote])

  const handleBlur = async () => {
    if (text === savedTextRef.current) return
    try {
      const note = await dayNotesApi.saveDayNote(date, text)
      savedTextRef.current = note.text
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to save notes',
      })
    }
  }

  return (
    <textarea
      ref={textareaRef}
      value={isLoading ? '' : text}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => void handleBlur()}
      disabled={isLoading}
      placeholder="Write anything about this day…"
      rows={12}
      className="custom-scrollbar w-full resize-none overflow-hidden rounded-md border border-brown-300/60 bg-cream-200 p-3 text-sm text-brown-900 shadow-sm focus:border-brown-500 focus:outline-none disabled:opacity-50"
    />
  )
}
