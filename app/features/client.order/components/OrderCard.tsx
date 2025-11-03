import type { Order, OrderType, OrderStatus } from "~/features/order";
import { getTraderBackgroundColor } from "~/features/client.chart/utils/trader-color";

interface OrderCardProps {
  order: Order & {
    traderName?: string | null;
  };
  allTraderIds?: string[];
}

/**
 * Format timestamp to readable date-time string
 */
function formatTimestamp(timestamp: number | null): string {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get order type display name
 */
function getOrderTypeDisplay(type: OrderType): string {
  const typeMap: Record<OrderType, string> = {
    LIMIT: "Limit",
    MARKET: "Market",
    STOP: "Stop Limit",
    STOP_MARKET: "Stop Market",
    TAKE_PROFIT: "Take Profit Limit",
    TAKE_PROFIT_MARKET: "Take Profit Market",
    TRAILING_STOP_MARKET: "Trailing Stop",
  };
  return typeMap[type] || type;
}

/**
 * Check if order is a conditional order (stop/take profit orders)
 */
function isConditionalOrder(type: OrderType): boolean {
  return (
    type === "STOP" ||
    type === "STOP_MARKET" ||
    type === "TAKE_PROFIT" ||
    type === "TAKE_PROFIT_MARKET" ||
    type === "TRAILING_STOP_MARKET"
  );
}

/**
 * Check if order is waiting (conditional order waiting to trigger)
 * Only NEW status conditional orders are considered as waiting
 */
function isOrderWaiting(type: OrderType, status: OrderStatus): boolean {
  return isConditionalOrder(type) && status === "NEW";
}

/**
 * Get order status display name
 */
function getOrderStatusDisplay(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    NEW: "New",
    PARTIALLY_FILLED: "Partial",
    FILLED: "Filled",
    CANCELED: "Canceled",
    REJECTED: "Rejected",
    EXPIRED: "Expired",
  };
  return statusMap[status] || status;
}

/**
 * Get order status color class
 */
function getOrderStatusColor(
  type: OrderType,
  status: OrderStatus
): string {
  if (status === "FILLED") {
    return "bg-green-500 text-white";
  }
  if (status === "PARTIALLY_FILLED") {
    return "bg-yellow-500 text-white";
  }
  if (isOrderWaiting(type, status)) {
    // Conditional order waiting to trigger - use orange to indicate waiting
    return "bg-orange-500 text-white";
  }
  if (status === "CANCELED" || status === "EXPIRED" || status === "REJECTED") {
    return "bg-gray-400 text-white";
  }
  // NEW status for non-conditional orders
  return "bg-blue-500 text-white";
}

/**
 * Get side display (BUY/SELL)
 */
function getSideDisplay(side: Order["side"]): string {
  return side;
}

/**
 * Get side color
 */
function getSideColor(side: Order["side"]): string {
  return side === "BUY" ? "text-green-600" : "text-red-600";
}

/**
 * Order card component
 * Displays:
 * 1. Trader name (small)
 * 2. Symbol
 * 3. Order type
 * 4. Order status (filled/waiting, conditional orders have special styling when waiting)
 * 5. Side (BUY/SELL)
 * 6. Price
 * 7. Quantity
 * 8. Time
 */
export function OrderCard({ order, allTraderIds }: OrderCardProps) {
  const traderBgColor =
    order.traderId && order.traderName
      ? getTraderBackgroundColor(
          order.traderId,
          allTraderIds,
          order.traderName,
          "",
          1
        )
      : undefined;

  const isWaiting = isOrderWaiting(order.type, order.status);
  const orderTypeDisplay = getOrderTypeDisplay(order.type);
  const orderStatusDisplay = getOrderStatusDisplay(order.status);
  const sideDisplay = getSideDisplay(order.side);

  return (
    <div
      className={`p-3 bg-white border-b border-black last:border-b-0 ${
        isWaiting ? "bg-orange-50" : ""
      }`}
    >
      {/* Compact header row: Trader + Symbol */}
      <div className="flex items-center gap-2 mb-2">
        {/* Trader name - small */}
        {order.traderName && (
          <span
            className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
            style={{
              backgroundColor: traderBgColor,
            }}
          >
            {order.traderName}
          </span>
        )}

        {/* Symbol - prominent */}
        <span className="font-bold text-xs text-black flex-1">
          {order.symbol}
        </span>

        {/* Side badge - BUY/SELL */}
        <span
          className={`px-1.5 py-0.5 text-[10px] font-bold ${getSideColor(order.side)}`}
        >
          {sideDisplay}
        </span>
      </div>

      {/* Info grid - compact 2 column layout */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
        {/* Order Type */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Type</span>
          <span className="font-semibold text-black">{orderTypeDisplay}</span>
        </div>

        {/* Order Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${getOrderStatusColor(order.type, order.status)}`}
          >
            {orderStatusDisplay}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Price</span>
          <span className="font-semibold text-black">
            {parseFloat(order.price) === 0
              ? "Market"
              : parseFloat(order.price).toLocaleString()}
          </span>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Qty</span>
          <span className="font-semibold text-black">{order.origQty}</span>
        </div>

        {/* Time - full width */}
        <div className="col-span-2 flex items-center justify-between pt-1 border-t border-gray-200">
          <span className="text-gray-500">Time</span>
          <span className="font-semibold text-black">
            {formatTimestamp(order.time)}
          </span>
        </div>
      </div>
    </div>
  );
}
