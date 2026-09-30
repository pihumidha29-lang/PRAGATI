import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Route as RouteIcon,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/my-roadmap")({
  head: () => ({
    meta: [
      { title: "My Roadmap — Pragati" },
      {
        name: "description",
        content:
          "Step-by-step milestone path from starting to scaling your business with clickable progress tracking.",
      },
    ],
  }),
  component: MyRoadmapPage,
});

export function MyRoadmapPage() {
  const { roadmapSteps, toggleRoadmapStep, roadmapProgressPct, profile, t, language } = usePragati();

  // Group steps by phase
  const phases = [
    { num: 1, nameEn: "Phase 1: Setup & Registration", nameHi: "चरण 1: शुरुआत व पंजीकरण", nameHinglish: "Phase 1: Setup & Registration" },
    { num: 2, nameEn: "Phase 2: Supplier Sourcing & Workshop", nameHi: "चरण 2: सप्लायर व कार्यशाला", nameHinglish: "Phase 2: Supplier & Workshop" },
    { num: 3, nameEn: "Phase 3: Sales & Khata Tracking", nameHi: "चरण 3: बिक्री व खाता प्रबंधन", nameHinglish: "Phase 3: Sales & Khata" },
    { num: 4, nameEn: "Phase 4: Financing & Capital Expansion", nameHi: "चरण 4: लोन व वित्तीय सहायता", nameHinglish: "Phase 4: Loans & Capital" },
    { num: 5, nameEn: "Phase 5: B2B Expansion & Repeat Customers", nameHi: "चरण 5: थोक ग्राहक विस्तार", nameHinglish: "Phase 5: B2B Expansion" },
    { num: 6, nameEn: "Phase 6: Sustainable Scaling & Growth", nameHi: "चरण 6: स्थायी विकास व विस्तार", nameHinglish: "Phase 6: Sustainable Growth" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <RouteIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("myRoadmap")}</h1>
          <p className="text-sm text-muted-foreground">
            {language === "hi" ? `${profile.name} के लिए चरणबद्ध प्रगति रोडमैप। अगले स्तर को अनलॉक करने के लिए मील के पत्थर पूरे करें।` : `Step-by-step milestone execution for ${profile.name}. Complete steps to unlock the next level.`}
          </p>
        </div>
      </div>

      {/* Progress Meter Card */}
      <div className="rounded-3xl bg-teal-deep p-6 text-secondary shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mint" />
            <h2 className="font-bold text-base">{t("roadmapReadiness")}</h2>
          </div>
          <span className="text-lg font-extrabold text-secondary">{roadmapProgressPct}% {language === "hi" ? "पूर्ण" : "Complete"}</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-sidebar-accent">
          <div
            className="h-full rounded-full bg-mint transition-all duration-500"
            style={{ width: `${roadmapProgressPct}%` }}
          />
        </div>

        <p className="text-xs text-secondary/80">
          {roadmapSteps.filter((s) => s.isCompleted).length} / {roadmapSteps.length} {language === "hi" ? "मील के पत्थर हासिल किए गए।" : "milestones achieved."}
        </p>
      </div>

      {/* Phases & Steps List */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseSteps = roadmapSteps.filter((s) => s.phase === phase.num);
          const isPhaseDone = phaseSteps.length > 0 && phaseSteps.every((s) => s.isCompleted);

          return (
            <div
              key={phase.num}
              className={`rounded-3xl border bg-card p-6 shadow-sm space-y-4 transition-all ${
                isPhaseDone ? "border-teal-mid/50 bg-mint/5" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      isPhaseDone
                        ? "bg-teal-deep text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {phase.num}
                  </span>
                  <h3 className="font-bold text-base text-foreground">
                    {language === "hi" ? phase.nameHi : language === "hinglish" ? phase.nameHinglish : phase.nameEn}
                  </h3>
                </div>

                {isPhaseDone && (
                  <Badge className="bg-mint/40 text-teal-deep text-[10px] font-bold">
                    {language === "hi" ? "✓ चरण पूर्ण हुआ" : "✓ Phase Completed"}
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                {phaseSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                      step.isCompleted
                        ? "bg-muted/40 border-border"
                        : "bg-card border-border hover:border-teal-mid/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleRoadmapStep(step.id)}
                        className="mt-0.5 text-teal-deep hover:scale-110 transition-transform"
                        title={step.isCompleted ? "Mark incomplete" : "Mark complete"}
                      >
                        {step.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-teal-deep fill-mint/30" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>

                      <div>
                        <h4
                          className={`font-bold text-sm ${
                            step.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {step.category} • Est: {step.estimatedDays} days
                        </span>
                      </div>
                    </div>

                    {step.actionableLink && !step.isCompleted && (
                      <Link
                        to={step.actionableLink}
                        className="text-xs font-bold text-teal-deep hover:underline shrink-0 inline-flex items-center gap-1 self-center"
                      >
                        Action <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
