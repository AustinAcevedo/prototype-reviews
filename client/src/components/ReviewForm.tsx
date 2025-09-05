import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertReviewSchema } from "@shared/schema";
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

const profanityWords = ["damn", "shit", "fuck", "stupid", "hate", "terrible", "awful", "horrible", "sucks"];

export default function ReviewForm() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasProfanity, setHasProfanity] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      rating: 0,
      content: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      handleCancel();
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

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
      <h3 className="text-xl font-semibold mb-4" data-testid="review-form-title">
        Submit a Review
      </h3>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" data-testid="username-label">
            Your Name
          </label>
          <input
            {...form.register("username")}
            placeholder="Enter your name"
            className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            data-testid="input-username"
          />
          {form.formState.errors.username && (
            <p className="text-destructive text-sm mt-1" data-testid="error-username">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" data-testid="rating-label">
            Your Rating
          </label>
          <StarRating
            rating={selectedRating}
            hoveredRating={hoveredRating}
            onRatingChange={handleRatingChange}
            onHover={setHoveredRating}
            onHoverLeave={() => setHoveredRating(0)}
            size="lg"
          />
          {form.formState.errors.rating && (
            <p className="text-destructive text-sm mt-1" data-testid="error-rating">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" data-testid="content-label">
            Your Review
          </label>
          <Textarea
            {...form.register("content")}
            placeholder="Type your review here..."
            rows={4}
            className="resize-none"
            data-testid="textarea-review"
          />
          {hasProfanity && (
            <p className="text-destructive text-sm mt-2" data-testid="error-profanity">
              Please remove inappropriate language from your review.
            </p>
          )}
          {form.formState.errors.content && !hasProfanity && (
            <p className="text-destructive text-sm mt-1" data-testid="error-content">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            data-testid="button-submit-review"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            data-testid="button-cancel-review"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
