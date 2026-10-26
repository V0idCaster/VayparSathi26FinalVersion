import { Download, Pencil, Sparkles, IndianRupee } from "lucide-react";
import { BarChart, Bar as RBar, XAxis, Tooltip, Cell } from "recharts";
import { Card, Button, AICallout, SectionTitle, ChartBox } from "../components/ui";
import { rupee } from "../lib/data";

const sections = [
  { n: 1, t: "Business Overview", d: "An affordable organic grocery store serving households within a 2 km radius, with WhatsApp ordering and free local delivery above ₹300." },
  { n: 2, t: "Target Customers", d: "Health-conscious families, working professionals and elderly residents seeking fresh, chemical-free produce at fair prices." },
  { n: 3, t: "Products & Services", d: "Organic vegetables, fruits, grains, dairy and daily essentials, plus a curated monthly subscription basket." },
  { n: 5, t: "Equipment Required", d: "Display racks, weighing scales, refrigeration unit, billing tablet, delivery cycle and packaging supplies." },
  { n: 7, t: "Pricing Strategy", d: "Cost-plus 22–28% margin, with subscription discounts and weekend loyalty offers to drive repeat visits." },
];

const finance = [
  { label: "Initial Investment", value: 200000, color: "#7c3aed" },
  { label: "Monthly Expenses", value: 40000, color: "#f97316" },
  { label: "Expected Revenue", value: 80000, color: "#2563eb" },
  { label: "Expected Profit", value: 25000, color: "#039855" },
];

export default function BusinessPlan() {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Business Plan"
        subtitle="Organic Grocery Store — auto-generated & editable"
        right={
          <div className="flex flex-wrap gap-2">
            <Button size="sm"><Download size={15} /> Download</Button>
            <Button size="sm" variant="outline"><Pencil size={15} /> Edit Assumptions</Button>
            <Button size="sm" variant="secondary"><Sparkles size={15} /> Ask AI Advisor</Button>
          </div>
        }
      />

      {/* Finance snapshot */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {finance.map((f) => (
          <Card key={f.label} className="p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: f.color + "1a", color: f.color }}>
              <IndianRupee size={18} />
            </div>
            <p className="mt-3 text-sm text-gray-500">{f.label}</p>
            <p className="tnum font-display text-2xl font-bold text-gray-900">{rupee(f.value)}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900">Monthly economics</h3>
          <ChartBox className="mt-4 h-64">
            <BarChart data={finance.filter((f) => f.label !== "Initial Investment")}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} />
              <Tooltip formatter={(v: number) => rupee(v)} cursor={{ fill: "#f5f5f5" }} contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <RBar dataKey="value" radius={[8, 8, 0, 0]} barSize={64}>
                {finance.filter((f) => f.label !== "Initial Investment").map((f) => (
                  <Cell key={f.label} fill={f.color} />
                ))}
              </RBar>
            </BarChart>
          </ChartBox>
        </Card>

        <Card className="flex flex-col justify-center p-6">
          <p className="text-sm font-semibold text-gray-500">Break-even Point</p>
          <p className="tnum font-display text-5xl font-bold text-brand-700">8</p>
          <p className="text-gray-500">months to recover investment</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Investment</span><span className="tnum font-semibold">{rupee(200000)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Monthly profit</span><span className="tnum font-semibold text-brand-700">{rupee(25000)}</span></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.n} className="p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">{s.n}</span>
              <h4 className="font-bold text-gray-900">{s.t}</h4>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.d}</p>
          </Card>
        ))}
      </div>

      <AICallout>
        Your break-even improves to ~6 months if you launch the subscription basket in month 1 —
        recurring orders stabilise cash flow and reduce spoilage.
      </AICallout>
    </div>
  );
}
