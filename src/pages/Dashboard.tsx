import { useState } from "react";
import {
  MapPin,
  TrendingUp,
  Landmark,
  ArrowRight,
  Check,
} from "lucide-react";
import { AreaChart, Area, Tooltip, XAxis } from "recharts";
import { Card, Button, ScoreRing, AICallout, LevelBadge, Chip, ChartBox } from "../components/ui";
import { opportunities, rankByInterests, revenueTrend, rupee, rupeeShort } from "../lib/data";
import { useLang } from "../lib/i18n";
import type { Profile } from "./Onboarding";
import type { PageId } from "../components/Shell";

const STAGES: { label: string; page: PageId }[] = [
  { label: "Opportunity", page: "opportunities" },
  { label: "Feasibility", page: "feasibility" },
  { label: "Business Plan", page: "plan" },
  { label: "Funding", page: "finance" },
  { label: "Launch", page: "launch" },
  { label: "Growth", page: "simulator" },
];
const CURRENT = 2;

export default function Dashboard({ profile, go }: { profile: Profile; go: (p: PageId) => void }) {
  const { t } = useLang();
  const nextStage = STAGES[Math.min(CURRENT + 1, STAGES.length - 1)];
  // Suggested businesses are driven by interests AND the user's budget.
  const ranked = rankByInterests(opportunities, profile.interests);
  const affordable = ranked.filter((o) => o.investment <= profile.budget);
  // Offer several options; the best affordable one is pre-selected.
  const suggestions = ranked.slice(0, 5);
  const defaultPick = (affordable[0] ?? ranked[0]).id;
  const [pickId, setPickId] = useState(defaultPick);
  const top = ranked.find((o) => o.id === pickId) ?? ranked[0];
  const matchesInterest = profile.interests.includes(top.interest);

  // Budget math — everything below is derived from the user's own inputs.
  const budget = profile.budget;
  const investment = top.investment;
  const fitsBudget = investment <= budget;
  const surplus = budget - investment; // >0 buffer, <0 shortfall
  const usedPct = Math.min(100, Math.round((investment / Math.max(budget, 1)) * 100));
  // Recommended funding split from the actual budget/investment.
  const ownFunds = Math.min(budget, investment);
  const loanNeeded = Math.max(0, investment - budget);
  const subsidy = Math.round(investment * 0.35); // PMEGP-style ~35% subsidy
  // Simple runway/break-even signals off the opportunity's profit.
  const breakEvenMonths = Math.max(1, Math.ceil(investment / Math.max(top.profit, 1)));
  const annualProfit = top.profit * 12;
  const roi = Math.round((annualProfit / Math.max(investment, 1)) * 100);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("dash.hello")}, {profile.name} 👋</h1>
        <p className="mt-1 text-gray-500">{t("dash.today")}</p>
      </div>

      {/* Journey tracker — every stage is clickable */}
      <Card className="p-5">
        <div className="flex items-center justify-between overflow-x-auto pb-1">
          {STAGES.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center">
              <button
                onClick={() => go(s.page)}
                title={`Go to ${s.label}`}
                className="group flex flex-col items-center gap-1.5 text-center focus:outline-none"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-transform group-hover:scale-110 ${
                    i < CURRENT
                      ? "bg-brand-600 text-white"
                      : i === CURRENT
                        ? "bg-brand-700 text-white ring-4 ring-brand-100"
                        : "bg-gray-100 text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-700"
                  }`}
                >
                  {i < CURRENT ? <Check size={16} /> : i + 1}
                </div>
                <span className={`whitespace-nowrap text-xs font-medium ${i <= CURRENT ? "text-gray-800" : "text-gray-500 group-hover:text-brand-700"}`}>
                  {s.label}
                </span>
              </button>
              {i < STAGES.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 ${i < CURRENT ? "bg-brand-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            You're on <span className="font-semibold text-gray-800">{STAGES[CURRENT].label}</span>. Next up: {nextStage.label}.
          </p>
          <Button size="sm" onClick={() => go(nextStage.page)}>
            Continue to {nextStage.label} <ArrowRight size={15} />
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Opportunity score */}
        <Card className="flex flex-col items-center p-6 text-center">
          <p className="text-sm font-semibold text-gray-500">{t("dash.oppScore")}</p>
          <div className="my-3">
            <ScoreRing value={top.score} size={140} label="out of 100" />
          </div>
          <p className="mb-2 text-sm font-semibold text-gray-900">{top.name}</p>
          <Chip tone="green">
            <MapPin size={12} /> {profile.location.split(",")[0] || "Your area"}
          </Chip>
        </Card>

        {/* Suggested business */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">{t("dash.suggested")}</p>
              <h3 className="mt-0.5 text-xl font-bold text-gray-900">{top.name}</h3>
              {matchesInterest && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                  ✦ {t("dash.matchesInterest")}
                </span>
              )}
            </div>
            <div className="rounded-xl bg-brand-50 px-3 py-1.5 text-center">
              <p className="tnum font-display text-xl font-bold text-brand-700">{top.score}</p>
              <p className="text-[10px] text-brand-600">score</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Investment" value={rupeeShort(top.investment)} />
            <Stat label="Est. Profit" value={rupeeShort(top.profit) + "/mo"} />
            <div>
              <p className="text-xs text-gray-500">Demand</p>
              <div className="mt-1"><LevelBadge level={top.demand} positive /></div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Competition</p>
              <div className="mt-1"><LevelBadge level={top.competition} /></div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => go("feasibility")}>
              {t("dash.checkFeas")} <ArrowRight size={15} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => go("plan")}>
              {t("dash.createPlan")}
            </Button>
          </div>

          {/* More suggested options — selecting one updates the score & math above */}
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">More options for you</p>
            <div className="space-y-2">
              {suggestions.map((o) => {
                const active = o.id === top.id;
                const fits = o.investment <= profile.budget;
                return (
                  <button
                    key={o.id}
                    onClick={() => setPickId(o.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      active ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {o.score}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">{o.name}</span>
                      <span className="block text-xs text-gray-500">
                        {rupeeShort(o.investment)} · {rupeeShort(o.profit)}/mo
                        {profile.interests.includes(o.interest) && <span className="text-brand-700"> · ✦ your interest</span>}
                      </span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${fits ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                      {fits ? "Fits" : "Over"}
                    </span>
                    {active && <Check size={16} className="shrink-0 text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Budget & funding — all figures computed from the user's budget input */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-500">Your Budget vs This Business</p>
            <h3 className="mt-0.5 text-lg font-bold text-gray-900">{top.name}</h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              fitsBudget ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
            }`}
          >
            {fitsBudget ? "Within your budget" : "Needs extra funding"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <Stat label="Your budget" value={rupee(budget)} />
          <Stat label="Investment needed" value={rupee(investment)} />
          <Stat
            label={surplus >= 0 ? "Buffer left" : "Shortfall"}
            value={rupee(Math.abs(surplus))}
          />
          <Stat label="Est. break-even" value={`${breakEvenMonths} mo`} />
        </div>

        {/* Budget utilisation bar */}
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-gray-500">
            <span>Budget used</span>
            <span className="tnum">{usedPct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${usedPct >= 100 ? "bg-rose-500" : "bg-brand-600"}`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>

        {/* Funding plan derived from budget */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <FundLine label="Own funds" value={ownFunds} tone="brand" />
          <FundLine label="Suggested subsidy (~35%)" value={subsidy} tone="purple" />
          <FundLine
            label={loanNeeded > 0 ? "Loan you'll need" : "No loan needed"}
            value={loanNeeded}
            tone="orange"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <p className="tnum text-sm text-gray-500">
            Projected ROI <span className="font-semibold text-brand-700">{roi}%</span> / year on {rupee(investment)}.
          </p>
          <Button size="sm" variant="outline" onClick={() => go("finance")}>
            {loanNeeded > 0 ? "Plan the funding" : "Structure funding"} <ArrowRight size={15} />
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Business health */}
        <Card className="flex flex-col items-center p-6 text-center">
          <p className="text-sm font-semibold text-gray-500">{t("dash.health")}</p>
          <div className="my-3">
            <ScoreRing value={82} size={130} color="#039855" label="healthy" />
          </div>
          <Button size="sm" variant="secondary" onClick={() => go("health")}>
            {t("dash.viewDash")}
          </Button>
        </Card>

        {/* Revenue mini */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Revenue Trend</p>
              <p className="tnum font-display text-2xl font-bold text-gray-900">{rupee(91000)}</p>
            </div>
            <Chip tone="green">
              <TrendingUp size={12} /> +11% this month
            </Chip>
          </div>
          <ChartBox className="mt-4 h-32">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12b76a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#12b76a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#98a2b3" }} />
              <Tooltip formatter={(v: number) => rupee(v)} contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#039855" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ChartBox>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recommended scheme */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Landmark size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{t("dash.recScheme")}</p>
              <h3 className="font-bold text-gray-900">PMEGP — 92% eligibility match</h3>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Up to 35% subsidy on project cost for new micro-enterprises. Strong fit for your
            budget and category.
          </p>
          <Button size="sm" variant="outline" className="mt-4" onClick={() => go("schemes")}>
            {t("dash.viewSchemes")} <ArrowRight size={15} />
          </Button>
        </Card>

        <div className="flex flex-col justify-center">
          <AICallout>
            {top.name} is a strong fit for {profile.location.split(",")[0] || "your area"} — {top.demand.toLowerCase()} demand
            with {top.competition.toLowerCase()} competition. Starting lean keeps costs low and break-even near {breakEvenMonths} months.
          </AICallout>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="tnum font-display font-bold text-gray-900">{value}</p>
    </div>
  );
}

function FundLine({ label, value, tone }: { label: string; value: number; tone: "brand" | "orange" | "purple" }) {
  const dot = tone === "brand" ? "#039855" : tone === "orange" ? "#f97316" : "#7c3aed";
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} /> {label}
      </p>
      <p className="tnum mt-1 font-display font-bold text-gray-900">{rupee(value)}</p>
    </div>
  );
}
