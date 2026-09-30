import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Rocket,
  MapPin,
  IndianRupee,
  Wrench,
  Home,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { usePragati } from "@/hooks/use-pragati";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/start-a-business")({
  head: () => ({
    meta: [
      { title: "Start a Business — Pragati" },
      {
        name: "description",
        content:
          "Get personalized business ideas matched to your location, available capital, skills and resources.",
      },
    ],
  }),
  component: StartABusinessPage,
});

export function StartABusinessPage() {
  const { businessIdeas, profile, updateProfile, language, t } = usePragati();

  const [step, setStep] = useState<number>(1);
  const [location, setLocation] = useState<string>(profile.location);
  const [capital, setCapital] = useState<number>(profile.availableCapital);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile.skills);
  const [selectedResources, setSelectedResources] = useState<string[]>(profile.resources);

  const availableSkillsList =
    language === "hi"
      ? [
          "सिलाई व दर्जी कार्य",
          "खाद्य प्रसंस्करण व कुकिंग",
          "ब्लॉक प्रिंटिंग",
          "प्राकृतिक रंगाई (डाईंग)",
          "बढ़ईगीरी व काष्ठ शिल्प",
          "मोबाइल व बिजली मरम्मत",
          "ब्यूटी व वेलनेस",
          "ड्राइविंग व ट्रांसपोर्ट",
          "दुकानदारी व खुदरा बिक्री",
        ]
      : [
          "Tailoring / Stitching",
          "Cooking / Food Processing",
          "Block Printing",
          "Natural Dyeing",
          "Carpentry / Wood Craft",
          "Mobile & Electric Repair",
          "Beauty / Wellness",
          "Driving / Logistics",
          "Retail & Sales",
        ];

  const availableResourcesList =
    language === "hi"
      ? [
          "छोटी दुकान / वर्कशॉप की जगह",
          "सिलाई मशीन",
          "दोपहिया / वाहन",
          "कृषि भूमि",
          "स्मार्टफोन व इंटरनेट",
          "गोदाम / कमरा",
        ]
      : [
          "Small shop / workshop space",
          "Sewing machine",
          "Two-wheeler / vehicle",
          "Agricultural land",
          "Smartphone & Internet",
          "Storage room",
        ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleResource = (res: string) => {
    setSelectedResources((prev) =>
      prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res]
    );
  };

  const handleFinishWizard = () => {
    updateProfile({
      location,
      availableCapital: capital,
      skills: selectedSkills,
      resources: selectedResources,
    });
    setStep(4);
  };

  // Rank ideas based on match
  const matchedIdeas = businessIdeas
    .map((idea) => {
      let score = idea.feasibilityScore;
      if (capital >= idea.investmentMin && capital <= idea.investmentMax * 1.5) score += 5;
      if (selectedSkills.some((s) => idea.requiredSkills.some((rs) => rs.toLowerCase().includes(s.toLowerCase().split(" ")[0])))) {
        score += 8;
      }
      return { ...idea, calculatedScore: Math.min(98, score) };
    })
    .sort((a, b) => b.calculatedScore - a.calculatedScore);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-deep text-secondary">
          <Rocket className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("startBusiness")}</h1>
          <p className="text-sm text-muted-foreground">
            {language === "hi"
              ? "अपनी लोकेशन, पूंजी, कौशल और साधन बताएं — हम आपके लिए सबसे उपयुक्त व्यापार विचार खोजेंगे।"
              : "Tell us your location, capital, skills, and resources — we'll match the best business opportunities for you."}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, title: language === "hi" ? "स्थान" : "Location" },
          { num: 2, title: language === "hi" ? "शुरुआती पूंजी" : "Capital" },
          { num: 3, title: language === "hi" ? "कौशल व साधन" : "Skills & Assets" },
          { num: 4, title: language === "hi" ? "सर्वोत्तम मैच" : "Best Matches" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3 rounded-xl text-left border transition-all ${
              step === s.num
                ? "border-teal-mid bg-secondary text-teal-deep font-bold"
                : step > s.num
                ? "border-border bg-card text-foreground"
                : "border-border/60 bg-muted/40 text-muted-foreground"
            }`}
          >
            <span className="text-xs opacity-70">Step {s.num}</span>
            <p className="text-xs sm:text-sm font-semibold truncate">{s.title}</p>
          </button>
        ))}
      </div>

      {/* Step 1: Location */}
      {step === 1 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">
              {language === "hi" ? "आपका गांव / कस्बा / शहर" : "Your Location"}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {language === "hi"
              ? "हम आपकी लोकेशन के आधार पर स्थानीय मांग, कच्चे माल के सप्लायर और बाजार का विश्लेषण करते हैं।"
              : "We use your location to analyze local demand, raw material suppliers, and town market size."}
          </p>
          <div className="space-y-2 max-w-md pt-2">
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sanganer, Jaipur, Rajasthan"
              className="h-11"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setStep(2)} className="bg-primary text-primary-foreground font-bold">
              {language === "hi" ? "आगे: उपलब्ध पूंजी" : "Next: Available Capital"} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Capital */}
      {step === 2 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-teal-deep" />
            <h2 className="text-lg font-bold">
              {language === "hi" ? "आपके पास कितनी शुरुआती पूंजी है?" : "How much starting capital do you have?"}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === "hi"
              ? "वह राशि दर्ज करें जो आप अपनी बचत या पारिवारिक सहयोग से निवेश कर सकते हैं।"
              : "Enter the amount you can invest from your own savings or family support."}
          </p>
          <div className="space-y-4 max-w-md pt-2">
            <Input
              type="number"
              value={capital}
              onChange={(e) => setCapital(parseInt(e.target.value) || 0)}
              className="h-11 text-base font-bold"
            />
            <div className="flex flex-wrap gap-2">
              {[25000, 50000, 100000, 200000, 500000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCapital(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    capital === amt
                      ? "bg-teal-deep text-secondary border-teal-deep"
                      : "bg-muted text-foreground border-border"
                  }`}
                >
                  ₹{(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              {language === "hi" ? "पीछे" : "Back"}
            </Button>
            <Button onClick={() => setStep(3)} className="bg-primary text-primary-foreground font-bold">
              {language === "hi" ? "आगे: कौशल व साधन" : "Next: Skills & Resources"} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Skills & Resources */}
      {step === 3 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold">
                {language === "hi" ? "आपको कौन से काम / कौशल आते हैं?" : "What skills do you have?"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSkillsList.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      active
                        ? "bg-secondary text-teal-deep border-secondary font-bold shadow-xs"
                        : "bg-muted text-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-teal-deep" />
              <h2 className="text-base font-bold">
                {language === "hi" ? "आपके पास पहले से क्या साधन उपलब्ध हैं?" : "What resources do you already own?"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableResourcesList.map((res) => {
                const active = selectedResources.includes(res);
                return (
                  <button
                    key={res}
                    onClick={() => toggleResource(res)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      active
                        ? "bg-secondary text-teal-deep border-secondary font-bold shadow-xs"
                        : "bg-muted text-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {res}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-between border-t border-border">
            <Button variant="outline" onClick={() => setStep(2)}>
              {language === "hi" ? "पीछे" : "Back"}
            </Button>
            <Button onClick={handleFinishWizard} className="bg-teal-deep text-secondary hover:bg-teal-mid font-bold">
              {language === "hi" ? "अनुकूल व्यापार विचार देखें" : "Find Matched Businesses"} <Sparkles className="ml-1.5 h-4 w-4 text-mint" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Matches Output */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-teal-deep p-6 text-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-mint" />
                <h2 className="text-xl font-bold">
                  {language === "hi" ? "आपके लिए सर्वोत्तम व्यापार विचार" : "Top Businesses Matched for You"}
                </h2>
              </div>
              <p className="mt-1 text-xs text-secondary/80">
                {language === "hi"
                  ? `${location}, ₹${capital.toLocaleString("en-IN")} पूंजी और आपके चयनित कौशल के अनुसार मिलान।`
                  : `Matched against ${location}, ₹${capital.toLocaleString("en-IN")} capital, and your selected skills.`}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStep(1)}
              className="border-mint/50 text-secondary bg-transparent hover:bg-sidebar-accent text-xs"
            >
              {language === "hi" ? "बदलाव करें" : "Edit Inputs"}
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {matchedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 hover:border-teal-mid/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-foreground">{idea.title}</h3>
                      <p className="text-xs text-muted-foreground">{idea.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-extrabold text-teal-deep">
                        {idea.calculatedScore}/100 {language === "hi" ? "मैच" : "Match"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{idea.description}</p>

                  <div className="mt-4 rounded-xl bg-muted/60 p-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">{language === "hi" ? "निवेश सीमा:" : "Investment Range:"}</span>
                      <p className="font-bold text-foreground">
                        ₹{(idea.investmentMin / 1000).toFixed(0)}k - ₹{(idea.investmentMax / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{language === "hi" ? "स्थानीय मांग:" : "Local Demand:"}</span>
                      <p className="font-bold text-teal-deep">{idea.expectedDemand}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase">{language === "hi" ? "पहला महत्वपूर्ण कदम:" : "Key Launch Step:"}</p>
                    <p className="text-xs text-foreground flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-deep shrink-0 mt-0.5" />
                      <span>{idea.keySteps[0]}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <Link
                    to="/business-simulator"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-deep hover:underline"
                  >
                    {t("simulateBtn")} <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/my-business-plan"
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    {t("saveToPlan")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
