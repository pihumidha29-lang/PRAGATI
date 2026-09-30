import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Users,
  Printer,
  Calendar,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — Pragati" },
      {
        name: "description",
        content:
          "Live business reports computed directly from your sales, expenses, inventory and customer data.",
      },
    ],
  }),
  component: ReportsPage,
});

export function ReportsPage() {
  const { totalRevenue, totalExpenses, netProfit, sales, expenses, products, customers, profile, t, language } =
    usePragati();

  const marginPct = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Expense breakdown map
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });

  // Product revenue performance
  const productPerformance = products.map((p) => {
    const productSales = sales.filter((s) => s.productId === p.id);
    const unitsSold = productSales.reduce((acc, s) => acc + s.quantity, 0);
    const revenueEarned = productSales.reduce((acc, s) => acc + s.totalAmount, 0);
    const estimatedCost = unitsSold * p.purchaseCost;
    const profitEarned = revenueEarned - estimatedCost;

    return {
      name: p.name,
      unitsSold,
      revenueEarned,
      profitEarned,
      currentStock: p.currentStock,
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
            <BarChart3 className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("reports")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("reportsDesc")}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="rounded-full font-bold text-xs"
        >
          <Printer className="mr-1.5 h-4 w-4" /> {t("printSummary")}
        </Button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("totalSales")}
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {sales.length} {language === "hi" ? "ऑर्डर दर्ज" : "customer orders recorded"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {language === "hi" ? "कुल खर्चे (Expenses)" : "Total Expenses"}
          </span>
          <p className="mt-2 text-2xl font-extrabold text-destructive">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {expenses.length} {language === "hi" ? "खर्चे के लेन-देन" : "expense line items"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("netProfit")}
          </span>
          <p className="mt-2 text-2xl font-extrabold text-teal-deep">
            ₹{netProfit.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs font-semibold text-teal-mid">
            {marginPct}% {language === "hi" ? "समग्र मुनाफा मार्जिन" : "overall profit margin"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {language === "hi" ? "सक्रिय ग्राहक (Customers)" : "Active Customers"}
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground">{customers.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {customers.filter((c) => c.loyaltyStatus === "VIP").length} {language === "hi" ? "वीआईपी नियमित खरीदार" : "VIP repeat buyers"}
          </p>
        </div>
      </div>

      {/* Product Profitability & Expense Breakdown */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Product Sales Breakdown (7 Cols) */}
        <div className="md:col-span-7 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-base font-bold">{language === "hi" ? "उत्पाद बिक्री व मुनाफा योगदान" : "Product Sales & Profit Contribution"}</h2>
            <span className="text-xs text-muted-foreground">{products.length} {language === "hi" ? "उत्पाद" : "catalog items"}</span>
          </div>

          <div className="divide-y divide-border">
            {productPerformance.map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "hi" ? "बिक्री:" : "Units Sold:"} <strong>{p.unitsSold} {language === "hi" ? "इकाइयां" : "pcs"}</strong> • {language === "hi" ? "शेष स्टॉक:" : "Stock:"} {p.currentStock}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-teal-deep">
                    ₹{p.revenueEarned.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {language === "hi" ? "मुनाफा:" : "Profit:"} <strong className="text-teal-mid">+₹{p.profitEarned.toLocaleString("en-IN")}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Category Distribution (5 Cols) */}
        <div className="md:col-span-5 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-2 border-b border-border">
            <h2 className="text-base font-bold">{language === "hi" ? "खर्चों का ब्योरा (Distribution)" : "Expense Distribution"}</h2>
          </div>

          <div className="space-y-3">
            {Object.entries(expenseByCategory).map(([cat, amt], idx) => {
              const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">{cat}</span>
                    <span className="font-bold text-destructive">
                      ₹{amt.toLocaleString("en-IN")} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-destructive/80 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
