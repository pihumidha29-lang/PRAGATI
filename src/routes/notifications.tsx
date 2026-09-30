import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  MapPin,
  Landmark,
  BookOpen,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Pragati" },
      {
        name: "description",
        content:
          "Your Pragati alerts — low stock warnings, new enquiries, scheme updates and learning reminders.",
      },
    ],
  }),
  component: NotificationsPage,
});

export function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
    t,
    language,
  } = usePragati();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || n.unread
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return AlertTriangle;
      case "message":
      case "enquiry":
        return MessageSquare;
      case "scheme":
        return Landmark;
      case "learning":
        return BookOpen;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("notifications")}</h1>
            <p className="text-sm text-muted-foreground">
              {unreadNotificationsCount} {language === "hi" ? "अपठित सूचनाएं उपलब्ध हैं।" : "unread alert(s) on your business status."}
            </p>
          </div>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={markAllNotificationsAsRead}
            className="text-xs rounded-full font-bold self-start sm:self-auto"
          >
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> {t("markAllRead")}
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="text-xs h-8 rounded-lg"
        >
          {language === "hi" ? "सभी" : "All"} ({notifications.length})
        </Button>
        <Button
          size="sm"
          variant={filter === "unread" ? "default" : "outline"}
          onClick={() => setFilter("unread")}
          className="text-xs h-8 rounded-lg"
        >
          {language === "hi" ? "अपठित" : "Unread"} ({unreadNotificationsCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
            {language === "hi" ? "कोई नई सूचना नहीं है।" : "No new notifications found."}
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const IconComponent = getIcon(n.type);
            return (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`flex items-start gap-4 rounded-2xl border p-5 shadow-sm transition-all ${
                  n.unread
                    ? "bg-card border-teal-mid/50 shadow-xs"
                    : "bg-muted/30 border-border opacity-85"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    n.type === "low_stock"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-secondary text-teal-deep"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold text-sm text-foreground">{n.title}</h2>
                    {n.unread && (
                      <span className="h-2 w-2 rounded-full bg-teal-mid shrink-0" aria-label="unread" />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.body}</p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{n.timestamp}</span>
                    {n.linkUrl && (
                      <Link
                        to={n.linkUrl}
                        className="text-xs font-bold text-teal-deep hover:underline inline-flex items-center gap-1"
                      >
                        {n.linkText || (language === "hi" ? "विवरण देखें" : "View Details")} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
