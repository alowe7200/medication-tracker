# Medication Tracker — v1.1

## Primary user
My mom. Mobile-first. She will open this multiple times per day.

## Core purpose (current phase)
1. Track multiple daily medications.
2. Mark each medication as taken once per day.
3. Receive in-app reminder banners if a medication is overdue.

Future phases (not in this step):
- Daily checklist habits
- Symptom ratings
- Overall score
- Trends over time
- SMS reminders

---

## v1.1 Scope

### Medications
- User can add, edit, delete medications.
- Each medication has:
  - Name
  - Daily reminder time (HH:MM, local time)
- Each medication can be marked "Taken today".
- When marked taken:
  - Store timestamp
  - Allow undo
- Display reminder times in 12-hour format (e.g., 7:00 AM).
- Medications are always displayed sorted by reminderTime (earliest to latest).


### Reminder behavior
- If current time is after a medication's reminder time
  AND it has not been marked taken today:
  - Show one banner listing all overdue medications.
- Banner disappears once all overdue meds are taken.

### Daily reset
- All "taken today" states reset automatically at midnight (local device time).


---

# Medication Tracker — v1.2

## v1.2 Scope - Daily habits

### Daily habits
- User can create custom daily habits.
- Each habit:
  - Has a name
  - Can be checked "Done today"
- Habits are user-editable (add, edit, remove).
- Removing a habit removes it from the active list but does not delete past history.
- Habit completion is stored per calendar date (YYYY-MM-DD, local time), so historical data can be used later for trends/scoring.
- All habit checkboxes reset automatically each day (new date, local device time).

### Out of scope (future)
- Daily ratings (Excellent / Good / Fair / Poor) for: Sleep, Digestion, Bloating, Breathing
- Daily score (derived)
- Trends / charts

---

# Medication Tracker — v1.3

## v1.3 Scope — Daily Ratings (How am I feeling?)

### Overall daily feeling (primary)

User can rate overall daily feeling using a 4-icon horizontal scale:

- 💩 = Poor (0)
- 😕 = Fair (1)
- 😎 = Good (2)
- 🎉 = Excellent (3)

Behavior:
- This overall rating is the primary rating and is displayed prominently at the top of the ratings section.
- User taps an icon to select it.
- Tapping a different icon changes the selection.
- Tapping the currently selected icon clears the rating (ratings are optional).
- Overall rating is stored per date in localStorage.
- Overall rating resets automatically on a new calendar day (local device time).

### Category ratings (secondary)

User can also rate how they feel today across four categories:

- Sleep
- Digestion
- Bloating
- Breathing

Each category uses the same 4-icon horizontal scale:

- 💩 = Poor (0)
- 😕 = Fair (1)
- 😎 = Good (2)
- 🎉 = Excellent (3)

Behavior:
- Icons are displayed horizontally under each category label.
- User can rate any subset of categories (optional).
- One rating per category per day.
- Category ratings are stored per date in localStorage.
- Category ratings reset automatically on a new calendar day (local device time).

### Feel score (derived)

Two derived values are displayed:

1) Overall feeling score (derived from the overall rating only)
- Overall feeling score = selected numeric value (0–3)

2) Category feel score (derived from category ratings only)
- Category feel score = sum of selected numeric values across rated categories
- Only rated categories count toward the total
- Display includes:
  - "Category score: X"
  - "Y / 4 rated"

Derived values are computed at render time and are not stored in localStorage.

---

# Medication Tracker — v1.4

## v1.4 Scope — Tabbed Layout

### Navigation

- The app uses a top-level tab navigation.
- Tabs are always visible at the top of the screen (sticky).
- Tabs in this order:
  - Ratings
  - Habits
  - Meds
  - Metrics

### Behavior

- Default tab on load: Ratings.
- Only one tab’s content is visible at a time.
- Switching tabs does not reset state.
- Metrics tab is a placeholder ("Coming soon").
- No changes to data model.

---

# Medication Tracker — v1.5

## v1.5 Scope — Lavender Theme Refresh

### Visual Theme

- The app uses a lavender-based color palette.
- The overall tone should feel calm, soft, and clean (not clinical).
- The app background uses a soft lavender tint.
- Section cards remain white for readability.
- Primary interactions use lavender accents.

### Color Roles (Conceptual)

- Primary: Lavender
- Primary Dark: Used for active states and emphasis
- Primary Light: Used for subtle highlights and background tints
- Background: Soft lavender tint
- Cards: White
- Text: Dark neutral
- Borders: Light lavender/neutral tone

### Component Styling Updates

- Active tab uses primary-dark color.
- Selected emoji ratings use primary-light background and primary-dark border.
- When "Overall feeling" is set, its section has a subtle lavender highlight treatment.
- No layout changes.
- No data model changes.
- No logic changes.

---

# Medication Tracker — v1.6

## v1.6 Scope — Metrics (Charts)

### Metrics tab

- The Metrics tab is implemented (not a placeholder).
- It visualizes recent history using charts derived from localStorage data.
- Time range: last 14 days (including today).

### What is charted

The Metrics tab shows, per day:

1) Habits score (behavior)
- Habits score = number of habits checked done for that date.

2) Overall feeling (outcome)
- Overall feeling = daily overall rating value (0–3).

3) Category score (secondary outcome)
- Category score = sum of rated category values for that date (Sleep/Digestion/Bloating/Breathing).
- Only rated categories count (unrated categories do not contribute).

### Display requirements

- Show charts for:
  - Overall feeling over time (0–3)
  - Habits score over time (0–N)
  - Category score over time (0–12 max if all 4 categories rated)
- Charts should gracefully handle missing days and missing ratings (e.g., gaps or nulls).
- Include lightweight summary stats for the selected range:
  - Avg overall feeling (only days with overall set)
  - Avg habits score (all days)
  - Avg category score (only days with at least 1 category rated)
  - Days with overall rated: X / 14
  - Days with any category rated: Y / 14

### Constraints

- No backend.
- No accounts.
- No data model changes required.
- Scores are derived at render time; do not store aggregates.
- Keep UI simple and mobile-friendly.
- No correlation calculations yet (just visualization).

---

## Out of scope (future)

- SMS reminders
- Multi-user support

---

## Constraints

- Still one-page app
- Still localStorage only
- Still offline-first
- No SMS
- No accounts
- Keep UI extremely simple and mobile-friendly
- No additional features beyond scope
