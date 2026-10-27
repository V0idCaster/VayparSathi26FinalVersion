import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Onboarding, { type Profile } from "./pages/Onboarding";
import Shell, { type PageId } from "./components/Shell";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import Feasibility from "./pages/Feasibility";
import BusinessPlan from "./pages/BusinessPlan";
import Finance from "./pages/Finance";
import Schemes from "./pages/Schemes";
import BusinessDoctor from "./pages/BusinessDoctor";
import BusinessHealth from "./pages/BusinessHealth";
import Simulator from "./pages/Simulator";
import Community from "./pages/Community";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import Launch from "./pages/Launch";

type Screen = "landing" | "onboarding" | "app";
const KEY = "vyaparsathi.profile";
const SESSION = "vyaparsathi.session";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [history, setHistory] = useState<PageId[]>(["dashboard"]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const page = history[history.length - 1];

  useEffect(() => {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try {
      setProfile(JSON.parse(saved));
      // Only resume the app if this same tab was already logged in
      if (sessionStorage.getItem(SESSION)) setScreen("app");
    } catch {
      /* ignore */
    }
  }
}, []);

  const finishOnboarding = (p: Profile) => {
    setProfile(p);
    localStorage.setItem(KEY, JSON.stringify(p));
    sessionStorage.setItem(SESSION, "1");
    setHistory(["dashboard"]);
    setScreen("app");
  };

  // Login: returning users with a saved profile resume; otherwise they must onboard.
  const login = () => {
    if (profile) {
      sessionStorage.setItem(SESSION, "1");
      setScreen("app");
      setHistory(["dashboard"]);
    } else {
      setScreen("onboarding");
    }
  };

  const go = (p: PageId) =>
    setHistory((h) => (h[h.length - 1] === p ? h : [...h, p]));
  // Sidebar navigation pushes too, so Back stays meaningful.
  const goExclusive = (p: PageId) => go(p);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const home = () => setHistory(["dashboard"]);

  const updateProfile = (p: Profile) => {
    setProfile(p);
    localStorage.setItem(KEY, JSON.stringify(p));
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(SESSION);
    setProfile(null);
    setScreen("landing");
  };

  if (screen === "landing") {
    return <Landing onStart={() => setScreen("onboarding")} onLogin={login} />;
  }
  if (screen === "onboarding" || !profile) {
    return <Onboarding onDone={finishOnboarding} onExit={() => setScreen("landing")} />;
  }

  return (
    <Shell
      page={page}
      setPage={goExclusive}
      profile={profile}
      canBack={history.length > 1}
      onBack={back}
      onHome={home}
      onLogout={logout}
    >
      {page === "dashboard" && <Dashboard profile={profile} go={go} />}
      {page === "journey" && <Journey go={go} />}
      {page === "opportunities" && <Opportunities profile={profile} go={go} />}
      {page === "feasibility" && <Feasibility />}
      {page === "plan" && <BusinessPlan />}
      {page === "finance" && <Finance go={go} profile={profile} />}
      {page === "schemes" && <Schemes />}
      {page === "launch" && <Launch go={go} />}
      {page === "doctor" && <BusinessDoctor />}
      {page === "health" && <BusinessHealth />}
      {page === "simulator" && <Simulator />}
      {page === "community" && <Community />}
      {page === "settings" && <Settings profile={profile} onUpdate={updateProfile} onLogout={logout} />}
    </Shell>
  );
}
