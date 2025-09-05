# Overview

This is a modern full-stack web application built as a review system marketplace. The application allows users to view, create, and interact with product/service reviews through a clean, responsive interface. It features a comprehensive review management system with rating distributions, filtering capabilities, and social interaction features like likes/dislikes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with **React 18** using **TypeScript** and **Vite** as the build tool. The UI is constructed using **shadcn/ui** components with **Tailwind CSS** for styling, providing a modern and consistent design system.

**State Management**: Uses **TanStack Query (React Query)** for server state management, providing efficient data fetching, caching, and synchronization.

**Routing**: Implements **Wouter** as a lightweight client-side routing solution.

**Form Handling**: Leverages **React Hook Form** with **Zod** for form validation and type safety.

**Component Architecture**: Follows a modular component structure with reusable UI components, custom hooks, and separation of concerns between presentation and business logic.

## Backend Architecture

The server is built with **Express.js** using **TypeScript** and follows a RESTful API design pattern.

**API Structure**: 
- GET `/api/reviews` - Fetch all reviews
- POST `/api/reviews` - Create new review
- POST `/api/reviews/:id/like` - Like a review
- POST `/api/reviews/:id/dislike` - Dislike a review

**Data Storage**: Currently uses an in-memory storage implementation with seeded mock data, designed with an interface pattern that allows easy migration to persistent database solutions.

**Validation**: Uses **Zod** schemas shared between client and server for consistent data validation.

## Database Schema Design

The application uses **Drizzle ORM** with **PostgreSQL** dialect for database operations. The schema defines a reviews table with the following structure:

- Primary key with UUID generation
- User identification, rating (1-5), and content fields
- Social interaction counters (likes/dislikes)
- Timestamp tracking for creation dates

The schema is designed to be type-safe and includes validation rules ensuring data integrity.

## Development Workflow

**Build System**: Vite handles client-side bundling while esbuild compiles the server for production.

**Hot Reload**: Development environment supports hot module replacement for rapid iteration.

**Type Safety**: Full TypeScript coverage across both client and server with shared type definitions.

## UI/UX Design Decisions

**Design System**: Uses a neutral color scheme with CSS custom properties for theming support.

**Responsive Design**: Mobile-first approach with Tailwind's responsive utilities.

**Accessibility**: Implements Radix UI primitives ensuring ARIA compliance and keyboard navigation support.

**User Experience**: Features interactive elements like hover effects, loading states, and toast notifications for user feedback.

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL-compatible serverless database (configured via `@neondatabase/serverless`)
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries

## UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library built on top of Radix UI
- **Tailwind CSS**: Utility-first CSS framework for styling

## State Management & Data Fetching
- **TanStack Query**: Server state management and data synchronization
- **React Hook Form**: Form state management and validation

## Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Static type checking
- **Zod**: Runtime type validation and schema definition
- **esbuild**: Fast JavaScript bundler for server-side code

## Fonts & Assets
- **Google Fonts**: Inter, Architects Daughter, DM Sans, Fira Code, and Geist Mono font families

## Development Platform Integration
- **Replit**: Platform-specific plugins for development environment integration and error handling