import {
  MapPin,
  Gauge,
  ClipboardList,
  IndianRupee,
  Landmark,
  Rocket,
  Activity,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Card, SectionTitle } from "../components/ui";
import type { PageId } from "../components/Shell";

const ICONS = { MapPin, Gauge, ClipboardList, IndianRupee, Landmark, Rocket, Activity, TrendingUp };

const steps: { icon: keyof typeof ICONS; label: string; desc: string; page: PageId; done: boolean }[] = [
  { icon: "MapPin", label: "Discover Opportunity", desc: "Find hyper-local ideas ranked for you.", page: "opportunities", done: true },
  { icon: "Gauge", label: "Check Feasibility", desc: "Get an AI feasibility score & risks.", page: "feasibility", done: true },
  { icon: "ClipboardList", label: "Create Business Plan", desc: "A ready plan with full financials.", page: "plan", done: false },
  { icon: "IndianRupee", label: "Arrange Funding", desc: "Design your savings-loan-subsidy mix.", page: "finance", done: false },
  { icon: "Landmark", label: "Find Schemes & Loans", desc: "Match with PMEGP, MUDRA & more.", page: "schemes", done: false },
  { icon: "Rocket", label: "Launch Business", desc: "Go live with a clear step-by-step checklist.", page: "launch", done: false },
  { icon: "Activity", label: "Monitor Health", desc: "Track sales, profit and risk.", page: "health", done: false },
  { icon: "TrendingUp", label: "Improve & Grow", desc: "Simulate decisions and scale up.", page: "simulator", done: false },
];

export default function Journey({ go }: { go: (p: PageId) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle title="Your All-in-One Business Journey" subtitle="Eight guided stages, from idea to sustainable growth. Tap any stage to jump in." />

      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <Card key={s.label} hover onClick={() => go(s.page)} className="group flex items-center gap-4 p-5">
              <div className="relative">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.done ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"}`}>
                  <Icon size={22} />
                </div>
                <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-500 shadow">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{s.label}</h3>
                  {s.done && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">DONE</span>}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{s.desc}</p>
              </div>
              <ArrowRight size={18} className="text-gray-300 transition-colors group-hover:text-brand-600" />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
