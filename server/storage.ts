import { type Review, type InsertReview } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  likeReview(id: string): Promise<Review | undefined>;
  dislikeReview(id: string): Promise<Review | undefined>;
}

export class MemStorage implements IStorage {
  private reviews: Map<string, Review>;

  constructor() {
    this.reviews = new Map();
    this.seedData();
  }

  private seedData() {
    const mockReviews: Omit<Review, 'id'>[] = [
      {
        username: "Sarah Johnson",
        rating: 5,
        content: "Absolutely love this app! The interface is intuitive and the shopping experience is seamless. The barcode scanner feature is incredibly useful when comparing prices in stores. Highly recommend!",
        likes: 8,
        dislikes: 0,
        createdAt: new Date("2024-01-15")
      },
      {
        username: "Mike Chen",
        rating: 4,
        content: "Great app overall! The wishlist feature is fantastic and the price tracking alerts have saved me money. Only minor issue is that it can be a bit slow to load sometimes, but still worth using.",
        likes: 5,
        dislikes: 1,
        createdAt: new Date("2024-01-12")
      },
      {
        username: "Emily Rodriguez",
        rating: 5,
        content: "This app has completely transformed my shopping experience! The personalized recommendations are spot-on, and I love how it organizes my shopping lists. The customer service integration is also excellent. Five stars!",
        likes: 12,
        dislikes: 0,
        createdAt: new Date("2024-01-10")
      },
      {
        username: "David Park",
        rating: 3,
        content: "The app is decent but has room for improvement. Some features work well, but the search function could be more accurate. Also, the app crashes occasionally on my device. It's usable but not exceptional.",
        likes: 2,
        dislikes: 3,
        createdAt: new Date("2024-01-08")
      },
      {
        username: "Alex Thompson",
        rating: 4,
        content: "Really solid shopping app with great features. The price comparison tool is my favorite feature - it's saved me hundreds of dollars! The interface could be a bit more modern, but functionality-wise it's excellent.",
        likes: 7,
        dislikes: 0,
        createdAt: new Date("2024-01-05")
      }
    ];

    mockReviews.forEach(review => {
      const id = randomUUID();
      this.reviews.set(id, { ...review, id });
    });
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      likes: 0,
      dislikes: 0,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async likeReview(id: string): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (review) {
      const updatedReview = { ...review, likes: review.likes + 1 };
      this.reviews.set(id, updatedReview);
      return updatedReview;
    }
    return undefined;
  }

  async dislikeReview(id: string): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (review) {
      const updatedReview = { ...review, dislikes: review.dislikes + 1 };
      this.reviews.set(id, updatedReview);
      return updatedReview;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
