import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
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

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileFor, setProfileFor] = useState<string | null>(null); // user id the profile was loaded for
  const [authScreen, setAuthScreen] = useState<null | "login" | "signup">(null);
  const [resetting, setResetting] = useState(false); // true while the user is redoing onboarding
  const [history, setHistory] = useState<PageId[]>(["dashboard"]);
  const page = history[history.length - 1];

  // Track the Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load this user's profile from the database
  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setProfileFor(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("data")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("Could not load profile:", error.message);
        const d = data?.data as Profile | undefined;
        setProfile(d && Object.keys(d).length ? d : null);
        setProfileFor(userId);
        setHistory(["dashboard"]);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const saveProfile = async (p: Profile) => {
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, data: p, updated_at: new Date().toISOString() });
    if (error) console.error("Could not save profile:", error.message);
  };

  const finishOnboarding = (p: Profile) => {
    setProfile(p);
    saveProfile(p);
    setResetting(false);
    setHistory(["dashboard"]);
  };

  const updateProfile = (p: Profile) => {
    setProfile(p);
    saveProfile(p);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthScreen(null);
    setResetting(false);
    setHistory(["dashboard"]);
  };

  const go = (p: PageId) =>
    setHistory((h) => (h[h.length - 1] === p ? h : [...h, p]));
  const goExclusive = (p: PageId) => go(p);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const home = () => setHistory(["dashboard"]);

  const Loading = (
    <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading...</div>
  );

  if (!authReady) return Loading;

  // Not logged in: Landing or Auth
  if (!session) {
    if (authScreen) return <Auth initialMode={authScreen} onBack={() => setAuthScreen(null)} />;
    return <Landing onStart={() => setAuthScreen("signup")} onLogin={() => setAuthScreen("login")} />;
  }

  // Logged in, still fetching profile
  if (profileFor !== userId) return Loading;

  // Logged in, but no profile yet (new user) or the user chose to reset their preferences
  if (!profile || resetting) {
    return (
      <Onboarding
        onDone={finishOnboarding}
        onExit={profile ? () => setResetting(false) : logout}
      />
    );
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
      {page === "settings" && (
        <Settings
          profile={profile}
          onUpdate={updateProfile}
          onLogout={logout}
          onReset={() => setResetting(true)}
        />
      )}
    </Shell>
  );
}