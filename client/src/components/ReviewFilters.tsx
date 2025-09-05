import { ChevronDown } from "lucide-react";

interface ReviewFiltersProps {
  sortFilter: string;
  ratingFilter: string;
  onSortChange: (value: string) => void;
  onRatingChange: (value: string) => void;
}

export default function ReviewFilters({
  sortFilter,
  ratingFilter,
  onSortChange,
  onRatingChange,
}: ReviewFiltersProps) {
  const getSortLabel = (value: string) => {
    switch (value) {
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      case "most-liked":
        return "Most liked";
      default:
        return "Newest";
    }
  };

  const getRatingLabel = (value: string) => {
    if (value === "all") return "Any star rating";
    return `${value} star${value === "1" ? "" : "s"}`;
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Sort Filter */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          data-testid="select-sort-filter"
        >
          <span>{getSortLabel(sortFilter)}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {/* Dropdown content would go here - for now showing current selection */}
      </div>

      {/* Rating Filter */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          data-testid="select-rating-filter"
        >
          <span>{getRatingLabel(ratingFilter)}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {/* Dropdown content would go here - for now showing current selection */}
      </div>
    </div>
  );
}
