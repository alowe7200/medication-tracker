import { useState } from 'react';

function HabitItem({ habit, done, onToggle, onEditLabel, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.label);

  const handleSave = () => {
    const label = draft.trim();
    if (!label) return;
    onEditLabel(label);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(habit.label);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (editing) {
    return (
      <li className="habit-item habit-item--editing">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Edit habit name"
          autoFocus
        />
        <div className="habit-item__edit-actions">
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!draft.trim()}
          >
            Save
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`habit-item${done ? ' habit-item--done' : ''}`}>
      <input
        type="checkbox"
        id={`habit-${habit.id}`}
        checked={done}
        onChange={onToggle}
        className="habit-checkbox"
      />
      <label htmlFor={`habit-${habit.id}`} className="habit-label">
        {habit.label}
      </label>
      <button
        className="btn-edit"
        onClick={() => setEditing(true)}
        aria-label={`Edit habit: ${habit.label}`}
      >
        Edit
      </button>
      <button
        className="btn-delete"
        onClick={onRemove}
        aria-label={`Remove habit: ${habit.label}`}
      >
        ✕
      </button>
    </li>
  );
}

export default function HabitList({ habits, habitsDone, onToggle, onAdd, onEditLabel, onRemove }) {
  const [newLabel, setNewLabel] = useState('');

  const activeHabits = habits.filter((h) => !h.archived);
  const doneCount = activeHabits.filter((h) => habitsDone[h.id]).length;

  const handleAdd = () => {
    const label = newLabel.trim();
    if (!label) return;
    onAdd(label);
    setNewLabel('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <section className="section" aria-label="Daily habits">
      <p className="section__title">Today's habits</p>

      <p className="habit-progress">
        {doneCount} / {activeHabits.length} completed today
      </p>

      {activeHabits.length === 0 && (
        <p className="empty-state">No habits added yet.</p>
      )}

      <ul className="habit-list">
        {activeHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            done={!!habitsDone[habit.id]}
            onToggle={() => onToggle(habit.id)}
            onEditLabel={(label) => onEditLabel(habit.id, label)}
            onRemove={() => onRemove(habit.id)}
          />
        ))}
      </ul>

      <div className="habit-add">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a habit…"
          aria-label="New habit name"
        />
        <button
          className="btn-add"
          onClick={handleAdd}
          disabled={!newLabel.trim()}
          aria-label="Add habit"
        >
          +
        </button>
      </div>
    </section>
  );
}
