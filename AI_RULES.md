# AI Rules for Content Planning Platform

This document outlines the core technologies and specific library usage guidelines for developing and modifying the Content Planning Platform.

## Tech Stack Overview

*   **React**: The primary JavaScript library for building user interfaces.
*   **TypeScript**: Used for type safety across the entire codebase, enhancing maintainability and reducing bugs.
*   **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling. All styling should be done using Tailwind classes.
*   **React Router**: Manages client-side routing, defining navigation paths and rendering components based on the URL.
*   **Supabase**: Provides backend services including authentication and database interactions.
*   **Shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS, available for use.
*   **Lucide React**: A library for open-source icons, used throughout the application.
*   **React DND**: Implements drag-and-drop functionality for interactive elements.
*   **Date-fns**: A lightweight library for date manipulation and formatting.
*   **Ayrshare**: An external API service used for social media publishing and analytics.

## Library Usage Rules

*   **UI Components**: Prioritize using `shadcn/ui` components where applicable. For custom UI elements, create new React components and style them exclusively with Tailwind CSS. Do not modify `shadcn/ui` source files directly; create new components if customization is needed.
*   **Styling**: Always use Tailwind CSS for all styling. Avoid inline styles or separate CSS files unless absolutely necessary for third-party integrations that cannot be styled otherwise.
*   **Routing**: Use `react-router-dom` for all navigation and route management within the application. Keep main application routes defined in `src/App.tsx`.
*   **Authentication & Database**: All authentication flows and database interactions must be handled via the Supabase client (`src/lib/supabase.ts`).
*   **Icons**: Use icons from the `lucide-react` library.
*   **Drag and Drop**: Implement drag-and-drop features using `react-dnd` and `react-dnd-html5-backend`.
*   **Date Operations**: For any date parsing, formatting, or manipulation, use the `date-fns` library.
*   **Social Media Integration**: Interact with social media platforms for publishing and analytics exclusively through the `ayrshareService` (`src/services/ayrshareService.ts`).

## General Coding Guidelines

*   **Responsive Design**: All UI components and layouts must be designed to be fully responsive and adapt seamlessly across various screen sizes (mobile, tablet, desktop).
*   **Error Handling**: Use toast notifications (e.g., via `react-hot-toast` if installed, or a similar system) to inform users about important events, including errors. Avoid `try/catch` blocks for general error handling within components unless specifically requested, allowing errors to bubble up for centralized management and debugging.
*   **Component Granularity**: Create small, focused, and reusable React components. Each new component or hook must reside in its own dedicated file. Avoid adding new components to existing files, even if they seem related. Aim for components that are generally 100 lines of code or less.
*   **Complete Implementations**: All requested features must be fully functional with complete code. Do not include placeholders, partial implementations, or `TODO` comments. If a request is too large to complete in one response, clearly state which parts are completed and which are not.

## File Structure and Naming Conventions

*   **Directory Names**: All directory names (e.g., `src/pages`, `src/components`, `src/utils`) must be all lowercase.
*   **File Names**: File names for React components and other modules should follow PascalCase (e.g., `UserProfile.tsx`, `AuthContext.tsx`). Utility files can use camelCase or kebab-case as appropriate (e.g., `supabase.ts`, `stripe-config.ts`).

## Supabase Integration Rules

*   **Supabase Client**: The Supabase client instance must be imported from `src/lib/supabase.ts`. If this file does not exist, it must be created first.
*   **Authentication**:
    *   Always assess if user profile data storage (e.g., `first_name`, `last_name`, `avatar_url`) is needed. If so, create a `profiles` table with appropriate columns.
    *   Use the `@supabase/auth-ui-react` Auth component for UI, applying a light theme and styling to match the application. Avoid third-party providers unless explicitly requested.
    *   Implement session management by wrapping the app with a `SessionContextProvider` (if not already present) and monitoring auth state changes using `supabase.auth.onAuthStateChange`.
    *   Implement automatic redirects: authenticated users to the main page, unauthenticated users to the login page.
    *   Handle `AuthApiError` for user-facing error messages.
*   **Database Interactions**:
    *   All database operations must use the `supabase` client.
    *   **Row Level Security (RLS)**: RLS is **MANDATORY** for all tables. When creating new tables, always enable RLS and define appropriate `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies. Prioritize user-specific data access (e.g., `auth.uid() = user_id`) unless public access is explicitly required.
    *   **User Profiles**: If user profiles are required, create a `public.profiles` table and a `handle_new_user` function with a trigger to automatically insert profile data on new user sign-up.
*   **Edge Functions**:
    *   Use edge functions for API-to-API communication, handling sensitive tokens, or general backend logic.
    *   Functions must be located in the `supabase/functions` folder, with each function in its own directory (e.g., `supabase/functions/hello/index.ts`).
    *   Always include CORS headers in edge functions.
    *   Invoke edge functions using `supabase.functions.invoke()`.
    *   Do not import code from the `supabase/` directory into client-side code.
    *   Inform the user to set up new secrets via the Supabase Console.