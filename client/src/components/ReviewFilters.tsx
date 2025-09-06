import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
      if (ratingRef.current && !ratingRef.current.contains(event.target as Node)) {
        setShowRatingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "most-liked", label: "Most liked" },
  ];

  const ratingOptions = [
    { value: "all", label: "Any star rating" },
    { value: "5", label: "5 stars" },
    { value: "4", label: "4 stars" },
    { value: "3", label: "3 stars" },
    { value: "2", label: "2 stars" },
    { value: "1", label: "1 star" },
  ];

  const handleSortSelect = (value: string) => {
    onSortChange(value);
    setShowSortDropdown(false);
  };

  const handleRatingSelect = (value: string) => {
    onRatingChange(value);
    setShowRatingDropdown(false);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Sort Filter */}
      <div className="relative" ref={sortRef}>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          data-testid="select-sort-filter"
        >
          <span>{getSortLabel(sortFilter)}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showSortDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleSortSelect(option.value)}
                data-testid={`sort-${option.value}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="relative" ref={ratingRef}>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setShowRatingDropdown(!showRatingDropdown)}
          data-testid="select-rating-filter"
        >
          <span>{getRatingLabel(ratingFilter)}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showRatingDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showRatingDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleRatingSelect(option.value)}
                data-testid={`rating-${option.value}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
