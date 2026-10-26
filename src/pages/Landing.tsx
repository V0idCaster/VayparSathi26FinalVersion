import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Gauge,
  IndianRupee,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Globe,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { Button, Card, Chip } from "../components/ui";
import { languages, rupeeShort } from "../lib/data";
import { useLang } from "../lib/i18n";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white">
        <Leaf size={18} />
      </div>
      <div className="leading-none">
        <span className="font-display text-lg font-extrabold text-gray-900">Vyapar</span>
        <span className="font-display text-lg font-extrabold text-brand-700">Sathi</span>
      </div>
    </div>
  );
}

export default function Landing({ onStart, onLogin }: { onStart: () => void; onLogin: () => void }) {
  const { t, display, setDisplay } = useLang();
  const [langOpen, setLangOpen] = useState(false);
  const nav = [t("nav.home"), t("nav.explore"), t("nav.myBusiness"), t("nav.schemes"), t("nav.community")];

  return (
    <div className="min-h-full bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((n, i) => (
              <button
                key={n}
                onClick={i === 0 ? () => window.scrollTo({ top: 0, behavior: "smooth" }) : onStart}
                className={`text-sm font-medium ${i === 0 ? "text-brand-700" : "text-gray-600 hover:text-gray-900"}`}
              >
                {n}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <Globe size={16} /> {display.split(" ")[0]} <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setDisplay(l);
                        setLangOpen(false);
                      }}
                      className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-brand-50 ${display === l ? "font-semibold text-brand-700" : "text-gray-700"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onLogin}>
              {t("cta.login")}
            </Button>
            <Button size="sm" onClick={onStart}>
              {t("cta.getStarted")}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Chip tone="green">
              <Sparkles size={13} /> {t("land.tag")}
            </Chip>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              {t("land.h1a")} <span className="text-brand-700">{t("land.h1b")}</span> {t("land.h1c")}{" "}
              <span className="text-brand-700">{t("land.h1d")}</span> {t("land.h1e")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">{t("land.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={onStart}>
                {t("land.ctaPrimary")} <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={onLogin}>
                {t("land.ctaSecondary")}
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-brand-600" /> {t("land.trust1")}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={16} className="text-blue-600" /> {t("land.trust2")}
              </span>
              <span className="flex items-center gap-1.5">
                <IndianRupee size={16} className="text-orange-500" /> {t("land.trust3")}
              </span>
            </div>
          </div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Best Opportunity Score</p>
                  <p className="tnum font-display text-3xl font-bold text-gray-900">
                    87<span className="text-lg text-gray-400">/100</span>
                  </p>
                </div>
                <Chip tone="green">
                  <MapPin size={12} /> Kolkata, WB
                </Chip>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { icon: Gauge, color: "text-blue-600", label: "AI Feasibility", val: "89/100" },
                  { icon: IndianRupee, color: "text-orange-600", label: "Est. Profit", val: "₹35K/mo" },
                  { icon: TrendingUp, color: "text-brand-600", label: "Demand", val: "High" },
                  { icon: ShieldCheck, color: "text-purple-600", label: "Risk", val: "Low" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                    <s.icon size={18} className={s.color} />
                    <p className="mt-2 text-xs text-gray-500">{s.label}</p>
                    <p className="font-display font-bold text-gray-900">{s.val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-brand-700 p-4 text-white">
                <p className="text-xs opacity-80">Suggested Business</p>
                <p className="font-display text-lg font-bold">Organic Grocery Store</p>
                <p className="mt-1 text-xs opacity-90">
                  Investment {rupeeShort(200000)} · Break-even 8 months
                </p>
              </div>
            </Card>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-blue-100 bg-white p-3 shadow-lg sm:block"
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                <Sparkles size={13} /> AI Insight
              </p>
              <p className="mt-1 max-w-[200px] text-xs text-gray-600">
                Demand for affordable grocery delivery is rising in your area.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-14">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-700">
            {t("land.journeyKicker")}
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">{t("land.journeyTitle")}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, box: "bg-brand-50 text-brand-700", t: "Right Opportunity", d: "Hyper-local ideas ranked for your budget & skills." },
              { icon: Gauge, box: "bg-blue-50 text-blue-600", t: "Right Plan", d: "AI feasibility score & a ready business plan." },
              { icon: IndianRupee, box: "bg-orange-50 text-orange-600", t: "Right Funding", d: "Match with PMEGP, MUDRA & the best loan mix." },
              { icon: TrendingUp, box: "bg-purple-50 text-purple-600", t: "Sustainable Growth", d: "Health dashboard, simulator & mentors." },
            ].map((f) => (
              <Card key={f.t} hover className="p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.box}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{f.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{f.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="overflow-hidden rounded-3xl bg-brand-800 px-8 py-12 text-center text-white sm:px-16">
          <h2 className="text-3xl font-bold">{t("land.tagline")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">{t("land.ctaBlurb")}</p>
          <div className="mt-7 flex justify-center">
            <Button size="lg" variant="secondary" onClick={onStart}>
              {t("land.ctaPrimary")} <ArrowRight size={18} />
            </Button>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          © 2026 VyaparSathi · Built for the Smart India Hackathon · Eligibility should be
          verified with official sources.
        </p>
      </section>
    </div>
  );
}
