import { ArrowBigUp, MessageCircle, BadgeCheck, Sparkles, Star, Send } from "lucide-react";
import { Card, Button, Chip, SectionTitle } from "../components/ui";
import { communityPosts, mentors } from "../lib/data";

export default function Community() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Community & Expert Network" subtitle="Ask questions, learn from stories, find a mentor." />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Ask box */}
          <Card className="p-5">
            <p className="font-bold text-gray-900">Ask the Community</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-100 p-2">
              <input placeholder="e.g. How can I increase customers for my grocery store?" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <Button size="sm"><Send size={14} /> Post</Button>
            </div>
          </Card>

          {communityPosts.map((p) => (
            <Card key={p.question} className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                  {p.author.charAt(0)}
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    {p.author}
                    {p.verified && <BadgeCheck size={15} className="text-blue-500" />}
                  </p>
                  <p className="text-xs text-gray-400">{p.time}</p>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{p.question}</h3>
              <div className="mt-3 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-700">AI Summary of discussion</p>
                  <p className="mt-0.5 text-sm text-gray-700">{p.summary}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-brand-700">
                  <ArrowBigUp size={18} /> {p.upvotes}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} /> {p.replies} replies
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Mentors */}
        <div className="space-y-5">
          <Card className="p-5">
            <p className="font-bold text-gray-900">Find a Mentor</p>
            <div className="mt-3 space-y-3">
              {mentors.map((m) => (
                <div key={m.name} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{m.name}</p>
                      <p className="truncate text-xs text-gray-500">{m.expertise}</p>
                    </div>
                    <span className="ml-auto flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                      <Star size={13} className="fill-amber-400" /> {m.rating}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Chip tone="gray">{m.experience}</Chip>
                    <Chip tone="purple">{m.languages}</Chip>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3 w-full">Request Guidance</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-bold text-gray-900">Success Story</p>
            <div className="mt-3 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 p-4 text-white">
              <p className="text-sm leading-relaxed">
                "I started my tiffin service with a ₹40,000 MUDRA loan. Today I serve 120 daily
                meals across Howrah."
              </p>
              <p className="mt-3 text-xs font-semibold text-brand-100">— Rekha Mondal, Cloud Kitchen owner</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
