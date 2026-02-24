import { useState } from 'react';

const EMOJIS = [
  { emoji: '💩', value: 0, label: 'Poor' },
  { emoji: '😕', value: 1, label: 'Fair' },
  { emoji: '😎', value: 2, label: 'Good' },
  { emoji: '🎉', value: 3, label: 'Excellent' },
];

const CATEGORIES = [
  { key: 'sleep',      label: 'Sleep',      hasSymptoms: false },
  { key: 'digestion',  label: 'Digestion',  hasSymptoms: true  },
  { key: 'lungs',      label: 'Lungs',      hasSymptoms: true  },
];

function EmojiRow({ value, onChange, large = false }) {
  return (
    <div className="rating-emojis">
      {EMOJIS.map(({ emoji, value: v, label }) => (
        <button
          key={v}
          className={`rating-btn${large ? ' rating-btn--large' : ''}${value === v ? ' rating-btn--selected' : ''}`}
          onClick={() => onChange(value === v ? null : v)}
          aria-label={`${label}${value === v ? ', selected' : ''}`}
          aria-pressed={value === v}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function SymptomSelect({ category, options, selected, onToggle, onAddOption, onRemoveOption }) {
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    const sym = draft.trim();
    if (!sym || options.includes(sym)) return;
    onAddOption(sym);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="symptom-select">
      <span className="symptom-select__label">Symptoms</span>
      <div className="symptom-pills">
        {options.map((symptom) => (
          <div key={symptom} className="symptom-pill-wrapper">
            <button
              className={`symptom-pill${selected.includes(symptom) ? ' symptom-pill--selected' : ''}`}
              onClick={() => onToggle(symptom)}
              aria-pressed={selected.includes(symptom)}
            >
              {symptom}
            </button>
            <button
              className="symptom-pill__remove"
              onClick={() => onRemoveOption(symptom)}
              aria-label={`Remove ${symptom} from options`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="symptom-add">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add symptom…"
          aria-label={`Add symptom for ${category}`}
        />
        <button
          className="btn-add"
          onClick={handleAdd}
          disabled={!draft.trim()}
          aria-label="Add symptom"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function DailyRatings({
  overallFeeling,
  ratings,
  onOverallChange,
  onCategoryChange,
  symptomOptions,
  selectedSymptoms,
  onAddSymptomOption,
  onRemoveSymptomOption,
  onSymptomToggle,
}) {
  const ratingsObj = ratings ?? {};
  const ratedCount = CATEGORIES.filter(({ key }) => ratingsObj[key] !== undefined).length;
  const categoryScore = CATEGORIES.reduce(
    (sum, { key }) => (ratingsObj[key] !== undefined ? sum + ratingsObj[key] : sum),
    0
  );
  const safeOptions = symptomOptions ?? {};
  const safeSelected = selectedSymptoms ?? {};

  return (
    <section className="section" aria-label="Daily ratings">
      <p className="section__title">How are you feeling today?</p>

      <div className={`rating-overall${overallFeeling !== undefined && overallFeeling !== null ? ' rating-overall--set' : ''}`}>
        <p className="rating-overall__label">Overall</p>
        <EmojiRow value={overallFeeling} onChange={onOverallChange} large />
      </div>

      <div className="rating-categories">
        {CATEGORIES.map(({ key, label, hasSymptoms }) => (
          <div key={key} className="rating-category">
            <span className="rating-category__label">{label}</span>
            <EmojiRow
              value={ratingsObj[key]}
              onChange={(v) => onCategoryChange(key, v)}
            />
            {hasSymptoms && (
              <SymptomSelect
                category={label}
                options={safeOptions[key] ?? []}
                selected={safeSelected[key] ?? []}
                onToggle={(sym) => onSymptomToggle(key, sym)}
                onAddOption={(sym) => onAddSymptomOption(key, sym)}
                onRemoveOption={(sym) => onRemoveSymptomOption(key, sym)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rating-derived">
        <p className="rating-derived__stat">
          Overall feeling:{' '}
          {overallFeeling !== undefined && overallFeeling !== null ? overallFeeling : '—'}
        </p>
        <p className="rating-derived__stat">Category score: {categoryScore}</p>
        <p className="rating-derived__stat">{ratedCount} / 3 rated</p>
      </div>
    </section>
  );
}
