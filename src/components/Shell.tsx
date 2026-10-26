import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  MapPin,
  Gauge,
  ClipboardList,
  IndianRupee,
  Landmark,
  Stethoscope,
  Activity,
  FlaskConical,
  Users,
  Settings,
  Leaf,
  Menu,
  X,
  Bell,
  Search,
  Route,
  Rocket,
  ChevronLeft,
  Home,
  Globe,
  LogOut,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Landmark as LandmarkIcon,
  MessageSquare,
} from "lucide-react";
import { cx } from "./ui";
import AIAssistant from "./AIAssistant";
import { useLang } from "../lib/i18n";
import { languages } from "../lib/data";
import type { Profile } from "../pages/Onboarding";

const NOTIFICATIONS = [
  { icon: LandmarkIcon, tone: "text-orange-600 bg-orange-50", title: "PMEGP window closing soon", time: "2h ago", page: "schemes" as const },
  { icon: TrendingUp, tone: "text-brand-700 bg-brand-50", title: "Business Health improved to 82/100", time: "1d ago", page: "health" as const },
  { icon: MessageSquare, tone: "text-purple-600 bg-purple-50", title: "New reply on your community question", time: "2d ago", page: "community" as const },
  { icon: Sparkles, tone: "text-blue-600 bg-blue-50", title: "AI found 2 new opportunities near you", time: "3d ago", page: "opportunities" as const },
];

export type PageId =
  | "dashboard"
  | "opportunities"
  | "feasibility"
  | "plan"
  | "finance"
  | "schemes"
  | "doctor"
  | "health"
  | "simulator"
  | "community"
  | "journey"
  | "settings"
  | "launch";

const NAV: { id: PageId; label: string; icon: typeof MapPin; group: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { id: "journey", label: "Business Journey", icon: Route, group: "Overview" },
  { id: "opportunities", label: "Opportunities", icon: MapPin, group: "Plan" },
  { id: "feasibility", label: "Feasibility", icon: Gauge, group: "Plan" },
  { id: "plan", label: "Business Plan", icon: ClipboardList, group: "Plan" },
  { id: "finance", label: "Finance", icon: IndianRupee, group: "Fund" },
  { id: "schemes", label: "Schemes & Loans", icon: Landmark, group: "Fund" },
  { id: "launch", label: "Launch", icon: Rocket, group: "Fund" },
  { id: "doctor", label: "Business Doctor", icon: Stethoscope, group: "Grow" },
  { id: "health", label: "Business Health", icon: Activity, group: "Grow" },
  { id: "simulator", label: "Simulator", icon: FlaskConical, group: "Grow" },
  { id: "community", label: "Community", icon: Users, group: "Grow" },
];

