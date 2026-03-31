<p align="center">
  <img src="public/logo.png" alt="Movie Explorer" width="200" />
</p>

# Movie Explorer

**<a href="https://movie-explorer-nick.vercel.app/" target="_blank">https://movie-explorer-nick.vercel.app/</a>**

### Web app where users can search movies, view details, and save favorites with a personal rating/comment

## Tech Stack

- **Framework:** Next.js (React/TypeScript)
- **Styling:** Tailwind CSS
- **Database:** SQLite (`better-sqlite3`)
- **API:** TMDB API

## Setup & Run Instructions

#### Prerequisites: TMDB API Token & Node

1. Install dependencies:
   ```
   npm install
   ```
2. Add TMDB API Token. Create `.env.local` in root:
   ```
   TMDB_API_TOKEN=...
   ```
3. Run dev server, open `http://localhost:3000`
   ```
   npm run dev
   ```

## Features

- Search by Movie title, results are returned with poster, year released, and overview of movie (truncated)
- View Movie Modal with full desciption and run time
- Add or Remove Movie from Favorites
- Favorited Movies:
  - Add a rating (1-5 Stars)
  - Add a note
- Server-side persistence via lightweight SQLite database

## Development Process

1. **Defining Requirements and Constraints (~10 mins)**

   ### Functional
   - User can search for movies and results are returned with poster, title, year released, and short description
   - User can view movie details in a modal with poster, overview, year, and runtime
   - User can add/remove movies to a Favorites list, each Favorite can have a rating and note

   ### Non-Functional
   - System must persist data server-side using lightweight db via API
   - System must keep API token server-side via proxy endpoint
   - System must be fault tolerant and handle errors gracefully with user messages (no results, network/API errors)

2. **API & Data Model Design (~30 mins)**

- Map required TMDB endpoints: search (`/search/movie?query=...`) and details (`/movie/{id}`)
- Build types for API response: `MovieSearch` and `MovieDetail`
- Create search and details proxy routes

3. **Search and Results Components (~40 mins)**

- `Search`, `MovieTile`, and `MovieGrid` frontend client components
- Wire end-to-end Search feature in `page.tsx`
- Style components with Tailwind as they are made
- Movies returned after searching

4. **Movie Details Modal (~25 mins)**

- `MovieModal` component, receives `movieId` and fetches `/api/movie/${movieId}` to populate modal
- Set `movieId` onClick on homepage to open modal. When `null` does not open

5. **SQLite DB Persistence (~30 mins)**

- Install `better-sqlite3` dependency and SQL statement to create `favorites` table with movie metadata
- Add routes for CRUD operations on `favorite` resources

6. **Favorites Functionality (~60 mins)**

- Build `FavoritesContext` to provide favorite movies, addFavorite, removeFavorite, updateFavorite, and isFavorite, wrap in `layout.tsx`
- Add Favorite button to MovieModal. Display Rating and Note when a Movie is favorited. Only update on save, read-only after saving
- Add `Favorites` button to home page next to Search. Filters favorited movies when toggled.

**Total Time: ~3 hours 15 minutes**

## Technical Decisions & Tradeoffs

### Single-Page Scroll:

- Search, results, and favorites are immediately accessible from first load
- Movie details are opened in a modal to not lose previous results
- Ease of development under time constraint (~ 3 hours)
- **Tradeoffs:**
  - URL does not change when viewing Movie Modal
  - Details cannot be shared/bookmarked

### SQLite over LocalStorage

- Chose optional enhancement of server-side persistance over browser-bound storage
- LocalStorage does not persist across devices/browsers
- Favorites, ratings, and notes are stored server-side and persist through private browsing and cache clears
- **Tradeoffs:**
  - SQLite is single file, can't scale to distributed deployments
  - Raw SQL queries, no type safety

### Next.js API Routes - TMDB API Proxy

- All external API requests are made server-side and API token never exposed through browser
- Only returning fields the FE will need, controlled outputs with Types
- **Tradeoffs:**
  - Extra server round-trip instead of hitting TMDB API directly

### React Context

- `favorites` state is simple enough for a custom context and no external state management dependency
- Context is memoized to prevent unnecessary rerenders
- **Tradeoffs:**
  - Lacks built in caching

### Key Remount Pattern

- `Search` component manages it own state internally, clear the input from the parent using the `key` prop to force a remount
- Avoids exposing internal state on parent component
- **Tradeoffs:**
  - Remounting is heavier (negligible for scope of project)

## Known Limitations + Future Improvements

### Pagination

- All Search results are returned at once on one page
- Pagination of search results for different values (i.e. 10, 25, 50, 100)

### Debounce Function

- Searches are only fired on form Submit
- Add debounced input, returning results as text is entered (~300 ms)

### User Authentication

- No user authentication so favorites are stored globally and not per user
- Add NextAuth to scope favorites to individual accounts

### Loading and Error States

- Text-based loading and error state UI
- Add loading skeleton and retry functionality upon failure
