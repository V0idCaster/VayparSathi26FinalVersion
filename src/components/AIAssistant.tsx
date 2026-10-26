import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Send, Sparkles, Volume2 } from "lucide-react";
import { cx } from "./ui";
import { languages, opportunities, rankByInterests, schemes, rupee, rupeeShort } from "../lib/data";
import { useLang } from "../lib/i18n";
import type { Profile } from "../pages/Onboarding";

interface Msg {
  from: "ai" | "user";
  text: string;
}

// More question options for the user, grouped so the chips stay scannable.
const QUICK_PROMPTS = [
  "Best business for me?",
  "What's my opportunity score?",
  "Which scheme fits me?",
  "How much loan will I need?",
  "How do I improve my sales?",
  "Is this business feasible?",
  "How do I grow faster?",
  "What licenses do I need?",
];

export default function AIAssistant({ profile }: { profile: Profile }) {
  const { display, setDisplay } = useLang();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: `Namaste ${profile.name}! 🙏 I'm your VyaparSathi assistant. Ask me anything about your business — you can speak or type.` },
  ]);

  // Build a smart, personalised answer from the user's real profile + data.
  const answer = (q: string): string => {
    const s = q.toLowerCase();
    const ranked = rankByInterests(opportunities, profile.interests);
    const top = ranked.find((o) => o.investment <= profile.budget) ?? ranked[0];
    const area = profile.location.split(",")[0] || "your area";

    if (/(score|rating|rank|potential)/.test(s)) {
      return `Your top opportunity is ${top.name} with an opportunity score of ${top.score}/100. It scores well on demand (${top.demand}) with ${top.competition} competition in ${area}. Want me to open its feasibility report?`;
    }
    if (/(loan|fund|emi|money|capital|invest)/.test(s)) {
      const needed = top.investment;
      const loan = Math.max(0, needed - profile.budget);
      const subsidy = Math.round(needed * 0.35);
      return loan > 0
        ? `${top.name} needs about ${rupee(needed)}. With your ${rupee(profile.budget)} budget and a ~${rupee(subsidy)} subsidy, you'd need roughly ${rupee(loan)} as a loan. A MUDRA loan can cover this. Open the Finance page to plan the EMI.`
        : `Good news — your ${rupee(profile.budget)} budget already covers ${top.name} (needs ${rupee(needed)}). You may not need a loan at all. A ~${rupee(subsidy)} subsidy can free up working capital.`;
    }
    if (/(scheme|subsidy|government|pmegp|mudra)/.test(s)) {
      const best = schemes[0];
      return `You have a strong ${best.match}% match with ${best.name} — ${best.benefit}. ${schemes[1].name} is also a good fit. Documents needed: ${best.documents.slice(0, 3).join(", ")}. Check the Schemes page for the full list.`;
    }
    if (/(sales|customer|revenue|grow|scale|marketing)/.test(s)) {
      return `To lift sales for ${top.name} in ${area}: start a WhatsApp order group, offer free local delivery above ₹300, and run a weekend loyalty offer. Small steps first — most owners see 15–20% growth in 2 months. The Simulator lets you test these decisions.`;
    }
    if (/(feasib|risk|viable|worth|safe)/.test(s)) {
      return `${top.name} looks feasible for you: ${top.demand} demand, ${top.risk} risk, and an estimated ${rupeeShort(top.profit)}/month profit — breaking even in about ${Math.max(1, Math.ceil(top.investment / Math.max(top.profit, 1)))} months. Open the Feasibility page for the full breakdown.`;
    }
    if (/(licen|register|legal|gst|document|permit)/.test(s)) {
      return `For ${top.name} you'll typically need: Udyam (MSME) registration, a GST number if turnover crosses ₹40 lakh, a local trade licence, and a business bank account. Food businesses also need an FSSAI licence. The Launch checklist walks you through each step.`;
    }
    // Default: personalised top-3 with real scores.
    const three = ranked.slice(0, 3);
    return `Based on your interests, budget (${rupee(profile.budget)}) and ${area}, here are three suitable options: ${three
      .map((o) => `${o.name} (${o.score}/100)`)
      .join(", ")}. Want the feasibility report for any of these?`;
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const reply = answer(text);
    setMsgs((m) => [...m, { from: "user", text }, { from: "ai", text: reply }]);
    setInput("");
  };

  const mic = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      send("Mere area mein kaunsa business accha chalega?");
    }, 1600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
      >
        <Sparkles size={18} /> Ask AI
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              className="fixed bottom-6 right-6 z-50 flex h-[560px] max-h-[85vh] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between bg-blue-600 px-4 py-3.5 text-white">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="font-display font-bold leading-tight">AI Assistant</p>
                    <p className="text-xs text-blue-100">Voice & 8 Indian languages</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="border-b border-gray-100 px-3 py-2">
                <select
                  value={display}
                  onChange={(e) => setDisplay(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 outline-none"
                >
                  {languages.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {msgs.map((m, i) => (
                  <div key={i} className={cx("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cx(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        m.from === "user"
                          ? "rounded-br-sm bg-brand-700 text-white"
                          : "rounded-bl-sm bg-gray-100 text-gray-800",
                      )}
                    >
                      {m.text}
                      {m.from === "ai" && i > 0 && (
                        <button className="mt-1.5 flex items-center gap-1 text-xs text-blue-600">
                          <Volume2 size={12} /> Listen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {listening && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          animate={{ scaleY: [1, 2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.7, delay: d * 0.15 }}
                          className="inline-block h-3 w-1 rounded bg-blue-500"
                        />
                      ))}
                    </span>
                    Listening…
                  </div>
                )}
              </div>

              <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-gray-100 p-3">
                <button
                  onClick={mic}
                  className={cx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    listening ? "bg-rose-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                >
                  <Mic size={18} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Type or speak your question…"
                  className="min-w-0 flex-1 rounded-xl bg-gray-100 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={() => send(input)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white hover:bg-brand-800"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
