import { reportTypeLabels } from "@/lib/reports-data";
import { reportTypes, type ReportType } from "@/types/reports";

export function ReportTypeTabs({ active, onChange }: { active: ReportType; onChange: (type: ReportType) => void }) {
  return (
    <div className="report-type-tabs" role="tablist" aria-label="Report period">
      {reportTypes.map((type) => (
        <button
          key={type}
          type="button"
          role="tab"
          aria-selected={active === type}
          className={active === type ? "report-type-tabs__button report-type-tabs__button--active" : "report-type-tabs__button"}
          onClick={() => onChange(type)}
        >
          {reportTypeLabels[type]}
        </button>
      ))}
    </div>
  );
}
