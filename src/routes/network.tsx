import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users2,
  Search,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Send,
  PlusCircle,
  Sparkles,
  ShoppingBag,
  Package,
  Building2,
  ArrowRight,
  Filter,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Local Business Network — Pragati" },
      {
        name: "description",
        content:
          "Connect with nearby suppliers, wholesale buyers, post your needs and negotiate deals locally.",
      },
    ],
  }),
  component: NetworkPage,
});

export function NetworkPage() {
  const {
    networkBusinesses,
    needs,
    listings,
    conversations,
    messages,
    openModal,
    updateNeedStatus,
    sendMessage,
    unreadMessagesCount,
    t,
    language,
  } = usePragati();

  const [activeTab, setActiveTab] = useState<string>("suppliers");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<"all" | "supplier" | "buyer">("all");

  // Messaging active conversation
  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || "conv-1"
  );
  const [chatInput, setChatInput] = useState<string>("");

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeConversationMessages = activeConversation
    ? messages[activeConversation.id] || []
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, chatInput.trim());
    setChatInput("");
  };

  const filteredBusinesses = networkBusinesses.filter((b) => {
    const matchesRole =
      roleFilter === "all" ? true : roleFilter === "supplier" ? b.isSupplier : b.isBuyer;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.products.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
            <Users2 className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("network")}</h1>
            <p className="text-sm text-muted-foreground">
              {language === "hi"
                ? "स्थानीय सप्लायर्स, थोक खरीदारों से सीधे जुड़ें, आवश्यकताएं पोस्ट करें और चैट करें।"
                : "Connect directly with verified suppliers, bulk buyers, post requirements and chat."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openModal("need")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold text-xs"
          >
            <PlusCircle className="mr-1.5 h-4 w-4" /> {t("postNeedBtn")}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted p-1">
          <TabsTrigger value="suppliers" className="rounded-lg text-xs font-bold gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> {t("findBusinesses")}
          </TabsTrigger>
          <TabsTrigger value="needs" className="rounded-lg text-xs font-bold gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5" /> {t("myNeeds")} ({needs.length})
          </TabsTrigger>
          <TabsTrigger value="listings" className="rounded-lg text-xs font-bold gap-1.5">
            <Package className="h-3.5 w-3.5" /> {t("myListings")} ({listings.length})
          </TabsTrigger>
          <TabsTrigger value="messages" className="rounded-lg text-xs font-bold gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> {t("messages")}
            {unreadMessagesCount > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-mid px-1 text-[10px] font-bold text-primary-foreground">
                {unreadMessagesCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* 1. FIND SUPPLIERS & BUYERS TAB */}
        <TabsContent value="suppliers" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                type="text"
                placeholder={language === "hi" ? "उत्पाद, सामग्री, पैकेजिंग या कपड़े से खोजें..." : "Search by product, cotton, fabric, packaging, dyes..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={roleFilter === "all" ? "default" : "outline"}
                onClick={() => setRoleFilter("all")}
                className="text-xs h-8 rounded-lg"
              >
                {t("allFilter")}
              </Button>
              <Button
                size="sm"
                variant={roleFilter === "supplier" ? "default" : "outline"}
                onClick={() => setRoleFilter("supplier")}
                className="text-xs h-8 rounded-lg"
              >
                {t("suppliersFilter")}
              </Button>
              <Button
                size="sm"
                variant={roleFilter === "buyer" ? "default" : "outline"}
                onClick={() => setRoleFilter("buyer")}
                className="text-xs h-8 rounded-lg"
              >
                {t("buyersFilter")}
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {filteredBusinesses.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-teal-mid/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{b.name}</h3>
                        {b.verified && (
                          <CheckCircle2 className="h-4 w-4 text-teal-deep shrink-0" title={language === "hi" ? "सत्यापित व्यापार" : "Verified Business"} />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{b.owner} • {b.category}</p>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold ${
                        b.isSupplier
                          ? "bg-secondary text-teal-deep border-secondary"
                          : "bg-mint/40 text-teal-deep border-mint"
                      }`}
                    >
                      {b.isSupplier
                        ? language === "hi"
                          ? "सप्लायर"
                          : "Supplier"
                        : language === "hi"
                        ? "खरीदार"
                        : "Buyer"}
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <MapPin className="h-3 w-3 text-primary" /> {b.location} ({b.distanceKm} {language === "hi" ? "किमी दूर" : "km away"})
                    </span>
                    <span>⭐ {b.rating} ({b.reviewsCount} {language === "hi" ? "समीक्षाएं" : "reviews"})</span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{b.about}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {b.products.map((p, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <a
                    href={`tel:${b.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground bg-muted hover:bg-accent px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" /> {t("callBtn")}
                  </a>

                  <Button
                    size="sm"
                    onClick={() =>
                      openModal("enquiry", {
                        toBusinessId: b.id,
                        subject: language === "hi" ? `${b.name} से पूछताछ` : `Price enquiry from Jaipur Heritage`,
                      })
                    }
                    className="text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex-1 font-bold"
                  >
                    {t("sendEnquiryBtn")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 2. MY NEEDS TAB (With Smart Match Engine) */}
        <TabsContent value="needs" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-teal-deep p-6 text-secondary">
            <div>
              <h2 className="text-xl font-bold">
                {language === "hi" ? "मेरी व्यापारिक आवश्यकताएं" : "My Active Business Requirements"}
              </h2>
              <p className="mt-1 text-xs text-secondary/80">
                {language === "hi"
                  ? "कच्चे माल या उपकरणों की मांग पोस्ट करें। प्रगति आसपास के सप्लायर से स्वतः मिलान करती है।"
                  : "Post what material or tools you need. Pragati automatically matches nearby suppliers."}
              </p>
            </div>
            <Button
              onClick={() => openModal("need")}
              className="bg-secondary text-teal-deep hover:bg-mint font-bold rounded-full text-xs"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> {t("postNeedBtn")}
            </Button>
          </div>

          <div className="space-y-4">
            {needs.map((need) => {
              // Intelligent match matching logic
              const matchingSuppliers = networkBusinesses.filter(
                (b) =>
                  b.isSupplier &&
                  (b.products.some((p) => need.item.toLowerCase().includes(p.toLowerCase().split(" ")[0])) ||
                    b.category.toLowerCase().includes(need.category.toLowerCase()))
              );

              return (
                <div
                  key={need.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{need.item}</h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${
                            need.status === "active"
                              ? "bg-mint/40 text-teal-deep border-mint"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {need.status === "active"
                            ? language === "hi"
                              ? "सक्रिय आवश्यकता"
                              : "Active Seeking"
                            : language === "hi"
                            ? "पूर्ण हुआ"
                            : "Fulfilled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t("quantity")}: <strong>{need.quantity} {need.unit}</strong> • {language === "hi" ? "अनुमानित बजट:" : "Estimated Budget:"}{" "}
                        <strong>₹{need.budget?.toLocaleString("en-IN") || "Flexible"}</strong> • {language === "hi" ? "अंतिम तारीख:" : "Required by:"}{" "}
                        <strong>{need.requiredDate}</strong>
                      </p>
                      {need.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1">"{need.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {need.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateNeedStatus(need.id, "fulfilled")}
                          className="text-xs h-8 rounded-lg text-teal-deep"
                        >
                          {t("markDone")}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Matching Suppliers Box */}
                  <div className="rounded-xl bg-muted/60 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-deep" />
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                        {language === "hi"
                          ? `नजदीकी सप्लायर्स (${matchingSuppliers.length} उपलब्ध)`
                          : `Matching Local Suppliers (${matchingSuppliers.length} found nearby)`}
                      </h4>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {matchingSuppliers.map((sup) => (
                        <div
                          key={sup.id}
                          className="flex items-center justify-between rounded-lg bg-card p-3 border border-border"
                        >
                          <div>
                            <p className="text-xs font-bold text-foreground">{sup.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {sup.location} • {sup.distanceKm} km away • ⭐ {sup.rating}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              openModal("enquiry", {
                                toBusinessId: sup.id,
                                subject: `Request for ${need.quantity} ${need.unit} ${need.item}`,
                              })
                            }
                            className="text-[11px] h-7 bg-teal-deep text-secondary hover:bg-teal-mid rounded-md font-bold"
                          >
                            {t("connectBtn")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* 3. MY LISTINGS TAB */}
        <TabsContent value="listings" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                {language === "hi" ? "मेरे पास उपलब्ध (मार्केटप्लेस लिस्टिंग)" : "My Marketplace Listings"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {language === "hi"
                  ? "अतिरिक्त कच्चा माल, तैयार उत्पाद या उपकरण अन्य व्यापारियों को बेचें।"
                  : "Sell surplus raw material, wholesale stock or tools to other local businesses."}
              </p>
            </div>
            <Button
              onClick={() => openModal("need")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> {language === "hi" ? "+ नई लिस्टिंग जोड़ें" : "+ Add Listing"}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {listings.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.category} • {item.location}</p>
                  </div>
                  <Badge variant="outline" className="bg-mint/30 text-teal-deep text-[10px] font-bold">
                    {language === "hi" ? "सक्रिय" : "Active"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

                <div className="rounded-xl bg-muted/60 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground">{language === "hi" ? "उपलब्ध मात्रा:" : "Available Quantity:"}</span>
                    <p className="font-bold text-foreground text-sm">{item.quantity} {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">{language === "hi" ? "प्रस्तावित दर:" : "Offer Price:"}</span>
                    <p className="font-extrabold text-teal-deep text-sm">₹{item.price} / {item.unit}</p>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>{t("date")}: {item.dateAdded}</span>
                  <span>{language === "hi" ? "संपर्क" : "Contact"}: {item.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 4. MESSAGES / REAL-TIME CHAT TAB */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-border bg-card overflow-hidden shadow-sm min-h-[500px]">
            {/* Conversation list */}
            <div className="border-r border-border p-3 space-y-2 bg-muted/20">
              <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground px-2 py-1">
                {language === "hi" ? "संदेश व बातचीत" : "Conversations"}
              </h3>
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 ${
                      activeConvId === conv.id
                        ? "bg-secondary text-teal-deep font-semibold shadow-xs"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{conv.businessName}</span>
                      <span className="text-[10px] text-muted-foreground">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat message thread */}
            <div className="md:col-span-2 flex flex-col justify-between p-4 bg-card">
              {activeConversation ? (
                <>
                  {/* Chat header */}
                  <div className="pb-3 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{activeConversation.businessName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {activeConversation.businessCategory} • {activeConversation.businessLocation}
                      </p>
                    </div>
                    {activeConversation.enquirySubject && (
                      <Badge variant="outline" className="text-[10px] bg-secondary/30">
                        {activeConversation.enquirySubject}
                      </Badge>
                    )}
                  </div>

                  {/* Message stream */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[360px]">
                    {activeConversationMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                            msg.isMe
                              ? "bg-teal-deep text-secondary rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          {msg.enquiryContext && (
                            <div className="mb-1 pb-1 border-b border-white/20 text-[10px] opacity-80">
                              {msg.enquiryContext}
                            </div>
                          )}
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-border flex gap-2">
                    <Input
                      type="text"
                      placeholder={language === "hi" ? "संदेश लिखें या भाव-ताव करें..." : "Type your message or negotiate price..."}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="text-xs h-10"
                    />
                    <Button type="submit" className="bg-primary text-primary-foreground shrink-0 h-10 px-4">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  {language === "hi" ? "बातचीत शुरू करने के लिए बाईं ओर से एक संपर्क चुनें।" : "Select a conversation from the left to start chatting."}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
