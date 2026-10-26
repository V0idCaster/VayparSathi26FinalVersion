import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import type { Level } from "../lib/data";

export function cx(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/**
 * Chart wrapper that only mounts Recharts' ResponsiveContainer once the box has
 * real dimensions. Prevents the "width(0) and height(0)" warning that fires when
 * the container is measured before layout.
 */
export function ChartBox({ children, className }: { children: ReactElement; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setReady(el.clientWidth > 0 && el.clientHeight > 0);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={cx("w-full", className)}>
      {ready && (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
  onClick,
  hover,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cx(
        "rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
        hover && "transition-all hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)] hover:border-gray-300 cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "outline";

export function Button({
  children,
  onClick,
  variant = "primary",
  className,
  size = "md",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  className?: string;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
}) {
  const variants: Record<BtnVariant, string> = {
    primary:
      "bg-brand-700 text-white hover:bg-brand-800 shadow-[0_1px_2px_rgba(5,96,58,0.4)]",
    secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 bg-white",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-xl gap-2",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

const levelStyles: Record<Level, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  High: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

// Direction-aware: for demand/profit High is good; for competition/risk High is bad.
export function LevelBadge({ level, positive }: { level: Level; positive?: boolean }) {
  let style = levelStyles[level];
  if (positive) {
    style =
      level === "High"
        ? levelStyles.Low
        : level === "Low"
          ? levelStyles.High
          : levelStyles.Medium;
  }
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", style)}>
      {level}
    </span>
  );
}

export function Chip({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: "gray" | "green" | "blue" | "orange" | "purple";
}) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-brand-50 text-brand-700",
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function ScoreRing({
  value,
  size = 120,
  stroke = 10,
  color = "#027a48",
  label,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef0f2" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="tnum font-display font-bold text-gray-900" style={{ fontSize: size * 0.26 }}>
          {value}
        </span>
        {label && <span className="text-[11px] font-medium text-gray-500">{label}</span>}
        {sub && <span className="text-[10px] text-gray-400">{sub}</span>}
      </div>
    </div>
  );
}

export function Bar({ value, color = "#027a48" }: { value: number; color?: string }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: color, transition: "width 0.8s ease" }}
      />
    </div>
  );
}

export function AICallout({ children, title = "AI Recommendation" }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-700">{children}</p>
      </div>
    </div>
  );
}

export function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
