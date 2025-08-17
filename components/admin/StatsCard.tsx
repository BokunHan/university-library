import type { StatsCard } from "@/types";
import { calculateTrendChange, cn } from "@/lib/utils";

const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
}: StatsCard) => {
  const { trend, change } = calculateTrendChange(
    currentMonthCount,
    lastMonthCount,
  );

  return (
    <article className="stat w-full md:min-w-[220px]">
      <div className="flex gap-4">
        <p className="stat-label">{headerTitle}</p>
        <figure className="flex items-center gap-1">
          <img
            src={
              trend === "decrement"
                ? "/icons/admin/caret-down.svg"
                : "/icons/admin/caret-up.svg"
            }
            alt="caret"
            width={18}
            height={18}
          />
          <figcaption
            className={cn(
              "text-sm font-medium",
              trend === "decrement" ? "text-success-700" : "text-red-800",
            )}
          >
            {change}
          </figcaption>
        </figure>
      </div>
      <div className="stat-count">{total}</div>
    </article>
  );
};
export default StatsCard;
