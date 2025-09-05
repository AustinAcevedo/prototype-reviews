import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  readonly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onRatingChange?: (rating: number) => void;
  hoveredRating?: number;
  onHover?: (rating: number) => void;
  onHoverLeave?: () => void;
}

export default function StarRating({
  rating,
  readonly = false,
  size = "md",
  onRatingChange,
  hoveredRating,
  onHover,
  onHoverLeave,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const displayRating = hoveredRating ?? rating;

  return (
    <div className="flex items-center gap-1" onMouseLeave={onHoverLeave}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            "transition-colors duration-150",
            star <= displayRating
              ? "fill-yellow-500 text-yellow-500"
              : "fill-gray-200 text-gray-200",
            !readonly && "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={readonly ? undefined : () => onRatingChange?.(star)}
          onMouseEnter={readonly ? undefined : () => onHover?.(star)}
          data-testid={`star-${star}`}
        />
      ))}
    </div>
  );
}
