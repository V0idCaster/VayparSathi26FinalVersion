import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Stethoscope, AlertCircle, ListChecks, ArrowRight } from "lucide-react";
import { Card, Button, LevelBadge, Chip, cx } from "../components/ui";
import { doctorProblems } from "../lib/data";

const RESULT: Record<string, { problem: string; causes: string[]; plan: string[] }> = {
  expenses: {
    problem: "High operational expenses",
    causes: ["Supplier costs increased", "High wastage of perishable stock", "Low inventory efficiency"],
    plan: ["Compare supplier pricing across 3 vendors", "Reduce wastage with weekly stock audits", "Track inventory weekly using a simple register", "Negotiate bulk purchase discounts"],
  },
  sales: {
    problem: "Declining sales momentum",
    causes: ["Low repeat customer rate", "Limited local visibility", "No festive/weekend offers"],
    plan: ["Start a WhatsApp order group", "Run a weekend loyalty discount", "List on 1 local delivery aggregator", "Collect customer numbers at billing"],
  },
};

export default function BusinessDoctor() {
  const [problem, setProblem] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const res = problem ? RESULT[problem] ?? RESULT.expenses : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">AI Business Doctor</h1>
        <p className="mt-1 text-gray-500">Tell us what's wrong — we'll diagnose and prescribe a fix.</p>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-gray-900">What problem are you facing?</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {doctorProblems.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProblem(p.id);
                setAnalyzed(false);
              }}
              className={cx(
                "rounded-2xl border-2 p-4 text-left transition-all",
                problem === p.id ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300",
              )}
            >
              <span className="text-2xl">{p.emoji}</span>
              <p className="mt-2 text-sm font-semibold text-gray-800">{p.label}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-gray-100 p-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Mic size={18} />
          </button>
          <input placeholder="Or describe it in your words (text or voice)…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
          <Button size="sm" onClick={() => setAnalyzed(true)} className={problem ? "" : "opacity-50"}>
            <Stethoscope size={15} /> Diagnose
          </Button>
        </div>
      </Card>

      {analyzed && res && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-rose-600">
              <AlertCircle size={14} /> Problem detected
            </p>
            <h3 className="mt-1 text-xl font-bold text-gray-900">{res.problem}</h3>
            <p className="mt-4 text-sm font-semibold text-gray-700">Possible causes</p>
            <ul className="mt-2 space-y-2">
              {res.causes.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" /> {c}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-gray-50 p-2">
                <p className="text-gray-400">Priority</p>
                <div className="mt-1"><LevelBadge level="High" /></div>
              </div>
              <div className="rounded-xl bg-gray-50 p-2">
                <p className="text-gray-400">Impact</p>
                <div className="mt-1"><LevelBadge level="High" positive /></div>
              </div>
              <div className="rounded-xl bg-gray-50 p-2">
                <p className="text-gray-400">Difficulty</p>
                <div className="mt-1"><LevelBadge level="Medium" /></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-700">
              <ListChecks size={14} /> AI Action Plan
            </p>
            <ol className="mt-3 space-y-3">
              {res.plan.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-center gap-2">
              <Chip tone="green">Est. timeline: 3–4 weeks</Chip>
            </div>
            <Button size="sm" className="mt-4">Track this plan <ArrowRight size={14} /></Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
