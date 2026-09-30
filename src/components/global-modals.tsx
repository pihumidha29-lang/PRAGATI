import React, { useState, useEffect } from "react";
import { usePragati } from "@/hooks/use-pragati";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag, ArrowDownCircle, PackagePlus, SendHorizontal, FileQuestion } from "lucide-react";

export function GlobalModals() {
  const {
    activeModal,
    activeModalPayload,
    closeModal,
    products,
    customers,
    recordSale,
    addExpense,
    addProduct,
    updateStockQuantity,
    createNeed,
    sendEnquiry,
    profile,
    t,
    language,
  } = usePragati();

  // 1. Sale Form State
  const [saleProductId, setSaleProductId] = useState<string>("");
  const [saleQuantity, setSaleQuantity] = useState<number>(1);
  const [saleUnitPrice, setSaleUnitPrice] = useState<number>(480);
  const [saleCustomerName, setSaleCustomerName] = useState<string>("");
  const [salePaymentMethod, setSalePaymentMethod] = useState<"UPI" | "Cash" | "Bank Transfer">("UPI");
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // 2. Expense Form State
  const [expCategory, setExpCategory] = useState<any>("Raw Material");
  const [expAmount, setExpAmount] = useState<number>(500);
  const [expDescription, setExpDescription] = useState<string>("");
  const [expPaymentMethod, setExpPaymentMethod] = useState<"UPI" | "Cash" | "Bank Transfer">("UPI");
  const [expDate, setExpDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // 3. Product Form State
  const [prodName, setProdName] = useState<string>("");
  const [prodCategory, setProdCategory] = useState<string>("Bags & Totes");
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodThreshold, setProdThreshold] = useState<number>(8);
  const [prodCost, setProdCost] = useState<number>(250);
  const [prodPrice, setProdPrice] = useState<number>(450);
  const [prodUnit, setProdUnit] = useState<string>("pieces");

  // 4. Need Form State
  const [needItem, setNeedItem] = useState<string>("");
  const [needCategory, setNeedCategory] = useState<string>("Raw Material");
  const [needQty, setNeedQty] = useState<number>(50);
  const [needUnit, setNeedUnit] = useState<string>("kg");
  const [needBudget, setNeedBudget] = useState<number>(10000);
  const [needDate, setNeedDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );
  const [needNotes, setNeedNotes] = useState<string>("");

  // 5. Enquiry Form State
  const [enqToBizId, setEnqToBizId] = useState<string>("");
  const [enqSubject, setEnqSubject] = useState<string>("");
  const [enqMessage, setEnqMessage] = useState<string>("");

  // Sync state when modal opens with payload
  useEffect(() => {
    if (activeModal === "sale") {
      const defaultProd = products.find((p) => p.id === activeModalPayload?.productId) || products[0];
      if (defaultProd) {
        setSaleProductId(defaultProd.id);
        setSaleUnitPrice(defaultProd.sellingPrice);
      }
      setSaleQuantity(activeModalPayload?.quantity || 1);
      setSaleCustomerName(activeModalPayload?.customerName || customers[0]?.name || (language === "hi" ? "रमेश कुमार" : "Ramesh Kumar"));
    } else if (activeModal === "expense") {
      setExpCategory(activeModalPayload?.category || "Raw Material");
      setExpAmount(activeModalPayload?.amount || 500);
      setExpDescription(activeModalPayload?.description || "");
    } else if (activeModal === "enquiry" && activeModalPayload) {
      setEnqToBizId(activeModalPayload.toBusinessId || "");
      setEnqSubject(activeModalPayload.subject || (language === "hi" ? "उत्पाद दर व उपलब्धता पूछताछ" : "Product Price & Availability Enquiry"));
      setEnqMessage(
        activeModalPayload.message ||
          (language === "hi"
            ? `नमस्ते! हम आपके व्यापार से सामान खरीदने में रुचि रखते हैं। कृपया मूल्य सूची और डिलीवरी समय साझा करें।`
            : `Namaste! We are interested in procuring from your business. Please share quotation and delivery timeline.`)
      );
    } else if (activeModal === "need" && activeModalPayload) {
      setNeedItem(activeModalPayload.item || "");
      setNeedQty(activeModalPayload.quantity || 50);
      setNeedUnit(activeModalPayload.unit || "kg");
    }
  }, [activeModal, activeModalPayload, products, customers, language]);

  const handleSaleProductChange = (prodId: string) => {
    setSaleProductId(prodId);
    const p = products.find((x) => x.id === prodId);
    if (p) {
      setSaleUnitPrice(p.sellingPrice);
    }
  };

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd = products.find((p) => p.id === saleProductId) || products[0];
    const targetCust = customers.find((c) => c.name.toLowerCase() === saleCustomerName.toLowerCase());

    recordSale({
      productId: targetProd.id,
      productName: targetProd.name,
      quantity: Number(saleQuantity),
      unitPrice: Number(saleUnitPrice),
      totalAmount: Number(saleQuantity) * Number(saleUnitPrice),
      customerId: targetCust?.id,
      customerName: saleCustomerName || (language === "hi" ? "नकद ग्राहक" : "Walk-in Customer"),
      paymentMethod: salePaymentMethod,
      date: saleDate,
      status: "completed",
    });
    closeModal();
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category: expCategory,
      amount: Number(expAmount),
      date: expDate,
      description: expDescription || expCategory,
      paymentMethod: expPaymentMethod,
      status: "paid",
    });
    closeModal();
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    addProduct({
      name: prodName.trim(),
      category: prodCategory || "General",
      currentStock: Number(prodStock),
      lowStockThreshold: Number(prodThreshold),
      purchaseCost: Number(prodCost),
      sellingPrice: Number(prodPrice),
      unit: prodUnit,
    });
    closeModal();
  };

  const handleNeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!needItem.trim()) return;
    createNeed({
      item: needItem.trim(),
      category: needCategory,
      quantity: Number(needQty),
      unit: needUnit,
      location: profile.location,
      budget: needBudget ? Number(needBudget) : undefined,
      requiredDate: needDate,
      notes: needNotes,
    });
    closeModal();
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enqToBizId || !enqMessage.trim()) return;
    sendEnquiry(enqToBizId, enqSubject, enqMessage);
    closeModal();
  };

  return (
    <>
      {/* 1. SALE MODAL */}
      <Dialog open={activeModal === "sale"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">{t("recordSaleTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("recordSaleDesc")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleSaleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("selectProduct")}</Label>
              <Select value={saleProductId} onValueChange={handleSaleProductChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("chooseProduct")} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (Stock: {p.currentStock} {p.unit} - ₹{p.sellingPrice})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("quantity")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("ratePerItem")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={saleUnitPrice}
                  onChange={(e) => setSaleUnitPrice(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("customerNameLabel")}</Label>
              <Input
                type="text"
                placeholder={t("customerPlaceholder")}
                value={saleCustomerName}
                onChange={(e) => setSaleCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("paymentMode")}</Label>
                <Select
                  value={salePaymentMethod}
                  onValueChange={(val: any) => setSalePaymentMethod(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI / QR Code</SelectItem>
                    <SelectItem value="Cash">{language === "hi" ? "नकद (Cash)" : "Cash"}</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("date")}</Label>
                <Input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rounded-xl bg-secondary/60 p-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary-foreground">{t("totalBillAmount")}</span>
              <span className="text-lg font-extrabold text-teal-deep">
                ₹{(Number(saleQuantity) * Number(saleUnitPrice)).toLocaleString("en-IN")}
              </span>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeModal}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("confirmRecordSale")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. EXPENSE MODAL */}
      <Dialog open={activeModal === "expense"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[460px] rounded-3xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <ArrowDownCircle className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">{t("addExpenseTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("addExpenseDesc")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("expenseCategory")}</Label>
              <Select value={expCategory} onValueChange={(val: any) => setExpCategory(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Raw Material">
                    {language === "hi" ? "कच्चा माल (Raw Material)" : "Raw Material (Fabric/Thread)"}
                  </SelectItem>
                  <SelectItem value="Packaging">
                    {language === "hi" ? "पैकेजिंग (बॉक्स, बैग)" : "Packaging (Boxes, Tags)"}
                  </SelectItem>
                  <SelectItem value="Salary / Wages">
                    {language === "hi" ? "कारीगर मजदूरी / वेतन" : "Salary / Wages"}
                  </SelectItem>
                  <SelectItem value="Rent & Utilities">
                    {language === "hi" ? "दुकान किराया व बिजली" : "Rent & Utilities"}
                  </SelectItem>
                  <SelectItem value="Transport & Fuel">
                    {language === "hi" ? "भाड़ा व पेट्रोल (Transport)" : "Transport & Fuel"}
                  </SelectItem>
                  <SelectItem value="Equipment">
                    {language === "hi" ? "मशीन मरम्मत (Equipment)" : "Equipment / Repair"}
                  </SelectItem>
                  <SelectItem value="Marketing">Marketing / Promotion</SelectItem>
                  <SelectItem value="Other">
                    {language === "hi" ? "अन्य विविध खर्चे" : "Other Miscellaneous"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("amount")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("date")}</Label>
                <Input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("descriptionVendor")}</Label>
              <Input
                type="text"
                placeholder={t("descVendorPlaceholder")}
                value={expDescription}
                onChange={(e) => setExpDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("paymentMode")}</Label>
              <Select
                value={expPaymentMethod}
                onValueChange={(val: any) => setExpPaymentMethod(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI / GooglePay / PhonePe</SelectItem>
                  <SelectItem value="Cash">{language === "hi" ? "नकद (Cash)" : "Cash"}</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer / NEFT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeModal}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t("saveExpenseKhata")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. PRODUCT MODAL */}
      <Dialog open={activeModal === "product"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PackagePlus className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">{t("addProductTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("addProductDesc")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("productNameLabel")}</Label>
              <Input
                type="text"
                placeholder={t("prodNamePlaceholder")}
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("category")}</Label>
                <Input
                  type="text"
                  placeholder="e.g. Bags & Totes"
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("unitLabel")}</Label>
                <Input
                  type="text"
                  placeholder={t("unitPlaceholder")}
                  value={prodUnit}
                  onChange={(e) => setProdUnit(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("currentStockQty")}</Label>
                <Input
                  type="number"
                  min="0"
                  value={prodStock}
                  onChange={(e) => setProdStock(parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("lowStockAlertLvl")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={prodThreshold}
                  onChange={(e) => setProdThreshold(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("makingCost")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={prodCost}
                  onChange={(e) => setProdCost(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("sellingPriceVal")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeModal}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("addToInventoryBtn")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. NEED MODAL */}
      <Dialog open={activeModal === "need"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-deep text-secondary">
                <FileQuestion className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">{t("postNeedTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("postNeedDesc")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleNeedSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("itemMaterialNeeded")}</Label>
              <Input
                type="text"
                placeholder={t("itemNeedPlaceholder")}
                value={needItem}
                onChange={(e) => setNeedItem(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("quantity")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={needQty}
                  onChange={(e) => setNeedQty(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("unitLabel")}</Label>
                <Input
                  type="text"
                  value={needUnit}
                  onChange={(e) => setNeedUnit(e.target.value)}
                  placeholder="kg / meters / sets"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("estimatedBudgetLabel")}</Label>
                <Input
                  type="number"
                  value={needBudget}
                  onChange={(e) => setNeedBudget(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("requiredByDate")}</Label>
                <Input
                  type="date"
                  value={needDate}
                  onChange={(e) => setNeedDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("additionalNotes")}</Label>
              <Textarea
                placeholder={t("notesPlaceholder")}
                value={needNotes}
                onChange={(e) => setNeedNotes(e.target.value)}
                rows={2}
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeModal}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("postNeedNetworkBtn")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. ENQUIRY MODAL */}
      <Dialog open={activeModal === "enquiry"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <SendHorizontal className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">{t("sendEnquiryTitle")}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("sendEnquiryDesc")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleEnquirySubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("subjectPurpose")}</Label>
              <Input
                type="text"
                value={enqSubject}
                onChange={(e) => setEnqSubject(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("yourMessage")}</Label>
              <Textarea
                rows={4}
                value={enqMessage}
                onChange={(e) => setEnqMessage(e.target.value)}
                placeholder={t("enquiryPlaceholder")}
                required
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeModal}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("sendEnquiryAction")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
