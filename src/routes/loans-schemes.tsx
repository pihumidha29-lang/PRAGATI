import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Landmark,
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/loans-schemes")({
  head: () => ({
    meta: [
      { title: "Loans & Government Schemes — Pragati" },
      {
        name: "description",
        content:
          "Find government loans, Mudra schemes, PMEGP subsidies and artisan grants you are eligible for.",
      },
    ],
  }),
  component: LoansSchemesPage,
});

export function LoansSchemesPage() {
  const { govSchemes, profile, updateBusinessPlan, t, language } = usePragati();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const categories = [
    { id: "All", labelEn: "All", labelHi: "सभी", labelHinglish: "All (Sabhi)" },
    { id: "Mudra", labelEn: "Mudra", labelHi: "मुद्रा योजना", labelHinglish: "Mudra Loan" },
    { id: "PMEGP", labelEn: "PMEGP", labelHi: "PMEGP (सब्सिडी)", labelHinglish: "PMEGP Subsidy" },
    { id: "MSME", labelEn: "MSME", labelHi: "एमएसएमई", labelHinglish: "MSME Scheme" },
    { id: "Artisan / State", labelEn: "Artisan / State", labelHi: "कारीगर व राज्य", labelHinglish: "Artisan / State" },
    { id: "NABARD", labelEn: "NABARD", labelHi: "नाबार्ड", labelHinglish: "NABARD Agri" },
  ];

  const filteredSchemes = govSchemes.filter((s) => {
    const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nameHindi.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplyHelp = (scheme: any) => {
    updateBusinessPlan({
      loanNeeded: Math.min(scheme.maxAmount, 150000),
      milestoneGoals: scheme.applySteps,
    });
    setSelectedScheme(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <Landmark className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("loansSchemes")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === "hi" ? `${profile.location} के लिए सत्यापित बिना गारंटी लोन, 35% तक पूंजी सब्सिडी और कारीगर अनुदान।` : t("schemesDesc")}
          </p>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        <div className="max-w-md">
          <Input
            type="text"
            placeholder={t("searchSchemesPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const label = language === "hi" ? cat.labelHi : language === "hinglish" ? cat.labelHinglish : cat.labelEn;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
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
      </div>

      {/* Schemes Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 hover:border-teal-mid/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="bg-secondary/30 text-teal-deep text-[10px] font-bold">
                    {scheme.category}
                  </Badge>
                  <h3 className="font-bold text-base text-foreground mt-1">{scheme.name}</h3>
                  <p className="text-xs text-muted-foreground">{scheme.nameHindi}</p>
                </div>
                {scheme.subsidyPct > 0 && (
                  <span className="inline-flex items-center rounded-full bg-mint/50 px-2.5 py-0.5 text-xs font-extrabold text-teal-deep shrink-0">
                    {scheme.subsidyPct}% {language === "hi" ? "सब्सिडी" : "Subsidy"}
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{scheme.description}</p>

              <div className="mt-4 rounded-xl bg-muted/60 p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">{language === "hi" ? "अधिकतम लोन:" : "Max Amount:"}</span>
                  <p className="font-extrabold text-teal-deep text-sm">
                    ₹{(scheme.maxAmount / 100000).toFixed(1)} {language === "hi" ? "लाख" : "Lakh"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">{language === "hi" ? "ब्याज दर / शर्तें:" : "Interest / Terms:"}</span>
                  <p className="font-bold text-foreground">{scheme.interestRate}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setSelectedScheme(scheme)}
                className="text-xs font-bold text-teal-deep hover:underline"
              >
                {language === "hi" ? "पात्रता व आवेदन चरण देखें" : "View Eligibility & Steps"}
              </button>

              <Button
                size="sm"
                onClick={() => setSelectedScheme(scheme)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg"
              >
                {t("applicationGuide")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail Dialog */}
      {selectedScheme && (
        <Dialog open={!!selectedScheme} onOpenChange={() => setSelectedScheme(null)}>
          <DialogContent className="sm:max-w-[580px] rounded-3xl bg-card border-border max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <Badge variant="outline" className="w-fit bg-secondary/30 text-teal-deep text-[10px] font-bold">
                {selectedScheme.category} • {selectedScheme.ministry}
              </Badge>
              <DialogTitle className="text-xl font-bold mt-1">{selectedScheme.name}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {language === "hi" ? "अधिकतम लोन:" : "Max Loan:"} <strong>₹{(selectedScheme.maxAmount / 100000).toFixed(1)} {language === "hi" ? "लाख" : "Lakh"}</strong> • {language === "hi" ? "ब्याज दर:" : "Interest:"}{" "}
                <strong>{selectedScheme.interestRate}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <h4 className="font-bold text-xs uppercase tracking-wide text-foreground">
                  {language === "hi" ? "पात्रता (Eligibility):" : "Eligibility Criteria:"}
                </h4>
                <div className="space-y-1">
                  {selectedScheme.eligibility.map((el: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-deep shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <h4 className="font-bold text-xs uppercase tracking-wide text-foreground">
                  {language === "hi" ? "मुख्य लाभ व सब्सिडी (Key Benefits):" : "Key Benefits & Subsidies:"}
                </h4>
                <div className="space-y-1">
                  {selectedScheme.keyBenefits.map((b: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <Sparkles className="h-3.5 w-3.5 text-mint shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <h4 className="font-bold text-xs uppercase tracking-wide text-foreground">
                  {language === "hi" ? "जरूरी दस्तावेज (Required Documents):" : "Documents Required:"}
                </h4>
                <div className="rounded-xl bg-muted/60 p-3 space-y-1">
                  {selectedScheme.documentsRequired.map((doc: string, idx: number) => (
                    <p key={idx} className="text-xs flex items-center gap-1.5">
                      <FileText className="h-3 w-3 text-muted-foreground" /> {doc}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <h4 className="font-bold text-xs uppercase tracking-wide text-foreground">
                  {language === "hi" ? "आवेदन प्रक्रिया (How to Apply):" : "How to Apply Step-by-Step:"}
                </h4>
                <div className="space-y-1.5">
                  {selectedScheme.applySteps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-deep text-secondary font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-between gap-2">
              {selectedScheme.officialUrl && (
                <a
                  href={selectedScheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-deep hover:underline"
                >
                  {language === "hi" ? "आधिकारिक पोर्टल" : "Official Portal"} <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <Button
                onClick={() => handleApplyHelp(selectedScheme)}
                className="bg-primary text-primary-foreground font-bold text-xs ml-auto"
              >
                {t("saveToPlan")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
