import { cn } from "@/lib/utils";

interface TooltipItem {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = String,
  className,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card px-3 py-2.5 shadow-lg text-sm text-card-foreground",
        className,
      )}
    >
      {label && (
        <p className="mb-2 font-semibold capitalize">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="ml-auto pl-6 font-medium tabular-nums">
              {valueFormatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
