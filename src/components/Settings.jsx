export default function Settings({ settings, onChange }) {
  return (
    <section className="section" aria-label="Settings">
      <p className="section__title">Settings</p>

      <div className="settings-row">
        <label htmlFor="med-name">Medication name</label>
        <input
          id="med-name"
          type="text"
          value={settings.medicationName}
          onChange={(e) => onChange({ ...settings, medicationName: e.target.value })}
          placeholder="e.g. Metformin"
          aria-describedby="med-name-hint"
        />
      </div>

      <div className="settings-row">
        <label htmlFor="reminder-time">Reminder time</label>
        <input
          id="reminder-time"
          type="time"
          value={settings.reminderTime}
          onChange={(e) => onChange({ ...settings, reminderTime: e.target.value })}
          aria-describedby="reminder-hint"
        />
        <span id="reminder-hint" className="settings-hint">
          A reminder banner appears if the medication hasn't been taken after this time.
        </span>
      </div>
    </section>
  );
}
