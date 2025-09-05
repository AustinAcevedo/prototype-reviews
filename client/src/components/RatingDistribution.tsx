import type { RatingDistribution as RatingDistributionType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface RatingDistributionProps {
  distribution: RatingDistributionType[];
  onRatingClick: (rating: string) => void;
}

export default function RatingDistribution({
  distribution,
  onRatingClick,
}: RatingDistributionProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4" data-testid="rating-distribution-title">
        Rating Distribution
      </h3>
      <div className="space-y-3">
        {distribution.map(({ rating, count, percentage }) => (
          <div
            key={rating}
            className="flex items-center gap-3 progress-bar cursor-pointer rounded-lg p-2 hover:bg-accent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => onRatingClick(rating.toString())}
            data-testid={`rating-bar-${rating}`}
          >
            <span className="text-sm font-medium w-8" data-testid={`rating-label-${rating}`}>
              {rating} ★
            </span>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
                data-testid={`rating-progress-${rating}`}
              />
            </div>
            <span className="text-sm text-muted-foreground w-8" data-testid={`rating-count-${rating}`}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
