import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  BarChart,
  Bar as RBar,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, ScoreRing, AICallout, SectionTitle, Button, ChartBox } from "../components/ui";
import { healthCategories, revenueTrend, customerGrowth, rupee } from "../lib/data";

const insights = [
  { icon: TrendingUp, tone: "text-brand-600", text: "Sales improved by 12% this month." },
  { icon: AlertTriangle, tone: "text-amber-500", text: "Marketing performance needs attention." },
  { icon: TrendingDown, tone: "text-rose-500", text: "Cash flow risk is increasing slightly." },
];

export default function BusinessHealth() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Business Health Dashboard" subtitle="A full check-up of your business performance." right={<Button size="sm">View AI Recommendations</Button>} />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm font-semibold text-gray-500">Business Health Score</p>
          <div className="my-3">
            <ScoreRing value={82} size={160} stroke={12} color="#039855" label="out of 100" />
          </div>
          <p className="text-sm font-medium text-brand-700">Healthy & improving</p>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900">Category breakdown</h3>
          <div className="grid items-center gap-4 sm:grid-cols-2">
            <ChartBox className="h-56">
              <RadarChart data={healthCategories} outerRadius={80}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "#667085" }} />
                <Radar dataKey="score" stroke="#039855" fill="#12b76a" fillOpacity={0.3} />
              </RadarChart>
            </ChartBox>
            <div className="space-y-2.5">
              {healthCategories.map((c) => (
                <div key={c.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-gray-600">{c.label}</span>
                    <span className="tnum font-semibold text-gray-800">{c.score}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${c.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {insights.map((i) => (
          <Card key={i.text} className="flex items-center gap-3 p-4">
            <i.icon size={20} className={i.tone} />
            <p className="text-sm font-medium text-gray-700">{i.text}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-bold text-gray-900">Revenue vs Expenses</h3>
          <ChartBox className="mt-4 h-56">
            <BarChart data={revenueTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} />
              <Tooltip formatter={(v: number) => rupee(v)} cursor={{ fill: "#f5f5f5" }} contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <RBar dataKey="revenue" fill="#039855" radius={[6, 6, 0, 0]} />
              <RBar dataKey="expenses" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartBox>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-gray-900">Profit Trend</h3>
          <ChartBox className="mt-4 h-56">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} />
              <Tooltip formatter={(v: number) => rupee(v)} contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Area type="monotone" dataKey="profit" stroke="#2563eb" strokeWidth={2.5} fill="url(#pf)" />
            </AreaChart>
          </ChartBox>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900">Customer Growth</h3>
          <ChartBox className="mt-4 h-52">
            <LineChart data={customerGrowth}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Line type="monotone" dataKey="customers" stroke="#7c3aed" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ChartBox>
        </Card>
      </div>

      <AICallout title="Your biggest improvement opportunity">
        Marketing is your lowest category (62/100). A simple WhatsApp broadcast list and weekend
        offers could lift monthly customers by an estimated 15–20%.
      </AICallout>
    </div>
  );
}
