import { lazy, Suspense, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Landing from "./pages/Landing"; // stays eager: it's the first screen visitors see
import type { Profile } from "./pages/Onboarding";
import type { PageId } from "./components/Shell";

// Everything below is downloaded only when it's first needed
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Shell = lazy(() => import("./components/Shell"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const Feasibility = lazy(() => import("./pages/Feasibility"));
const BusinessPlan = lazy(() => import("./pages/BusinessPlan"));
const Finance = lazy(() => import("./pages/Finance"));
const Schemes = lazy(() => import("./pages/Schemes"));
const BusinessDoctor = lazy(() => import("./pages/BusinessDoctor"));
const BusinessHealth = lazy(() => import("./pages/BusinessHealth"));
const Simulator = lazy(() => import("./pages/Simulator"));
const Community = lazy(() => import("./pages/Community"));
const Journey = lazy(() => import("./pages/Journey"));
const Settings = lazy(() => import("./pages/Settings"));
const Launch = lazy(() => import("./pages/Launch"));

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading...</div>
  );
}

function PageLoading() {
  return <div className="flex h-64 items-center justify-center text-sm text-gray-500">Loading...</div>;
}

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

  if (!authReady) return <Loading />;

  // Not logged in: Landing or Auth
  if (!session) {
    if (authScreen) {
      return (
        <Suspense fallback={<Loading />}>
          <Auth initialMode={authScreen} onBack={() => setAuthScreen(null)} />
        </Suspense>
      );
    }
    return <Landing onStart={() => setAuthScreen("signup")} onLogin={() => setAuthScreen("login")} />;
  }

  // Logged in, still fetching profile
  if (profileFor !== userId) return <Loading />;

  // Logged in, but no profile yet (new user) or the user chose to reset their preferences
  if (!profile || resetting) {
    return (
      <Suspense fallback={<Loading />}>
        <Onboarding
          onDone={finishOnboarding}
          onExit={profile ? () => setResetting(false) : logout}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Shell
        page={page}
        setPage={goExclusive}
        profile={profile}
        canBack={history.length > 1}
        onBack={back}
        onHome={home}
        onLogout={logout}
      >
        {/* Inner Suspense keeps the sidebar visible while a page loads */}
        <Suspense fallback={<PageLoading />}>
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
        </Suspense>
      </Shell>
    </Suspense>
  );
}