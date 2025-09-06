import { type Review, type InsertReview } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  likeReview(id: string): Promise<Review | undefined>;
  unlikeReview(id: string): Promise<Review | undefined>;
  dislikeReview(id: string): Promise<Review | undefined>;
  undislikeReview(id: string): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
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
      },
      {
        username: "Jessica Williams",
        rating: 5,
        content: "Outstanding productivity app! The collaboration features work seamlessly with our team workflow. Love how it integrates with our existing tools and makes project management so much easier.",
        likes: 15,
        dislikes: 1,
        createdAt: new Date("2024-01-03")
      },
      {
        username: "Robert Garcia",
        rating: 2,
        content: "Had high hopes for this app but it's disappointing. The user interface is confusing and I encountered several bugs during my trial. Customer support was slow to respond. Not recommended.",
        likes: 1,
        dislikes: 8,
        createdAt: new Date("2023-12-28")
      },
      {
        username: "Lisa Anderson",
        rating: 4,
        content: "Good app with useful features for managing daily tasks. The notification system works well and helps keep me organized. Would like to see more customization options in future updates.",
        likes: 6,
        dislikes: 2,
        createdAt: new Date("2023-12-25")
      },
      {
        username: "James Wilson",
        rating: 5,
        content: "Excellent integration with Zoom! Makes our meetings much more productive. The screen sharing capabilities are top-notch and the app rarely has any technical issues. Highly recommended for remote teams.",
        likes: 11,
        dislikes: 0,
        createdAt: new Date("2023-12-22")
      },
      {
        username: "Maria Santos",
        rating: 3,
        content: "Decent app but nothing special. It does what it promises but lacks innovation. The design feels outdated and some features are hard to find. It works fine for basic needs.",
        likes: 3,
        dislikes: 4,
        createdAt: new Date("2023-12-20")
      },
      {
        username: "Kevin Liu",
        rating: 4,
        content: "Really impressed with the functionality! The app handles large files well and the sync feature works perfectly across devices. Only wish the mobile version had all the desktop features.",
        likes: 9,
        dislikes: 1,
        createdAt: new Date("2023-12-18")
      },
      {
        username: "Rachel Green",
        rating: 5,
        content: "Perfect for our business needs! The analytics dashboard provides excellent insights and the reporting features save us hours of work each week. Worth every penny!",
        likes: 13,
        dislikes: 0,
        createdAt: new Date("2023-12-15")
      },
      {
        username: "Tom Brown",
        rating: 1,
        content: "Terrible experience. The app crashed multiple times during important presentations. Lost data and caused embarrassment in client meetings. Would not recommend to anyone.",
        likes: 0,
        dislikes: 12,
        createdAt: new Date("2023-12-12")
      },
      {
        username: "Amanda Davis",
        rating: 4,
        content: "Very helpful for organizing projects and tracking progress. The team collaboration features are well-designed. The only downside is that it can be resource-heavy on older computers.",
        likes: 8,
        dislikes: 2,
        createdAt: new Date("2023-12-10")
      },
      {
        username: "Chris Taylor",
        rating: 5,
        content: "Game changer for our workflow! The automation features have saved our team countless hours. Great customer support and regular updates with new features. Couldn't be happier!",
        likes: 16,
        dislikes: 0,
        createdAt: new Date("2023-12-08")
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

  async unlikeReview(id: string): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (review && review.likes > 0) {
      const updatedReview = { ...review, likes: review.likes - 1 };
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

  async undislikeReview(id: string): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (review && review.dislikes > 0) {
      const updatedReview = { ...review, dislikes: review.dislikes - 1 };
      this.reviews.set(id, updatedReview);
      return updatedReview;
    }
    return undefined;
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.reviews.delete(id);
  }
}

export const storage = new MemStorage();
