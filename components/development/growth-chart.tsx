import { formatGrowthDate, formatMeasurementValue, metricLabel, metricValue } from "@/lib/development-data";
import type { GrowthMeasurement, GrowthMetric } from "@/types/development";

export function GrowthChart({ metric, measurements }: { metric: GrowthMetric; measurements: GrowthMeasurement[] }) {
  const values = measurements.map((measurement) => metricValue(measurement, metric));
  const min = Math.min(...values); const max = Math.max(...values); const spread = Math.max(max - min, metric === "weight" ? .2 : 1);
  const points = measurements.map((measurement, index) => {
    const x = measurements.length === 1 ? 50 : 8 + (index / (measurements.length - 1)) * 84;
    const y = 82 - ((metricValue(measurement, metric) - min) / spread) * 58;
    return { x, y, measurement };
  });
  const summary = measurements.map((measurement) => `${formatGrowthDate(measurement.date)}: ${formatMeasurementValue(metricValue(measurement, metric), metric)}`).join(", ");
  return <figure className="growth-chart"><div className="growth-chart__header"><div><p>History</p><h2>{metricLabel(metric)} over time</h2></div><strong>{formatMeasurementValue(values.at(-1) ?? 0, metric)}</strong></div><svg viewBox="0 0 100 100" role="img" aria-labelledby={`chart-${metric}-title chart-${metric}-summary`}><title id={`chart-${metric}-title`}>{metricLabel(metric)} history</title><desc id={`chart-${metric}-summary`}>{summary}</desc><path className="growth-chart__grid" d="M8 24H92M8 53H92M8 82H92" /><polyline className="growth-chart__line" points={points.map((point) => `${point.x},${point.y}`).join(" ")} />{points.map((point, index) => <circle key={point.measurement.id} className={index === points.length - 1 ? "growth-chart__point growth-chart__point--current" : "growth-chart__point"} cx={point.x} cy={point.y} r={index === points.length - 1 ? 3.7 : 2.2}><title>{formatMeasurementValue(metricValue(point.measurement, metric), metric)} on {formatGrowthDate(point.measurement.date)}</title></circle>)}</svg><div className="growth-chart__labels">{measurements.map((measurement) => <span key={measurement.id}>{formatGrowthDate(measurement.date)}</span>)}</div><figcaption>Gentle measurement history. This chart does not show percentiles or medical guidance.</figcaption></figure>;
}
