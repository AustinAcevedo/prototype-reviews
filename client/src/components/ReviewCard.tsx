import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import type { Review } from "@shared/schema";
import StarRating from "./StarRating";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  onLike: () => void;
  onDislike: () => void;
}

export default function ReviewCard({ review, onLike, onDislike }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      onLike();
      setIsLiked(true);
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (!isDisliked) {
      onDislike();
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="review-card bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
          {getInitials(review.username)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold" data-testid={`reviewer-name-${review.id}`}>
              {review.username}
            </h4>
            <StarRating rating={review.rating} readonly size="sm" />
            <span className="text-sm text-muted-foreground" data-testid={`review-date-${review.id}`}>
              {formatDate(review.createdAt)}
            </span>
          </div>
          <p className="text-foreground mb-3" data-testid={`review-content-${review.id}`}>
            {review.content}
          </p>
          <div className="flex items-center gap-4">
            <button
              className={cn(
                "flex items-center gap-2 transition-colors",
                isLiked
                  ? "text-blue-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleLike}
              data-testid={`button-like-${review.id}`}
            >
              <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span data-testid={`likes-count-${review.id}`}>
                {review.likes + (isLiked ? 1 : 0)}
              </span>
            </button>
            <button
              className={cn(
                "flex items-center gap-2 transition-colors",
                isDisliked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleDislike}
              data-testid={`button-dislike-${review.id}`}
            >
              <ThumbsDown className={cn("w-4 h-4", isDisliked && "fill-current")} />
              <span data-testid={`dislikes-count-${review.id}`}>
                {review.dislikes + (isDisliked ? 1 : 0)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
