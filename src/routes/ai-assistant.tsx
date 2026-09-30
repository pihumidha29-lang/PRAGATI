import React, { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Sparkles, Send, Check, X, Bot, User, ArrowRight } from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "PRAGATI AI Assistant — हर व्यापार की तरक्की" },
      {
        name: "description",
        content:
          "AI business companion that understands your live sales, stock, expenses and suppliers.",
      },
    ],
  }),
  component: AIAssistantPage,
});

const quickPrompts = [
  "Mera business kaisa chal raha hai?",
  "Stock mein kya kam hai?",
  "Aaj ki 5 bags ki sale add karo",
  "Mujhe 50kg cotton chahiye",
  "Top customers kaun se hain?",
  "Mudra loan ke liye kya eligibility hai?",
];

export function AIAssistantPage() {
  const {
    aiMessages,
    sendAIMessage,
    confirmAIAction,
    cancelAIAction,
    profile,
    lowStockProducts,
    totalRevenue,
    netProfit,
    t,
    language,
  } = usePragati();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    t("aiChip1"),
    t("aiChip2"),
    t("aiChip3"),
    t("aiChip4"),
    t("aiChip5"),
    t("aiChip6"),
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendAIMessage(input.trim());
    setInput("");
  };

  const handlePromptClick = (prompt: string) => {
    sendAIMessage(prompt);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <Sparkles className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("aiAssistantTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("aiAssistantSubtitle")}
          </p>
        </div>
      </div>

      {/* Quick context pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground font-semibold">{t("aiLiveContext")}</span>
        <Badge variant="outline" className="bg-card">
          💼 {profile.name}
        </Badge>
        <Badge variant="outline" className="bg-card">
          💰 {language === "hi" ? "बिक्री" : "Sales"}: ₹{totalRevenue.toLocaleString("en-IN")}
        </Badge>
        <Badge variant="outline" className="bg-card">
          📈 {language === "hi" ? "मुनाफा" : "Profit"}: ₹{netProfit.toLocaleString("en-IN")}
        </Badge>
        {lowStockProducts.length > 0 && (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
            ⚠️ {lowStockProducts.length} {language === "hi" ? "कम स्टॉक वाले आइटम" : "low-stock items"}
          </Badge>
        )}
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm flex flex-col min-h-[520px] max-h-[620px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-teal-deep text-secondary"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted/70 text-foreground rounded-tl-none border border-border"
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Proposed Action Card */}
                {msg.proposedAction && (
                  <div className="mt-3 pt-3 border-t border-border/80 bg-card rounded-xl p-3 shadow-xs space-y-2 text-foreground">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-teal-deep">
                      <Sparkles className="h-3.5 w-3.5" /> {t("aiProposedAction")}
                    </div>
                    <p className="text-xs font-semibold">{msg.proposedAction.title}</p>

                    {msg.status === "pending_action" ? (
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => confirmAIAction(msg.id)}
                          className="text-xs h-7 bg-teal-deep text-secondary hover:bg-teal-mid rounded-md font-bold"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> {t("confirm")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelAIAction(msg.id)}
                          className="text-xs h-7 rounded-md"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> {t("cancel")}
                        </Button>
                      </div>
                    ) : msg.status === "action_confirmed" ? (
                      <Badge className="bg-mint/50 text-teal-deep text-[10px] font-bold">
                        {t("aiActionExecuted")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {t("aiActionCancelled")}
                      </Badge>
                    )}
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1.5 opacity-70 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-3 pb-2 flex flex-wrap gap-1.5 border-t border-border">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="text-[11px] font-medium bg-muted hover:bg-secondary hover:text-teal-deep px-2.5 py-1 rounded-full text-muted-foreground transition-colors border border-border"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="pt-2 flex gap-2">
          <Input
            type="text"
            placeholder={t("aiInputPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-11 text-xs sm:text-sm rounded-xl"
          />
          <Button
            type="submit"
            className="h-11 px-5 bg-teal-deep text-secondary hover:bg-teal-mid rounded-xl font-bold shrink-0"
          >
            <Send className="h-4 w-4 mr-1.5" /> {t("send")}
          </Button>
        </form>
      </div>
    </div>
  );
}
