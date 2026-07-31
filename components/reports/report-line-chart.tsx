import type { ReportCharts } from "@/types/reports";

export function ReportLineChart({ chart }: { chart: ReportCharts["growth"] }) {
  const values = chart.points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 0.2);
  const points = chart.points.map((point, index) => ({
    x: chart.points.length === 1 ? 50 : 8 + (index / (chart.points.length - 1)) * 84,
    y: 82 - ((point.value - min) / spread) * 58,
    point,
  }));
  const summary = chart.points.map((point) => `${point.date}: ${point.value} ${chart.unit}`).join(", ");

  return (
    <figure className="growth-chart">
      <div className="growth-chart__header">
        <div>
          <p>Growth</p>
          <h2>Weight over time</h2>
        </div>
        <strong>{values.at(-1) ?? 0} {chart.unit}</strong>
      </div>
      <svg viewBox="0 0 100 100" role="img" aria-labelledby="report-growth-chart-title report-growth-chart-summary">
        <title id="report-growth-chart-title">Weight history</title>
        <desc id="report-growth-chart-summary">{summary}</desc>
        <path className="growth-chart__grid" d="M8 24H92M8 53H92M8 82H92" />
        <polyline className="growth-chart__line" points={points.map((p) => `${p.x},${p.y}`).join(" ")} />
        {points.map((p, index) => (
          <circle key={p.point.date} className={index === points.length - 1 ? "growth-chart__point growth-chart__point--current" : "growth-chart__point"} cx={p.x} cy={p.y} r={index === points.length - 1 ? 3.7 : 2.2}>
            <title>{p.point.value} {chart.unit} on {p.point.date}</title>
          </circle>
        ))}
      </svg>
      <div className="growth-chart__labels">
        {chart.points.map((point) => (
          <span key={point.date}>{point.label}</span>
        ))}
      </div>
      <figcaption>Gentle weight history. This chart does not show percentiles or medical guidance.</figcaption>
    </figure>
  );
}
