import type { ReportChart } from "@/types/reports";

export function ReportBarChart({ chart, eyebrow }: { chart: ReportChart; eyebrow: string }) {
  if (chart.points.length === 0) {
    return (
      <figure className="report-bar-chart">
        <div className="report-bar-chart__header">
          <div>
            <p>{eyebrow}</p>
            <h2>{chart.title}</h2>
          </div>
        </div>
        <p className="report-bar-chart__empty">No entries logged yet for this chart.</p>
      </figure>
    );
  }

  const max = Math.max(...chart.points.map((point) => point.value), 1);
  const barWidth = 84 / chart.points.length;

  return (
    <figure className="report-bar-chart">
      <div className="report-bar-chart__header">
        <div>
          <p>{eyebrow}</p>
          <h2>{chart.title}</h2>
        </div>
      </div>
      <svg viewBox="0 0 100 100" role="img" aria-labelledby="report-bar-chart-title" preserveAspectRatio="none">
        <title id="report-bar-chart-title">{chart.title}</title>
        <path className="growth-chart__grid" d="M8 24H92M8 53H92M8 82H92" />
        {chart.points.map((point, index) => {
          const height = (point.value / max) * 58;
          const x = 8 + index * barWidth + barWidth * 0.2;
          return (
            <rect key={`${point.label}-${index}`} className="report-bar-chart__bar" x={x} y={82 - height} width={barWidth * 0.6} height={height} rx={1.4}>
              <title>{point.label}: {point.value} {chart.unit}</title>
            </rect>
          );
        })}
      </svg>
      <div className="growth-chart__labels">
        {chart.points.map((point, index) => (
          <span key={`${point.label}-${index}`}>{point.label}</span>
        ))}
      </div>
      <figcaption>{chart.points.length} entr{chart.points.length === 1 ? "y" : "ies"} logged, in {chart.unit}.</figcaption>
    </figure>
  );
}
