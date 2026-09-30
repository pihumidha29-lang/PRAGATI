import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import type {
  Language,
  BusinessProfile,
  Product,
  Customer,
  Sale,
  Expense,
  Transaction,
  NetworkBusiness,
  BusinessNeed,
  BusinessListing,
  Enquiry,
  ChatConversation,
  ChatMessage,
  Notification,
  BusinessIdea,
  LocalOpportunity,
  GovScheme,
  BusinessPlan,
  RoadmapStep,
  LearnLesson,
  SimulatorInputs,
  SimulatorResults,
  AIMessage,
} from "./types";
import {
  initialBusinessProfile,
  initialProducts,
  initialCustomers,
  initialSales,
  initialExpenses,
  initialTransactions,
  initialNetworkBusinesses,
  initialNeeds,
  initialListings,
  initialEnquiries,
  initialConversations,
  initialMessages,
  initialNotifications,
  initialBusinessIdeas,
  initialLocalOpportunities,
  initialGovSchemes,
  initialBusinessPlan,
  initialRoadmapSteps,
  initialLearnLessons,
  initialSimulatorInputs,
} from "./mock-data";
import { processAIQuery } from "@/services/ai-service";
import { getTranslation } from "@/services/i18n";

const STORAGE_KEY = "pragati_business_state_v1";

interface PragatiStoreState {
  language: Language;
  profile: BusinessProfile;
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  expenses: Expense[];
  transactions: Transaction[];
  networkBusinesses: NetworkBusiness[];
  needs: BusinessNeed[];
  listings: BusinessListing[];
  enquiries: Enquiry[];
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  notifications: Notification[];
  businessIdeas: BusinessIdea[];
  localOpportunities: LocalOpportunity[];
  govSchemes: GovScheme[];
  businessPlan: BusinessPlan;
  roadmapSteps: RoadmapStep[];
  learnLessons: LearnLesson[];
  simulatorInputs: SimulatorInputs;
  aiMessages: AIMessage[];
  activeModal: "sale" | "expense" | "product" | "need" | "listing" | "enquiry" | null;
  activeModalPayload?: any;
}

interface PragatiContextType extends PragatiStoreState {
  // Computed values
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashBalance: number;
  lowStockProducts: Product[];
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  simulatorResults: SimulatorResults;
  roadmapProgressPct: number;
  learnProgressPct: number;
  t: (key: any) => string;

  // Actions
  setLanguage: (lang: Language) => void;
  openModal: (modal: PragatiStoreState["activeModal"], payload?: any) => void;
  closeModal: () => void;
  recordSale: (saleData: Omit<Sale, "id" | "invoiceNumber">) => void;
  addExpense: (expenseData: Omit<Expense, "id">) => void;
  addProduct: (productData: Omit<Product, "id">) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStockQuantity: (productId: string, delta: number, isStockIn: boolean, optionalCost?: number) => void;
  addCustomer: (customerData: Omit<Customer, "id" | "totalSpent" | "ordersCount" | "lastPurchaseDate">) => void;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  createNeed: (needData: Omit<BusinessNeed, "id" | "createdDate" | "status">) => void;
  updateNeedStatus: (id: string, status: BusinessNeed["status"]) => void;
  createListing: (listingData: Omit<BusinessListing, "id" | "dateAdded" | "status">) => void;
  sendEnquiry: (toBusinessId: string, subject: string, message: string, needId?: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  updateProfile: (profileData: Partial<BusinessProfile>) => void;
  updateBusinessPlan: (planData: Partial<BusinessPlan>) => void;
  toggleRoadmapStep: (stepId: string) => void;
  toggleLessonComplete: (lessonId: string) => void;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  setSimulatorInputs: (inputs: Partial<SimulatorInputs>) => void;
  sendAIMessage: (text: string) => void;
  confirmAIAction: (messageId: string) => void;
  cancelAIAction: (messageId: string) => void;
  resetToDemoData: () => void;
}

const PragatiContext = createContext<PragatiContextType | undefined>(undefined);

function loadPersistedState(): Partial<PragatiStoreState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load Pragati state from localStorage", e);
  }
  return null;
}

