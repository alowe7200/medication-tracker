import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/** Generate the last 14 YYYY-MM-DD strings in local time, oldest first. */
function getLast14Dates() {
  const dates = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
}

/** Build one metrics entry per day from the raw daily localStorage object. */
function buildMetricsData(daily) {
  const safeDaily = daily ?? {};
  return getLast14Dates().map((date) => {
    const record = safeDaily[date] ?? {};

    // habitsScore: count of truthy entries (deleted keys = not done)
    const habitsScore = Object.values(record.habitsDone ?? {}).filter(Boolean).length;

    // overallFeeling: null when not set (0 is a valid value)
    const overallFeeling = record.overallFeeling !== undefined ? record.overallFeeling : null;

    // categoryScore: sum of rated categories; null if none rated
    const ratingVals = Object.values(record.ratings ?? {});
    const categoryScore = ratingVals.length > 0
      ? ratingVals.reduce((sum, v) => sum + v, 0)
      : null;

    return { date, habitsScore, overallFeeling, categoryScore };
  });
}

/** Compute 14-day summary statistics. */
function computeSummary(data) {
  const withOverall = data.filter((d) => d.overallFeeling !== null);
  const withCategory = data.filter((d) => d.categoryScore !== null);

  return {
    avgOverall: withOverall.length > 0
      ? withOverall.reduce((s, d) => s + d.overallFeeling, 0) / withOverall.length
      : null,
    avgHabits: data.reduce((s, d) => s + d.habitsScore, 0) / data.length,
    avgCategory: withCategory.length > 0
      ? withCategory.reduce((s, d) => s + d.categoryScore, 0) / withCategory.length
      : null,
    daysWithOverall: withOverall.length,
    daysWithCategory: withCategory.length,
    total: data.length,
  };
}

function fmt(n) {
  return n !== null ? n.toFixed(1) : '\u2014';
}

function shortDate(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${m}/${d}`;
}

function MetricsChart({ title, subtitle, data, dataKey, yDomain, strokeColor }) {
  return (
    <div className="metrics-chart">
      <p className="metrics-chart__title">{title}</p>
      {subtitle && <p className="metrics-chart__subtitle">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data} margin={{ top: 6, right: 12, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fontSize: 10 }}
            interval={1}
            tickLine={false}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 10 }}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            labelFormatter={shortDate}
            formatter={(v) => [v === null || v === undefined ? '\u2014' : v, title]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2.5}
            dot={{ r: 3, fill: strokeColor, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function MetricsView({ daily }) {
  const data = buildMetricsData(daily);
  const summary = computeSummary(data);
  const habitActiveDays = data.filter((d) => d.habitsScore > 0).length;
  const hasAnyMetricsData =
    summary.daysWithOverall > 0 || summary.daysWithCategory > 0 || habitActiveDays > 0;

  if (!hasAnyMetricsData) {
    return (
      <section className="section metrics-section" aria-label="Metrics">
        <p className="section__title">Metrics &mdash; last 14 days</p>
        <p className="empty-state">
          No metrics yet &mdash; start rating your day or checking off habits and you&apos;ll see trends here.
        </p>
      </section>
    );
  }

  return (
    <section className="section metrics-section" aria-label="Metrics">
      <p className="section__title">Metrics &mdash; last 14 days</p>

      <MetricsChart
        title="Overall feeling (0-3)"
        subtitle="0 = Poor, 1 = Fair, 2 = Good, 3 = Excellent. Gaps mean not rated."
        data={data}
        dataKey="overallFeeling"
        yDomain={[0, 3]}
        strokeColor="#7c6ac9"
      />

      <MetricsChart
        title="Habits done"
        subtitle="Count of habits completed per day (0+)."
        data={data}
        dataKey="habitsScore"
        yDomain={[0, 'auto']}
        strokeColor="#1e8a44"
      />

      <MetricsChart
        title="Category score (0-9)"
        subtitle="Sum of rated categories only. Gaps mean no categories rated."
        data={data}
        dataKey="categoryScore"
        yDomain={[0, 9]}
        strokeColor="#1a73e8"
      />

      <div className="metrics-summary">
        <p className="metrics-summary__label">14-day summary</p>
        <div className="metrics-stats">
          <div className="metrics-stat">
            <span className="metrics-stat__label">Avg overall feeling</span>
            <span className="metrics-stat__value">{fmt(summary.avgOverall)}</span>
          </div>
          <div className="metrics-stat">
            <span className="metrics-stat__label">Avg habits score</span>
            <span className="metrics-stat__value">{fmt(summary.avgHabits)}</span>
          </div>
          <div className="metrics-stat">
            <span className="metrics-stat__label">Avg category score</span>
            <span className="metrics-stat__value">{fmt(summary.avgCategory)}</span>
          </div>
          <div className="metrics-stat">
            <span className="metrics-stat__label">Overall rated</span>
            <span className="metrics-stat__value">{summary.daysWithOverall} / {summary.total}</span>
          </div>
          <div className="metrics-stat">
            <span className="metrics-stat__label">Category rated</span>
            <span className="metrics-stat__value">{summary.daysWithCategory} / {summary.total}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
