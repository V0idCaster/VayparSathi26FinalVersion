import { useState } from "react";
import { LogOut, Check, User, Globe, MapPin, RotateCcw } from "lucide-react";
import { Card, Button, SectionTitle, cx } from "../components/ui";
import { languages, locationSuggestions, isValidIndianLocation, rupee } from "../lib/data";
import { useLang } from "../lib/i18n";
import type { Profile } from "./Onboarding";

export default function Settings({
  profile,
  onUpdate,
  onLogout,
  onReset,
}: {
  profile: Profile;
  onUpdate: (p: Profile) => void;
  onLogout: () => void;
  onReset: () => void;
}) {
  const { setDisplay } = useLang();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);
  const locationValid = isValidIndianLocation(draft.location);
  const canSave = dirty && draft.name.trim().length > 0 && locationValid;

  const save = () => {
    if (!canSave) return;
    onUpdate(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const reset = () => {
    const ok = window.confirm(
      "Restart the setup questions to change your business preferences?\n\nYour current answers stay saved until you finish the new setup.",
    );
    if (ok) onReset();
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Settings" subtitle="Manage your profile and preferences." />

      <Card className="p-6">
        <h3 className="flex items-center gap-2 font-bold text-gray-900">
          <User size={18} className="text-brand-700" /> Profile
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Name</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1 text-sm font-semibold text-gray-700">
              <MapPin size={13} /> Location
            </span>
            <input
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              list="settings-locations"
              autoComplete="off"
              aria-invalid={!locationValid}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <datalist id="settings-locations">
              {locationSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {!locationValid && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">Enter a valid Indian city or state.</p>
            )}
          </label>
        </div>
        <label className="mt-4 block sm:max-w-xs">
          <span className="mb-1.5 block text-sm font-semibold text-gray-700">
            Investment budget <span className="tnum font-normal text-gray-500">({rupee(draft.budget)})</span>
          </span>
          <input
            type="number"
            min={0}
            step={10000}
            value={draft.budget}
            onChange={(e) => setDraft({ ...draft, budget: Math.max(0, Number(e.target.value)) })}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      </Card>

      <Card className="p-6">
        <h3 className="flex items-center gap-2 font-bold text-gray-900">
          <Globe size={18} className="text-blue-600" /> Preferred Language
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => {
                setDraft({ ...draft, language: l });
                setDisplay(l);
              }}
              className={cx(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                draft.language === l ? "bg-brand-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </Card>

      {/* NEW: reset business preferences */}
      <Card className="p-6">
        <h3 className="flex items-center gap-2 font-bold text-gray-900">
          <RotateCcw size={18} className="text-orange-600" /> Change Business Preferences
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Want to switch to a different business type, such as from a cloud kitchen to agriculture? Redo the setup
          questions with new choices. Your current answers stay saved until you finish.
        </p>
        <Button variant="outline" onClick={reset} className="mt-4">
          <RotateCcw size={16} /> Reset my preferences
        </Button>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} className={cx(!canSave && "cursor-not-allowed opacity-50")}>
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button variant="outline" onClick={onLogout} className="text-rose-600">
          <LogOut size={16} /> Log out
        </Button>
      </div>
    </div>
  );
}