export function PragatiProvider({ children }: { children: React.ReactNode }) {
  const persisted = useMemo(() => loadPersistedState(), []);

  const [language, setLanguageState] = useState<Language>(persisted?.language || "hinglish");
  const [profile, setProfileState] = useState<BusinessProfile>(persisted?.profile || initialBusinessProfile);
  const [products, setProductsState] = useState<Product[]>(persisted?.products || initialProducts);
  const [customers, setCustomersState] = useState<Customer[]>(persisted?.customers || initialCustomers);
  const [sales, setSalesState] = useState<Sale[]>(persisted?.sales || initialSales);
  const [expenses, setExpensesState] = useState<Expense[]>(persisted?.expenses || initialExpenses);
  const [transactions, setTransactionsState] = useState<Transaction[]>(persisted?.transactions || initialTransactions);
  const [networkBusinesses] = useState<NetworkBusiness[]>(persisted?.networkBusinesses || initialNetworkBusinesses);
  const [needs, setNeedsState] = useState<BusinessNeed[]>(persisted?.needs || initialNeeds);
  const [listings, setListingsState] = useState<BusinessListing[]>(persisted?.listings || initialListings);
  const [enquiries, setEnquiriesState] = useState<Enquiry[]>(persisted?.enquiries || initialEnquiries);
  const [conversations, setConversationsState] = useState<ChatConversation[]>(persisted?.conversations || initialConversations);
  const [messages, setMessagesState] = useState<Record<string, ChatMessage[]>>(persisted?.messages || initialMessages);
  const [notifications, setNotificationsState] = useState<Notification[]>(persisted?.notifications || initialNotifications);
  const [businessIdeas] = useState<BusinessIdea[]>(persisted?.businessIdeas || initialBusinessIdeas);
  const [localOpportunities] = useState<LocalOpportunity[]>(persisted?.localOpportunities || initialLocalOpportunities);
  const [govSchemes] = useState<GovScheme[]>(persisted?.govSchemes || initialGovSchemes);
  const [businessPlan, setBusinessPlanState] = useState<BusinessPlan>(persisted?.businessPlan || initialBusinessPlan);
  const [roadmapSteps, setRoadmapStepsState] = useState<RoadmapStep[]>(persisted?.roadmapSteps || initialRoadmapSteps);
  const [learnLessons, setLearnLessonsState] = useState<LearnLesson[]>(persisted?.learnLessons || initialLearnLessons);
  const [simulatorInputs, setSimulatorInputsState] = useState<SimulatorInputs>(persisted?.simulatorInputs || initialSimulatorInputs);
  const [aiMessages, setAiMessagesState] = useState<AIMessage[]>(persisted?.aiMessages || [
    {
      id: "ai-init-1",
      sender: "ai",
      text: "Namaste Prashant ji! Main Pragati AI Assistant hoon. Main aapke business ki live sales, stock, kharche aur network requirements ke baare mein sawalon ka jawab de sakta hoon. Aap mujhse kya poochhna chahte hain?",
      timestamp: "Just now",
    },
  ]);
  const [activeModal, setActiveModal] = useState<PragatiStoreState["activeModal"]>(null);
  const [activeModalPayload, setActiveModalPayload] = useState<any>(null);

  // Auto-persist state changes
  useEffect(() => {
    try {
      const stateToSave: Partial<PragatiStoreState> = {
        language,
        profile,
        products,
        customers,
        sales,
        expenses,
        transactions,
        needs,
        listings,
        enquiries,
        conversations,
        messages,
        notifications,
        businessPlan,
        roadmapSteps,
        learnLessons,
        simulatorInputs,
        aiMessages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to persist Pragati state", e);
    }
  }, [
    language,
    profile,
    products,
    customers,
    sales,
    expenses,
    transactions,
    needs,
    listings,
    enquiries,
    conversations,
    messages,
    notifications,
    businessPlan,
    roadmapSteps,
    learnLessons,
    simulatorInputs,
    aiMessages,
  ]);

  // Computed Financials & Metrics
  const totalRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.totalAmount, 0), [sales]);
  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const netProfit = useMemo(() => totalRevenue - totalExpenses, [totalRevenue, totalExpenses]);
  const cashBalance = useMemo(
    () => profile.availableCapital + totalRevenue - totalExpenses,
    [profile.availableCapital, totalRevenue, totalExpenses]
  );

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.currentStock <= p.lowStockThreshold),
    [products]
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const unreadMessagesCount = useMemo(
    () => conversations.reduce((acc, c) => acc + c.unreadCount, 0),
    [conversations]
  );

  const roadmapProgressPct = useMemo(() => {
    if (roadmapSteps.length === 0) return 0;
    const done = roadmapSteps.filter((s) => s.isCompleted).length;
    return Math.round((done / roadmapSteps.length) * 100);
  }, [roadmapSteps]);

  const learnProgressPct = useMemo(() => {
    if (learnLessons.length === 0) return 0;
    const done = learnLessons.filter((l) => l.isCompleted).length;
    return Math.round((done / learnLessons.length) * 100);
  }, [learnLessons]);

  const simulatorResults = useMemo<SimulatorResults>(() => {
    const { monthlyProduction, unitCost, sellingPrice, fixedExpenses, investment } = simulatorInputs;
    const monthlyRevenue = monthlyProduction * sellingPrice;
    const variableCosts = monthlyProduction * unitCost;
    const totalCosts = variableCosts + fixedExpenses;
    const monthlyProfit = monthlyRevenue - totalCosts;
    const marginPct = monthlyRevenue > 0 ? Math.round((monthlyProfit / monthlyRevenue) * 100) : 0;
    const contributionMarginPerUnit = sellingPrice - unitCost;
    const breakEvenUnits = contributionMarginPerUnit > 0 ? Math.ceil(fixedExpenses / contributionMarginPerUnit) : 0;
    const breakEvenRevenue = breakEvenUnits * sellingPrice;
    const paybackMonths = monthlyProfit > 0 ? Number((investment / monthlyProfit).toFixed(1)) : 999;

    return {
      monthlyRevenue,
      variableCosts,
      totalCosts,
      monthlyProfit,
      marginPct,
      breakEvenUnits,
      breakEvenRevenue,
      paybackMonths,
    };
  }, [simulatorInputs]);

  const t = (key: any) => getTranslation(language, key);

  // Modal handlers
  const openModal = (modal: PragatiStoreState["activeModal"], payload?: any) => {
    setActiveModal(modal);
    setActiveModalPayload(payload);
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveModalPayload(null);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setAiMessagesState((prev) => {
      if (prev.length === 1 && prev[0].id === "ai-init-1") {
        return [
          {
            id: "ai-init-1",
            sender: "ai",
            text:
              lang === "hi"
                ? `नमस्ते ${profile.ownerName} जी! मैं प्रगति एआई सहायक हूँ। मैं आपके व्यापार की वास्तविक बिक्री, स्टॉक, खर्चों और नेटवर्क से जुड़े सवालों का उत्तर दे सकता हूँ। आप क्या पूछना चाहते हैं?`
                : lang === "en"
                ? `Hello ${profile.ownerName}! I am your PRAGATI AI Assistant. I can assist you with live sales insights, stock alerts, expense tracking, and network opportunities. How can I help you today?`
                : `Namaste ${profile.ownerName} ji! Main Pragati AI Assistant hoon. Main aapke business ki live sales, stock, kharche aur network requirements ke baare mein sawalon ka jawab de sakta hoon. Aap mujhse kya poochhna chahte hain?`,
            timestamp: "Just now",
          },
        ];
      }
      return prev;
    });
    toast.success(
      lang === "en"
        ? "Language changed to English"
        : lang === "hi"
        ? "भाषा बदलकर हिंदी कर दी गई है"
        : "Language changed to Hinglish"
    );
  };

  // 1. Record Sale (Cross-Connected)
  const recordSale = (saleData: Omit<Sale, "id" | "invoiceNumber">) => {
    const newSaleId = "sale-" + Date.now();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, "0")}`;

    const newSale: Sale = {
      ...saleData,
      id: newSaleId,
      invoiceNumber,
    };

    // 1. Add to sales
    setSalesState((prev) => [newSale, ...prev]);

    // 2. Reduce inventory stock
    let triggeredLowStock = false;
    let targetProductName = saleData.productName;

    setProductsState((prev) =>
      prev.map((p) => {
        if (p.id === saleData.productId) {
          const updatedStock = Math.max(0, p.currentStock - saleData.quantity);
          if (updatedStock <= p.lowStockThreshold && p.currentStock > p.lowStockThreshold) {
            triggeredLowStock = true;
            targetProductName = p.name;
          }
          return { ...p, currentStock: updatedStock };
        }
        return p;
      })
    );

    // 3. Add to Transactions Ledger
    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      type: "sale",
      title: `Sale: ${saleData.quantity}x ${saleData.productName}`,
      category: "Sales Revenue",
      amount: saleData.totalAmount,
      date: saleData.date || new Date().toISOString().split("T")[0],
      partyName: saleData.customerName,
      paymentMethod: saleData.paymentMethod,
      status: "completed",
      referenceId: newSaleId,
    };
    setTransactionsState((prev) => [newTx, ...prev]);

    // 4. Update Customer purchase history
    if (saleData.customerName) {
      setCustomersState((prev) => {
        const existingIndex = prev.findIndex(
          (c) =>
            (saleData.customerId && c.id === saleData.customerId) ||
            c.name.toLowerCase() === saleData.customerName.toLowerCase()
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          const c = updated[existingIndex];
          const newOrdersCount = c.ordersCount + 1;
          const newTotalSpent = c.totalSpent + saleData.totalAmount;
          updated[existingIndex] = {
            ...c,
            ordersCount: newOrdersCount,
            totalSpent: newTotalSpent,
            lastPurchaseDate: saleData.date || new Date().toISOString().split("T")[0],
            loyaltyStatus: newTotalSpent > 10000 ? "VIP" : newOrdersCount > 1 ? "Regular" : "New",
          };
          return updated;
        } else {
          // Add new customer
          const newCust: Customer = {
            id: "cust-" + Date.now(),
            name: saleData.customerName,
            phone: "+91 " + Math.floor(9000000000 + Math.random() * 900000000),
            location: profile.location.split(",")[0] || "Jaipur",
            totalSpent: saleData.totalAmount,
            ordersCount: 1,
            lastPurchaseDate: saleData.date || new Date().toISOString().split("T")[0],
            loyaltyStatus: "New",
          };
          return [...prev, newCust];
        }
      });
    }

    // 5. Trigger Low Stock Alert if needed
    if (triggeredLowStock) {
      const newNotif: Notification = {
        id: "notif-stock-" + Date.now(),
        type: "low_stock",
        title: `Low Stock Alert: ${targetProductName}`,
        body: `${targetProductName} ka stock low-threshold par pahunch gaya hai. Stock Mangwayein.`,
        timestamp: "Just now",
        unread: true,
        linkUrl: "/my-business?tab=stock",
        linkText: "View Stock",
        actionType: "stock_alert",
      };
      setNotificationsState((prev) => [newNotif, ...prev]);
      toast.warning(`Low Stock Warning: ${targetProductName} threshold reached!`);
    }

    toast.success(`Sale recorded! ₹${saleData.totalAmount.toLocaleString("en-IN")} added to Khata`);
  };

  // 2. Add Expense
  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpId = "exp-" + Date.now();
    const newExp: Expense = {
      ...expenseData,
      id: newExpId,
    };

    setExpensesState((prev) => [newExp, ...prev]);

    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      type: "expense",
      title: `${expenseData.category}: ${expenseData.description.slice(0, 30)}`,
      category: expenseData.category,
      amount: expenseData.amount,
      date: expenseData.date || new Date().toISOString().split("T")[0],
      partyName: expenseData.description.split(" ")[0] || "Vendor",
      paymentMethod: expenseData.paymentMethod,
      status: "completed",
      referenceId: newExpId,
    };
    setTransactionsState((prev) => [newTx, ...prev]);

    toast.success(`Expense of ₹${expenseData.amount.toLocaleString("en-IN")} recorded in Khata`);
  };

  // 3. Products / Stock
  const addProduct = (productData: Omit<Product, "id">) => {
    const newProd: Product = {
      ...productData,
      id: "prod-" + Date.now(),
      emoji: productData.emoji || "📦",
    };
    setProductsState((prev) => [newProd, ...prev]);
    toast.success(`Product "${productData.name}" added to inventory!`);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProductsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    toast.success("Product updated!");
  };

  const deleteProduct = (id: string) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted from inventory");
  };

  const updateStockQuantity = (
    productId: string,
    delta: number,
    isStockIn: boolean,
    optionalCost?: number
  ) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const newQuantity = isStockIn
      ? target.currentStock + delta
      : Math.max(0, target.currentStock - delta);

    setProductsState((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, currentStock: newQuantity } : p))
    );

    // If stock in and cost entered, record expense
    if (isStockIn && optionalCost && optionalCost > 0) {
      addExpense({
        category: "Raw Material",
        amount: optionalCost,
        date: new Date().toISOString().split("T")[0],
        description: `Purchased ${delta} ${target.unit} of ${target.name}`,
        paymentMethod: "UPI",
      });
    }

    toast.success(`Stock updated: ${target.name} is now ${newQuantity} ${target.unit}`);
  };

  // 4. Customers
  const addCustomer = (
    customerData: Omit<Customer, "id" | "totalSpent" | "ordersCount" | "lastPurchaseDate">
  ) => {
    const newCust: Customer = {
      ...customerData,
      id: "cust-" + Date.now(),
      totalSpent: 0,
      ordersCount: 0,
      lastPurchaseDate: "-",
      loyaltyStatus: "New",
    };
    setCustomersState((prev) => [newCust, ...prev]);
    toast.success(`Customer "${customerData.name}" added!`);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomersState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...customerData } : c))
    );
    toast.success("Customer details updated!");
  };

  // 5. Network: Needs & Listings
  const createNeed = (needData: Omit<BusinessNeed, "id" | "createdDate" | "status">) => {
    const newNeed: BusinessNeed = {
      ...needData,
      id: "need-" + Date.now(),
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
    };
    setNeedsState((prev) => [newNeed, ...prev]);

    // Add notification
    const newNotif: Notification = {
      id: "notif-need-" + Date.now(),
      type: "enquiry",
      title: `Need Created: ${needData.item}`,
      body: `Requirement of ${needData.quantity} ${needData.unit} posted. Nearby suppliers can now view and match.`,
      timestamp: "Just now",
      unread: true,
      linkUrl: "/network?tab=needs",
      linkText: "View Need",
    };
    setNotificationsState((prev) => [newNotif, ...prev]);

    toast.success(`Requirement for "${needData.item}" posted to Pragati Network!`);
  };

  const updateNeedStatus = (id: string, status: BusinessNeed["status"]) => {
    setNeedsState((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status } : n))
    );
    toast.success(`Requirement status updated to ${status}`);
  };

  const createListing = (listingData: Omit<BusinessListing, "id" | "dateAdded" | "status">) => {
    const newListing: BusinessListing = {
      ...listingData,
      id: "list-" + Date.now(),
      status: "active",
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setListingsState((prev) => [newListing, ...prev]);
    toast.success(`Listing "${listingData.title}" posted to Pragati Marketplace!`);
  };

  // 6. Network: Enquiries & Messaging
  const sendEnquiry = (toBusinessId: string, subject: string, message: string, needId?: string) => {
    const targetBiz = networkBusinesses.find((b) => b.id === toBusinessId);
    const bizName = targetBiz ? targetBiz.name : "Local Business";

    const newEnq: Enquiry = {
      id: "enq-" + Date.now(),
      toBusinessId,
      toBusinessName: bizName,
      needId,
      subject,
      message,
      status: "sent",
      date: new Date().toISOString().split("T")[0],
      unread: false,
    };
    setEnquiriesState((prev) => [newEnq, ...prev]);

    // Create or locate conversation
    let convId = "conv-" + toBusinessId;
    setConversationsState((prev) => {
      const exists = prev.find((c) => c.businessId === toBusinessId);
      if (exists) {
        return prev.map((c) =>
          c.id === exists.id
            ? { ...c, lastMessage: message, lastMessageTime: "Just now" }
            : c
        );
      }
      return [
        {
          id: convId,
          businessId: toBusinessId,
          businessName: bizName,
          businessCategory: targetBiz?.category || "Supplier",
          businessLocation: targetBiz?.location || profile.location,
          lastMessage: message,
          lastMessageTime: "Just now",
          unreadCount: 0,
          enquirySubject: subject,
        },
        ...prev,
      ];
    });

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      conversationId: convId,
      senderId: "me",
      senderName: profile.ownerName,
      isMe: true,
      text: message,
      timestamp: "Just now",
      enquiryContext: subject,
    };

    setMessagesState((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    toast.success(`Enquiry sent to ${bizName}!`);

    // Simulate automated realistic reply after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: "msg-reply-" + Date.now(),
        conversationId: convId,
        senderId: toBusinessId,
        senderName: bizName,
        isMe: false,
        text: `Namaste ${profile.ownerName} ji! Aapka message mila. Humare paas stock available hai aur hum best rate provide karenge. Kripya quantity confirm karein.`,
        timestamp: "Just now",
      };

      setMessagesState((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), replyMsg],
      }));

      setConversationsState((prev) =>
        prev.map((c) =>
          c.businessId === toBusinessId
            ? { ...c, lastMessage: replyMsg.text, lastMessageTime: "Just now", unreadCount: c.unreadCount + 1 }
            : c
        )
      );

      setNotificationsState((prev) => [
        {
          id: "notif-msg-" + Date.now(),
          type: "message",
          title: `New message from ${bizName}`,
          body: replyMsg.text,
          timestamp: "Just now",
          unread: true,
          linkUrl: "/network?tab=messages",
          linkText: "View Chat",
        },
        ...prev,
      ]);
    }, 1500);
  };

  const sendMessage = (conversationId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      conversationId,
      senderId: "me",
      senderName: profile.ownerName,
      isMe: true,
      text,
      timestamp: "Just now",
    };

    setMessagesState((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversationsState((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: text, lastMessageTime: "Just now" }
          : c
      )
    );

    // Simulate reply
    setTimeout(() => {
      const currentConv = conversations.find((c) => c.id === conversationId);
      const bizName = currentConv ? currentConv.businessName : "Supplier";

      const autoReply: ChatMessage = {
        id: "msg-rep-" + Date.now(),
        conversationId,
        senderId: currentConv?.businessId || "partner",
        senderName: bizName,
        isMe: false,
        text: `Ji bilkul, hum order dispatch arrange kar rahe hain. Delivery receipt WhatsApp par bhej denge.`,
        timestamp: "Just now",
      };

      setMessagesState((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), autoReply],
      }));

      setConversationsState((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessage: autoReply.text, lastMessageTime: "Just now" }
            : c
        )
      );
    }, 1200);
  };

  // 7. Profile & Plan & Roadmap & Learn
  const updateProfile = (profileData: Partial<BusinessProfile>) => {
    setProfileState((prev) => ({ ...prev, ...profileData }));
    toast.success("Profile saved successfully!");
  };

  const updateBusinessPlan = (planData: Partial<BusinessPlan>) => {
    setBusinessPlanState((prev) => ({
      ...prev,
      ...planData,
      lastUpdated: new Date().toISOString().split("T")[0],
    }));
    toast.success("Business plan updated!");
  };

  const toggleRoadmapStep = (stepId: string) => {
    setRoadmapStepsState((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const toggleLessonComplete = (lessonId: string) => {
    setLearnLessonsState((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l))
    );
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotificationsState((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsState((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const setSimulatorInputs = (inputs: Partial<SimulatorInputs>) => {
    setSimulatorInputsState((prev) => ({ ...prev, ...inputs }));
  };

  // 8. PRAGATI AI Integration
  const sendAIMessage = (text: string) => {
    const userMsg: AIMessage = {
      id: "ai-usr-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const aiResponse = processAIQuery(text, {
      language,
      businessName: profile.name,
      ownerName: profile.ownerName,
      location: profile.location,
      totalRevenue,
      totalExpenses,
      netProfit,
      cashBalance,
      products,
      lowStockProducts,
      sales,
      expenses,
      customers,
      networkBusinesses,
      needs,
    });

    setAiMessagesState((prev) => [...prev, userMsg, aiResponse]);
  };

  const confirmAIAction = (messageId: string) => {
    const targetMsg = aiMessages.find((m) => m.id === messageId);
    if (!targetMsg || !targetMsg.proposedAction) return;

    const { type, payload } = targetMsg.proposedAction;

    if (type === "record_sale") {
      recordSale(payload);
    } else if (type === "add_expense") {
      addExpense(payload);
    } else if (type === "add_product") {
      addProduct(payload);
    } else if (type === "create_need") {
      createNeed(payload);
    }

    setAiMessagesState((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status: "action_confirmed" } : m))
    );
    toast.success(`Action executed successfully!`);
  };

  const cancelAIAction = (messageId: string) => {
    setAiMessagesState((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status: "action_cancelled" } : m))
    );
    toast.info("Action cancelled");
  };

  // 9. Reset Demo Data
  const resetToDemoData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setProfileState(initialBusinessProfile);
    setProductsState(initialProducts);
    setCustomersState(initialCustomers);
    setSalesState(initialSales);
    setExpensesState(initialExpenses);
    setTransactionsState(initialTransactions);
    setNeedsState(initialNeeds);
    setListingsState(initialListings);
    setEnquiriesState(initialEnquiries);
    setConversationsState(initialConversations);
    setMessagesState(initialMessages);
    setNotificationsState(initialNotifications);
    setBusinessPlanState(initialBusinessPlan);
    setRoadmapStepsState(initialRoadmapSteps);
    setLearnLessonsState(initialLearnLessons);
    setSimulatorInputsState(initialSimulatorInputs);
    setLanguageState("hinglish");
    toast.success("Reset to initial sample demo data!");
  };

  return (
    <PragatiContext.Provider
      value={{
        language,
        profile,
        products,
        customers,
        sales,
        expenses,
        transactions,
        networkBusinesses,
        needs,
        listings,
        enquiries,
        conversations,
        messages,
        notifications,
        businessIdeas,
        localOpportunities,
        govSchemes,
        businessPlan,
        roadmapSteps,
        learnLessons,
        simulatorInputs,
        aiMessages,
        activeModal,
        activeModalPayload,
        totalRevenue,
        totalExpenses,
        netProfit,
        cashBalance,
        lowStockProducts,
        unreadNotificationsCount,
        unreadMessagesCount,
        simulatorResults,
        roadmapProgressPct,
        learnProgressPct,
        t,
        setLanguage,
        openModal,
        closeModal,
        recordSale,
        addExpense,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStockQuantity,
        addCustomer,
        updateCustomer,
        createNeed,
        updateNeedStatus,
        createListing,
        sendEnquiry,
        sendMessage,
        updateProfile,
        updateBusinessPlan,
        toggleRoadmapStep,
        toggleLessonComplete,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        setSimulatorInputs,
        sendAIMessage,
        confirmAIAction,
        cancelAIAction,
        resetToDemoData,
      }}
    >
      {children}
    </PragatiContext.Provider>
  );
}

export function usePragati() {
  const context = useContext(PragatiContext);
  if (!context) {
    throw new Error("usePragati must be used within a PragatiProvider");
  }
  return context;
}
