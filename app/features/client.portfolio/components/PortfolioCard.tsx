import type { FC } from "react";
import type { ComputedPortfolio } from "../hooks/use-trader-portfolios";

interface PortfolioCardProps {
  portfolio: ComputedPortfolio;
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Format number as currency (USD)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number with appropriate decimal places
 */
function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Portfolio card component displaying a single trader's portfolio
 */
export const PortfolioCard: FC<PortfolioCardProps> = ({
  portfolio,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
}) => {
  const { traderName, totalAssets, positions } = portfolio;

  return (
    <div className="border-black bg-white text-black">
      {/* Header */}
      <div className="border-b-2 border-black bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold tracking-wide">
              {traderName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              className="w-6 h-6 border-2 border-black bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Previous"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </button>
            <span className="text-xs text-black min-w-12 text-center font-medium">
              {currentIndex + 1}/{totalCount}
            </span>
            <button
              onClick={onNext}
              className="w-6 h-6 border-2 border-black bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Next"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Total Assets */}
      <div className="border-b-2 border-black bg-white px-4 py-3">
        <div className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">
          Total Assets
        </div>
        <div className="text-lg font-black text-black">
          {formatCurrency(totalAssets)}
        </div>
      </div>

      {/* Positions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-white">
              <th className="text-left py-2 px-3 text-xs font-black text-black uppercase tracking-wider">
                Symbol
              </th>
              <th className="text-right py-2 px-3 text-xs font-black text-black uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-right py-2 px-3 text-xs font-black text-black uppercase tracking-wider">
                Entry Price
              </th>
              <th className="text-right py-2 px-3 text-xs font-black text-black uppercase tracking-wider">
                Direction
              </th>
              <th className="text-right py-2 px-3 text-xs font-black text-black uppercase tracking-wider">
                Leverage
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => {
              const directionColor =
                position.direction === "long" ? "text-green-600" : "text-red-600";

              return (
                <tr
                  key={position.symbol}
                  className="border-black border-b-2 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <span className="text-sm font-bold">
                      {position.symbol}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-bold">
                    {formatNumber(position.quantity, 4)}
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-bold">
                    {formatCurrency(position.entryPrice)}
                  </td>
                  <td className={`py-3 px-3 text-right text-sm font-bold ${directionColor}`}>
                    {position.direction === "long" ? "LONG" : "SHORT"}
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-bold">
                    {formatNumber(position.leverage, 0)}x
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
