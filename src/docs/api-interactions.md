# API Interactions

This document describes how the Content Planning Platform interacts with its backend services, primarily Supabase for database and authentication, and Ayrshare for social media publishing.

## Supabase Interactions

The Supabase client is initialized in `src/lib/supabase.ts` and used throughout the application for secure data operations.

### Authentication (`src/contexts/AuthContext.tsx`)
- **Sign Up**: `supabase.auth.signUp({ email, password })`
    - Creates a new user account.
    - Includes `emailRedirectTo` for email confirmation flow.
- **Sign In**: `supabase.auth.signInWithPassword({ email, password })`
    - Authenticates an existing user.
- **Sign Out**: `supabase.auth.signOut()`
    - Logs out the current user.
- **Session Management**: `supabase.auth.onAuthStateChange`
    - Listens for authentication state changes (e.g., login, logout, user updates) to manage the user session and redirect users accordingly.
    - `supabase.auth.getSession()` is used for initial session retrieval.

### Database Operations (e.g., `src/services/supabaseService.ts` - *conceptual, not yet implemented*)
- All CRUD (Create, Read, Update, Delete) operations on tables like `content_pillars`, `content_ideas`, `scheduled_content`, `social_posts`, etc., are performed using the `supabase.from('table_name').select()...` syntax.
- **Row Level Security (RLS)** is enforced at the database level, meaning the client-side code does not need to explicitly filter data by `user_id`. Supabase automatically applies the RLS policies based on the authenticated user's `auth.uid()`.

### User Profiles
- The `public.profiles` table is automatically populated upon new user sign-up via a Supabase database trigger (`handle_new_user` function).
- Profile data can be fetched and updated using standard Supabase queries.

## Ayrshare Interactions

The Ayrshare service is configured in `src/config/ayrshare.ts` and `src/services/ayrshareService.ts` to handle social media publishing and analytics.

### `src/services/ayrshareService.ts`
- **`getConnectedAccounts()`**: Fetches the list of social media profiles connected via Ayrshare.
    - Used in `src/components/social/SocialAccountManager.tsx` to display connected accounts.
- **`generateAuthUrl(platform: string)`**: Generates an OAuth URL for connecting new social media accounts.
    - Used in `SocialAccountManager` to initiate the connection flow.
- **`createPost(postData: PostData)`**: Publishes content to selected social media platforms.
    - `PostData` includes `post` content, `platforms` array, `mediaUrls` (optional), and `scheduleDate` (optional).
    - Used in `src/components/social/SocialPublisher.tsx`.
- **`uploadMedia(file: File)`**: Uploads media files (images/videos) to Ayrshare's CDN for use in posts.
    - Used in `SocialPublisher` before creating a post with media.
- **`getPostHistory(options: { limit?: number; page?: number })`**: Retrieves a history of published and scheduled posts.
    - Used in `src/components/social/PublishingQueue.tsx` and `src/components/analytics/SocialAnalytics.tsx`.
- **`deletePost(postId: string)`**: Deletes a scheduled post from Ayrshare.
    - Used in `PublishingQueue` to cancel scheduled posts.
- **`getAnalytics(options: { startDate: string; endDate: string })`**: Fetches social media analytics data for a given date range.
    - Used in `src/components/analytics/SocialAnalytics.tsx`.

### API Key Management
- The Ayrshare API key (`AYRSHARE_API_KEY`) is a sensitive secret and should be stored as an environment variable.
- It is accessed server-side (e.g., via Supabase Edge Functions or a dedicated backend) to prevent exposure in the client-side code. The `ayrshareService` would typically make calls to an Edge Function that then calls Ayrshare. (Note: The current `ayrshareService.ts` directly uses `import.meta.env.VITE_AYRSHARE_API_KEY`, which is suitable for client-side development but should be moved to a secure backend/Edge Function for production.)