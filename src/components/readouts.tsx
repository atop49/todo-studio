import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

/** 实时时间码：HH:MM:SS，每秒跳格。剪辑台监视器的常驻读数。 */
export function LiveTimecode() {
  const [now, setNow] = useState(() => new Date());
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      ref={ref}
      className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-muted"
      aria-live="off"
    >
      {format(now, "HH:mm:ss")}
    </span>
  );
}

/** 统计读数：数值变化时闪一次信号橙 */
export function StatReadout({
  value,
  label,
  flash,
}: {
  value: string;
  label: string;
  flash: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        key={value}
        className={`font-mono text-[1.375rem] font-medium leading-none tabular-nums text-ink ${
          flash ? "readout-flash" : ""
        }`}
      >
        {value}
      </span>
      <span className="mono-label">{label}</span>
    </div>
  );
}

/** 完成率进度：发丝线轨道 + 纸白填充，不发光 */
export function RateBar({ rate }: { rate: number }) {
  const pct = Math.round(rate * 100);
  return (
    <div
      className="h-px w-full bg-hairline"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`完成率 ${pct}%`}
    >
      <div
        className="h-px bg-ink transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
