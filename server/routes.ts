import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Create new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid review data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });

  // Like a review
  app.post("/api/reviews/:id/like", async (req, res) => {
    try {
      const review = await storage.likeReview(req.params.id);
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to like review" });
    }
  });

  // Dislike a review
  app.post("/api/reviews/:id/dislike", async (req, res) => {
    try {
      const review = await storage.dislikeReview(req.params.id);
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to dislike review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
