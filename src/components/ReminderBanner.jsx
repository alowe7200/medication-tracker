export default function ReminderBanner({ overdueMeds }) {
  const names = overdueMeds.map((m) => m.name);
  const text =
    names.length === 1
      ? names[0]
      : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];

  return (
    <div className="banner" role="alert" aria-live="assertive">
      <span className="banner__icon" aria-hidden="true">⏰</span>
      <span>
        Reminder: you haven't taken <strong>{text}</strong> yet today.
      </span>
    </div>
  );
}
