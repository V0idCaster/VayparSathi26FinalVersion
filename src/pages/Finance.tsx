import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { Card, Button, AICallout, SectionTitle, ChartBox } from "../components/ui";
import { opportunities, rankByInterests, rupee } from "../lib/data";
import type { PageId } from "../components/Shell";
import type { Profile } from "./Onboarding";

export default function Finance({ go, profile }: { go: (p: PageId) => void; profile: Profile }) {
  // Total requirement = the suggested (budget-aware) business investment.
  const ranked = rankByInterests(opportunities, profile.interests);
  const suggested = ranked.find((o) => o.investment <= profile.budget) ?? ranked[0];
  const TOTAL = suggested.investment;

  // Seed the funding mix from the user's actual budget.
  const [savings, setSavings] = useState(Math.min(profile.budget, TOTAL));
  const [subsidy, setSubsidy] = useState(Math.min(Math.round(TOTAL * 0.35), TOTAL));
  const loan = Math.max(0, TOTAL - savings - subsidy);

  const [rate, setRate] = useState(11);
  const [tenure, setTenure] = useState(36);

  const r = rate / 12 / 100;
  const emi = loan > 0 ? (loan * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1) : 0;
  const totalInterest = emi * tenure - loan;

  const data = [
    { name: "Own Savings", value: savings, color: "#039855" },
    { name: "Bank Loan", value: loan, color: "#f97316" },
    { name: "Govt. Subsidy", value: subsidy, color: "#7c3aed" },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title="Smart Financial Structuring" subtitle="Plan the healthiest way to fund your business." />

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Funding mix */}
        <Card className="p-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900">Suggested Funding Structure</h3>
            <span className="tnum rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              Total: {rupee(TOTAL)}
            </span>
          </div>

          <div className="mt-4 grid items-center gap-6 sm:grid-cols-2">
            <div className="relative h-48">
              <ChartBox className="h-full">
                <PieChart>
                  <Pie data={data} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2} startAngle={90} endAngle={-270}>
                    {data.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartBox>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400">Loan</span>
                <span className="tnum font-display text-lg font-bold text-orange-600">{Math.round((loan / TOTAL) * 100)}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <Slider label="Own Savings" value={savings} max={TOTAL} color="#039855" onChange={setSavings} />
              <Slider label="Govt. Subsidy" value={subsidy} max={Math.round(TOTAL * 0.5)} color="#7c3aed" onChange={setSubsidy} />
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-gray-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#f97316" }} /> Bank Loan
                  </span>
                  <span className="tnum font-semibold text-gray-900">{rupee(loan)}</span>
                </div>
                <p className="text-xs text-gray-400">Auto-balanced from the total requirement</p>
              </div>
            </div>
          </div>
        </Card>

        {/* EMI calculator */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900">EMI Calculator</h3>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-gray-700">Interest Rate</span>
                <span className="tnum font-semibold">{rate}% p.a.</span>
              </div>
              <input type="range" min={7} max={18} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-orange-500" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-gray-700">Loan Tenure</span>
                <span className="tnum font-semibold">{tenure} months</span>
              </div>
              <input type="range" min={12} max={84} step={6} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-orange-500" />
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-orange-50 p-4 text-center">
            <p className="text-xs text-orange-700">Monthly EMI</p>
            <p className="tnum font-display text-3xl font-bold text-orange-600">{rupee(Math.round(emi))}</p>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Loan amount</span><span className="tnum font-semibold">{rupee(loan)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total interest</span><span className="tnum font-semibold">{rupee(Math.round(totalInterest))}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total payable</span><span className="tnum font-semibold">{rupee(Math.round(emi * tenure))}</span></div>
          </div>
        </Card>
      </div>

      <AICallout title="AI suggests">
        For {suggested.name} you need {rupee(TOTAL)}. With {rupee(savings)} of your own funds and a{" "}
        {rupee(subsidy)} subsidy, your loan drops to {rupee(loan)} — keeping the EMI comfortably under
        30% of the expected monthly profit.
      </AICallout>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Funding sorted? Continue your journey.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => go("schemes")}>
            Find matching schemes
          </Button>
          <Button onClick={() => go("launch")}>
            Continue to Launch <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, max, color, onChange }: { label: string; value: number; max: number; color: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-gray-700">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}
        </span>
        <span className="tnum font-semibold text-gray-900">{rupee(value)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={10000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
    </div>
  );
}
