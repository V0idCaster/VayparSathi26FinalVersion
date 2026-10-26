import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Store, ArrowRight, ArrowLeft, Check, Leaf } from "lucide-react";
import { Button, Card, cx } from "../components/ui";
import { interests, interestLabel, languages, rupee, rupeeShort, locationSuggestions, isValidIndianLocation } from "../lib/data";
import { useLang } from "../lib/i18n";

export interface Profile {
  type: "start" | "own";
  name: string;
  location: string;
  age: string;
  language: string;
  interests: string[];
  experience: string;
  budget: number;
  timeBasis: string;
  businessBasis: string;
}

const MAX_BUDGET = 10000000; // ₹1 Crore

const TOTAL = 5;

export default function Onboarding({ onDone, onExit }: { onDone: (p: Profile) => void; onExit: () => void }) {
  const { t, lang, display, setDisplay } = useLang();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>({
    type: "start",
    name: "",
    location: "",
    age: "25–34",
    language: display,
    interests: [],
    experience: "Some experience",
    budget: 200000,
    timeBasis: "Full-time",
    businessBasis: "Solo owner",
  });

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));
  const toggleInterest = (id: string) =>
    set(
      "interests",
      p.interests.includes(id) ? p.interests.filter((i) => i !== id) : [...p.interests, id],
    );

  // Location must be a recognised Indian city or state — no free-text nonsense.
  const locationValid = isValidIndianLocation(p.location);
  const locationTouched = p.location.trim().length > 0;

  // Per-step validation keeps the flow clear for first-time users.
  const canContinue =
    step === 1
      ? p.name.trim().length > 0 && locationValid
      : step === 2
        ? p.interests.length > 0
        : true;

  const next = () => {
    if (!canContinue) return;
    step < TOTAL - 1 ? setStep(step + 1) : onDone(p);
  };
  const back = () => (step === 0 ? onExit() : setStep(step - 1));

  return (
    <div className="min-h-full bg-gray-50/60">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
            <Leaf size={16} />
          </div>
          <span className="font-display font-extrabold text-gray-900">VyaparSathi</span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-semibold text-brand-700">{t("ob.step")} {step + 1} {t("ob.of")} {TOTAL}</span>
            <span className="text-gray-500">{Math.round(((step + 1) / TOTAL) * 100)}% {t("ob.complete")}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{t("ob.q0")}</h2>
                  <p className="mt-1 text-gray-500">{t("ob.q0sub")}</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { id: "start", icon: Rocket, t: t("ob.start"), d: t("ob.startSub") },
                      { id: "own", icon: Store, t: t("ob.own"), d: t("ob.ownSub") },
                    ].map((o) => (
                      <button
                        key={o.id}
                        onClick={() => set("type", o.id as Profile["type"])}
                        className={cx(
                          "rounded-2xl border-2 p-5 text-left transition-all",
                          p.type === o.id
                            ? "border-brand-600 bg-brand-50"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <o.icon size={28} className="text-brand-700" />
                        <p className="mt-3 font-bold text-gray-900">{o.t}</p>
                        <p className="mt-1 text-sm text-gray-500">{o.d}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{t("ob.q1")}</h2>
                  <p className="mt-1 text-gray-500">{t("ob.q1sub")}</p>
                  <div className="mt-6 space-y-4">
                    <Field label={t("ob.name")}>
                      <input
                        value={p.name}
                        onChange={(e) => set("name", e.target.value)}
                        className="input"
                        placeholder="e.g. Sachin"
                      />
                    </Field>
                    <Field label={t("ob.location")}>
                      <input
                        value={p.location}
                        onChange={(e) => set("location", e.target.value)}
                        className="input"
                        placeholder="Start typing an Indian city, e.g. Salt Lake, West Bengal"
                        list="india-locations"
                        autoComplete="off"
                        aria-invalid={locationTouched && !locationValid}
                      />
                      <datalist id="india-locations">
                        {locationSuggestions.map((s) => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                      {locationTouched && !locationValid ? (
                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                          Please pick a valid Indian city or state from the suggestions.
                        </p>
                      ) : locationValid ? (
                        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand-700">
                          <Check size={13} /> Location recognised.
                        </p>
                      ) : (
                        <p className="mt-1.5 text-xs text-gray-400">We support cities and states across India.</p>
                      )}
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t("ob.age")}>
                        <div className="flex flex-wrap gap-2">
                          {["18–24", "25–34", "35–44", "45+"].map((a) => (
                            <Pill key={a} active={p.age === a} onClick={() => set("age", a)}>
                              {a}
                            </Pill>
                          ))}
                        </div>
                      </Field>
                      <Field label={t("ob.language")}>
                        <select
                          value={p.language}
                          onChange={(e) => {
                            set("language", e.target.value);
                            setDisplay(e.target.value);
                          }}
                          className="input"
                        >
                          {languages.map((l) => (
                            <option key={l}>{l}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{t("ob.q2")}</h2>
                  <p className="mt-1 text-gray-500">{t("ob.q2sub")}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {interests.map((it) => {
                      const active = p.interests.includes(it.id);
                      return (
                        <button
                          key={it.id}
                          onClick={() => toggleInterest(it.id)}
                          className={cx(
                            "relative rounded-2xl border-2 p-4 text-center transition-all",
                            active ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300",
                          )}
                        >
                          {active && (
                            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                              <Check size={12} />
                            </span>
                          )}
                          <div className="text-3xl">{it.emoji}</div>
                          <p className="mt-2 text-sm font-semibold text-gray-800">{interestLabel(it.id, lang)}</p>
                        </button>
                      );
                    })}
                  </div>
                  <Field label={t("ob.experience")} className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {["No experience", "Some experience", "Experienced"].map((e) => (
                        <Pill key={e} active={p.experience === e} onClick={() => set("experience", e)}>
                          {e}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{t("ob.q3")}</h2>
                  <p className="mt-1 text-gray-500">{t("ob.q3sub")}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      { label: "Under ₹50,000", v: 40000 },
                      { label: "₹50K – ₹2 Lakh", v: 150000 },
                      { label: "₹2 – ₹5 Lakh", v: 350000 },
                      { label: "₹5 – ₹10 Lakh", v: 750000 },
                      { label: "₹10 – ₹25 Lakh", v: 1800000 },
                      { label: "Above ₹25 Lakh", v: 4000000 },
                    ].map((b) => (
                      <Pill key={b.label} active={p.budget === b.v} onClick={() => set("budget", b.v)} block>
                        {b.label}
                      </Pill>
                    ))}
                  </div>
                  <div className="mt-8 rounded-2xl bg-gray-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{t("ob.custom")}</span>
                      <span className="tnum font-display text-xl font-bold text-brand-700">{rupee(p.budget)}</span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={MAX_BUDGET}
                      step={10000}
                      value={p.budget}
                      onChange={(e) => set("budget", Number(e.target.value))}
                      className="mt-3 w-full accent-brand-600"
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-400">
                      <span>₹10K</span>
                      <span>{rupeeShort(MAX_BUDGET)}</span>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                      Need more? Type any amount for a larger enterprise — there's no upper limit on planning.
                    </p>
                    <input
                      type="number"
                      min={10000}
                      step={10000}
                      value={p.budget}
                      onChange={(e) => set("budget", Math.max(0, Number(e.target.value)))}
                      className="input mt-2"
                      placeholder="Enter exact budget in ₹"
                    />
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{t("ob.q4")}</h2>
                  <p className="mt-1 text-gray-500">{t("ob.q4sub")}</p>
                  <div className="mt-6 space-y-6">
                    <Field label={t("ob.timeBasis")}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {["Full-time", "Part-time"].map((v) => (
                          <Pill key={v} active={p.timeBasis === v} onClick={() => set("timeBasis", v)} block>
                            {v}
                          </Pill>
                        ))}
                      </div>
                    </Field>
                    <Field label={t("ob.businessBasis")}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {["Solo owner", "Family business", "Partnership", "Side business"].map((v) => (
                          <Pill key={v} active={p.businessBasis === v} onClick={() => set("businessBasis", v)} block>
                            {v}
                          </Pill>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50 p-5">
                    <p className="text-sm font-semibold text-brand-800">
                      {t("ob.allset")}{p.name ? `, ${p.name}` : ""}!
                    </p>
                    <p className="mt-1 text-sm text-brand-700">
                      We'll analyse opportunities in {p.location || "your area"} within a {rupee(p.budget)} budget.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={back}>
              <ArrowLeft size={16} /> {step === 0 ? t("cta.home") : t("cta.back")}
            </Button>
            <Button size="lg" onClick={next} className={canContinue ? "" : "cursor-not-allowed opacity-50"}>
              {step === TOTAL - 1 ? t("ob.finish") : t("cta.continue")}
              <ArrowRight size={18} />
            </Button>
          </div>
        </Card>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          background: #fff;
          padding: 0.65rem 0.85rem;
          font-size: 0.95rem;
          color: #101828;
          outline: none;
        }
        .input:focus { border-color: #12b76a; box-shadow: 0 0 0 3px rgba(18,183,106,0.15); }
      `}</style>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
  block,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  block?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all",
        block && "w-full",
        active ? "border-brand-600 bg-brand-50 text-brand-800" : "border-gray-200 text-gray-700 hover:border-gray-300",
      )}
    >
      {children}
    </button>
  );
}
