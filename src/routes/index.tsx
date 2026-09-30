import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Rocket,
  MapPin,
  Lightbulb,
  Wallet,
  Landmark,
  BookOpen,
  ArrowRight,
  Compass,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  ShoppingBag,
  ArrowDownCircle,
  PackagePlus,
  Users2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { usePragati } from "@/hooks/use-pragati";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pragati — हर व्यापार की तरक्की" },
      {
        name: "description",
        content:
          "Pragati helps rural entrepreneurs in India discover local business opportunities, plan finances, find loans and government schemes, and learn step by step.",
      },
      { property: "og:title", content: "Pragati — हर व्यापार की तरक्की" },
      {
        property: "og:description",
        content:
          "Pragati helps rural entrepreneurs in India discover local business opportunities, plan finances, find loans and government schemes, and learn step by step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const {
    profile,
    totalRevenue,
    totalExpenses,
    netProfit,
    cashBalance,
    lowStockProducts,
    products,
    transactions,
    openModal,
    t,
    language,
  } = usePragati();

  const marginPct = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* 1. Hero */}
      <section className="flex flex-col items-center gap-8 rounded-3xl bg-teal-deep px-6 py-10 text-center md:flex-row md:text-left shadow-md">
        <img
          src="/pragati-logo.png"
          alt="Pragati logo — a woman rising with growth"
          className="h-32 w-32 md:h-36 md:w-36 rounded-full object-cover ring-4 ring-mint/40 shrink-0 bg-white"
        />
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary mb-2">
            <span>📍 {profile.location}</span>
            <span>•</span>
            <span>{profile.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary md:text-4xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-2.5 max-w-xl text-sm md:text-base leading-relaxed text-secondary/85">
            {t("heroSubtitle")}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
            <button
              onClick={() => openModal("sale")}
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-teal-deep transition-all hover:bg-mint hover:scale-105 shadow-sm"
            >
              <PlusCircle className="h-4 w-4" /> {t("saleAddKaro")}
            </button>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 rounded-full border border-mint/60 px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-sidebar-accent"
            >
              <Sparkles className="h-4 w-4 text-mint" /> {t("pragatiSePoochhein")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Live Dynamic Financial Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KUL BIKRI */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-teal-mid/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {t("totalSales")}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-deep/10 text-teal-deep">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("totalSalesDesc")}
          </p>
        </div>

        {/* BACHAT / MUNAFA */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-teal-mid/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {t("netProfit")}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/30 text-teal-deep">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-teal-deep">
            ₹{netProfit.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs font-medium text-teal-mid">
            {marginPct}% {language === "hi" ? "शुद्ध मार्जिन" : "net margin"} (₹{totalExpenses.toLocaleString("en-IN")} {language === "hi" ? "कुल खर्चा" : "expenses"})
          </p>
        </div>

        {/* CASH & BANK BALANCE */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-teal-mid/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {t("cashInHand")}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-teal-deep">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
            ₹{cashBalance.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("cashInHandDesc")}
          </p>
        </div>

        {/* ACTIVE STOCK */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-teal-mid/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {t("activeStock")}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PackagePlus className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
            {products.reduce((acc, p) => acc + p.currentStock, 0)} {language === "hi" ? "आइटम" : "items"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {products.length} {language === "hi" ? "उत्पाद उपलब्ध" : "active catalog products"}
          </p>
        </div>
      </section>

      {/* 3. Urgent Action ("Abhi kya karna hai?") */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h2 className="text-base font-bold text-foreground">
            {t("urgentActionTitle")}
          </h2>
        </div>

        {lowStockProducts.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4">
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                ⚠️ {t("lowStockWarning")}: {lowStockProducts.map((p) => `${p.name} (${p.currentStock} ${p.unit})`).join(", ")}
              </p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                {t("lowStockDesc")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/network"
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-deep px-3.5 py-1.5 text-xs font-bold text-secondary transition-colors hover:bg-teal-mid"
              >
                {t("reorderStockBtn")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : totalExpenses > totalRevenue ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4">
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                💡 {t("highExpensesAlert")}
              </p>
              <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-400">
                {t("highExpensesDesc")}
              </p>
            </div>
            <Link
              to="/my-business"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground"
            >
              {t("checkKhataBtn")}
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-mint/20 border border-mint/40 p-4">
            <div>
              <p className="text-sm font-bold text-teal-deep">
                ✅ {t("businessOnTrack")}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("businessOnTrackDesc")}
              </p>
            </div>
            <Link
              to="/local-opportunities"
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-deep px-3.5 py-1.5 text-xs font-bold text-secondary"
            >
              {t("exploreMarketsBtn")} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. Quick Action Buttons */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">{t("quickActionsTitle")}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => openModal("sale")}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-teal-mid hover:shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-foreground">{t("saleAddKaro")}</span>
          </button>

          <button
            onClick={() => openModal("expense")}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-destructive/50 hover:shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <ArrowDownCircle className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-foreground">{t("kharchaAddKaro")}</span>
          </button>

          <button
            onClick={() => openModal("product")}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-teal-mid hover:shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-teal-deep">
              <PackagePlus className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-foreground">{t("nayaItemJodein")}</span>
          </button>

          <Link
            to="/network"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-teal-mid hover:shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/30 text-teal-deep">
              <Users2 className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-foreground">{t("stockMangwayein")}</span>
          </Link>

          <Link
            to="/ai-assistant"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-teal-mid hover:shadow-sm col-span-2 sm:col-span-1"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-deep text-secondary">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-foreground">{language === "hi" ? "प्रगति एआई" : "PRAGATI AI"}</span>
          </Link>
        </div>
      </section>

      {/* 5. Recent Activity Ledger */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">{t("recentActivityTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("recentActivitySubtitle")}</p>
          </div>
          <Link
            to="/my-business"
            className="text-xs font-bold text-primary hover:underline"
          >
            {t("viewFullKhata")}
          </Link>
        </div>

        <div className="divide-y divide-border">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    tx.type === "sale"
                      ? "bg-mint/30 text-teal-deep"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {tx.type === "sale" ? "IN" : "OUT"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{tx.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.partyName} • {tx.paymentMethod} • {tx.date}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${
                  tx.type === "sale" ? "text-teal-deep" : "text-destructive"
                }`}
              >
                {tx.type === "sale" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Discover Features Grid */}
      <section>
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">{t("whereToGoTitle")}</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: t("startBusiness"),
              description: language === "hi" ? "अपनी पूंजी, कौशल और संसाधन बताएं — उपयुक्त व्यापार पाएं।" : "Tell us your capital, skills and resources — get business ideas that fit you.",
              url: "/start-a-business",
              icon: Rocket,
            },
            {
              title: t("localOpportunities"),
              description: language === "hi" ? "देखें कि आपके गांव या कस्बे में क्या सामान या सेवा की कमी है।" : "See what is missing near your village or town and where demand is high.",
              url: "/local-opportunities",
              icon: MapPin,
            },
            {
              title: t("businessIdeas"),
              description: language === "hi" ? "₹ निवेश सीमा और स्थानीय व्यवहार्यता स्कोर के साथ नए विचार खोजें।" : "Explore ideas with investment ranges in ₹ and local feasibility scores.",
              url: "/business-ideas",
              icon: Lightbulb,
            },
            {
              title: t("finance"),
              description: language === "hi" ? "किस्त (EMI), कार्यशील पूंजी और लोन जरूरत का आसान कैलकुलेटर।" : "Simple calculators for EMI, profit, savings and working capital.",
              url: "/finance",
              icon: Wallet,
            },
            {
              title: t("loansSchemes"),
              description: language === "hi" ? "मुद्रा लोन, PMEGP और सरकारी सब्सिडी की पात्रता जांचें।" : "Find government schemes, Mudra loans and subsidies you may be eligible for.",
              url: "/loans-schemes",
              icon: Landmark,
            },
            {
              title: t("learn"),
              description: language === "hi" ? "व्यापार के बुनियादी नियमों पर छोटे और आसान पाठ सीखें।" : "Short, simple lessons on business basics in easy language.",
              url: "/learn",
              icon: BookOpen,
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-mid/50 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
