import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search, Sparkles, TrendingUp, Users, ArrowRight, Compass } from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/local-opportunities")({
  head: () => ({
    meta: [
      { title: "Local Opportunities — Pragati" },
      {
        name: "description",
        content:
          "Discover what businesses, materials and services are missing near your village or town.",
      },
    ],
  }),
  component: LocalOpportunitiesPage,
});

export function LocalOpportunitiesPage() {
  const { localOpportunities, profile, openModal, language, t } = usePragati();
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [search, setSearch] = useState<string>("");

  const filteredOpportunities = localOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.category.toLowerCase().includes(search.toLowerCase()) ||
      opp.location.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && opp.radiusKm <= selectedRadius * 2.5;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
            <MapPin className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("localOpportunities")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "hi"
                ? `${profile.location} के आसपास किन चीजों की सबसे ज्यादा मांग है? बाजार के नए अवसर देखें।`
                : `What's missing near ${profile.location}? High demand market gaps around you.`}
            </p>
          </div>
        </div>

        {/* Radius selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1">
          <span className="text-xs font-semibold px-2 text-muted-foreground">
            {language === "hi" ? "दूरी का दायरा:" : "Radius:"}
          </span>
          {[1, 5, 10, 25].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRadius(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedRadius === r
                  ? "bg-teal-deep text-secondary shadow-xs"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {r} {language === "hi" ? "किमी" : "km"}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <Input
          type="text"
          placeholder={language === "hi" ? "अवसर खोजें (उदा. कॉटन बैग, तेल, उपहार सामग्री, पैकेजिंग)..." : "Search opportunities (e.g. Cotton Bags, Oil, Gifting, Packaging)..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 text-xs"
        />
      </div>

      {/* Opportunities List */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filteredOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 hover:border-teal-mid/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="bg-secondary/30 text-teal-deep text-[10px] font-bold mb-1.5">
                    {opp.category}
                  </Badge>
                  <h3 className="font-bold text-base text-foreground">{opp.title}</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-mint/40 px-2.5 py-1 text-xs font-extrabold text-teal-deep shrink-0">
                  {opp.feasibilityScore}/100 {language === "hi" ? "स्कोर" : "Score"}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{opp.location} ({opp.radiusKm} {language === "hi" ? "किमी के भीतर" : "km radius"})</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/50">
                <strong>{language === "hi" ? "बाजार की कमी (गैप):" : "Market Gap:"}</strong> {opp.gapDescription}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">{language === "hi" ? "संभावित मासिक आय:" : "Potential Monthly Rev:"}</span>
                  <p className="font-extrabold text-teal-deep text-sm">
                    ₹{opp.potentialMonthlyRevenue.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">{language === "hi" ? "आसपास प्रतिस्पर्धा:" : "Nearby Competition:"}</span>
                  <p className="font-bold text-foreground">{opp.nearbyCompetitionCount} {language === "hi" ? "दुकानें" : "shops nearby"}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Link
                to="/business-simulator"
                className="text-xs font-bold text-teal-deep hover:underline inline-flex items-center gap-1"
              >
                {t("simulateBtn")} <ArrowRight className="h-3 w-3" />
              </Link>

              <Button
                size="sm"
                onClick={() =>
                  openModal("need", {
                    item: opp.title,
                    category: opp.category,
                  })
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg"
              >
                {t("postNeedBtn")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
