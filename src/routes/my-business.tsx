import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Store,
  Wallet,
  ShoppingBag,
  Package,
  Users,
  PlusCircle,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Phone,
  MapPin,
  Trash2,
  Edit,
  SlidersHorizontal,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/my-business")({
  head: () => ({
    meta: [
      { title: "My Business & Khata — Pragati" },
      {
        name: "description",
        content:
          "Manage your Money & Khata, Sales, Stock and Customers in one connected business dashboard.",
      },
    ],
  }),
  component: MyBusinessPage,
});

export function MyBusinessPage() {
  const {
    totalRevenue,
    totalExpenses,
    netProfit,
    cashBalance,
    sales,
    expenses,
    transactions,
    products,
    customers,
    lowStockProducts,
    openModal,
    updateStockQuantity,
    deleteProduct,
    addCustomer,
    language,
    t,
  } = usePragati();

  const [activeTab, setActiveTab] = useState<string>("money");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [txFilter, setTxFilter] = useState<string>("all");

  // Stock In / Out Adjustment Dialog state
  const [stockAdjustOpen, setStockAdjustOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<any>(null);
  const [stockAdjustQty, setStockAdjustQty] = useState<number>(10);
  const [stockAdjustType, setStockAdjustType] = useState<"in" | "out">("in");
  const [stockAdjustCost, setStockAdjustCost] = useState<number>(0);

  // Add Customer Dialog state
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custLocation, setCustLocation] = useState("");
  const [custNotes, setCustNotes] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (txFilter === "all") return matchesSearch;
    if (txFilter === "sale") return matchesSearch && tx.type === "sale";
    if (txFilter === "expense") return matchesSearch && tx.type === "expense";
    return matchesSearch;
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenStockAdjust = (prod: any, type: "in" | "out") => {
    setSelectedProductForStock(prod);
    setStockAdjustType(type);
    setStockAdjustQty(10);
    setStockAdjustCost(type === "in" ? prod.purchaseCost * 10 : 0);
    setStockAdjustOpen(true);
  };

  const handleStockAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForStock) return;
    updateStockQuantity(
      selectedProductForStock.id,
      Number(stockAdjustQty),
      stockAdjustType === "in",
      stockAdjustType === "in" ? Number(stockAdjustCost) : undefined
    );
    setStockAdjustOpen(false);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;
    addCustomer({
      name: custName.trim(),
      phone: custPhone.trim() || "+91 98000 00000",
      location: custLocation.trim() || "Jaipur",
      notes: custNotes.trim(),
      loyaltyStatus: "New",
    });
    setCustName("");
    setCustPhone("");
    setCustLocation("");
    setCustNotes("");
    setAddCustomerOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
            <Store className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("myBusinessAndKhata")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "hi"
                ? "खाता, बिक्री रिकॉर्ड, स्टॉक इन्वेंट्री और ग्राहक प्रबंधन एक ही स्थान पर।"
                : language === "hinglish"
                ? "Connected ledger, sales records, stock tracking aur customer loyalty."
                : "Connected ledger, sales records, stock tracking, and customer loyalty."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openModal("sale")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold text-xs"
          >
            <PlusCircle className="mr-1.5 h-4 w-4" /> {t("saleAddKaro")}
          </Button>
          <Button
            onClick={() => openModal("expense")}
            variant="outline"
            className="rounded-full font-bold text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <PlusCircle className="mr-1.5 h-4 w-4" /> {t("kharchaAddKaro")}
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted p-1">
          <TabsTrigger value="money" className="rounded-lg text-xs font-bold gap-1.5">
            <Wallet className="h-3.5 w-3.5" /> {t("moneyKhata")}
          </TabsTrigger>
          <TabsTrigger value="sales" className="rounded-lg text-xs font-bold gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5" /> {t("sales")} ({sales.length})
          </TabsTrigger>
          <TabsTrigger value="stock" className="rounded-lg text-xs font-bold gap-1.5">
            <Package className="h-3.5 w-3.5" /> {t("stock")} ({products.length})
            {lowStockProducts.length > 0 && (
              <span className="ml-1 h-2 w-2 rounded-full bg-destructive" />
            )}
          </TabsTrigger>
          <TabsTrigger value="customers" className="rounded-lg text-xs font-bold gap-1.5">
            <Users className="h-3.5 w-3.5" /> {t("customers")} ({customers.length})
          </TabsTrigger>
        </TabsList>

        {/* 1. MONEY & KHATA TAB */}
        <TabsContent value="money" className="space-y-6">
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t("totalSales")}
              </span>
              <p className="mt-2 text-2xl font-extrabold text-foreground">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{sales.length} {language === "hi" ? "बिक्री लेन-देन" : "sales transactions"}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {language === "hi" ? "कुल खर्चे" : "Total Expenses"}
              </span>
              <p className="mt-2 text-2xl font-extrabold text-destructive">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{expenses.length} {language === "hi" ? "खर्च प्रविष्टियां" : "expense entries"}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t("netProfit")}
              </span>
              <p className="mt-2 text-2xl font-extrabold text-teal-deep">
                ₹{netProfit.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-teal-mid font-semibold">
                {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}% {language === "hi" ? "शुद्ध लाभ मार्जिन" : "net margin"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t("cashInHand")}
              </span>
              <p className="mt-2 text-2xl font-extrabold text-foreground">
                ₹{cashBalance.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{language === "hi" ? "उपलब्ध चालू पूंजी" : "Available operating cash"}</p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={language === "hi" ? "नाम या श्रेणी से लेन-देन खोजें..." : "Search transaction by name, party, or category..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={txFilter === "all" ? "default" : "outline"}
                  onClick={() => setTxFilter("all")}
                  className="text-xs h-8 rounded-lg"
                >
                  {t("allFilter")}
                </Button>
                <Button
                  size="sm"
                  variant={txFilter === "sale" ? "default" : "outline"}
                  onClick={() => setTxFilter("sale")}
                  className="text-xs h-8 rounded-lg"
                >
                  {t("salesFilter")}
                </Button>
                <Button
                  size="sm"
                  variant={txFilter === "expense" ? "default" : "outline"}
                  onClick={() => setTxFilter("expense")}
                  className="text-xs h-8 rounded-lg"
                >
                  {t("expensesFilter")}
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border overflow-hidden">
              {filteredTransactions.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">
                  {t("noTransactions")}
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                          tx.type === "sale"
                            ? "bg-mint/40 text-teal-deep"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {tx.type === "sale" ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">{tx.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{tx.partyName}</span>
                          <span>•</span>
                          <span className="rounded bg-muted px-1.5 py-0.5">{tx.category}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-base font-extrabold ${
                          tx.type === "sale" ? "text-teal-deep" : "text-destructive"
                        }`}
                      >
                        {tx.type === "sale" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {tx.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* 2. SALES TAB */}
        <TabsContent value="sales" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-teal-deep p-6 text-secondary">
            <div>
              <h2 className="text-xl font-bold">
                {language === "hi" ? "बिक्री और ऑर्डर रिकॉर्ड" : "Sales & Orders Log"}
              </h2>
              <p className="mt-1 text-xs text-secondary/80">
                {language === "hi"
                  ? "हर ऑर्डर, ग्राहक बिल और स्टॉक की रीयल-टाइम प्रविष्टि रखें।"
                  : "Track every order, customer bill, and unit price with automatic inventory updates."}
              </p>
            </div>
            <Button
              onClick={() => openModal("sale")}
              className="bg-secondary text-teal-deep hover:bg-mint font-bold rounded-full text-xs"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> {t("saleAddKaro")}
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="divide-y divide-border">
              {sales.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  {language === "hi" ? "कोई बिक्री दर्ज नहीं है।" : "No sales recorded yet."}
                </div>
              ) : (
                sales.map((s) => (
                  <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                        {s.invoiceNumber.slice(-3)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">{s.productName}</h3>
                          <Badge variant="outline" className="text-[10px] bg-secondary/30">
                            {s.invoiceNumber}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {language === "hi" ? "मात्रा" : "Quantity"}: <strong>{s.quantity}</strong> @ ₹{s.unitPrice} • {t("customer")}:{" "}
                          <strong className="text-foreground">{s.customerName}</strong>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {t("date")}: {s.date} • {s.paymentMethod} {s.notes ? `• ${s.notes}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:self-center">
                      <span className="text-lg font-extrabold text-teal-deep">
                        ₹{s.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <p className="text-[10px] text-teal-mid font-semibold">
                        {language === "hi" ? "भुगतान पूर्ण" : "Payment Completed"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* 3. STOCK & INVENTORY TAB */}
        <TabsContent value="stock" className="space-y-6">
          {/* Low stock alert banner */}
          {lowStockProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 p-5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                    {t("lowStockWarning")} ({lowStockProducts.length} {language === "hi" ? "आइटम कम हैं" : "items critical"})
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {lowStockProducts.map((p) => `${p.name}: ${p.currentStock} ${p.unit} (${language === "hi" ? "सीमा" : "Limit"}: ${p.lowStockThreshold})`).join(", ")}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => openModal("need")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shrink-0"
              >
                {t("stockMangwayein")}
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={language === "hi" ? "उत्पाद खोजें..." : "Search products..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-60 h-9 text-xs"
              />
            </div>
            <Button
              onClick={() => openModal("product")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> {t("nayaItemJodein")}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => {
              const isLowStock = p.currentStock <= p.lowStockThreshold;
              const margin = p.sellingPrice - p.purchaseCost;

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border bg-card p-5 shadow-sm transition-all hover:border-teal-mid/60 ${
                    isLowStock ? "border-amber-400 bg-amber-50/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl">{p.emoji || "📦"}</span>
                      <h3 className="mt-2 font-bold text-base text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold ${
                        isLowStock
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-mint/40 text-teal-deep border-mint"
                      }`}
                    >
                      {isLowStock
                        ? language === "hi"
                          ? "⚠️ कम स्टॉक"
                          : "⚠️ Low Stock"
                        : language === "hi"
                        ? "स्टॉक में उपलब्ध"
                        : "In Stock"}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{language === "hi" ? "वर्तमान स्टॉक:" : "Current Stock:"}</span>
                      <span className="font-extrabold text-foreground text-sm">
                        {p.currentStock} {p.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{language === "hi" ? "लागत / बिक्री:" : "Cost / Sell:"}</span>
                      <span>
                        ₹{p.purchaseCost} / <strong>₹{p.sellingPrice}</strong> ({language === "hi" ? "मुनाफा" : "Profit"}:{" "}
                        <strong className="text-teal-deep">+₹{margin}</strong>)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenStockAdjust(p, "in")}
                      className="text-xs h-8 flex-1 rounded-lg text-teal-deep border-teal-mid/50"
                    >
                      {t("stockIn")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenStockAdjust(p, "out")}
                      className="text-xs h-8 flex-1 rounded-lg"
                    >
                      {t("stockOut")}
                    </Button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      title={t("delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* 4. CUSTOMERS TAB */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                {language === "hi" ? "ग्राहक सूची व खाता इतिहास" : "Customer CRM & Khata History"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {language === "hi"
                  ? "नियमित खरीदार, ऑर्डर आवृत्ति और विश्वसनीयता ट्रैक करें।"
                  : "Track repeat buyers, order frequency, and loyalty statuses."}
              </p>
            </div>
            <Button
              onClick={() => setAddCustomerOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> {language === "hi" ? "+ नया ग्राहक जोड़ें" : "+ Add Customer"}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 hover:border-teal-mid/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {c.phone} • <MapPin className="h-3 w-3" /> {c.location}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      c.loyaltyStatus === "VIP"
                        ? "bg-secondary text-teal-deep border-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.loyaltyStatus} {language === "hi" ? "ग्राहक" : "Customer"}
                  </Badge>
                </div>

                <div className="rounded-xl bg-muted/60 p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">{language === "hi" ? "कुल खरीदारी:" : "Total Spent:"}</span>
                    <p className="font-extrabold text-teal-deep text-sm">
                      ₹{c.totalSpent.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{language === "hi" ? "कुल ऑर्डर:" : "Total Orders:"}</span>
                    <p className="font-bold text-foreground text-sm">{c.ordersCount} {language === "hi" ? "ऑर्डर" : "orders"}</p>
                  </div>
                </div>

                {c.notes && (
                  <p className="text-xs text-muted-foreground italic">"{c.notes}"</p>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <span className="text-[11px] text-muted-foreground">
                    {language === "hi" ? "अंतिम खरीदारी" : "Last purchase"}: {c.lastPurchaseDate}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal("sale", { customerName: c.name })}
                    className="text-xs h-7 rounded-md"
                  >
                    + {t("saleAddKaro")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stock Adjust Modal */}
      <Dialog open={stockAdjustOpen} onOpenChange={setStockAdjustOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {stockAdjustType === "in" ? t("stockIn") : t("stockOut")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {language === "hi"
                ? `${selectedProductForStock?.name} के लिए मात्रा अपडेट करें`
                : `Adjust quantity for ${selectedProductForStock?.name}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockAdjustSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("quantity")} ({selectedProductForStock?.unit})</Label>
              <Input
                type="number"
                min="1"
                value={stockAdjustQty}
                onChange={(e) => {
                  const qty = parseInt(e.target.value) || 1;
                  setStockAdjustQty(qty);
                  if (stockAdjustType === "in" && selectedProductForStock) {
                    setStockAdjustCost(qty * selectedProductForStock.purchaseCost);
                  }
                }}
                required
              />
            </div>

            {stockAdjustType === "in" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {language === "hi"
                    ? "कुल खरीद लागत (₹) — कच्चे माल के खर्च में दर्ज होगी"
                    : "Total Purchase Cost (₹) — will record as Raw Material Kharcha"}
                </Label>
                <Input
                  type="number"
                  value={stockAdjustCost}
                  onChange={(e) => setStockAdjustCost(parseInt(e.target.value) || 0)}
                />
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setStockAdjustOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Customer Modal */}
      <Dialog open={addCustomerOpen} onOpenChange={setAddCustomerOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {language === "hi" ? "नया ग्राहक जोड़ें" : "Add Customer"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {language === "hi"
                ? "ग्राहक का संपर्क सहेजें और भावी बिक्री से जोड़ें।"
                : "Save customer contact and link future sales."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCustomer} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("customerNameLabel")}</Label>
              <Input
                type="text"
                placeholder={t("customerPlaceholder")}
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{language === "hi" ? "फ़ोन नंबर" : "Phone Number"}</Label>
                <Input
                  type="text"
                  placeholder="+91 98..."
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("location")}</Label>
                <Input
                  type="text"
                  placeholder={language === "hi" ? "उदा. जयपुर, राजस्थान" : "e.g. MI Road, Jaipur"}
                  value={custLocation}
                  onChange={(e) => setCustLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "विशेष नोट्स / प्राथमिकता" : "Notes / Buying Preference"}</Label>
              <Input
                type="text"
                placeholder={language === "hi" ? "उदा. थोक में खरीदारी करते हैं" : "e.g. Buys in bulk for gifting"}
                value={custNotes}
                onChange={(e) => setCustNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAddCustomerOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
