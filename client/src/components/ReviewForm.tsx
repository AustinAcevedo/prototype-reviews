import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, MoreHorizontal } from "lucide-react";
import { insertReviewSchema, type Review } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertReviewSchema.extend({
  rating: z.number().min(1, "Please select a rating"),
  content: z.string().min(10, "Review must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

const profanityWords = [
  "damn", "shit", "fuck", "stupid", "hate", "terrible", "awful", "horrible", "sucks",
  "ass", "asshole", "bitch", "bastard", "hell", "crap", "piss", "dick", "cock", 
  "pussy", "slut", "whore", "faggot", "retard", "idiot", "moron", "dumbass"
];

export default function ReviewForm() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasProfanity, setHasProfanity] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<Review | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "Anonymous",
      rating: 0,
      content: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/reviews", data),
    onSuccess: (newReview: Review) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setSubmittedReview(newReview);
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const checkProfanity = (text: string) => {
    const lowerText = text.toLowerCase();
    return profanityWords.some((word) => lowerText.includes(word));
  };

  const watchedContent = form.watch("content");

  useEffect(() => {
    const hasProfanityNow = checkProfanity(watchedContent || "");
    setHasProfanity(hasProfanityNow);
  }, [watchedContent]);

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  const handleCancel = () => {
    form.reset();
    setSelectedRating(0);
    setHoveredRating(0);
    setHasProfanity(false);
  };

  const onSubmit = (data: FormData) => {
    if (!hasProfanity) {
      createReviewMutation.mutate(data);
    }
  };

  const isSubmitDisabled = 
    !form.watch("content")?.trim() || 
    selectedRating === 0 || 
    hasProfanity || 
    createReviewMutation.isPending;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // If user has submitted a review, show the submitted review card instead
  if (submittedReview) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6" data-testid="submitted-review-card">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900" data-testid="your-review-title">
            Your review
          </h3>
          <button className="text-gray-400 hover:text-gray-600" data-testid="button-review-menu">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= submittedReview.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300"
              }`}
              data-testid={`submitted-star-${star}`}
            />
          ))}
        </div>
        
        <p className="text-gray-700 mb-4" data-testid="submitted-review-content">
          {submittedReview.content}
        </p>
        
        <p className="text-sm text-gray-500" data-testid="submitted-review-date">
          Posted {formatDate(submittedReview.createdAt)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="review-form-title">
        Submit a review
      </h3>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition-colors duration-150 ${
                  star <= (hoveredRating || selectedRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-transparent text-gray-300 stroke-2"
                }`}
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                data-testid={`star-${star}`}
              />
            ))}
          </div>
          {form.formState.errors.rating && (
            <p className="text-red-500 text-sm mb-2" data-testid="error-rating">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            {...form.register("content")}
            placeholder="Type your review here"
            rows={4}
            className="resize-none w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            data-testid="textarea-review"
          />
          {hasProfanity && (
            <p className="text-red-500 text-sm mt-2" data-testid="error-profanity">
              Please remove inappropriate language from your review.
            </p>
          )}
          {form.formState.errors.content && !hasProfanity && (
            <p className="text-red-500 text-sm mt-2" data-testid="error-content">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-blue-600 text-sm hover:underline"
            data-testid="link-content-guidelines"
          >
            Content guidelines
          </button>
          
          <div className="flex gap-3 ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              data-testid="button-cancel-review"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className={`px-6 py-2 rounded-lg font-medium ${
                isSubmitDisabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              data-testid="button-submit-review"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
