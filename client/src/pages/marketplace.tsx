import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Star, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Review, RatingDistribution as RatingDistributionType } from "@shared/schema";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  // Calculate overall rating and distribution
  const totalReviews = reviews.length;
  const overallRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const ratingDistribution: RatingDistributionType[] = [5, 4, 3, 2, 1].map(rating => {
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [reviews, ratingFilter, sortFilter]);

  const likeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/reviews/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/reviews/${id}/unlike`),
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

  const undislikeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/reviews/${id}/undislike`),
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
    setRatingFilter(rating === ratingFilter ? "all" : rating);
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
      {/* Zoom App Marketplace Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-blue-600">zoom</div>
                <span className="text-gray-600 font-medium">App Marketplace</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Apps"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="search-apps"
                  />
                  <div className="absolute left-3 top-2.5">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <button className="text-gray-700 hover:text-gray-900 font-medium" data-testid="develop-button">
                Develop
                <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button className="text-gray-700 hover:text-gray-900 font-medium" data-testid="manage-button">
                Manage
              </button>
              
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center" data-testid="user-avatar">
                <span className="text-sm font-medium text-gray-600">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        <h2 className="text-2xl font-semibold text-gray-900 mb-8" data-testid="reviews-heading">
          Reviews & ratings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Overall Rating */}
          <div className="flex flex-col items-start">
            <div className="mb-2">
              <p className="text-sm text-gray-600 font-medium mb-2">OVERALL RATING</p>
              <div className="text-5xl font-bold text-gray-900 mb-3" data-testid="text-overall-rating">
                {overallRating.toFixed(1)} <span className="text-lg text-gray-500 font-normal">out of 5</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= Math.round(overallRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                    data-testid={`overall-star-${star}`}
                  />
                ))}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="w-full">
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleRatingFilter(rating.toString())}
                    data-testid={`rating-bar-${rating}`}
                  >
                    <span className="text-sm text-gray-900 w-3" data-testid={`rating-label-${rating}`}>
                      {rating}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300 group-hover:bg-yellow-500"
                        style={{ width: `${percentage}%` }}
                        data-testid={`rating-progress-${rating}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Review Form */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <ReviewForm />
          </div>
        </div>


        {/* Reviews Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="reviews-section-title">
            Reviews
          </h3>
          
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
              paginatedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onLike={() => likeMutation.mutate(review.id)}
                  onUnlike={() => unlikeMutation.mutate(review.id)}
                  onDislike={() => dislikeMutation.mutate(review.id)}
                  onUndislike={() => undislikeMutation.mutate(review.id)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8" data-testid="pagination">
              {/* Previous button */}
              <button
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                data-testid="pagination-prev"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                
                return (
                  <button
                    key={pageNumber}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      isCurrentPage
                        ? "bg-blue-600 text-white"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                    data-testid={`pagination-${pageNumber}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next button */}
              <button
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                data-testid="pagination-next"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
