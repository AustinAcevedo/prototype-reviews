import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Star, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Review, RatingDistribution } from "@shared/schema";
import StarRating from "@/components/StarRating";
import RatingDistribution from "@/components/RatingDistribution";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import ReviewFilters from "@/components/ReviewFilters";

export default function Marketplace() {
  const queryClient = useQueryClient();
  
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");

  // Calculate overall rating and distribution
  const totalReviews = reviews.length;
  const overallRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const ratingDistribution: RatingDistribution[] = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    return {
      rating,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
    };
  });

  // Filter and sort reviews
  useEffect(() => {
    let filtered = [...reviews];

    // Apply rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortFilter === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortFilter === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortFilter === "most-liked") {
        return b.likes - a.likes;
      }
      return 0;
    });

    setFilteredReviews(filtered);
  }, [reviews, ratingFilter, sortFilter]);

  const likeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/reviews/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/reviews/${id}/dislike`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });

  const handleScrollToReviews = () => {
    document.getElementById("reviews-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRatingFilter = (rating: string) => {
    setRatingFilter(rating);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start gap-6">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&h=128" 
              alt="App icon" 
              className="w-24 h-24 rounded-2xl shadow-lg" 
            />
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2" data-testid="app-title">
                ShopMaster Pro
              </h1>
              <p className="text-muted-foreground mb-3" data-testid="app-description">
                The ultimate shopping companion app
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={overallRating} readonly size="lg" />
                  <span className="text-lg font-semibold" data-testid="overall-rating">
                    {overallRating.toFixed(1)}
                  </span>
                </div>
                
                <button 
                  onClick={handleScrollToReviews}
                  className="text-primary hover:underline cursor-pointer"
                  data-testid="link-reviews"
                >
                  {totalReviews} ratings
                </button>
                
                <span className="text-muted-foreground" data-testid="app-category">
                  Category: Shopping
                </span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  data-testid="button-install"
                >
                  Install
                </button>
                <button 
                  className="border border-border px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
                  data-testid="button-wishlist"
                >
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div id="reviews-section" className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-foreground mb-8" data-testid="reviews-heading">
          Reviews & Ratings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Overall Rating Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground mb-2" data-testid="text-overall-rating">
                {overallRating.toFixed(1)}
              </div>
              <StarRating rating={overallRating} readonly size="xl" />
              <p className="text-muted-foreground mt-2" data-testid="text-review-count">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-2">
            <RatingDistribution 
              distribution={ratingDistribution} 
              onRatingClick={handleRatingFilter}
            />
          </div>
        </div>

        {/* Submit Review Form */}
        <ReviewForm />

        {/* Filters */}
        <ReviewFilters
          sortFilter={sortFilter}
          ratingFilter={ratingFilter}
          onSortChange={setSortFilter}
          onRatingChange={setRatingFilter}
        />

        {/* Reviews List */}
        <div className="space-y-6" data-testid="reviews-list">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg" data-testid="text-no-reviews">
                No reviews match your current filters.
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={() => likeMutation.mutate(review.id)}
                onDislike={() => dislikeMutation.mutate(review.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
