import { ThumbsUp, ThumbsDown, Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Review } from "@shared/schema";
import StarRating from "./StarRating";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  onLike: () => void;
  onUnlike: () => void;
  onDislike: () => void;
  onUndislike: () => void;
}

export default function ReviewCard({ review, onLike, onUnlike, onDislike, onUndislike }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      onUnlike();
    } else {
      setIsLiked(true);
      setIsDisliked(false);
      onLike();
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
      onUndislike();
    } else {
      setIsDisliked(true);
      setIsLiked(false);
      onDislike();
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
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
          {getInitials(review.username)}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900" data-testid={`reviewer-name-${review.id}`}>
                  {review.username}
                </h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                      data-testid={`review-star-${star}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500" data-testid={`review-date-${review.id}`}>
              Posted {formatDate(review.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 mb-3 leading-relaxed" data-testid={`review-content-${review.id}`}>
            {review.content}
          </p>
          <div className="flex items-center gap-4">
            <button
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
                isLiked
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={handleLike}
              data-testid={`button-like-${review.id}`}
            >
              <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span data-testid={`likes-count-${review.id}`}>
                {review.likes}
              </span>
            </button>
            <button
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
                isDisliked
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={handleDislike}
              data-testid={`button-dislike-${review.id}`}
            >
              <ThumbsDown className={cn("w-4 h-4", isDisliked && "fill-current")} />
              <span data-testid={`dislikes-count-${review.id}`}>
                {review.dislikes}
              </span>
            </button>
          </div>
          {/* Developer response section */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <button
              className="flex items-center gap-2 w-full text-left"
              onClick={() => setIsResponseExpanded(!isResponseExpanded)}
              data-testid={`developer-response-toggle-${review.id}`}
            >
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">D</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Developer response</span>
              <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isResponseExpanded && "rotate-180")} />
              <span className="text-xs text-gray-500 ml-auto">Replied {formatDate(review.createdAt)}</span>
            </button>
            {isResponseExpanded && (
              <p className="text-sm text-gray-600 leading-relaxed mt-2 pl-8">
                Thanks for the awesome feedback! We're thrilled to hear the JIRA app for Zoom is making your workflow smoother and keeping your team aligned. Our goal is to help teams stay productive without context switching, so it's great to know it's working for you. If you have any suggestions for new features or improvements, let us know — we're all ears!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
