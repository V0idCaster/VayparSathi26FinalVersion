import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, ScoreRing, Bar, AICallout, Chip } from "../components/ui";
import { feasibilityBreakdown } from "../lib/data";

export default function Feasibility() {
  const overall = 87;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">AI Business Feasibility</h1>
        <p className="mt-1 text-gray-500">Organic Grocery Store · Kolkata, West Bengal</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-sm font-semibold text-gray-500">Business Feasibility Score</p>
          <div className="my-4">
            <ScoreRing value={overall} size={170} stroke={13} label="out of 100" />
          </div>
          <Chip tone="green">Highly feasible</Chip>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900">Score breakdown</h3>
          <div className="mt-5 space-y-4">
            {feasibilityBreakdown.map((f) => (
              <div key={f.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{f.label}</span>
                  <span className="tnum font-semibold" style={{ color: f.color }}>{f.score}/100</span>
                </div>
                <Bar value={f.score} color={f.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="flex items-center gap-2 font-bold text-gray-900">
            <CheckCircle2 size={18} className="text-brand-600" /> Strengths
          </h3>
          <ul className="mt-4 space-y-3">
            {["Growing local demand for affordable groceries", "Low startup cost fits your budget", "High repeat-purchase, recurring revenue", "Multiple government schemes available"].map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <CheckCircle2 size={13} />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="flex items-center gap-2 font-bold text-gray-900">
            <AlertTriangle size={18} className="text-amber-500" /> Risks
          </h3>
          <ul className="mt-4 space-y-3">
            {["High competition from nearby stores", "Seasonal demand for some produce", "Margins depend on supplier pricing", "Inventory spoilage if not managed"].map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <AlertTriangle size={12} />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <AICallout>
        Start with a smaller service area (2 km radius) and a focused organic range. Expand only
        after achieving stable daily demand — this keeps spoilage low and protects your margins.
      </AICallout>
    </div>
  );
}
