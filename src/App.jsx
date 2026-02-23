import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { todayStr, isAfterReminderTime } from './utils/dateUtils.js';
import ReminderBanner from './components/ReminderBanner.jsx';
import MedicationCard from './components/MedicationCard.jsx';
import MedicationForm from './components/MedicationForm.jsx';
import HabitList from './components/HabitList.jsx';
import DailyRatings from './components/DailyRatings.jsx';
import MetricsView from './components/MetricsView.jsx';

const TABS = [
  { key: 'ratings', label: 'Ratings' },
  { key: 'habits', label: 'Habits' },
  { key: 'meds', label: 'Meds' },
  { key: 'metrics', label: 'Metrics' },
];

function generateId() {
  return `med_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function App() {
  const [meds, setMeds] = useLocalStorage('med_tracker_meds', []);
  const [habits, setHabits] = useLocalStorage('med_tracker_habits', []);
  const [daily, setDaily] = useLocalStorage('med_tracker_daily', {});
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('ratings');

  // Re-render every minute so the reminder banner appears/disappears without a page refresh.
  const [, setTick] = useState(0);
  const tickRef = useRef(null);
  useEffect(() => {
    tickRef.current = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(tickRef.current);
  }, []);

  const today = todayStr();

  // Overdue = not taken today AND past their reminder time
  const overdueMeds = meds.filter(
    (m) => m.takenDate !== today && isAfterReminderTime(m.reminderTime)
  );

  // ── Handlers ──────────────────────────────────────────────────
  const handleAdd = ({ name, reminderTime }) => {
    const newMed = { id: generateId(), name, reminderTime, takenDate: null, takenAt: null };
    setMeds((prev) => [...prev, newMed]);
    setShowAddForm(false);
  };

  const handleEdit = (updatedMed) => {
    setMeds((prev) => prev.map((m) => (m.id === updatedMed.id ? { ...m, ...updatedMed } : m)));
  };

  const handleDelete = (id) => {
    setMeds((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMark = (id) => {
    setMeds((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, takenDate: today, takenAt: new Date().toISOString() } : m
      )
    );
  };

  const handleUndo = (id) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, takenDate: null, takenAt: null } : m))
    );
  };

  // ── Habit handlers ────────────────────────────────────────────
  const handleHabitAdd = (label) => {
    setHabits((prev) => [...prev, { id: generateId(), label, points: 1, archived: false }]);
  };

  const handleHabitEditLabel = (id, label) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, label } : h)));
  };

  const handleHabitRemove = (id) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, archived: true } : h)));
  };

  const handleHabitToggle = (id) => {
    setDaily((prev) => {
      const todayRecord = prev[today] ?? { habitsDone: {} };
      const newDone = { ...todayRecord.habitsDone };
      if (newDone[id]) {
        delete newDone[id];
      } else {
        newDone[id] = true;
      }
      return { ...prev, [today]: { ...todayRecord, habitsDone: newDone } };
    });
  };

  // ── Rating handlers ───────────────────────────────────────────
  const handleOverallFeeling = (value) => {
    setDaily((prev) => {
      const todayRecord = prev[today] ?? {};
      const next = { ...todayRecord };
      if (value === null || value === undefined) {
        delete next.overallFeeling;
      } else {
        next.overallFeeling = value;
      }
      return { ...prev, [today]: next };
    });
  };

  const handleCategoryRating = (category, value) => {
    setDaily((prev) => {
      const todayRecord = prev[today] ?? {};
      const ratings = { ...(todayRecord.ratings ?? {}) };
      if (value === null || value === undefined) {
        delete ratings[category];
      } else {
        ratings[category] = value;
      }
      return { ...prev, [today]: { ...todayRecord, ratings } };
    });
  };

  return (
    <div className="app">
      <nav className="tab-bar" aria-label="Main navigation">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`tab-btn${activeTab === key ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveTab(key)}
            aria-current={activeTab === key ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

      {overdueMeds.length > 0 && <ReminderBanner overdueMeds={overdueMeds} />}

      {activeTab === 'ratings' && (
        <DailyRatings
          overallFeeling={daily[today]?.overallFeeling}
          ratings={daily[today]?.ratings ?? {}}
          onOverallChange={handleOverallFeeling}
          onCategoryChange={handleCategoryRating}
        />
      )}

      {activeTab === 'habits' && (
        <HabitList
          habits={habits}
          habitsDone={daily[today]?.habitsDone ?? {}}
          onToggle={handleHabitToggle}
          onAdd={handleHabitAdd}
          onEditLabel={handleHabitEditLabel}
          onRemove={handleHabitRemove}
        />
      )}

      {activeTab === 'meds' && (
        <section className="section" aria-label="Medications">
          <p className="section__title">Today's medications</p>

          {meds.length === 0 && (
            <p className="empty-state">No medications added yet.</p>
          )}

          <ul className="med-list" aria-label="Medication list">
            {[...meds].sort((a, b) => a.reminderTime.localeCompare(b.reminderTime)).map((med) => (
              <li key={med.id}>
                <MedicationCard
                  med={med}
                  today={today}
                  onMark={handleMark}
                  onUndo={handleUndo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>

          {showAddForm ? (
            <MedicationForm onSave={handleAdd} onCancel={() => setShowAddForm(false)} />
          ) : (
            <button
              className="btn-add-med"
              onClick={() => setShowAddForm(true)}
              aria-label="Add a new medication"
            >
              + Add medication
            </button>
          )}
        </section>
      )}

      {activeTab === 'metrics' && (
        <MetricsView daily={daily} habits={habits} />
      )}
    </div>
  );
}
