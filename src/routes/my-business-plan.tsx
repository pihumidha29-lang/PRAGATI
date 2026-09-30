import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList,
  Save,
  Printer,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  TrendingUp,
  Target,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/my-business-plan")({
  head: () => ({
    meta: [
      { title: "My Business Plan — Pragati" },
      {
        name: "description",
        content:
          "Your complete MSME business plan — capital required, pricing strategy, marketing channels and milestone goals.",
      },
    ],
  }),
  component: MyBusinessPlanPage,
});

export function MyBusinessPlanPage() {
  const { businessPlan, updateBusinessPlan, profile, t, language } = usePragati();

  const [formData, setFormData] = useState({
    businessName: businessPlan.businessName || profile.name,
    ownerName: businessPlan.ownerName || profile.ownerName,
    location: businessPlan.location || profile.location,
    category: businessPlan.category || profile.category,
    capitalRequired: businessPlan.capitalRequired,
    ownContribution: businessPlan.ownContribution,
    loanNeeded: businessPlan.loanNeeded,
    targetAudience: businessPlan.targetAudience,
    pricingStrategy: businessPlan.pricingStrategy,
    costStructure: businessPlan.costStructure,
    monthlyRevenueTarget: businessPlan.monthlyRevenueTarget,
    breakEvenTarget: businessPlan.breakEvenTarget,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessPlan(formData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
            <ClipboardList className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("myBusinessPlan")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("businessPlanDesc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="rounded-full font-bold text-xs"
          >
            <Printer className="mr-1.5 h-4 w-4" /> {language === "hi" ? "प्रिंट / पीडीएफ डाउनलोड" : "Print / Export PDF"}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold text-xs"
          >
            <Save className="mr-1.5 h-4 w-4" /> {t("save")}
          </Button>
        </div>
      </div>

      {/* Plan Form Container */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Profile Overview */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-deep text-secondary text-xs font-bold">
              1
            </span>
            <h2 className="text-base font-bold">{language === "hi" ? "व्यापार का विवरण व स्थान" : "Business Overview & Location"}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "व्यापार का नाम" : "Business Name"}</Label>
              <Input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="h-10 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "संस्थापक / मालिक का नाम" : "Founder / Owner Name"}</Label>
              <Input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="h-10 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "कार्य स्थल / पता" : "Operational Location"}</Label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-10 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "उद्योग / श्रेणी" : "Industry / Category"}</Label>
              <Input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="h-10 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financials & Loan Requirement */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-deep text-secondary text-xs font-bold">
              2
            </span>
            <h2 className="text-base font-bold">{language === "hi" ? "पूंजी व लोन की आवश्यकता" : "Capital & Funding Requirement"}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "कुल आवश्यक पूंजी (₹)" : "Total Capital Needed (₹)"}</Label>
              <Input
                type="number"
                value={formData.capitalRequired}
                onChange={(e) => setFormData({ ...formData, capitalRequired: parseInt(e.target.value) || 0 })}
                className="h-10 text-sm font-bold"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "अपनी बचत / पूंजी (₹)" : "Own Contribution (₹)"}</Label>
              <Input
                type="number"
                value={formData.ownContribution}
                onChange={(e) => setFormData({ ...formData, ownContribution: parseInt(e.target.value) || 0 })}
                className="h-10 text-sm font-bold"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "आवश्यक बैंक लोन (₹)" : "Bank Loan Requirement (₹)"}</Label>
              <Input
                type="number"
                value={formData.loanNeeded}
                onChange={(e) => setFormData({ ...formData, loanNeeded: parseInt(e.target.value) || 0 })}
                className="h-10 text-sm font-bold text-teal-deep"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "मासिक बिक्री लक्ष्य (₹)" : "Monthly Revenue Target (₹)"}</Label>
              <Input
                type="number"
                value={formData.monthlyRevenueTarget}
                onChange={(e) => setFormData({ ...formData, monthlyRevenueTarget: parseInt(e.target.value) || 0 })}
                className="h-10 text-sm font-bold text-teal-deep"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "मासिक ब्रेक-ईवन लक्ष्य" : "Break-Even Target"}</Label>
              <Input
                type="text"
                value={formData.breakEvenTarget}
                onChange={(e) => setFormData({ ...formData, breakEvenTarget: e.target.value })}
                className="h-10 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Market & Cost Strategy */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-deep text-secondary text-xs font-bold">
              3
            </span>
            <h2 className="text-base font-bold">{language === "hi" ? "लक्षित बाजार व मूल्य निर्धारण नीति" : "Target Market & Cost Structure"}</h2>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{language === "hi" ? "लक्षित ग्राहक वर्ग" : "Target Customers"}</Label>
            <Textarea
              rows={2}
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{language === "hi" ? "दाम निर्धारण नीति व मार्जिन" : "Pricing Strategy & Margins"}</Label>
            <Textarea
              rows={2}
              value={formData.pricingStrategy}
              onChange={(e) => setFormData({ ...formData, pricingStrategy: e.target.value })}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{language === "hi" ? "लागत ढांचा (कच्चा माल, मजदूरी, पैकेजिंग)" : "Cost Structure (Raw materials, labor, packaging)"}</Label>
            <Textarea
              rows={2}
              value={formData.costStructure}
              onChange={(e) => setFormData({ ...formData, costStructure: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>

        {/* Section 4: Milestones & Goals */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-deep text-secondary text-xs font-bold">
              4
            </span>
            <h2 className="text-base font-bold">{language === "hi" ? "कार्य लक्ष्य व मील के पत्थर" : "Action Milestones"}</h2>
          </div>

          <div className="space-y-2">
            {businessPlan.milestoneGoals.map((g, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-teal-deep shrink-0 mt-0.5" />
                <span className="leading-relaxed">{g}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 rounded-xl"
          >
            {t("saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}
