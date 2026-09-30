import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet,
  IndianRupee,
  Calculator,
  Percent,
  Calendar,
  Landmark,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance & EMI Planning — Pragati" },
      {
        name: "description",
        content:
          "Simple financial calculators for rural entrepreneurs in ₹ — Loan EMI, working capital requirements and funding gap.",
      },
    ],
  }),
  component: FinancePage,
});

export function FinancePage() {
  const { profile, businessPlan, updateBusinessPlan, t, language } = usePragati();

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(150000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(3);

  // Working Capital State
  const [startingInv, setStartingInv] = useState<number>(100000);
  const [monthlyOperatingExp, setMonthlyOperatingExp] = useState<number>(25000);
  const [bufferMonths, setBufferMonths] = useState<number>(2);

  // Live EMI Calculation
  const emiResults = useMemo(() => {
    const P = Number(loanAmount) || 0;
    const r = (Number(interestRate) || 0) / (12 * 100);
    const n = (Number(tenureYears) || 1) * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      totalMonths: n,
    };
  }, [loanAmount, interestRate, tenureYears]);

  // Working Capital Requirement Calculation
  const totalWorkingCapitalNeeded = useMemo(() => {
    return startingInv + monthlyOperatingExp * bufferMonths;
  }, [startingInv, monthlyOperatingExp, bufferMonths]);

  const fundingGap = useMemo(() => {
    return Math.max(0, totalWorkingCapitalNeeded - profile.availableCapital);
  }, [totalWorkingCapitalNeeded, profile.availableCapital]);

  const handleSaveLoanPlan = () => {
    updateBusinessPlan({
      capitalRequired: totalWorkingCapitalNeeded,
      ownContribution: profile.availableCapital,
      loanNeeded: fundingGap,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <Wallet className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("finance")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("financeDesc")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 1. Loan EMI Calculator */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Calculator className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold">{t("loanEmiTitle")}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <Label className="font-semibold">{t("loanAmount")}</Label>
                <span className="font-bold text-teal-deep">₹{loanAmount.toLocaleString("en-IN")}</span>
              </div>
              <Input
                type="number"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-10 text-sm font-bold"
              />
              <div className="flex gap-1.5 pt-1">
                {[50000, 100000, 150000, 300000, 500000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setLoanAmount(val)}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted hover:bg-secondary hover:text-teal-deep border border-border"
                  >
                    ₹{(val / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("interestRate")}</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("loanTenure")}</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(parseInt(e.target.value) || 1)}
                  className="h-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* EMI Results Card */}
          <div className="rounded-2xl bg-teal-deep p-5 text-secondary space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-secondary/80">
                {t("monthlyEmi")}
              </span>
              <p className="mt-1 text-3xl font-extrabold text-secondary">
                ₹{emiResults.monthlyEmi.toLocaleString("en-IN")}
                <span className="text-xs font-normal opacity-80"> / {language === "hi" ? "माह" : "month"}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="opacity-80">{t("totalInterest")}:</span>
                <p className="font-bold text-mint">₹{emiResults.totalInterest.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <span className="opacity-80">{t("totalPayment")}:</span>
                <p className="font-bold text-secondary">₹{emiResults.totalPayment.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Working Capital & Funding Gap Estimator */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <IndianRupee className="h-4 w-4 text-teal-deep" />
            <h2 className="text-base font-bold">{t("workingCapitalTitle")}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "दुकान/उपकरण सेटअप लागत (₹)" : "Fixed Setup & Equipment Cost (₹)"}</Label>
              <Input
                type="number"
                step="5000"
                value={startingInv}
                onChange={(e) => setStartingInv(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "मासिक कच्चा माल व मजदूरी खर्च (₹)" : "Monthly Raw Material & Wage Needs (₹)"}</Label>
              <Input
                type="number"
                step="2000"
                value={monthlyOperatingExp}
                onChange={(e) => setMonthlyOperatingExp(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "सुरक्षा बैकअप (महीनों का रिज़र्व)" : "Safety Buffer (Months of cash in reserve)"}</Label>
              <Input
                type="number"
                min="1"
                max="6"
                value={bufferMonths}
                onChange={(e) => setBufferMonths(parseInt(e.target.value) || 1)}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Funding Summary Box */}
          <div className="rounded-2xl bg-secondary/50 p-5 border border-secondary space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-secondary-foreground">{language === "hi" ? "कुल आवश्यक पूंजी:" : "Total Capital Required:"}</span>
              <span className="font-extrabold text-teal-deep text-sm">
                ₹{totalWorkingCapitalNeeded.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-secondary-foreground">{language === "hi" ? "आपकी अपनी पूंजी:" : "Your Own Capital:"}</span>
              <span className="font-bold text-teal-deep">₹{profile.availableCapital.toLocaleString("en-IN")}</span>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center">
              <span className="text-xs font-extrabold text-teal-deep uppercase tracking-wide">
                {language === "hi" ? "लोन की जरूरत (Funding Gap):" : "Loan Requirement Gap:"}
              </span>
              <span className="text-xl font-extrabold text-teal-deep">
                ₹{fundingGap.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              to="/loans-schemes"
              className="text-xs font-bold text-teal-deep hover:underline inline-flex items-center gap-1"
            >
              {language === "hi" ? `₹${fundingGap.toLocaleString("en-IN")} के लिए योजनाएं देखें` : `Explore Mudra / PMEGP for ₹${fundingGap.toLocaleString("en-IN")}`} <ArrowRight className="h-3 w-3" />
            </Link>

            <Button
              onClick={handleSaveLoanPlan}
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
