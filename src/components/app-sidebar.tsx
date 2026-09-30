import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
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
  Store,
  Users2,
  BarChart3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePragati } from "@/hooks/use-pragati";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { lowStockProducts, unreadMessagesCount, t, language } = usePragati();
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });
  const isActive = (path: string) => currentPath === path;

  const discoverItems = [
    { title: t("home"), url: "/", icon: Home },
    { title: t("startBusiness"), url: "/start-a-business", icon: Rocket },
    { title: t("localOpportunities"), url: "/local-opportunities", icon: MapPin },
    { title: t("businessIdeas"), url: "/business-ideas", icon: Lightbulb },
    { title: t("aiAssistant"), url: "/ai-assistant", icon: MessageCircle },
  ];

  const myBusinessItems = [
    { title: t("myBusinessAndKhata"), url: "/my-business", icon: Store },
    { title: t("network"), url: "/network", icon: Users2 },
    { title: t("reports"), url: "/reports", icon: BarChart3 },
  ];

  const planItems = [
    { title: t("businessSimulator"), url: "/business-simulator", icon: LineChart },
    { title: t("finance"), url: "/finance", icon: Wallet },
    { title: t("loansSchemes"), url: "/loans-schemes", icon: Landmark },
    { title: t("myBusinessPlan"), url: "/my-business-plan", icon: ClipboardList },
    { title: t("myRoadmap"), url: "/my-roadmap", icon: RouteIcon },
    { title: t("learn"), url: "/learn", icon: BookOpen },
  ];

  const renderGroup = (label: string, items: typeof discoverItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link
                  to={item.url}
                  className="flex items-center justify-between gap-2"
                  activeOptions={{ exact: true }}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                  {!collapsed && item.url === "/my-business" && lowStockProducts.length > 0 && (
                    <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  )}
                  {!collapsed && item.url === "/network" && unreadMessagesCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-mid px-1 text-[10px] font-bold text-primary-foreground">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <img
            src="/pragati-logo.png"
            alt="Pragati logo"
            className="h-9 w-9 shrink-0 rounded-full object-cover bg-white shadow-xs"
          />
          {!collapsed && (
            <div className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-wide">
                {language === "hi" ? "प्रगति" : "PRAGATI"}
              </span>
              <span className="block text-[11px] text-sidebar-foreground/70">
                {t("tagline")}
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup(t("discover"), discoverItems)}
        {renderGroup(t("myBusiness"), myBusinessItems)}
        {renderGroup(t("planAndGrow"), planItems)}
      </SidebarContent>
    </Sidebar>
  );
}
