import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Lightbulb,
  Search,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
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

export const Route = createFileRoute("/business-ideas")({
  head: () => ({
    meta: [
      { title: "Business Ideas — Pragati" },
      {
        name: "description",
        content:
          "Catalogue of viable business ideas for rural and semi-urban India with investment ranges and feasibility scores.",
      },
    ],
  }),
  component: BusinessIdeasPage,
});

export function BusinessIdeasPage() {
  const { businessIdeas, updateBusinessPlan, t, language } = usePragati();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  const categories = [
    { id: "All", labelEn: "All", labelHi: "सभी", labelHinglish: "All (Sabhi)" },
    { id: "Textiles & Crafts", labelEn: "Textiles & Crafts", labelHi: "कपड़ा व हस्तशिल्प", labelHinglish: "Textiles & Crafts" },
    { id: "Food & Agri-Processing", labelEn: "Food & Agri-Processing", labelHi: "खाद्य प्रसंस्करण", labelHinglish: "Food & Processing" },
    { id: "Services & Logistics", labelEn: "Services & Logistics", labelHi: "सेवाएं व लॉजिस्टिक्स", labelHinglish: "Services & Delivery" },
    { id: "Artisan & Paper Crafts", labelEn: "Artisan & Paper Crafts", labelHi: "हस्तनिर्मित पेपर व शिल्प", labelHinglish: "Paper & Handicrafts" },
    { id: "Textiles & Fashion", labelEn: "Textiles & Fashion", labelHi: "फैशन व परिधान", labelHinglish: "Fashion & Tailoring" },
  ];

  const filteredIdeas = businessIdeas.filter((idea) => {
    const matchesCat = selectedCategory === "All" || idea.category === selectedCategory;
    const matchesSearch =
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description.toLowerCase().includes(search.toLowerCase()) ||
      idea.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSaveToPlan = (idea: any) => {
    updateBusinessPlan({
      category: idea.category,
      capitalRequired: idea.investmentMin + (idea.investmentMax - idea.investmentMin) / 2,
      pricingStrategy: "Cost-plus pricing with 45-50% gross margin target",
      milestoneGoals: idea.keySteps,
    });
    setSelectedIdea(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <Lightbulb className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("businessIdeas")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("businessIdeasDesc")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="max-w-md">
          <Input
            type="text"
            placeholder={t("searchIdeasPlaceholder")}
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

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-3 hover:border-teal-mid/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="bg-secondary/30 text-teal-deep text-[10px] font-bold">
                  {idea.category}
                </Badge>
                <span className="text-xs font-extrabold text-teal-deep bg-mint/40 px-2 py-0.5 rounded-full">
                  {idea.feasibilityScore}/100
                </span>
              </div>

              <h3 className="font-bold text-base text-foreground mt-2">{idea.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{idea.description}</p>

              <div className="mt-3 rounded-xl bg-muted/60 p-2.5 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === "hi" ? "निवेश सीमा:" : "Investment:"}</span>
                  <span className="font-bold text-foreground">
                    ₹{(idea.investmentMin / 1000).toFixed(0)}k - ₹{(idea.investmentMax / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === "hi" ? "अनुमानित मांग:" : "Demand:"}</span>
                  <span className="font-bold text-teal-deep">{idea.expectedDemand}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setSelectedIdea(idea)}
                className="text-xs font-bold text-teal-deep hover:underline"
              >
                {t("viewFullDetails")}
              </button>
              <Link
                to="/business-simulator"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                {language === "hi" ? "हिसाब लगाएं" : "Simulate"} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedIdea && (
        <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
          <DialogContent className="sm:max-w-[550px] rounded-3xl bg-card border-border max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <Badge variant="outline" className="w-fit bg-secondary/30 text-teal-deep text-[10px] font-bold">
                {selectedIdea.category}
              </Badge>
              <DialogTitle className="text-xl font-bold mt-1">{selectedIdea.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {language === "hi" ? "व्यवहार्यता स्कोर:" : "Feasibility Score:"} <strong>{selectedIdea.feasibilityScore}/100</strong> • {language === "hi" ? "मांग:" : "Demand:"}{" "}
                <strong>{selectedIdea.expectedDemand}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs sm:text-sm">
              <p className="text-muted-foreground leading-relaxed">{selectedIdea.description}</p>

              <div className="rounded-2xl bg-secondary/40 p-4 border border-secondary space-y-1">
                <h4 className="font-bold text-teal-deep text-xs uppercase tracking-wide">
                  {language === "hi" ? "यह व्यापार क्यों चलेगा:" : "Why This Business Works:"}
                </h4>
                <p className="text-xs text-teal-deep/90 leading-relaxed">{selectedIdea.whyItWorks}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-foreground">
                  {language === "hi" ? "शुरू करने के चरण:" : "Step-by-Step Launch Plan:"}
                </h4>
                <div className="space-y-1.5">
                  {selectedIdea.keySteps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-deep text-secondary font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-muted p-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">{language === "hi" ? "आवश्यक कौशल:" : "Required Skills:"}</span>
                  <p className="mt-1 text-xs font-semibold">{selectedIdea.requiredSkills.join(", ")}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">{language === "hi" ? "मुख्य उपकरण / संसाधन:" : "Key Equipment:"}</span>
                  <p className="mt-1 text-xs font-semibold">{selectedIdea.resourcesNeeded.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-between gap-2">
              <Link
                to="/business-simulator"
                onClick={() => setSelectedIdea(null)}
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground hover:bg-muted"
              >
                {t("simulateBtn")}
              </Link>
              <Button
                onClick={() => handleSaveToPlan(selectedIdea)}
                className="bg-primary text-primary-foreground font-bold text-xs"
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
