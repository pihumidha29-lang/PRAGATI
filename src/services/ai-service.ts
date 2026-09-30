import type {
  Product,
  Sale,
  Expense,
  Customer,
  NetworkBusiness,
  BusinessNeed,
  AIMessage,
  AIProposedAction,
  Language,
} from "@/lib/types";

export interface AIStateContext {
  language: Language;
  businessName: string;
  ownerName: string;
  location: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashBalance: number;
  products: Product[];
  lowStockProducts: Product[];
  sales: Sale[];
  expenses: Expense[];
  customers: Customer[];
  networkBusinesses: NetworkBusiness[];
  needs: BusinessNeed[];
}

export function processAIQuery(query: string, context: AIStateContext): AIMessage {
  const normalized = query.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const id = "ai-msg-" + Date.now();
  const isHindi = context.language === "hi";
  const isEnglish = context.language === "en";

  // Intent 1: "Mera business kaisa chal raha hai?" / "How is my business doing?" / "Performance"
  if (
    normalized.includes("kaisa chal raha") ||
    normalized.includes("business kaisa") ||
    normalized.includes("performance") ||
    normalized.includes("summary") ||
    normalized.includes("report") ||
    normalized.includes("mera business") ||
    normalized.includes("how is my business") ||
    normalized.includes("financial summary")
  ) {
    const margin =
      context.totalRevenue > 0 ? Math.round((context.netProfit / context.totalRevenue) * 100) : 0;

    let text = "";
    if (isHindi) {
      text = `नमस्ते ${context.ownerName} जी! आपके व्यापार **"${context.businessName}"** का वर्तमान वित्तीय ब्योरा इस प्रकार है:

📊 **कुल बिक्री (Sales):** ₹${context.totalRevenue.toLocaleString("en-IN")}
💸 **कुल खर्चा (Expenses):** ₹${context.totalExpenses.toLocaleString("en-IN")}
💰 **शुद्ध बचत / मुनाफा (Net Profit):** ₹${context.netProfit.toLocaleString("en-IN")} (मुनाफा मार्जिन: **${margin}%**)
🏦 **चालू रोकड़ व बैंक बैलेंस (Cash Balance):** ₹${context.cashBalance.toLocaleString("en-IN")}

${
  context.lowStockProducts.length > 0
    ? `⚠️ **ध्यान दें:** आपके पास ${context.lowStockProducts.length} उत्पाद कम स्टॉक पर हैं (${context.lowStockProducts.map((p) => p.name).join(", ")}).`
    : `✅ आपका सारा स्टॉक सुरक्षित सीमा में उपलब्ध है।`
}

आप इसके अलावा क्या जानना चाहते हैं?`;
    } else if (isEnglish) {
      text = `Hello ${context.ownerName}! Here is the current financial summary for your business **"${context.businessName}"**:

📊 **Total Sales Revenue:** ₹${context.totalRevenue.toLocaleString("en-IN")}
💸 **Total Expenses:** ₹${context.totalExpenses.toLocaleString("en-IN")}
💰 **Net Profit / Savings:** ₹${context.netProfit.toLocaleString("en-IN")} (Profit Margin: **${margin}%**)
🏦 **Cash & Bank Balance:** ₹${context.cashBalance.toLocaleString("en-IN")}

${
  context.lowStockProducts.length > 0
    ? `⚠️ **Alert:** You have ${context.lowStockProducts.length} item(s) on low stock (${context.lowStockProducts.map((p) => p.name).join(", ")}).`
    : `✅ All inventory items are currently above safe threshold.`
}

What else would you like to explore?`;
    } else {
      text = `Namaste ${context.ownerName} ji! Aapke business **"${context.businessName}"** ka current financial hisaab ye hai:

📊 **Kul Bikri (Sales):** ₹${context.totalRevenue.toLocaleString("en-IN")}
💸 **Kul Kharcha (Expenses):** ₹${context.totalExpenses.toLocaleString("en-IN")}
💰 **Bachat / Munafa (Net Profit):** ₹${context.netProfit.toLocaleString("en-IN")} (Profit Margin: **${margin}%**)
🏦 **Cash & Bank Balance:** ₹${context.cashBalance.toLocaleString("en-IN")}

${
  context.lowStockProducts.length > 0
    ? `⚠️ **Dhyan dein:** Aapke paas ${context.lowStockProducts.length} item(s) low-stock par hain (${context.lowStockProducts.map((p) => p.name).join(", ")}).`
    : `✅ Saara inventory stock abhi safe limit mein hai.`
}

Aap aur kya janna chahte hain?`;
    }

    return { id, sender: "ai", text, timestamp };
  }

  // Intent 2: "Stock mein kya kam hai?" / "Low stock" / "What is low in stock?"
  if (
    normalized.includes("stock") &&
    (normalized.includes("kam") ||
      normalized.includes("low") ||
      normalized.includes("khatam") ||
      normalized.includes("shortage") ||
      normalized.includes("reorder"))
  ) {
    if (context.lowStockProducts.length === 0) {
      const text = isHindi
        ? `शुभ समाचार! आपके सभी उत्पादों का स्टॉक सुरक्षित सीमा से ऊपर है। कोई भी आइटम कम नहीं है।`
        : isEnglish
        ? `Good news! All your catalog products are above the minimum safety stock threshold.`
        : `Badhiya khabar! Aapke sabhi products ka stock safe threshold se upar hai. Koi bhi item low-stock par nahi hai.`;
      return { id, sender: "ai", text, timestamp };
    }

    const itemsList = context.lowStockProducts
      .map(
        (p) =>
          `• **${p.name}:** ${isHindi ? "सिर्फ" : isEnglish ? "Only" : "Sirf"} **${p.currentStock} ${p.unit}** ${
            isHindi ? "शेष है" : isEnglish ? "remaining" : "bacha hai"
          } (${isHindi ? "सुरक्षित सीमा" : isEnglish ? "Threshold" : "Threshold"}: ${p.lowStockThreshold} ${p.unit})`
      )
      .join("\n");

    const text = isHindi
      ? `⚠️ **स्टॉक की कमी की सूचना (Low Stock Alert):**

${itemsList}

इन उत्पादों का स्टॉक जल्द समाप्त हो सकता है। क्या मैं स्थानीय नेटवर्क पर कच्चा माल सप्लायर खोजकर आवश्यकता (Need) पोस्ट करूँ?`
      : isEnglish
      ? `⚠️ **Low Stock Alert:**

${itemsList}

These products may run out soon. Would you like me to find nearby suppliers on Pragati Network and create a procurement need?`
      : `⚠️ **Low Stock Alert:**

${itemsList}

In items ka stock jaldi khatam ho sakta hai. Kya main Network par raw material suppliers ko dhundh kar requirement create karoon?`;

    return {
      id,
      sender: "ai",
      text,
      timestamp,
      proposedAction: {
        id: "act-create-need-" + Date.now(),
        type: "search_network",
        title: isHindi
          ? "प्रगति नेटवर्क पर सप्लायर खोजें"
          : isEnglish
          ? "Search Suppliers on Pragati Network"
          : "Search Suppliers on Pragati Network",
        payload: {
          query: context.lowStockProducts[0]?.name || "Raw Material",
          category: "Raw Material",
        },
      },
      status: "pending_action",
    };
  }

  // Intent 3: "Aaj ki 5 bags ki sale add karo" / "Record sale" / "Sale add karo"
  if (
    normalized.includes("sale") &&
    (normalized.includes("add") ||
      normalized.includes("darj") ||
      normalized.includes("jodo") ||
      normalized.includes("biki") ||
      normalized.includes("becha") ||
      normalized.includes("record"))
  ) {
    const matchQty = normalized.match(/(\d+)/);
    const qty = matchQty ? parseInt(matchQty[1], 10) : 5;

    const targetProduct =
      context.products.find((p) => normalized.includes(p.name.toLowerCase())) ||
      context.products[0];

    const unitPrice = targetProduct ? targetProduct.sellingPrice : 480;
    const totalAmount = qty * unitPrice;
    const defaultCustomer = context.customers[0] || { id: "cust-1", name: "Ramesh Kumar" };

    const text = isHindi
      ? `जी हाँ! मैं **${targetProduct?.name || "Cotton Bags"}** की **${qty} ${targetProduct?.unit || "pieces"}** की बिक्री (₹${totalAmount.toLocaleString("en-IN")}) दर्ज करने के लिए तैयार हूँ:

• **उत्पाद:** ${targetProduct?.name}
• **मात्रा:** ${qty} ${targetProduct?.unit}
• **प्रति इकाई दर:** ₹${unitPrice}
• **कुल बिल राशि:** ₹${totalAmount.toLocaleString("en-IN")}
• **ग्राहक:** ${defaultCustomer.name}

क्या इस लेन-देन को खाते और इन्वेंट्री में दर्ज कर दिया जाए?`
      : isEnglish
      ? `Yes! I am ready to record the sale of **${qty} ${targetProduct?.unit || "pieces"}** of **${targetProduct?.name || "Cotton Bags"}** (₹${totalAmount.toLocaleString("en-IN")}):

• **Product:** ${targetProduct?.name}
• **Quantity:** ${qty}
• **Unit Selling Price:** ₹${unitPrice}
• **Total Bill Amount:** ₹${totalAmount.toLocaleString("en-IN")}
• **Customer:** ${defaultCustomer.name}

Shall I confirm this transaction in Khata and deduct stock?`
      : `Ji! Main **${targetProduct?.name || "Cotton Bags"}** ki **${qty} ${targetProduct?.unit || "pieces"}** ki sale (₹${totalAmount.toLocaleString("en-IN")}) record karne ke liye ready hoon:

• **Product:** ${targetProduct?.name}
• **Quantity:** ${qty}
• **Selling Price:** ₹${unitPrice} per item
• **Total Amount:** ₹${totalAmount.toLocaleString("en-IN")}
• **Customer:** ${defaultCustomer.name}

Kya is transaction ko Khata aur Inventory mein confirm kar diya jaye?`;

    const proposedAction: AIProposedAction = {
      id: "act-sale-" + Date.now(),
      type: "record_sale",
      title: isHindi
        ? `बिक्री की पुष्टि करें: ${qty}x ${targetProduct?.name} (₹${totalAmount})`
        : isEnglish
        ? `Confirm Sale: ${qty}x ${targetProduct?.name} (₹${totalAmount})`
        : `Confirm Sale: ${qty}x ${targetProduct?.name} (₹${totalAmount})`,
      payload: {
        productId: targetProduct?.id || "prod-1",
        productName: targetProduct?.name || "Cotton Bags",
        quantity: qty,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        customerId: defaultCustomer.id,
        customerName: defaultCustomer.name,
        paymentMethod: "UPI",
        notes: "Recorded via PRAGATI AI Assistant",
      },
    };

    return {
      id,
      sender: "ai",
      text,
      timestamp,
      proposedAction,
      status: "pending_action",
    };
  }

  // Intent 4: "Mujhe 50kg cotton chahiye" / "Need 50kg cotton" / "Supplier dhundho"
  if (
    normalized.includes("chahiye") ||
    normalized.includes("need") ||
    normalized.includes("supplier") ||
    normalized.includes("kharidna") ||
    normalized.includes("cotton") ||
    normalized.includes("fabric") ||
    normalized.includes("material")
  ) {
    const matchedSupplier =
      context.networkBusinesses.find(
        (b) =>
          b.isSupplier &&
          (b.name.toLowerCase().includes("cotton") ||
            b.category.toLowerCase().includes("textile") ||
            b.products.some((p) => p.toLowerCase().includes("cotton")))
      ) || context.networkBusinesses[0];

    const text = isHindi
      ? `मैंने प्रगति स्थानीय नेटवर्क पर सप्लायर खोजे हैं:

🎯 **उपयुक्त सप्लायर मिला:**
• **${matchedSupplier.name}** (${matchedSupplier.location})
• **दूरी:** ${matchedSupplier.distanceKm} किमी दूर
• **रेटिंग:** ⭐ ${matchedSupplier.rating} (${matchedSupplier.reviewsCount} समीक्षाएं)
• **उत्पाद:** ${matchedSupplier.products.join(", ")}

क्या आप इस सप्लायर को सीधी पूछताछ (Enquiry) भेजना चाहते हैं या आवश्यकता पोस्ट करें?`
      : isEnglish
      ? `I searched the Pragati Local Network and found a matching supplier:

🎯 **Matched Supplier:**
• **${matchedSupplier.name}** (${matchedSupplier.location})
• **Distance:** ${matchedSupplier.distanceKm} km away
• **Rating:** ⭐ ${matchedSupplier.rating} (${matchedSupplier.reviewsCount} reviews)
• **Products:** ${matchedSupplier.products.join(", ")}

Would you like to send a direct enquiry or create a requirement in My Needs?`
      : `Maine Pragati Local Network par suppliers scan kiye hain:

🎯 **Matching Supplier Mila:**
• **${matchedSupplier.name}** (${matchedSupplier.location})
• **Distance:** ${matchedSupplier.distanceKm} km away
• **Rating:** ⭐ ${matchedSupplier.rating} (${matchedSupplier.reviewsCount} reviews)
• **Products:** ${matchedSupplier.products.join(", ")}

Kya aap is supplier ko direct Enquiry / Message bhejna chahte hain ya My Needs mein requirement post karein?`;

    const proposedAction: AIProposedAction = {
      id: "act-need-" + Date.now(),
      type: "create_need",
      title: isHindi
        ? `आवश्यकता पोस्ट करें: 50kg Organic Raw Cotton`
        : isEnglish
        ? `Create Need: 50kg Organic Raw Cotton`
        : `Create Need: 50kg Organic Raw Cotton (Sanganer)`,
      payload: {
        item: "50kg Organic Raw Cotton",
        category: "Raw Material",
        quantity: 50,
        unit: "kg",
        location: context.location,
        budget: 11000,
        requiredDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0],
        notes: "Urgent procurement for tote bag production batch",
      },
    };

    return {
      id,
      sender: "ai",
      text,
      timestamp,
      proposedAction,
      status: "pending_action",
    };
  }

  // Intent 5: "Kharcha kitna hua?" / "Expense breakdown"
  if (
    normalized.includes("kharcha") ||
    normalized.includes("expense") ||
    normalized.includes("spending") ||
    normalized.includes("kahan kharch") ||
    normalized.includes("cost")
  ) {
    const catMap: Record<string, number> = {};
    context.expenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });

    const breakdown = Object.entries(catMap)
      .map(([cat, amt]) => `• **${cat}:** ₹${amt.toLocaleString("en-IN")}`)
      .join("\n");

    const text = isHindi
      ? `इस अवधि में आपका कुल खर्चा **₹${context.totalExpenses.toLocaleString("en-IN")}** दर्ज हुआ है:

${breakdown}

💡 **प्रगति सुझाव:** कच्चा माल (Raw Material) आपके खर्च का सबसे बड़ा हिस्सा है। स्थानीय बुनकरों व मिलों से थोक मोलभाव करके आप 8-12% की बचत कर सकते हैं।`
      : isEnglish
      ? `During this period, your total recorded expenses are **₹${context.totalExpenses.toLocaleString("en-IN")}**:

${breakdown}

💡 **Pragati Tip:** Raw material is your largest expense. You can save 8-12% by negotiating bulk deals directly with Sanganer mills on Pragati Network.`
      : `Is period mein aapka total kharcha **₹${context.totalExpenses.toLocaleString("en-IN")}** hua hai:

${breakdown}

💡 **Pragati Tip:** Raw Material aapke kharche ka sabse bada hissa hai. Sanganer ke direct mill suppliers se bulk negotiation karke aap 8-12% bachat kar sakte hain.`;

    return { id, sender: "ai", text, timestamp };
  }

  // Intent 6: "Top customer" / "Customer kaun hai"
  if (
    normalized.includes("customer") ||
    normalized.includes("grahak") ||
    normalized.includes("top buyer") ||
    normalized.includes("client")
  ) {
    const sorted = [...context.customers].sort((a, b) => b.totalSpent - a.totalSpent);
    const top = sorted[0];

    const text = isHindi
      ? `आपके शीर्ष ग्राहकों की सूची:

🥇 **${top?.name || "रमेश कुमार"}:** ₹${top?.totalSpent.toLocaleString("en-IN")} (${top?.ordersCount} ऑर्डर) - *${top?.loyaltyStatus}*
🥈 **${sorted[1]?.name || "अनीता शर्मा"}:** ₹${sorted[1]?.totalSpent.toLocaleString("en-IN")} (${sorted[1]?.ordersCount} ऑर्डर)

त्योहारी सीजन में इन्हें विशेष थोक छूट देकर आप ऑर्डर बढ़ा सकते हैं!`
      : isEnglish
      ? `Your top customers by purchase volume:

🥇 **${top?.name || "Ramesh Kumar"}:** ₹${top?.totalSpent.toLocaleString("en-IN")} (${top?.ordersCount} orders) - *${top?.loyaltyStatus}*
🥈 **${sorted[1]?.name || "Anita Sharma"}:** ₹${sorted[1]?.totalSpent.toLocaleString("en-IN")} (${sorted[1]?.ordersCount} orders)

Consider offering them a festive bundle discount to drive repeat orders!`
      : `Aapke top customers ki list:

🥇 **${top?.name || "Ramesh Kumar"}:** ₹${top?.totalSpent.toLocaleString("en-IN")} (${top?.ordersCount} orders) - *${top?.loyaltyStatus}*
🥈 **${sorted[1]?.name || "Anita Sharma"}:** ₹${sorted[1]?.totalSpent.toLocaleString("en-IN")} (${sorted[1]?.ordersCount} orders)

Aap inhe festive offer ya wholesale bundle discount dekar repeat orders badha sakte hain!`;

    return { id, sender: "ai", text, timestamp };
  }

  // Intent 7: "Loan" / "Scheme" / "Sarkari sahayata"
  if (
    normalized.includes("loan") ||
    normalized.includes("scheme") ||
    normalized.includes("mudra") ||
    normalized.includes("pmegp") ||
    normalized.includes("subsidy") ||
    normalized.includes("paisa chahiye") ||
    normalized.includes("funding")
  ) {
    const text = isHindi
      ? `आपके एमएसएमई व हस्तशिल्प व्यापार के लिए दो सबसे उपयुक्त सरकारी योजनाएं उपलब्ध हैं:

1. **प्रधानमंत्री मुद्रा योजना (किशोर लोन):**
   • राशि: ₹50,000 से ₹5,00,000
   • जमानत: **बिना किसी गारंटी या संपत्ति गिरवी रखे (Collateral-Free)**
   • उद्देश्य: कच्चा माल खरीदने व कार्यशील पूंजी के लिए

2. **प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP):**
   • ग्रामीण क्षेत्र में 35% तक सरकारी पूंजीगत सब्सिडी।

आप **लोन व सरकारी योजनाएं** अनुभाग में जाकर पात्रता जांच सकते हैं और आवेदन मार्गदर्शिका देख सकते हैं!`
      : isEnglish
      ? `Here are the two best government financing schemes for your MSME enterprise:

1. **Pradhan Mantri MUDRA Yojana (Kishor Loan):**
   • Amount: ₹50,000 to ₹5,00,000
   • Collateral: **100% Collateral-Free (No guarantor needed)**
   • Purpose: Working capital for raw materials & equipment

2. **PMEGP Scheme (KVIC):**
   • Up to 35% capital subsidy for manufacturing units in rural areas.

Visit the **Loans & Schemes** section to check eligibility and download the step-by-step application guide!`
      : `Aapke artisan MSME business ke liye do sabse behtareen government schemes hain:

1. **PM Mudra Yojana (Kishor Loan):**
   • Amount: ₹50,000 se ₹5,00,000
   • Collateral: **Koi property ya guarantor nahi chahiye**
   • Purpose: Raw material aur machinery ke liye working capital

2. **PMEGP Scheme (KVIC):**
   • Up to 35% government capital subsidy in rural areas.

Aap **Loans & Schemes** section mein jakar eligibility check kar sakte hain aur 1-click application guide download kar sakte hain!`;

    return { id, sender: "ai", text, timestamp };
  }

  // Default response
  const text = isHindi
    ? `नमस्ते ${context.ownerName} जी! मैं आपकी सहायता के लिए तैयार हूँ। आप मुझसे पूछ सकते हैं:

• *"मेरा व्यापार कैसा चल रहा है?"*
• *"स्टॉक में क्या कम है?"*
• *"आज की 5 बैग्स की बिक्री जोड़ो"*
• *"मुझे 50 किलो कॉटन चाहिए"*
• *"मेरे सबसे बड़े ग्राहक कौन हैं?"*
• *"मुद्रा लोन के नियम क्या हैं?"*`
    : isEnglish
    ? `Hello ${context.ownerName}! I am here to help you manage your business. You can ask me:

• *"How is my business doing?"*
• *"What items are low in stock?"*
• *"Record sale of 5 bags today"*
• *"I need 50kg raw cotton"*
• *"Who are my top customers?"*
• *"What is the eligibility for Mudra loan?"*`
    : `Namaste ${context.ownerName} ji! Main aapki help ke liye ready hoon. Aap mujhse pooch sakte hain:

• *"Mera business kaisa chal raha hai?"*
• *"Stock mein kya kam hai?"*
• *"Aaj ki 5 bags ki sale add karo"*
• *"Mujhe 50kg cotton chahiye"*
• *"Top customers kaun se hain?"*
• *"Mudra loan ke liye kya eligibility hai?"*`;

  return { id, sender: "ai", text, timestamp };
}
