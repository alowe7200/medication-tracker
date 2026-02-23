import { useState } from 'react';
import { formatTime, formatReminderTime } from '../utils/dateUtils.js';

export default function MedicationCard({ med, today, onMark, onUndo, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(med.name);
  const [draftTime, setDraftTime] = useState(med.reminderTime);

  const isTaken = med.takenDate === today;

  const handleSaveEdit = () => {
    const name = draftName.trim();
    if (!name) return;
    onEdit({ ...med, name, reminderTime: draftTime });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftName(med.name);
    setDraftTime(med.reminderTime);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="med-card med-card--editing">
        <div className="med-form-field">
          <label htmlFor={`edit-name-${med.id}`}>Medication name</label>
          <input
            id={`edit-name-${med.id}`}
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Medication name"
            autoFocus
          />
        </div>
        <div className="med-form-field">
          <label htmlFor={`edit-time-${med.id}`}>Reminder time</label>
          <input
            id={`edit-time-${med.id}`}
            type="time"
            value={draftTime}
            onChange={(e) => setDraftTime(e.target.value)}
          />
        </div>
        <div className="med-card__edit-actions">
          <button
            className="btn-save"
            onClick={handleSaveEdit}
            disabled={!draftName.trim()}
          >
            Save
          </button>
          <button className="btn-cancel" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`med-card${isTaken ? ' med-card--taken' : ''}`}>
      <div className="med-card__header">
        <div className="med-card__info">
          <span className="med-card__name">{med.name}</span>
          <span className="med-card__reminder">⏰ {formatReminderTime(med.reminderTime)}</span>
        </div>
        <div className="med-card__meta-actions">
          <button
            className="btn-edit"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${med.name}`}
          >
            Edit
          </button>
          <button
            className="btn-delete"
            onClick={() => onDelete(med.id)}
            aria-label={`Delete ${med.name}`}
          >
            ✕
          </button>
        </div>
      </div>

      {isTaken ? (
        <div className="med-card__status">
          <div className="med-taken-badge" role="status">
            <span aria-hidden="true">✓</span> Taken today
          </div>
          {med.takenAt && (
            <p className="med-taken-time">at {formatTime(med.takenAt)}</p>
          )}
          <button
            className="btn-undo"
            onClick={() => onUndo(med.id)}
            aria-label={`Undo — mark ${med.name} as not taken`}
          >
            Undo
          </button>
        </div>
      ) : (
        <button
          className="btn-primary"
          onClick={() => onMark(med.id)}
          aria-label={`Mark ${med.name} as taken today`}
        >
          Mark as Taken
        </button>
      )}
    </div>
  );
}
