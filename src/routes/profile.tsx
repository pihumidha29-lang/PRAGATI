import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  UserRound,
  MapPin,
  IndianRupee,
  Wrench,
  Home,
  Briefcase,
  Target,
  TrendingUp,
  Edit2,
  Save,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Pragati" },
      {
        name: "description",
        content:
          "Your entrepreneur profile on Pragati — location, capital, skills, resources and readiness.",
      },
    ],
  }),
  component: ProfilePage,
});

export function ProfilePage() {
  const { profile, updateProfile, roadmapProgressPct, resetToDemoData, t, language } = usePragati();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: profile.name,
    ownerName: profile.ownerName,
    location: profile.location,
    category: profile.category,
    description: profile.description,
    availableCapital: profile.availableCapital,
    skills: profile.skills.join(", "),
    resources: profile.resources.join(", "),
    experience: profile.experience,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: form.name,
      ownerName: form.ownerName,
      location: form.location,
      category: form.category,
      description: form.description,
      availableCapital: Number(form.availableCapital) || 0,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      resources: form.resources.split(",").map((r) => r.trim()).filter(Boolean),
      experience: form.experience as any,
    });
    setIsEditing(false);
  };

  const calculatedReadiness = Math.round((profile.readinessScore + roadmapProgressPct) / 2);

  const cards = [
    { icon: MapPin, label: language === "hi" ? "स्थान" : "Location", value: profile.location, emoji: "📍" },
    {
      icon: IndianRupee,
      label: language === "hi" ? "उपलब्ध पूंजी" : "Available Capital",
      value: `₹${profile.availableCapital.toLocaleString("en-IN")}`,
      emoji: "💰",
    },
    { icon: Wrench, label: language === "hi" ? "कौशल" : "Skills", value: profile.skills.join(", "), emoji: "🧵" },
    { icon: Home, label: language === "hi" ? "उपलब्ध संसाधन" : "Existing Resources", value: profile.resources.join(", "), emoji: "🏠" },
    { icon: Briefcase, label: language === "hi" ? "अनुभव" : "Experience", value: profile.experience, emoji: "🌱" },
    { icon: Target, label: language === "hi" ? "व्यापार श्रेणी" : "Business Category", value: profile.category, emoji: "🎯" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
            <UserRound className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">
              {profile.ownerName} • {profile.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={resetToDemoData}
            className="text-xs rounded-full"
            title="Reset to sample demo data"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> {t("resetDemoData")}
          </Button>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold text-xs"
          >
            {isEditing ? t("cancel") : <><Edit2 className="mr-1.5 h-3.5 w-3.5" /> {t("editProfile")}</>}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold pb-2 border-b border-border">{language === "hi" ? "उद्यमी प्रोफाइल संपादित करें" : "Edit Entrepreneur Profile"}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "व्यापार का नाम" : "Business Name"}</Label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "मालिक / संस्थापक का नाम" : "Owner / Founder Name"}</Label>
              <Input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "स्थान / जिला" : "Location / District"}</Label>
              <Input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{language === "hi" ? "उपलब्ध पूंजी (₹)" : "Available Capital (₹)"}</Label>
              <Input
                type="number"
                value={form.availableCapital}
                onChange={(e) => setForm({ ...form, availableCapital: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{language === "hi" ? "व्यापार श्रेणी" : "Category / Industry"}</Label>
            <Input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{language === "hi" ? "कौशल (अल्पविराम से अलग करें)" : "Skills (comma separated)"}</Label>
            <Input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{language === "hi" ? "संसाधन व उपकरण" : "Resources & Equipment (comma separated)"}</Label>
            <Input
              type="text"
              value={form.resources}
              onChange={(e) => setForm({ ...form, resources: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{language === "hi" ? "व्यापार का संक्षिप्त विवरण" : "About / Description"}</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground font-bold">
              <Save className="mr-1.5 h-4 w-4" /> {t("saveChanges")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-4 w-4" />
                </span>
                <span aria-hidden className="text-xl">
                  {c.emoji}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {c.label}
              </p>
              <p className="font-semibold text-foreground text-sm">{c.value}</p>
            </div>
          ))}

          {/* Readiness */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-2 lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">{language === "hi" ? "उद्यमी तैयारी स्कोर (Readiness Score)" : "Entrepreneur Readiness Score"}</h2>
              </div>
              <span className="text-sm font-extrabold text-teal-deep">{calculatedReadiness}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-teal-mid transition-all duration-500"
                style={{ width: `${calculatedReadiness}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatedReadiness}% {language === "hi" ? "तैयार — उच्च श्रेणी की सरकारी सब्सिडी योजनाओं का लाभ लेने के लिए अपने रोडमैप के पड़ाव पूरे करें।" : "ready — Complete your Roadmap milestones to unlock higher tier government scheme subsidies."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
