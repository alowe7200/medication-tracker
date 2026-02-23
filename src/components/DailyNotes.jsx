import { useState } from 'react';
import { todayStr, formatDate } from '../utils/dateUtils.js';

export default function DailyNotes({ notes, onSave }) {
  const today = todayStr();
  const todayNote = notes.find((n) => n.date === today);
  const [draft, setDraft] = useState(todayNote?.text ?? '');

  // When the parent updates (e.g. after save), sync draft if today's note changed
  // and the user hasn't started a new edit — handled via controlled value

  const handleSave = () => {
    const text = draft.trim();
    onSave(today, text);
  };

  const recentNotes = [...notes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const isDirty = draft.trim() !== (todayNote?.text ?? '').trim();

  return (
    <section className="section" aria-label="Daily notes">
      <p className="section__title">Daily notes</p>

      <div className="note-form">
        <span className="note-date">{formatDate(today)}</span>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="How are you feeling? Any symptoms or events worth noting…"
          aria-label="Today's note"
        />
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={!isDirty && !!todayNote}
          aria-label="Save today's note"
        >
          Save note
        </button>
      </div>

      {recentNotes.length > 0 && (
        <div className="notes-history">
          <p className="notes-history__label">Recent notes</p>
          <ul style={{ listStyle: 'none' }}>
            {recentNotes.map((note) => (
              <li key={note.id} className="note-item">
                <p className="note-item__date">{formatDate(note.date)}</p>
                <p className="note-item__text">{note.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentNotes.length === 0 && (
        <p className="empty-state">No notes yet. Add your first one above.</p>
      )}
    </section>
  );
}
