import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        return "Most Liked";
      default:
        return "Newest";
    }
  };

  const getRatingLabel = (value: string) => {
    if (value === "all") return "Any star rating";
    return `${value} star${value === "1" ? "" : "s"}`;
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={sortFilter} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]" data-testid="select-sort-filter">
          <SelectValue>
            {getSortLabel(sortFilter)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest" data-testid="sort-newest">
            Newest
          </SelectItem>
          <SelectItem value="oldest" data-testid="sort-oldest">
            Oldest
          </SelectItem>
          <SelectItem value="most-liked" data-testid="sort-most-liked">
            Most Liked
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={ratingFilter} onValueChange={onRatingChange}>
        <SelectTrigger className="w-[180px]" data-testid="select-rating-filter">
          <SelectValue>
            {getRatingLabel(ratingFilter)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" data-testid="rating-all">
            Any star rating
          </SelectItem>
          <SelectItem value="5" data-testid="rating-5">
            5 stars
          </SelectItem>
          <SelectItem value="4" data-testid="rating-4">
            4 stars
          </SelectItem>
          <SelectItem value="3" data-testid="rating-3">
            3 stars
          </SelectItem>
          <SelectItem value="2" data-testid="rating-2">
            2 stars
          </SelectItem>
          <SelectItem value="1" data-testid="rating-1">
            1 star
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
