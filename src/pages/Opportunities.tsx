import { useState } from "react";
import { MapPin, Search, SlidersHorizontal, Sparkles, ArrowRight } from "lucide-react";
import { Card, Button, LevelBadge, Chip, AICallout, ScoreRing } from "../components/ui";
import { opportunities, rankByInterests, interestLabel, rupee, rupeeShort } from "../lib/data";
import { useLang } from "../lib/i18n";
import type { Profile } from "./Onboarding";
import type { PageId } from "../components/Shell";

export default function Opportunities({ profile, go }: { profile: Profile; go: (p: PageId) => void }) {
  const { lang } = useLang();
  // Rank so businesses matching the user's chosen interests come first.
  const ranked = rankByInterests(opportunities, profile.interests);
  const [selected, setSelected] = useState(ranked[0].id);
  const [onlyMine, setOnlyMine] = useState(profile.interests.length > 0);
  const [withinBudget, setWithinBudget] = useState(false);
  const matches = (o: (typeof opportunities)[number]) => profile.interests.includes(o.interest);
  const fitsBudget = (o: (typeof opportunities)[number]) => o.investment <= profile.budget;
  const mine = ranked.filter((o) => matches(o));
  let list = onlyMine && mine.length > 0 ? mine : ranked;
  if (withinBudget) list = list.filter(fitsBudget);
  const active = opportunities.find((o) => o.id === selected)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Business Opportunity Finder</h1>
        <p className="mt-1 text-gray-500">Ranked, hyper-local ideas for your budget and skills.</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5">
            <MapPin size={16} className="text-gray-400" />
            <span className="truncate text-sm text-gray-800">{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5">
            <span className="text-sm text-gray-500">Budget</span>
            <span className="ml-auto tnum text-sm font-semibold text-gray-800">{rupee(profile.budget)}</span>
          </div>
          <Button variant="outline">
            <SlidersHorizontal size={16} /> More filters
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {profile.interests.length > 0 && (
            <button
              onClick={() => setOnlyMine((v) => !v)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                onlyMine ? "bg-brand-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ✦ Matches my interests
            </button>
          )}
          <button
            onClick={() => setOnlyMine(false)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              !onlyMine ? "bg-brand-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All opportunities
          </button>
          <button
            onClick={() => setWithinBudget((v) => !v)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              withinBudget ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ₹ Within my budget
          </button>
          <span className="ml-1 text-xs text-gray-400">
            Your interests: {profile.interests.map((i) => interestLabel(i, lang)).join(", ") || "—"}
          </span>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* List */}
        <div className="space-y-4 lg:col-span-3">
          {list.length === 0 && (
            <Card className="p-6 text-center">
              <p className="font-semibold text-gray-800">No ideas within {rupee(profile.budget)} yet.</p>
              <p className="mt-1 text-sm text-gray-500">Raise your budget in Settings or clear the budget filter to see more.</p>
              <Button variant="outline" className="mt-4" onClick={() => setWithinBudget(false)}>
                Clear budget filter
              </Button>
            </Card>
          )}
          {list.map((o, i) => (
            <Card
              key={o.id}
              hover
              onClick={() => setSelected(o.id)}
              className={`p-5 ${selected === o.id ? "ring-2 ring-brand-500" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-display font-bold text-brand-700">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-gray-900">{o.name}</h3>
                    <Chip tone="green">
                      <Sparkles size={12} /> {o.score}/100
                    </Chip>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Chip tone="gray">{o.category}</Chip>
                    {matches(o) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                        ✦ {interestLabel(o.interest, lang)}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        fitsBudget(o) ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {fitsBudget(o) ? "Within budget" : "Over budget"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500">{o.blurb}</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                    <Metric label="Demand"><LevelBadge level={o.demand} positive /></Metric>
                    <Metric label="Competition"><LevelBadge level={o.competition} /></Metric>
                    <Metric label="Investment"><span className="tnum text-sm font-semibold text-gray-800">{rupeeShort(o.investment)}</span></Metric>
                    <Metric label="Profit/mo"><span className="tnum text-sm font-semibold text-brand-700">{rupeeShort(o.profit)}</span></Metric>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Map + detail */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative h-44 bg-gradient-to-br from-brand-100 to-blue-50">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(#c7d2da 1px, transparent 1px), linear-gradient(90deg, #c7d2da 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              {[
                { t: "30%", l: "35%" },
                { t: "55%", l: "60%" },
                { t: "40%", l: "70%" },
              ].map((pos, i) => (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: pos.t, left: pos.l }}>
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-600 ring-2 ring-white" />
                  </span>
                </div>
              ))}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur">
                <MapPin size={12} className="text-brand-600" /> {profile.location}
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-gray-500">Selected opportunity</p>
            <h3 className="mt-0.5 text-lg font-bold text-gray-900">{active.name}</h3>
            <div className="mt-4 flex items-center gap-4">
              <ScoreRing value={active.score} size={90} label="score" />
              <div className="space-y-1.5 text-sm">
                <Row label="Investment" value={rupee(active.investment)} />
                <Row label="Est. revenue" value={rupee(active.revenue) + "/mo"} />
                <Row label="Est. profit" value={rupee(active.profit) + "/mo"} accent />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Risk</span>
                  <LevelBadge level={active.risk} />
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <Button className="w-full" onClick={() => go("feasibility")}>
                Check Feasibility <ArrowRight size={15} />
              </Button>
              <Button variant="outline" className="w-full" onClick={() => go("plan")}>
                Create Business Plan
              </Button>
            </div>
          </Card>

          <AICallout title="Why AI picked this">
            {active.name} suits your {profile.budget <= 150000 ? "lean" : "mid-range"} budget and rising
            local demand, with a manageable {active.competition.toLowerCase()} competition level.
          </AICallout>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}
function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{label}</span>
      <span className={`tnum ml-auto font-semibold ${accent ? "text-brand-700" : "text-gray-800"}`}>{value}</span>
    </div>
  );
}
