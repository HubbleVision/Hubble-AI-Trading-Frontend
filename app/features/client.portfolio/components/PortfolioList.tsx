import type { FC } from "react";
import { useState } from "react";
import { useTraderPortfolios } from "../hooks/use-trader-portfolios";
import { PortfolioCard } from "./PortfolioCard";

/**
 * Portfolio list component displaying all trader portfolios with pagination
 */
export const PortfolioList: FC = () => {
  const { data: portfolios, isLoading, error } = useTraderPortfolios();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto border-black bg-white text-black">
        {/* Header skeleton */}
        <div className="border-b-2 border-black bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-6 h-6 border-2 border-gray-300 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Total Assets skeleton */}
        <div className="border-b-2 border-black bg-white px-4 py-3">
          <div className="h-3 w-20 bg-gray-300 rounded mb-2 animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-white">
                <th className="text-left py-2 px-3">
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-right py-2 px-3">
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-right py-2 px-3">
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-right py-2 px-3">
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="border-black border-b-2">
                  <td className="py-3 px-3">
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" style={{ animationDelay: `${idx * 0.1}s` }}></div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse ml-auto" style={{ animationDelay: `${idx * 0.1}s` }}></div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="h-4 w-16 bg-gray-300 rounded animate-pulse ml-auto" style={{ animationDelay: `${idx * 0.1}s` }}></div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse ml-auto" style={{ animationDelay: `${idx * 0.1}s` }}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="border border-black bg-white p-8 text-center">
          <div className="text-red-600 text-2xl mb-3">⚠️</div>
          <p className="text-red-600 font-black mb-2 text-sm">
            Failed to load portfolios
          </p>
          <p className="text-gray-700 text-xs font-medium">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="border border-black bg-white p-8 text-center">
          <div className="text-gray-800 text-3xl mb-3">📊</div>
          <p className="text-black font-black mb-2 text-sm">No portfolios found</p>
          <p className="text-gray-600 text-xs font-medium">
            There are no trader portfolios to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  const currentPortfolio = portfolios[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : portfolios.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < portfolios.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="mx-auto">
      <PortfolioCard
        portfolio={currentPortfolio}
        currentIndex={currentIndex}
        totalCount={portfolios.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};
