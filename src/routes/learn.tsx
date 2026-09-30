import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Business Basics — Pragati" },
      {
        name: "description",
        content:
          "Short, practical business lessons for rural entrepreneurs in simple Hindi & English with real Indian examples.",
      },
    ],
  }),
  component: LearnPage,
});

export function LearnPage() {
  const { learnLessons, toggleLessonComplete, learnProgressPct, t, language } = usePragati();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeLesson, setActiveLesson] = useState<any>(null);

  const categories = [
    { id: "All", labelEn: "All", labelHi: "सभी", labelHinglish: "All (Sabhi)" },
    { id: "Money Basics", labelEn: "Money Basics", labelHi: "पैसे के बुनियादी नियम", labelHinglish: "Money Basics" },
    { id: "Sales & Marketing", labelEn: "Sales & Marketing", labelHi: "बिक्री व ग्राहक", labelHinglish: "Sales & Marketing" },
    { id: "Operations & Stock", labelEn: "Operations & Stock", labelHi: "दुकान व स्टॉक संचालन", labelHinglish: "Operations & Stock" },
    { id: "Digital & Schemes", labelEn: "Digital & Schemes", labelHi: "डिजिटल पेमेंट व योजनाएं", labelHinglish: "Digital & Schemes" },
  ];

  const filteredLessons = learnLessons.filter(
    (l) => selectedCategory === "All" || l.category === selectedCategory
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <BookOpen className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("learn")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === "hi" ? "व्यापार के बुनियादी नियमों पर छोटे और आसान पाठ, भारतीय उदाहरणों के साथ।" : "Short, practical lessons in simple language with Indian examples and ₹ calculations."}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-3xl bg-teal-deep p-6 text-secondary shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mint" />
            <h2 className="font-bold text-base">{t("learningProgress")}</h2>
          </div>
          <span className="text-lg font-extrabold text-secondary">{learnProgressPct}% {language === "hi" ? "पूर्ण" : "Done"}</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-sidebar-accent">
          <div
            className="h-full rounded-full bg-mint transition-all duration-500"
            style={{ width: `${learnProgressPct}%` }}
          />
        </div>

        <p className="text-xs text-secondary/80">
          {learnLessons.filter((l) => l.isCompleted).length} / {learnLessons.length} {language === "hi" ? "व्यावहारिक पाठ पूरे किए गए।" : "practical lessons completed."}
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => {
          const label = language === "hi" ? cat.labelHi : language === "hinglish" ? cat.labelHinglish : cat.labelEn;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat.id
                  ? "bg-teal-deep text-secondary border-teal-deep shadow-xs"
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Lessons Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`rounded-3xl border bg-card p-6 shadow-sm space-y-4 transition-all hover:border-teal-mid/60 flex flex-col justify-between ${
              lesson.isCompleted ? "border-teal-mid/40 bg-mint/5" : "border-border"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="bg-secondary/30 text-teal-deep text-[10px] font-bold">
                  {lesson.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{lesson.durationMinutes} {language === "hi" ? "मिनट" : "mins"}</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-foreground mt-2">
                {language === "hi" ? lesson.titleHindi || lesson.title : lesson.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{lesson.summary}</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setActiveLesson(lesson)}
                className="text-xs font-bold text-teal-deep hover:underline inline-flex items-center gap-1"
              >
                {language === "hi" ? "पाठ पढ़ें" : "Read Lesson"} <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => toggleLessonComplete(lesson.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  lesson.isCompleted
                    ? "bg-teal-deep text-secondary border-teal-deep"
                    : "bg-muted text-foreground border-border hover:bg-accent"
                }`}
              >
                {lesson.isCompleted ? (language === "hi" ? "✓ पूर्ण हुआ" : "✓ Completed") : (language === "hi" ? "पूर्ण मार्क करें" : "Mark as Done")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Dialog */}
      {activeLesson && (
        <Dialog open={!!activeLesson} onOpenChange={() => setActiveLesson(null)}>
          <DialogContent className="sm:max-w-[560px] rounded-3xl bg-card border-border max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <Badge variant="outline" className="w-fit bg-secondary/30 text-teal-deep text-[10px] font-bold">
                {activeLesson.category} • {activeLesson.durationMinutes} {language === "hi" ? "मिनट पठन" : "mins read"}
              </Badge>
              <DialogTitle className="text-xl font-bold mt-1">
                {language === "hi" ? activeLesson.titleHindi || activeLesson.title : activeLesson.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {activeLesson.titleHindi}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs sm:text-sm leading-relaxed">
              <div className="space-y-2.5">
                {activeLesson.content.map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="rounded-2xl bg-secondary/40 p-4 border border-secondary space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-teal-deep">
                  {language === "hi" ? "मुख्य सीख (याद रखने योग्य बातें):" : "Key Takeaways:"}
                </h4>
                <div className="space-y-1.5">
                  {activeLesson.keyTakeaways.map((takeaway: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-deep shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-between gap-2">
              <Button variant="outline" onClick={() => setActiveLesson(null)} className="text-xs">
                {t("cancel")}
              </Button>
              <Button
                onClick={() => {
                  toggleLessonComplete(activeLesson.id);
                  setActiveLesson(null);
                }}
                className="bg-primary text-primary-foreground font-bold text-xs"
              >
                {activeLesson.isCompleted ? (language === "hi" ? "अपूर्ण करें" : "Mark Incomplete") : t("markCompleted")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
