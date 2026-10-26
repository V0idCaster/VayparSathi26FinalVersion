import { useState } from "react";
import { FileText, Info, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, Button, LevelBadge, Chip, SectionTitle } from "../components/ui";
import { schemes } from "../lib/data";

export default function Schemes() {
  const filters = ["All", "Low", "Medium", "High"] as const;
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const list = f === "All" ? schemes : schemes.filter((s) => s.difficulty === f);

  return (
    <div className="space-y-6">
      <SectionTitle title="Government Scheme & Loan Matcher" subtitle="Schemes ranked by how well they fit your profile." />

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <span className="text-sm font-medium text-gray-600">Application difficulty:</span>
        {filters.map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              f === x ? "bg-brand-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {x}
          </button>
        ))}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((s) => (
          <Card key={s.id} className="flex flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{s.category}</p>
              </div>
              <div className="shrink-0 text-center">
                <div className="tnum font-display text-2xl font-bold text-brand-700">{s.match}%</div>
                <p className="text-[10px] text-gray-400">eligibility match</p>
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${s.match}%` }} />
            </div>

            <p className="mt-4 text-sm text-gray-600">{s.summary}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Potential benefit</p>
                <p className="font-semibold text-gray-800">{s.benefit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Difficulty</p>
                <div className="mt-0.5"><LevelBadge level={s.difficulty} /></div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Deadline</p>
                <p className="font-semibold text-gray-800">{s.deadline}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Documents</p>
                <p className="font-semibold text-gray-800">{s.documents.length} required</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.documents.map((d) => (
                <Chip key={d} tone="gray">
                  <FileText size={11} /> {d}
                </Chip>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm">Start Application <ArrowRight size={14} /></Button>
              <Button size="sm" variant="outline"><CheckCircle2 size={14} /> Check Eligibility</Button>
              <Button size="sm" variant="ghost">View Details</Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        Eligibility should be verified with official sources before applying. Match percentages are
        AI estimates based on the details you provided.
      </div>
    </div>
  );
}
