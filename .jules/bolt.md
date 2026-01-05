## 2024-05-24 - Frontend Re-render Optimization
**Learning:** React components that manage both a list of items and a form for adding new items are prime candidates for unnecessary re-renders. Every keystroke in the form updates the parent state, triggering a re-render of the list.
**Action:** Extract the list into a pure component wrapped in `React.memo`. This isolates the list rendering from the form's state updates, ensuring the list only re-renders when the data actually changes.
