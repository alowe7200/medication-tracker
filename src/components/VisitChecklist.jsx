import { useState } from 'react';

const LIST_DEFS = [
  { key: 'questions', label: 'Questions for doctor' },
  { key: 'toBring',   label: 'Things to bring' },
  { key: 'followUps', label: 'Follow-ups' },
];

function ChecklistGroup({ title, items, onAdd, onEdit, onDelete }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const text = inputValue.trim();
    if (!text) return;
    onAdd(text);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="checklist-group">
      <p className="checklist-group__title">{title}</p>

      {items.length > 0 && (
        <ul className="checklist-items" aria-label={title}>
          {items.map((item, idx) => (
            <li key={idx} className="checklist-item">
              <input
                className="checklist-item__text"
                type="text"
                value={item}
                onChange={(e) => onEdit(idx, e.target.value)}
                aria-label={`${title} item ${idx + 1}`}
              />
              <button
                className="btn-delete"
                onClick={() => onDelete(idx)}
                aria-label={`Delete item: ${item}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="checklist-add">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add to ${title.toLowerCase()}…`}
          aria-label={`New item for ${title}`}
        />
        <button
          className="btn-add"
          onClick={handleAdd}
          aria-label={`Add to ${title}`}
          disabled={!inputValue.trim()}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function VisitChecklist({ checklist, onChange }) {
  const handleAdd = (key, text) => {
    onChange({ ...checklist, [key]: [...checklist[key], text] });
  };

  const handleEdit = (key, idx, text) => {
    const updated = [...checklist[key]];
    updated[idx] = text;
    onChange({ ...checklist, [key]: updated });
  };

  const handleDelete = (key, idx) => {
    const updated = checklist[key].filter((_, i) => i !== idx);
    onChange({ ...checklist, [key]: updated });
  };

  return (
    <section className="section" aria-label="Doctor visit checklist">
      <p className="section__title">Doctor visit checklist</p>

      {LIST_DEFS.map(({ key, label }) => (
        <ChecklistGroup
          key={key}
          title={label}
          items={checklist[key]}
          onAdd={(text) => handleAdd(key, text)}
          onEdit={(idx, text) => handleEdit(key, idx, text)}
          onDelete={(idx) => handleDelete(key, idx)}
        />
      ))}
    </section>
  );
}
