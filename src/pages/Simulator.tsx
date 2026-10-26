import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, AICallout, SectionTitle, cx } from "../components/ui";
import { rupee } from "../lib/data";

const BASE = { price: 100, sales: 900, expenses: 45000, loan: 150000, rate: 11 };

const presets = [
  { label: "Take ₹2 lakh loan", apply: (s: typeof BASE) => ({ ...s, loan: 200000 }) },
  { label: "Sales drop 20%", apply: (s: typeof BASE) => ({ ...s, sales: Math.round(s.sales * 0.8) }) },
  { label: "Raise prices 10%", apply: (s: typeof BASE) => ({ ...s, price: Math.round(s.price * 1.1) }) },
  { label: "Expenses +15%", apply: (s: typeof BASE) => ({ ...s, expenses: Math.round(s.expenses * 1.15) }) },
];

function compute(s: typeof BASE) {
  const revenue = s.price * s.sales;
  const r = s.rate / 12 / 100;
  const emi = (s.loan * r * Math.pow(1 + r, 36)) / (Math.pow(1 + r, 36) - 1);
  const profit = revenue - s.expenses - emi;
  const cashFlow = profit;
  const breakeven = profit > 0 ? Math.ceil(s.loan / profit) : Infinity;
  return { revenue, expenses: s.expenses, profit, emi, cashFlow, breakeven };
}

export default function Simulator() {
  const [s, setS] = useState(BASE);
  const base = compute(BASE);
  const now = compute(s);

  const set = (k: keyof typeof BASE, v: number) => setS((p) => ({ ...p, [k]: v }));

  const rows: { label: string; base: number; now: number; better: "up" | "down"; fmt?: (n: number) => string }[] = [
    { label: "Revenue", base: base.revenue, now: now.revenue, better: "up" },
    { label: "Expenses", base: base.expenses, now: now.expenses, better: "down" },
    { label: "Monthly EMI", base: base.emi, now: now.emi, better: "down" },
    { label: "Profit", base: base.profit, now: now.profit, better: "up" },
    { label: "Cash Flow", base: base.cashFlow, now: now.cashFlow, better: "up" },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title='Business "What If?" Simulator' subtitle="Adjust the levers and see the impact instantly." />

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900">Adjust your scenario</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setS(p.apply(BASE))}
                className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
              >
                {p.label}
              </button>
            ))}
            <button onClick={() => setS(BASE)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200">
              Reset
            </button>
          </div>
          <div className="mt-5 space-y-4">
            <SlideRow label="Product Price" value={s.price} min={50} max={200} step={5} fmt={rupee} onChange={(v) => set("price", v)} />
            <SlideRow label="Monthly Sales (units)" value={s.sales} min={200} max={2000} step={50} onChange={(v) => set("sales", v)} />
            <SlideRow label="Operating Expenses" value={s.expenses} min={20000} max={90000} step={2000} fmt={rupee} onChange={(v) => set("expenses", v)} />
            <SlideRow label="Loan Amount" value={s.loan} min={0} max={500000} step={25000} fmt={rupee} onChange={(v) => set("loan", v)} />
            <SlideRow label="Interest Rate" value={s.rate} min={7} max={18} step={0.5} fmt={(n) => n + "%"} onChange={(v) => set("rate", v)} />
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Current vs New Scenario</h3>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-300" /> Current</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-500" /> New</span>
              </div>
            </div>
            <div className="space-y-3">
              {rows.map((r) => {
                const diff = r.now - r.base;
                const improved = r.better === "up" ? diff > 0 : diff < 0;
                const flat = Math.abs(diff) < 1;
                return (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="w-28 text-sm text-gray-600">{r.label}</span>
                    <div className="flex-1">
                      <div className="tnum flex items-center justify-between text-sm">
                        <span className="text-gray-400">{rupee(Math.round(r.base))}</span>
                        <span className="font-display font-bold text-gray-900">{rupee(Math.round(r.now))}</span>
                      </div>
                    </div>
                    <span
                      className={cx(
                        "flex w-20 items-center justify-end gap-0.5 text-xs font-semibold",
                        flat ? "text-gray-400" : improved ? "text-brand-600" : "text-rose-500",
                      )}
                    >
                      {flat ? <Minus size={13} /> : improved ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {flat ? "—" : rupee(Math.abs(Math.round(diff)))}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 text-center">
              <p className="text-sm text-gray-500">New Monthly Profit</p>
              <p className={cx("tnum font-display text-3xl font-bold", now.profit >= base.profit ? "text-brand-700" : "text-rose-600")}>
                {rupee(Math.round(now.profit))}
              </p>
            </Card>
            <Card className="p-5 text-center">
              <p className="text-sm text-gray-500">Break-even Period</p>
              <p className="tnum font-display text-3xl font-bold text-gray-900">
                {isFinite(now.breakeven) ? `${now.breakeven} mo` : "—"}
              </p>
            </Card>
          </div>
        </div>
      </div>

      <AICallout>
        Raising prices by 10% while holding sales steady adds the most profit with the least risk.
        Watch for customer drop-off — pair a price rise with a small loyalty perk.
      </AICallout>
    </div>
  );
}

function SlideRow({ label, value, min, max, step, fmt, onChange }: { label: string; value: number; min: number; max: number; step: number; fmt?: (n: number) => string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="tnum font-semibold text-gray-900">{fmt ? fmt(value) : value.toLocaleString("en-IN")}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand-600" />
    </div>
  );
}
