import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileCheck,
  Store,
  Megaphone,
  Check,
  Rocket,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { Card, Button, AICallout, SectionTitle, cx } from "../components/ui";
import type { PageId } from "../components/Shell";

interface Task {
  id: string;
  label: string;
  hint: string;
}

const GROUPS: { title: string; icon: typeof Store; tone: string; weeks: string; tasks: Task[] }[] = [
  {
    title: "Registration & Legal",
    icon: FileCheck,
    tone: "text-blue-600",
    weeks: "Week 1–2",
    tasks: [
      { id: "udyam", label: "Register on Udyam (MSME)", hint: "Free online registration — gives you a lifetime MSME number." },
      { id: "gst", label: "Apply for GST (if turnover needs it)", hint: "Required above ₹40L turnover, or for inter-state supply." },
      { id: "license", label: "Get trade / FSSAI license", hint: "FSSAI is mandatory for any food business." },
      { id: "bank", label: "Open a current bank account", hint: "Keeps business money separate — needed for loans." },
    ],
  },
  {
    title: "Setup & Supplies",
    icon: Store,
    tone: "text-brand-600",
    weeks: "Week 2–4",
    tasks: [
      { id: "location", label: "Finalise location / kitchen", hint: "Start small; a 2 km service radius keeps costs low." },
      { id: "equipment", label: "Buy essential equipment", hint: "Only day-1 essentials — lease or buy used where possible." },
      { id: "suppliers", label: "Lock in 2–3 suppliers", hint: "Compare pricing and negotiate bulk discounts." },
      { id: "billing", label: "Set up billing & UPI", hint: "A simple billing app + QR code is enough to begin." },
    ],
  },
  {
    title: "Marketing & Go-Live",
    icon: Megaphone,
    tone: "text-purple-600",
    weeks: "Week 4–6",
    tasks: [
      { id: "whatsapp", label: "Create a WhatsApp order group", hint: "Cheapest channel to reach and retain local customers." },
      { id: "gmb", label: "List on Google & local directories", hint: "Free visibility when people search nearby." },
      { id: "offer", label: "Plan a launch-week offer", hint: "A small discount drives your first reviews and word-of-mouth." },
      { id: "softlaunch", label: "Soft-launch to friends & family", hint: "Test operations with real orders before going wide." },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.tasks);

export default function Launch({ go }: { go: (p: PageId) => void }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const count = ALL.filter((t) => done[t.id]).length;
  const pct = Math.round((count / ALL.length) * 100);
  const ready = pct === 100;

  return (
    <div className="space-y-6">
      <SectionTitle title="Launch Your Business" subtitle="A step-by-step checklist to go from plan to open for business." />

      {/* Progress */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cx("flex h-14 w-14 items-center justify-center rounded-2xl", ready ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700")}>
              <Rocket size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Launch readiness</p>
              <p className="tnum font-display text-2xl font-bold text-gray-900">
                {count}/{ALL.length} steps done
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-600">
            <CalendarClock size={16} className="text-brand-600" /> Est. timeline: 4–6 weeks
          </div>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div className="h-full rounded-full bg-brand-600" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
        </div>
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm font-semibold text-brand-800">
            <Check size={16} /> You're ready to launch! Next, keep an eye on your Business Health.
          </motion.div>
        )}
      </Card>

      {/* Checklist groups */}
      <div className="grid gap-4 lg:grid-cols-3">
        {GROUPS.map((g) => {
          const gdone = g.tasks.filter((t) => done[t.id]).length;
          return (
            <Card key={g.title} className="p-5">
              <div className="flex items-center gap-2">
                <g.icon size={20} className={g.tone} />
                <div>
                  <h3 className="font-bold text-gray-900">{g.title}</h3>
                  <p className="text-xs text-gray-400">{g.weeks} · {gdone}/{g.tasks.length}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {g.tasks.map((t) => {
                  const isDone = !!done[t.id];
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggle(t.id)}
                      className={cx(
                        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                        isDone ? "border-brand-200 bg-brand-50/60" : "border-gray-200 hover:bg-gray-50",
                      )}
                    >
                      <span className={cx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2", isDone ? "border-brand-600 bg-brand-600 text-white" : "border-gray-300")}>
                        {isDone && <Check size={12} />}
                      </span>
                      <span>
                        <span className={cx("block text-sm font-semibold", isDone ? "text-gray-400 line-through" : "text-gray-800")}>{t.label}</span>
                        <span className="mt-0.5 block text-xs text-gray-500">{t.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <AICallout>
        Don't wait for everything to be perfect. Once Registration and a WhatsApp group are done,
        do a soft-launch — real orders teach you more than another week of planning.
      </AICallout>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => go("schemes")} variant="outline">
          Arrange funding first
        </Button>
        <Button onClick={() => go("health")}>
          Track Business Health <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}
