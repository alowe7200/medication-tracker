/** Returns today's date as "YYYY-MM-DD" in local time. */
export function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Formats "YYYY-MM-DD" as "Mon, Jan 1" using local date parts (avoids UTC shift). */
export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Formats an ISO timestamp as "9:05 AM". */
export function formatTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Formats "HH:MM" (24-hour) as "9:05 AM". */
export function formatReminderTime(hhMM) {
  const [hours, minutes] = hhMM.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Returns true if the current local time is at or after the given reminder time.
 * @param {string} reminderTime - "HH:MM" in 24-hour format
 */
export function isAfterReminderTime(reminderTime) {
  const [hours, minutes] = reminderTime.split(':').map(Number);
  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hours, minutes, 0, 0);
  return now >= trigger;
}
