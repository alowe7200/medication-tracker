const EMOJIS = [
  { emoji: '💩', value: 0, label: 'Poor' },
  { emoji: '😕', value: 1, label: 'Fair' },
  { emoji: '😎', value: 2, label: 'Good' },
  { emoji: '🎉', value: 3, label: 'Excellent' },
];

const CATEGORIES = [
  { key: 'sleep', label: 'Sleep' },
  { key: 'digestion', label: 'Digestion' },
  { key: 'bloating', label: 'Bloating' },
  { key: 'breathing', label: 'Breathing' },
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

export default function DailyRatings({ overallFeeling, ratings, onOverallChange, onCategoryChange }) {
  const ratingsObj = ratings ?? {};
  const ratedCount = CATEGORIES.filter(({ key }) => ratingsObj[key] !== undefined).length;
  const categoryScore = CATEGORIES.reduce(
    (sum, { key }) => (ratingsObj[key] !== undefined ? sum + ratingsObj[key] : sum),
    0
  );

  return (
    <section className="section" aria-label="Daily ratings">
      <p className="section__title">How are you feeling today?</p>

      <div className={`rating-overall${overallFeeling !== undefined && overallFeeling !== null ? ' rating-overall--set' : ''}`}>
        <p className="rating-overall__label">Overall</p>
        <EmojiRow value={overallFeeling} onChange={onOverallChange} large />
      </div>

      <div className="rating-categories">
        {CATEGORIES.map(({ key, label }) => (
          <div key={key} className="rating-category">
            <span className="rating-category__label">{label}</span>
            <EmojiRow
              value={ratingsObj[key]}
              onChange={(v) => onCategoryChange(key, v)}
            />
          </div>
        ))}
      </div>

      <div className="rating-derived">
        <p className="rating-derived__stat">
          Overall feeling:{' '}
          {overallFeeling !== undefined && overallFeeling !== null ? overallFeeling : '—'}
        </p>
        <p className="rating-derived__stat">Category score: {categoryScore}</p>
        <p className="rating-derived__stat">{ratedCount} / 4 rated</p>
      </div>
    </section>
  );
}
