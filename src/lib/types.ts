export type Language = "en" | "hi" | "hinglish";

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  location: string;
  category: string;
  description: string;
  stage: "planning" | "early" | "growing" | "established";
  availableCapital: number;
  skills: string[];
  resources: string[];
  experience: "Beginner" | "Intermediate" | "Experienced";
  readinessScore: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  purchaseCost: number;
  sellingPrice: number;
  unit: string;
  description?: string;
  emoji?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  totalSpent: number;
  ordersCount: number;
  lastPurchaseDate: string;
  notes?: string;
  loyaltyStatus: "New" | "Regular" | "VIP";
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerId?: string;
  customerName: string;
  date: string;
  paymentMethod: "UPI" | "Cash" | "Bank Transfer";
  notes?: string;
}

export interface Expense {
  id: string;
  category:
    | "Raw Material"
    | "Packaging"
    | "Rent & Utilities"
    | "Transport & Fuel"
    | "Equipment"
    | "Salary / Wages"
    | "Marketing"
    | "Other";
  amount: number;
  date: string;
  description: string;
  paymentMethod: "UPI" | "Cash" | "Bank Transfer";
}

export interface Transaction {
  id: string;
  type: "sale" | "expense" | "stock_purchase" | "loan_disbursement";
  title: string;
  category: string;
  amount: number;
  date: string;
  partyName: string;
  paymentMethod: "UPI" | "Cash" | "Bank Transfer";
  status: "completed" | "pending";
  referenceId?: string;
}

export interface NetworkBusiness {
  id: string;
  name: string;
  owner: string;
  category: string;
  location: string;
  district: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  phone: string;
  about: string;
  products: string[];
  services: string[];
  isSupplier: boolean;
  isBuyer: boolean;
  badge?: string;
}

export interface BusinessNeed {
  id: string;
  item: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  budget?: number;
  requiredDate: string;
  status: "active" | "fulfilled" | "cancelled";
  notes?: string;
  createdDate: string;
}

export interface BusinessListing {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  description: string;
  dateAdded: string;
  status: "active" | "sold";
  contactPhone: string;
}

export interface Enquiry {
  id: string;
  toBusinessId: string;
  toBusinessName: string;
  needId?: string;
  subject: string;
  message: string;
  status: "sent" | "replied" | "in_discussion" | "closed";
  date: string;
  unread: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  isMe: boolean;
  text: string;
  timestamp: string;
  enquiryContext?: string;
}

export interface ChatConversation {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  enquirySubject?: string;
}

export interface Notification {
  id: string;
  type: "low_stock" | "enquiry" | "message" | "insight" | "scheme" | "learning";
  title: string;
  body: string;
  timestamp: string;
  unread: boolean;
  linkUrl?: string;
  linkText?: string;
  actionType?: string;
}

export interface BusinessIdea {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  investmentMin: number;
  investmentMax: number;
  expectedDemand: "High" | "Very High" | "Moderate";
  feasibilityScore: number;
  competition: "Low" | "Medium" | "High";
  requiredSkills: string[];
  resourcesNeeded: string[];
  description: string;
  whyItWorks: string;
  keySteps: string[];
}

export interface LocalOpportunity {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  location: string;
  radiusKm: number;
  gapDescription: string;
  feasibilityScore: number;
  potentialMonthlyRevenue: number;
  targetAudience: string;
  nearbyCompetitionCount: number;
  demandTrend: "Rising" | "Steady" | "High Demand";
}

export interface GovScheme {
  id: string;
  name: string;
  nameHindi: string;
  ministry: string;
  maxAmount: number;
  subsidyPct: number;
  interestRate: string;
  eligibility: string[];
  description: string;
  keyBenefits: string[];
  documentsRequired: string[];
  applySteps: string[];
  category: "Mudra" | "MSME" | "PMEGP" | "NABARD" | "Artisan / State";
  officialUrl?: string;
}

export interface BusinessPlan {
  businessName: string;
  ownerName: string;
  location: string;
  category: string;
  capitalRequired: number;
  ownContribution: number;
  loanNeeded: number;
  targetAudience: string;
  pricingStrategy: string;
  costStructure: string;
  marketingChannels: string[];
  monthlyRevenueTarget: number;
  breakEvenTarget: string;
  milestoneGoals: string[];
  lastUpdated: string;
}

export interface RoadmapStep {
  id: string;
  phase: number;
  phaseName: string;
  title: string;
  description: string;
  isCompleted: boolean;
  estimatedDays: number;
  category: "Setup" | "Compliance" | "Supply" | "Sales" | "Growth";
  actionableLink?: string;
}

export interface LearnLesson {
  id: string;
  category: "Money Basics" | "Sales & Marketing" | "Operations & Stock" | "Digital & Schemes";
  title: string;
  titleHindi: string;
  durationMinutes: number;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  isCompleted: boolean;
}

export interface SimulatorInputs {
  investment: number;
  monthlyProduction: number;
  unitCost: number;
  sellingPrice: number;
  fixedExpenses: number;
}

export interface SimulatorResults {
  monthlyRevenue: number;
  variableCosts: number;
  totalCosts: number;
  monthlyProfit: number;
  marginPct: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  paybackMonths: number;
}

export interface AIProposedAction {
  id: string;
  type: "record_sale" | "add_expense" | "add_product" | "create_need" | "search_network";
  title: string;
  payload: any;
}

export interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  proposedAction?: AIProposedAction;
  status?: "pending_action" | "action_confirmed" | "action_cancelled";
}
