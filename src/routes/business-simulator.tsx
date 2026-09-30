import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LineChart,
  IndianRupee,
  TrendingUp,
  Sliders,
  Sparkles,
  Calculator,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/business-simulator")({
  head: () => ({
    meta: [
      { title: "Business Simulator — Pragati" },
      {
        name: "description",
        content:
          "Test your business idea on paper before spending real money. Live profit, margin and break-even calculations.",
      },
    ],
  }),
  component: BusinessSimulatorPage,
});

export function BusinessSimulatorPage() {
  const { simulatorInputs, setSimulatorInputs, simulatorResults, updateBusinessPlan, t, language } = usePragati();

  const presets = [
    {
      name: language === "hi" ? "कॉटन बैग निर्माण" : "Cotton Bag Production",
      investment: 120000,
      monthlyProduction: 120,
      unitCost: 280,
      sellingPrice: 480,
      fixedExpenses: 9500,
    },
    {
      name: language === "hi" ? "मसाला पिसाई इकाई" : "Organic Spice Grinding",
      investment: 150000,
      monthlyProduction: 250,
      unitCost: 140,
      sellingPrice: 240,
      fixedExpenses: 12000,
    },
    {
      name: language === "hi" ? "टिफिन / भोजन सेवा" : "Tiffin Meal Delivery",
      investment: 80000,
      monthlyProduction: 400,
      unitCost: 45,
      sellingPrice: 90,
      fixedExpenses: 8000,
    },
    {
      name: language === "hi" ? "हस्तनिर्मित पेपर डायरी" : "Handmade Paper Diaries",
      investment: 60000,
      monthlyProduction: 200,
      unitCost: 90,
      sellingPrice: 190,
      fixedExpenses: 6500,
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setSimulatorInputs({
      investment: p.investment,
      monthlyProduction: p.monthlyProduction,
      unitCost: p.unitCost,
      sellingPrice: p.sellingPrice,
      fixedExpenses: p.fixedExpenses,
    });
  };

  const handleSaveToPlan = () => {
    updateBusinessPlan({
      capitalRequired: simulatorInputs.investment,
      monthlyRevenueTarget: simulatorResults.monthlyRevenue,
      breakEvenTarget: `${simulatorResults.breakEvenUnits} units per month (₹${simulatorResults.breakEvenRevenue.toLocaleString("en-IN")})`,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <LineChart className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("businessSimulator")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("simulatorDesc")}
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">{t("trySampleScenarios")}</span>
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => handleApplyPreset(p)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted hover:bg-secondary hover:text-teal-deep border border-border transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Simulator Grid */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Inputs (Left 5 Cols) */}
        <div className="md:col-span-5 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Sliders className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold">{t("businessParameters")}</h2>
          </div>

          {/* Investment */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-semibold">{t("initialCapital")}</Label>
              <span className="font-bold text-teal-deep">
                ₹{simulatorInputs.investment.toLocaleString("en-IN")}
              </span>
            </div>
            <Input
              type="number"
              step="5000"
              value={simulatorInputs.investment}
              onChange={(e) =>
                setSimulatorInputs({ investment: Math.max(0, parseInt(e.target.value) || 0) })
              }
              className="h-10 text-sm font-bold"
            />
          </div>

          {/* Monthly Production */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-semibold">{t("monthlyProduction")}</Label>
              <span className="font-bold text-teal-deep">{simulatorInputs.monthlyProduction} {language === "hi" ? "इकाइयां" : "units"}</span>
            </div>
            <Input
              type="number"
              min="1"
              value={simulatorInputs.monthlyProduction}
              onChange={(e) =>
                setSimulatorInputs({ monthlyProduction: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="h-10 text-sm font-bold"
            />
          </div>

          {/* Cost Price per item */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-semibold">{t("costPerUnit")}</Label>
              <span className="font-bold text-destructive">₹{simulatorInputs.unitCost}</span>
            </div>
            <Input
              type="number"
              min="1"
              value={simulatorInputs.unitCost}
              onChange={(e) =>
                setSimulatorInputs({ unitCost: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="h-10 text-sm font-bold"
            />
          </div>

          {/* Selling Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-semibold">{t("sellingPricePerUnit")}</Label>
              <span className="font-bold text-teal-deep">₹{simulatorInputs.sellingPrice}</span>
            </div>
            <Input
              type="number"
              min="1"
              value={simulatorInputs.sellingPrice}
              onChange={(e) =>
                setSimulatorInputs({ sellingPrice: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="h-10 text-sm font-bold"
            />
          </div>

          {/* Fixed Expenses */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-semibold">{t("fixedMonthlyExpenses")}</Label>
              <span className="font-bold text-destructive">
                ₹{simulatorInputs.fixedExpenses.toLocaleString("en-IN")}
              </span>
            </div>
            <Input
              type="number"
              step="500"
              value={simulatorInputs.fixedExpenses}
              onChange={(e) =>
                setSimulatorInputs({ fixedExpenses: Math.max(0, parseInt(e.target.value) || 0) })
              }
              className="h-10 text-sm font-bold"
            />
          </div>
        </div>

        {/* Live Calculated Results (Right 7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* Main Profit Highlight Card */}
          <div
            className={`rounded-3xl p-6 text-secondary shadow-md ${
              simulatorResults.monthlyProfit >= 0 ? "bg-teal-deep" : "bg-destructive/90"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary/80">
                {t("netMonthlyProfit")}
              </span>
              <span className="text-xs font-extrabold bg-mint text-teal-deep px-3 py-1 rounded-full">
                {simulatorResults.marginPct}% {language === "hi" ? "शुद्ध मार्जिन" : "Profit Margin"}
              </span>
            </div>

            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-secondary">
              ₹{simulatorResults.monthlyProfit.toLocaleString("en-IN")}
              <span className="text-sm font-normal opacity-80"> / {language === "hi" ? "माह" : "month"}</span>
            </p>

            <p className="mt-2 text-xs text-secondary/85 leading-relaxed">
              {simulatorResults.monthlyProfit >= 0
                ? language === "hi"
                  ? `आप हर महीने ₹${simulatorResults.monthlyProfit.toLocaleString("en-IN")} बचा सकते हैं। पूरा निवेश लगभग ${simulatorResults.paybackMonths} महीनों में वसूल हो जाएगा।`
                  : language === "hinglish"
                  ? `Aap har mahine ₹${simulatorResults.monthlyProfit.toLocaleString("en-IN")} bacha sakte hain. Poora investment lagbhag ${simulatorResults.paybackMonths} mahino mein vasool ho jayega.`
                  : `You can net ₹${simulatorResults.monthlyProfit.toLocaleString("en-IN")} monthly profit. Your total initial investment can be recovered in ~${simulatorResults.paybackMonths} months.`
                : language === "hi"
                  ? `ध्यान दें: इस मूल्य पर व्यापार में नुकसान हो रहा है। बिक्री दर बढ़ाएं या मासिक खर्चे कम करें।`
                  : `Attention: Negative cashflow. Increase selling price per unit or reduce monthly fixed expenses.`}
            </p>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">{t("expectedMonthlyRevenue")}:</span>
              <p className="text-lg font-extrabold text-foreground">
                ₹{simulatorResults.monthlyRevenue.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {simulatorInputs.monthlyProduction} {language === "hi" ? "यूनिट" : "units"} × ₹{simulatorInputs.sellingPrice}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">{language === "hi" ? "कुल मासिक लागत:" : "Total Monthly Costs:"}</span>
              <p className="text-lg font-extrabold text-destructive">
                ₹{simulatorResults.totalCosts.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {language === "hi" ? "लागत" : "Var"}: ₹{simulatorResults.variableCosts} + {language === "hi" ? "खर्चा" : "Fix"}: ₹{simulatorInputs.fixedExpenses}
              </p>
            </div>
          </div>

          {/* Break-Even Target Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-deep" />
              <h3 className="font-bold text-sm text-foreground">{t("breakEvenUnitsTarget")}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {language === "hi" ? (
                <>
                  आपको महीने में कम से कम <strong>{simulatorResults.breakEvenUnits} इकाइयां</strong> (₹
                  {simulatorResults.breakEvenRevenue.toLocaleString("en-IN")}) बेचनी होंगी ताकि कोई नुकसान न हो। इसके बाद हर इकाई पर आपको सीधा <strong>₹{simulatorInputs.sellingPrice - simulatorInputs.unitCost}</strong> का शुद्ध मुनाफा होगा।
                </>
              ) : language === "hinglish" ? (
                <>
                  Aapko mahine mein kam se kam <strong>{simulatorResults.breakEvenUnits} units</strong> (₹
                  {simulatorResults.breakEvenRevenue.toLocaleString("en-IN")}) bechna hoga taaki loss na ho. Iske baad har unit par aapko seedha <strong>₹{simulatorInputs.sellingPrice - simulatorInputs.unitCost}</strong> ka munafa hoga.
                </>
              ) : (
                <>
                  You need to sell at least <strong>{simulatorResults.breakEvenUnits} units</strong> (₹
                  {simulatorResults.breakEvenRevenue.toLocaleString("en-IN")}) each month to cover all fixed and variable costs. Beyond this, every unit nets <strong>₹{simulatorInputs.sellingPrice - simulatorInputs.unitCost}</strong> profit.
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              to="/finance"
              className="text-xs font-bold text-teal-deep hover:underline inline-flex items-center gap-1"
            >
              {language === "hi" ? "लोन व ईएमआई की गणना करें" : "Calculate Loan & EMI for this investment"} <ArrowRight className="h-3 w-3" />
            </Link>

            <Button
              onClick={handleSaveToPlan}
              className="bg-primary text-primary-foreground font-bold text-xs rounded-xl"
            >
              {t("saveToPlan")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
