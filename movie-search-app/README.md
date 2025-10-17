# Frontend: Movie Search App (Next.js 15 - App Router)

This service is the client-side application for searching and managing movies, built with **Next.js 15 (App Router)** and **Tailwind CSS**.

## Key Technologies & Design

### Next.js 15 & React 19
- **App Router**: Used for routing between the Search page (`/`) and Favorites page (`/favorites`).
- **Component Architecture**: Utilizes a mix of Server Components (for layout/navigation) and Client Components (for interactivity).

### State Management: TanStack Query v5
- **Server State Management**: Used to handle data fetching, caching, and synchronization with the backend API.
- **Optimistic Updates**: Implemented for a smoother user experience when adding/removing favorites.
- **Automatic Caching**: Data is automatically cached to reduce unnecessary API calls.

### Styling & Design
- **Tailwind CSS**: Utility-first framework used for rapid, mobile-first responsive design.
- **Mobile-First**: The UI is designed to be responsive, scaling from 1 column on mobile to up to 4 columns on large screens.
- **Accessibility**: Includes touch-friendly button sizes (44px minimum).

---

## Pages & Components

### Pages
- **Search Page (`/`)**: Features a debounced search bar and displays real-time results in a `MovieGrid`.
- **Favorites Page (`/favorites`)**: Displays the user's saved collection and allows removal.

### Components
- `Navigation`: App-wide header.
- `SearchBar`: Debounced input for efficient searching.
- `MovieCard`: Displays individual movie data with a favorite toggle.
- `MovieGrid`: Responsive container for movie cards.

---

## Setup

The frontend depends on the backend being available at the URL specified in `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`).

### Local Development (without Docker)
```bash
cd movie-search-app
npm install
# Ensure .env has NEXT_PUBLIC_API_URL set
npm run dev
# Access the app at http://localhost:3000