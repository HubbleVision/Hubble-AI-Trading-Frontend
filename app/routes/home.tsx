import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { EnvContext } from "~/context";
import CompetitorChart from "~/features/client.chart";
import Portfolio from "~/features/client.portfolio";
import { OrderList as OrdersList } from "~/features/client.order";
import ChatsList from "~/features/client.chats";
import Logo from "~/svg/logo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hubble Trading AI" },
    {
      name: "description",
      content: "Competitor trading performance analysis",
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const { cloudflare } = context.get(EnvContext);

  return { message: cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

type TabType = "portfolio" | "chats" | "orders";

export default function Home({ loaderData }: Route.ComponentProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("portfolio");

  // Set up global 10-minute auto refresh for all queries
  useEffect(() => {
    const interval = setInterval(
      () => {
        console.log("[Home] Auto-refreshing all queries (10 min interval)");
        queryClient.invalidateQueries();
      },
      10 * 60 * 1000
    ); // 10 minutes

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <>
      <header className="flex items-center h-12 px-4 lg:px-10 relative">
        <section className="flex items-center gap-2 cursor-pointer">
          <Logo />
          <b className="text-lg">Hubble</b>
        </section>
        <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="px-3 lg:px-6 relative">
            <b>LIVE</b>
          </div>
        </section>
      </header>
      {/* Desktop Layout */}
      <main className="hidden lg:flex h-[calc(100vh-48px)] flex-row border-black border-t-2">
        {/* Chart Section */}
        <div className="flex-1 border-r-2 border-black min-h-0">
          <CompetitorChart />
        </div>

        {/* Middle - Model Chats */}
        <div className="w-[350px] border-r-2 border-black overflow-hidden">
          <ChatsList limit={100} />
        </div>

        {/* Right - Portfolio + Orders */}
        <div className="w-[350px] flex flex-col">
          {/* Portfolio - Top 50% */}
          <div className="h-1/2 border-b-2 border-black overflow-hidden">
            <Portfolio />
          </div>

          {/* Orders - Bottom 50% */}
          <div className="h-1/2 overflow-hidden">
            <OrdersList />
          </div>
        </div>
      </main>

      {/* Mobile Layout - Entirely scrollable */}
      <main className="lg:hidden flex flex-col border-black border-t-2 overflow-y-auto h-[calc(100vh-48px)]">
        {/* Chart Section - Fixed height */}
        <div className="h-[60vh] border-b-2 border-black min-h-0 shrink-0">
          <CompetitorChart />
        </div>

        {/* Tab Navigation - Sticky */}
        <div className="sticky top-0 z-10 flex border-b-2 border-black bg-white">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              activeTab === "portfolio"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-x-2 border-black ${
              activeTab === "chats"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Model Chat
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              activeTab === "orders"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Orders
          </button>
        </div>

        {/* Tab Content - Natural height, scrolls with main */}
        <div>
          {activeTab === "portfolio" && (
            <div className="w-full [&>div]:!h-auto [&>div]:!min-h-0">
              <Portfolio />
            </div>
          )}
          {activeTab === "chats" && (
            <div className="w-full [&>div]:!h-auto [&>div]:!min-h-0 [&>div>div]:!h-auto">
              <ChatsList limit={100} />
            </div>
          )}
          {activeTab === "orders" && (
            <div className="w-full [&>div]:!h-auto [&>div]:!min-h-0">
              <OrdersList />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
