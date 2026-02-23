# Acceptance Criteria — v1.1

## Medications
- I can add a medication with name and reminder time.
- I can edit a medication.
- I can delete a medication.
- Medications are listed clearly on the main screen.
- Reminder times display in 12-hour AM/PM format.
- Medications are ordered by reminder time ascending.


## Daily check-in
- Each medication has a clear "Mark taken" button.
- After marking taken:
  - I see "Taken today" with timestamp.
  - I can undo.
- State persists after page refresh.

## Reminder banner
- If a medication is past its reminder time and not taken:
  - A single banner appears listing overdue medications.
- If multiple meds are overdue:
  - All are listed in the same banner.
- Banner disappears once all overdue meds are taken.

## Daily reset
- At midnight (local time), all medications reset to "not taken".

## Mobile usability
- Buttons are large and easy to tap.
- No horizontal scrolling on small screens.

# Acceptance Criteria — v1.2

## Daily habits

- I can add a new habit with a name.
- I can edit a habit’s name.
- I can remove a habit so it no longer appears in today’s list.
- Today’s habits list shows only active habits.
- Each habit has a checkbox to mark it done for today.
- Checking/unchecking a habit updates immediately.
- I see progress text: "X / Y completed today".
- If I refresh the page, today’s checked/unchecked states are preserved.
- Tomorrow, all habits start unchecked automatically (new day).
- Removing a habit does not delete past daily history.

---

# Acceptance Criteria — v1.3

## Overall daily feeling (primary)

- I see a prominent "Overall, how do you feel today?" rating at the top of the ratings section.
- It shows 4 icons horizontally:
  - 💩 (Poor)
  - 😕 (Fair)
  - 😎 (Good)
  - 🎉 (Excellent)
- I can tap an icon to select it.
- The selected icon is visually highlighted.
- Tapping a different icon updates the selection.
- Tapping the selected icon again clears the rating.
- The overall rating persists after refresh.
- Tomorrow the overall rating starts empty automatically.

## Category ratings (secondary)

- I see 4 categories:
  - Sleep
  - Digestion
  - Bloating
  - Breathing
- Each category displays the same 4 icons horizontally:
  - 💩 (Poor)
  - 😕 (Fair)
  - 😎 (Good)
  - 🎉 (Excellent)
- I can rate any subset of categories (optional).
- Only one icon per category can be selected at a time.
- Tapping the selected icon again clears that category’s rating.
- Category ratings persist after refresh.
- Tomorrow category ratings start empty automatically.

## Derived values display

- The UI shows:
  - "Overall feeling: X" (0–3) when set, or an empty/unset state when not set.
  - "Category score: Y" computed as the sum of rated categories only.
  - "N / 4 rated" showing how many categories are rated.
- Derived values are not stored directly in localStorage (they are computed).

---

# Acceptance Criteria — v1.4

## Tab Navigation

- I see a tab bar at the top of the app.
- Tabs appear in this order:
  - Ratings
  - Habits
  - Meds
  - Metrics
- Ratings is the default tab on page load.
- The active tab is visually highlighted.
- Tabs remain visible while scrolling (sticky).
- Only one section is visible at a time.
- Switching tabs does not reset any data.
- Metrics tab displays a placeholder message.

---

# Acceptance Criteria — v1.5

## Lavender Theme

- The app background has a soft lavender tint.
- Section cards remain white.
- Text remains readable with strong contrast.
- Active tab is clearly indicated using a lavender accent.
- Selected emoji rating buttons use lavender highlight styling.
- When overall feeling is set, that section is visually emphasized.
- All existing functionality remains unchanged.
- No regressions in Meds, Habits, or Ratings behavior.

---

# Acceptance Criteria — v1.6

## Metrics tab

- The Metrics tab is no longer a placeholder.
- The Metrics tab displays metrics for the last 14 days (including today).

## Charts

- I see a chart for Overall feeling over time.
  - Values range 0–3.
  - Days without an overall rating are handled gracefully (gap or missing point).

- I see a chart for Habits score over time.
  - Values range 0–N (based on number of habits done).
  - Days with no habits done show as 0.

- I see a chart for Category score over time.
  - Value is the sum of rated category values (Sleep/Digestion/Bloating/Breathing).
  - Unrated categories do not count toward the sum.
  - Days with no category ratings are handled gracefully (gap or missing point).

## Summary stats

- I see:
  - Avg overall feeling (computed only from days with overall rated)
  - Avg habits score (computed across all days in range)
  - Avg category score (computed only from days with at least 1 category rated)
  - Days with overall rated: X / 14
  - Days with any category rated: Y / 14

## Non-regression

- Meds, Habits, and Ratings tabs behave exactly as before.
- No data is lost or reset.
- No changes to localStorage key shapes are required.