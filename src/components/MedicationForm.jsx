import { useState } from 'react';

export default function MedicationForm({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, reminderTime });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="med-form">
      <div className="med-form-field">
        <label htmlFor="new-med-name">Medication name</label>
        <input
          id="new-med-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Metformin"
          autoFocus
        />
      </div>
      <div className="med-form-field">
        <label htmlFor="new-med-time">Reminder time</label>
        <input
          id="new-med-time"
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
      </div>
      <div className="med-form__actions">
        <button
          className="btn-save"
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          Add medication
        </button>
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
