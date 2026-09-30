import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Rocket,
  MapPin,
  Lightbulb,
  LineChart,
  Wallet,
  Landmark,
  BookOpen,
  ClipboardList,
  Route as RouteIcon,
  MessageCircle,
  Home,
  UserRound,
  Bell,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Pragati — What it does and how to use it" },
      {
        name: "description",
        content:
          "Learn what Pragati does, how to start using it, and how every feature works — from local opportunity discovery to loans, finance and learning.",
      },
      { property: "og:title", content: "About Pragati — What it does and how to use it" },
      {
        property: "og:description",
        content:
          "Learn what Pragati does, how to start using it, and how every feature works — from local opportunity discovery to loans, finance and learning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

type Feature = {
  icon: LucideIcon;
  title: string;
  what: string;
  steps: string[];
  url: string;
};

const features: Feature[] = [
  {
    icon: Home,
    title: "Home",
    what: "Your starting point. It answers: where am I in my entrepreneurship journey and what should I do next?",
    steps: [
      "Open Home to see quick actions for every major feature.",
      "Follow the 3-step strip to understand the journey: tell us about you → explore → plan & grow.",
      "Tap any card to jump straight into that feature.",
    ],
    url: "/",
  },
  {
    icon: Rocket,
    title: "Start a Business",
    what: "A guided flow that understands your situation — location, capital, skills and resources — and suggests businesses that genuinely fit you.",
    steps: [
      "Enter your village/town or allow location access.",
      "Enter how much capital you can invest (in ₹).",
      "Add your skills and resources you already have (land, shop, vehicle, tools).",
      "Review the suggested businesses with investment ranges and feasibility scores.",
    ],
    url: "/start-a-business",
  },
  {
    icon: MapPin,
    title: "Local Opportunities",
    what: "Shows what is happening around your location — nearby businesses, markets, suppliers and, most importantly, what is missing near you.",
    steps: [
      "Allow location access, or type your village, town, district or PIN code.",
      "See the map with your position and nearby businesses, markets and suppliers.",
      "Choose a search radius — 1 km, 5 km, 10 km, 25 km or custom.",
      "Check 'What's Missing Near Me?' to find gaps — for example, no affordable tiffin service within 5 km.",
      "Tap 'Explore This Opportunity' to see demand, competition and feasibility.",
    ],
    url: "/local-opportunities",
  },
  {
    icon: Lightbulb,
    title: "Business Ideas",
    what: "A catalogue of business ideas suited to rural and semi-urban India — dairy, tailoring, food processing, repair shops, beekeeping, local transport and more.",
    steps: [
      "Browse ideas or filter by investment range and category.",
      "Open an idea to see estimated investment in ₹, demand and competition.",
      "Check the Local Feasibility Score (like 88/100) for your area.",
      "Save the ideas you like to revisit later.",
    ],
    url: "/business-ideas",
  },
  {
    icon: LineChart,
    title: "Business Simulator",
    what: "A risk-free calculator to test your numbers on paper before spending real money. Estimate monthly profit, expenses and break-even point.",
    steps: [
      "Enter your initial capital/investment.",
      "Set your expected monthly sales or units produced.",
      "Enter your cost per unit and selling price.",
      "Add monthly fixed costs (rent, wages, electricity, transport).",
      "Instantly see your estimated monthly profit, profit margin and break-even sales target.",
    ],
    url: "/business-simulator",
  },
  {
    icon: Wallet,
    title: "Finance & EMI Planning",
    what: "Simple financial tools designed for first-time entrepreneurs — loan EMI calculators, working capital planning and funding gap estimation.",
    steps: [
      "Use the Loan EMI Calculator: enter amount, interest rate and tenure to see monthly instalments.",
      "Estimate your working capital: calculate how much cash buffer you need for raw materials and running expenses.",
      "Find your Funding Gap: see exactly how much external financing or loan you need beyond your own savings.",
    ],
    url: "/finance",
  },
  {
    icon: Landmark,
    title: "Loans & Government Schemes",
    what: "Curated directory of central and state government schemes — Mudra, PMEGP, Stand-Up India, PM Vishwakarma, NABARD and artisan subsidies.",
    steps: [
      "Filter schemes by category: Mudra (Shishu, Kishore, Tarun), PMEGP, MSME, Artisan, NABARD.",
      "Read simple eligibility criteria and subsidy percentages (up to 35%).",
      "Check the required document checklist before visiting a bank.",
      "Follow step-by-step application guidance.",
    ],
    url: "/loans-schemes",
  },
  {
    icon: BookOpen,
    title: "Learn",
    what: "Short lessons on business basics in simple language — with regional-language support (English, Hindi and more).",
    steps: [
      "Pick a topic — for example 'What is working capital?' or 'EMI — मासिक किस्त'.",
      "Learn with Indian examples and ₹ amounts.",
      "Track your completed topics under Learning Progress.",
    ],
    url: "/learn",
  },
  {
    icon: ClipboardList,
    title: "My Business Plan",
    what: "Everything about your chosen business in one place — capital needed, own contribution, loan requirement and milestones.",
    steps: [
      "Choose a business idea and save it to your plan.",
      "See required capital, your contribution and loan gap in ₹.",
      "Update the plan as your situation changes.",
    ],
    url: "/my-business-plan",
  },
  {
    icon: RouteIcon,
    title: "My Roadmap",
    what: "A step-by-step path from where you are today to running your business — registrations, licences, money and launch.",
    steps: [
      "Open your roadmap to see the next step highlighted.",
      "Complete steps like registration, licence and funding in order.",
      "Come back anytime — your progress is saved.",
    ],
    url: "/my-roadmap",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    what: "Ask anything about starting or running your business — in English or Hindi — and get answers based on your location, skills and capital.",
    steps: [
      "Type your question, for example 'Kya dairy business mere liye sahi hai?'",
      "Get an answer that uses your profile — not generic advice.",
      "Ask follow-up questions to go deeper, step by step.",
    ],
    url: "/ai-assistant",
  },
  {
    icon: UserRound,
    title: "Profile",
    what: "Your entrepreneur profile — location, capital, skills, resources, experience and readiness — shown as simple visual cards.",
    steps: [
      "Tap the profile icon at the top right of any page.",
      "Fill in your location, available capital, skills and resources.",
      "Keep it updated — every feature uses it to personalise suggestions.",
    ],
    url: "/profile",
  },
  {
    icon: Bell,
    title: "Notifications",
    what: "Alerts about new opportunities near you, scheme deadlines, loan updates and learning reminders.",
    steps: [
      "Tap the bell icon at the top right of any page.",
      "Read alerts and tap one to go to the related feature.",
    ],
    url: "/notifications",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* What is Pragati */}
      <section className="flex flex-col items-center gap-6 text-center">
        <img
          src="/pragati-logo.png"
          alt="Pragati logo"
          className="h-28 w-28 rounded-full object-cover ring-4 ring-secondary bg-white shadow-sm"
        />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            About Pragati
          </h1>
          <p className="mt-1 text-sm font-semibold tracking-wide text-primary">
            हर व्यापार की तरक्की — progress for every business
          </p>
        </div>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Pragati is a platform built for rural and small-town entrepreneurs in
          India. It helps you discover which business can succeed in your area,
          understand the money side in simple ₹ terms, find government loans and
          schemes you qualify for, and learn business basics step by step — all
          in language that is easy to understand.
        </p>
      </section>

      {/* How to start */}
      <section className="mt-12 rounded-3xl bg-teal-deep p-8 text-secondary">
        <h2 className="text-2xl font-bold">How to start using Pragati</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "1",
              t: "Set your location",
              d: "Allow location access, or type your village, town, district or PIN code. We use it only to understand your local market.",
            },
            {
              n: "2",
              t: "Complete your profile",
              d: "Add your available capital, skills and resources so suggestions match your real situation.",
            },
            {
              n: "3",
              t: "Explore opportunities",
              d: "Open Local Opportunities or Start a Business to see ideas with demand, competition and feasibility scores.",
            },
            {
              n: "4",
              t: "Plan & grow",
              d: "Use Finance, Loans & Schemes, My Business Plan and My Roadmap to move from idea to launch.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl bg-sidebar-accent p-5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-teal-deep">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-secondary/80">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature guide */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Every feature, explained</h2>
        <p className="mt-2 text-muted-foreground">
          What each feature does and exactly how to use it. You can open any of
          these from the menu on the left.
        </p>
        <div className="mt-6 space-y-4">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <Link
                  to={f.url}
                  className="ml-auto shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground transition-colors hover:bg-mint"
                >
                  Open
                </Link>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.what}
              </p>
              <div className="mt-4 rounded-xl bg-muted p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  How to use it
                </p>
                <ol className="mt-2 space-y-2">
                  {f.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-mid text-[10px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Privacy note */}
      <section className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold">Your privacy matters</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pragati never collects your precise location without permission. You
          can stop location sharing anytime, and your exact location is never
          shown to other users. Only the minimum information needed for a
          feature is stored.
        </p>
      </section>
    </div>
  );
}
