import { formatTime } from '../utils/dateUtils.js';

export default function MedicationCheck({ medicationName, isTaken, takenAt, onMark, onUndo }) {
  return (
    <section className="section" aria-label="Medication check-in">
      <p className="section__title">Today's medication</p>

      <div className="med-status">
        <p className="med-name">{medicationName}</p>

        {isTaken ? (
          <>
            <div className="med-taken-badge" role="status">
              <span aria-hidden="true">✓</span> Taken today
            </div>
            {takenAt && (
              <p className="med-taken-time">Marked at {formatTime(takenAt)}</p>
            )}
            <button
              className="btn-undo"
              onClick={onUndo}
              aria-label="Undo — mark medication as not taken"
            >
              Undo
            </button>
          </>
        ) : (
          <button
            className="btn-primary"
            onClick={onMark}
            aria-label={`Mark ${medicationName} as taken today`}
          >
            Mark as Taken
          </button>
        )}
      </div>
    </section>
  );
}
