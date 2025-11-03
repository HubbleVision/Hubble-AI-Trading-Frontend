import type { FC } from "react";
import { useMemo, useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Markdown } from "~/components/ui/markdown";
import {
  useLatestAnalysis,
  type AnalysisRecordWithTrader,
} from "~/features/analysis-team";
import { getTraderBackgroundColor } from "~/features/client.chart/utils/trader-color";

/**
 * Format timestamp to readable date string.
 */
function formatDate(timestamp: string | null | undefined): string {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ChatsListProps {
  limit?: number;
}

function formatTraderLabel(chat: AnalysisRecordWithTrader): string {
  // Prefer trader name, fallback to traderId if name is not available
  if (chat.traderName) return chat.traderName;
  const traderId = chat.traderId;
  if (traderId.length <= 10) return traderId;
  return `${traderId.slice(0, 4)}…${traderId.slice(-4)}`;
}

/**
 * Produce a short preview of the analysis content.
 */
function getChatPreview(chat: string, maxLines = 3, maxChars = 320) {
  const lines = chat
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let preview = lines.slice(0, maxLines).join("\n");

  if (preview.length > maxChars) {
    preview = `${preview.slice(0, maxChars - 3)}...`;
  } else if (lines.length > maxLines) {
    preview = `${preview}\n...`;
  }

  return preview || chat.slice(0, maxChars);
}

/**
 * Chats list component displaying analysis records grouped by recordId
 * with per-role cards and markdown drawer view.
 */
export const ChatsList: FC<ChatsListProps> = ({ limit = 100 }) => {
  const { data: chats, isLoading, error } = useLatestAnalysis({ limit });
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<AnalysisRecordWithTrader | null>(
    null
  );

  // Get unique traders from chats
  const availableTraders = useMemo(() => {
    if (!chats) return [];
    const traders = new Set(chats.map((chat) => chat.traderId));
    return Array.from(traders).sort();
  }, [chats]);

  // Filter chats by selected trader
  const filteredChats = useMemo(() => {
    if (!chats) return [];
    if (!selectedTrader) return chats;
    return chats.filter((chat) => chat.traderId === selectedTrader);
  }, [chats, selectedTrader]);

  // Group chats by recordId and sort by latest message time
  const groupedChats = useMemo(() => {
    if (!filteredChats || filteredChats.length === 0) return [];

    const groups = new Map<
      string,
      {
        key: string;
        recordId?: string | null;
        records: AnalysisRecordWithTrader[];
        latest: string;
        traderName: string;
      }
    >();

    filteredChats.forEach((chat) => {
      const key = chat.recordId ?? `__no-record-${chat.id}`;
      const existing = groups.get(key);

      if (existing) {
        existing.records.push(chat);
        if (
          new Date(chat.createdAt).getTime() >
          new Date(existing.latest).getTime()
        ) {
          existing.latest = chat.createdAt;
        }
      } else {
        groups.set(key, {
          key,
          recordId: chat.recordId,
          records: [chat],
          latest: chat.createdAt,
          traderName: chat.traderName ?? "",
        });
      }
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        records: group.records.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }))
      .sort(
        (a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime()
      );
  }, [filteredChats]);

  const drawerOpen = Boolean(activeChat);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-white">
        {/* Header with filter skeleton */}
        <div className="shrink-0 border-b-2 border-black bg-white px-3 py-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 w-16 border border-gray-300 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Scrollable grouped messages skeleton */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          <div className="divide-y-2 divide-black">
            {[...Array(4)].map((_, groupIdx) => (
              <section key={groupIdx} className="border-black">
                <div className="flex items-center justify-between border-b-2 border-black px-3 py-2 bg-gray-400">
                  <div
                    className="h-4 w-32 bg-gray-500 rounded animate-pulse"
                    style={{ animationDelay: `${groupIdx * 0.1}s` }}
                  ></div>
                  <div
                    className="h-3 w-20 bg-gray-500 rounded animate-pulse"
                    style={{ animationDelay: `${groupIdx * 0.1}s` }}
                  ></div>
                </div>

                <div className="divide-y divide-black">
                  {[...Array(2)].map((_, chatIdx) => (
                    <div key={chatIdx} className="w-full bg-gray-50 p-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div
                          className="h-3 w-20 bg-gray-300 rounded animate-pulse"
                          style={{
                            animationDelay: `${(groupIdx * 2 + chatIdx) * 0.05}s`,
                          }}
                        ></div>
                        <div
                          className="h-3 w-16 bg-gray-300 rounded animate-pulse"
                          style={{
                            animationDelay: `${(groupIdx * 2 + chatIdx) * 0.05 + 0.05}s`,
                          }}
                        ></div>
                      </div>
                      <div className="space-y-1">
                        <div
                          className="h-3 w-full bg-gray-300 rounded animate-pulse"
                          style={{
                            animationDelay: `${(groupIdx * 2 + chatIdx) * 0.05 + 0.1}s`,
                          }}
                        ></div>
                        <div
                          className="h-3 w-4/5 bg-gray-300 rounded animate-pulse"
                          style={{
                            animationDelay: `${(groupIdx * 2 + chatIdx) * 0.05 + 0.15}s`,
                          }}
                        ></div>
                        <div
                          className="h-3 w-3/5 bg-gray-300 rounded animate-pulse"
                          style={{
                            animationDelay: `${(groupIdx * 2 + chatIdx) * 0.05 + 0.2}s`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-1 text-xs font-bold text-red-600">Failed to load</p>
          <p className="text-xs text-gray-700">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-1 text-xs font-bold text-black">No chats found</p>
          <p className="text-xs text-gray-600">No records to display</p>
        </div>
      </div>
    );
  }

  return (
    <Drawer
      direction="right"
      open={drawerOpen}
      onOpenChange={(open) => {
        if (!open) setActiveChat(null);
      }}
    >
      <div className="flex h-full flex-col bg-white">
        {/* Header with filter */}
        <div className="shrink-0 border-b-2 border-black bg-white px-3 py-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold">MODEL CHATS</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded border border-black px-2 py-1 text-xs font-semibold transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  {selectedTrader
                    ? chats?.find((c) => c.traderId === selectedTrader)
                      ? formatTraderLabel(
                          chats.find((c) => c.traderId === selectedTrader)!
                        )
                      : selectedTrader.slice(0, 10)
                    : "All"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-gray-500">
                  Filter by trader
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedTrader ?? "all"}
                  onValueChange={(value) => {
                    setSelectedTrader(value === "all" ? null : value);
                  }}
                >
                  <DropdownMenuRadioItem value="all" className="text-xs">
                    All
                  </DropdownMenuRadioItem>
                  {availableTraders.map((traderId) => {
                    const chat = chats?.find((c) => c.traderId === traderId);
                    return (
                      <DropdownMenuRadioItem
                        key={traderId}
                        value={traderId}
                        className="text-xs"
                      >
                        {chat ? formatTraderLabel(chat) : traderId.slice(0, 10)}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Scrollable grouped messages */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          {groupedChats.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-black">No messages</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {groupedChats.map((group, index) => {
                const bgColor = getTraderBackgroundColor(
                  group.records[0]?.traderId || "",
                  availableTraders,
                  group.traderName,
                  "",
                  1
                );
                const btnColor = getTraderBackgroundColor(
                  group.records[0]?.traderId || "",
                  availableTraders,
                  group.traderName,
                  "",
                  0.15
                );
                return (
                  <section key={group.key} className="border-black">
                    <div
                      className="flex items-center justify-between border-b-2 border-black px-3 py-2"
                      style={{
                        backgroundColor: bgColor,
                      }}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide text-white">
                        {group.traderName}
                      </span>
                      <span className="text-[10px] font-medium text-white">
                        {formatDate(group.latest)}
                      </span>
                    </div>

                    <div className="divide-y divide-black">
                      {group.records.map((chat, chatIndex) => (
                        <button
                          key={chat.id}
                          type="button"
                          onClick={() => setActiveChat(chat)}
                          className="w-full bg-white p-3 text-left hover:opacity-80 transition-colors cursor-pointer"
                          style={{
                            backgroundColor: btnColor,
                          }}
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <span className="text-xs font-bold uppercase text-black">
                              {chat.role}
                            </span>
                            <span className="text-[10px] text-gray-600">
                              {formatDate(chat.createdAt)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-xs leading-relaxed text-black">
                            {getChatPreview(chat.chat)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeChat && (
        <DrawerContent className="sm:max-w-2xl">
          <div className="flex h-full flex-col">
            <DrawerHeader>
              <div className="flex items-start justify-between gap-4">
                <DrawerTitle>
                  <span className="uppercase">{activeChat.role}</span>
                </DrawerTitle>
                <DrawerClose className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                  Close
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <Markdown className="pr-2">{activeChat.chat}</Markdown>
            </div>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
};