export default function Shell({
  page,
  setPage,
  profile,
  canBack,
  onBack,
  onHome,
  onLogout,
  children,
}: {
  page: PageId;
  setPage: (p: PageId) => void;
  profile: Profile;
  canBack: boolean;
  onBack: () => void;
  onHome: () => void;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<null | "bell" | "profile">(null);
  const [langOpen, setLangOpen] = useState(false);
  const { t, display, setDisplay } = useLang();
  const groups = [...new Set(NAV.map((n) => n.group))];
  const initials = (profile.name || "U").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-full bg-gray-50/60">
      {/* Sidebar */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
              <Leaf size={16} />
            </div>
            <span className="font-display font-extrabold text-gray-900">VyaparSathi</span>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-1">
          {groups.map((g) => (
            <div key={g}>
              <p className="px-3 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">{t("group." + g)}</p>
              {NAV.filter((n) => n.group === g).map((n) => {
                const active = page === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      setPage(n.id);
                      setOpen(false);
                    }}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? "bg-brand-50 text-brand-800" : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <n.icon size={17} className={active ? "text-brand-700" : "text-gray-400"} />
                    {t("nav." + n.id)}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-gray-100 p-3">
          {/* Profile + Settings merged into one row */}
          <button
            onClick={() => {
              setPage("settings");
              setOpen(false);
            }}
            className={cx(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
              page === "settings" ? "bg-brand-50" : "hover:bg-gray-100",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">{profile.name || "Your profile"}</p>
              <p className="truncate text-xs text-gray-500">{profile.location || t("nav.settings")}</p>
            </div>
            <Settings size={16} className={page === "settings" ? "text-brand-700" : "text-gray-400"} />
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className={cx("sticky top-0 flex items-center gap-3 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6", menu ? "z-50" : "z-30")}>
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} className="text-gray-700" />
          </button>
          <button
            onClick={onBack}
            disabled={!canBack}
            className={cx(
              "flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
              canBack ? "text-gray-700 hover:bg-gray-100" : "cursor-not-allowed text-gray-300",
            )}
          >
            <ChevronLeft size={18} /> <span className="hidden sm:inline">{t("cta.back")}</span>
          </button>
          <button
            onClick={onHome}
            className={cx(
              "flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
              page === "dashboard" ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <Home size={17} /> <span className="hidden sm:inline">{t("cta.home")}</span>
          </button>
          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 lg:flex">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder={t("shell.search")}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setMenu((m) => (m === "bell" ? null : "bell"));
                  setLangOpen(false);
                }}
                className={cx("relative rounded-lg p-2 transition-colors", menu === "bell" ? "bg-gray-100" : "hover:bg-gray-100")}
              >
                <Bell size={18} className="text-gray-600" />
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {NOTIFICATIONS.length}
                </span>
              </button>
              {menu === "bell" && (
                <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <p className="font-bold text-gray-900">Notifications</p>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">{NOTIFICATIONS.length} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <button
                        key={n.title}
                        onClick={() => {
                          setPage(n.page);
                          setMenu(null);
                        }}
                        className="flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left last:border-0 hover:bg-gray-50"
                      >
                        <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", n.tone)}>
                          <n.icon size={17} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium leading-snug text-gray-800">{n.title}</span>
                          <span className="mt-0.5 block text-xs text-gray-400">{n.time}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setPage("community");
                      setMenu(null);
                    }}
                    className="block w-full bg-gray-50 py-2.5 text-center text-sm font-semibold text-brand-700 hover:bg-gray-100"
                  >
                    View all activity
                  </button>
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setMenu((m) => (m === "profile" ? null : "profile"));
                  setLangOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white ring-offset-2 transition-shadow hover:ring-2 hover:ring-brand-400"
              >
                {initials}
              </button>
              {menu === "profile" && (
                <div className="absolute right-0 z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 font-bold text-white">{initials}</div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{profile.name || "Your profile"}</p>
                      <p className="truncate text-xs text-gray-500">{profile.location || "—"}</p>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <MenuItem icon={Home} label={t("cta.home")} onClick={() => { onHome(); setMenu(null); }} />
                    <MenuItem icon={Settings} label={t("nav.settings")} onClick={() => { setPage("settings"); setMenu(null); }} />
                    {/* Language switcher */}
                    <button
                      onClick={() => setLangOpen((o) => !o)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Globe size={17} className="text-gray-400" />
                      <span className="flex-1 text-left">{t("ob.language")}</span>
                      <span className="text-xs text-gray-400">{display.split(" ")[0]}</span>
                      <ChevronRight size={15} className={cx("text-gray-400 transition-transform", langOpen && "rotate-90")} />
                    </button>
                    {langOpen && (
                      <div className="mb-1 max-h-44 overflow-y-auto rounded-lg bg-gray-50 p-1">
                        {languages.map((l) => (
                          <button
                            key={l}
                            onClick={() => { setDisplay(l); setLangOpen(false); }}
                            className={cx(
                              "block w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-white",
                              display === l ? "font-semibold text-brand-700" : "text-gray-600",
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 p-1.5">
                    <button
                      onClick={() => { setMenu(null); onLogout(); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={17} /> {t("cta.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Click-away backdrop for header menus */}
        {menu && <div className="fixed inset-0 z-40" onClick={() => { setMenu(null); setLangOpen(false); }} />}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      <AIAssistant profile={profile} />
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick }: { icon: typeof Home; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      <Icon size={17} className="text-gray-400" /> {label}
    </button>
  );
}
