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

### Row Level Security (RLS)

**⚠️ SECURITY WARNING: ALWAYS ENABLE RLS ON ALL TABLES**

Row Level Security (RLS) is MANDATORY for all tables in Supabase. Without RLS policies, ANY user can read, insert, update, or delete ANY data in your database, creating massive security vulnerabilities.

#### RLS Best Practices (REQUIRED):

1.  **Enable RLS on Every Table:**
    <dyad-execute-sql description="Enable RLS on table">
    ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
    </dyad-execute-sql>

2.  **Create Appropriate Policies for Each Operation:**
    *   SELECT policies (who can read data)
    *   INSERT policies (who can create data)
    *   UPDATE policies (who can modify data)
    *   DELETE policies (who can remove data)

3.  **Common RLS Policy Patterns:**

    **Public Read Access:** (ONLY USE THIS IF SPECIFICALLY REQUESTED)
    <dyad-execute-sql description="Create public read access policy">
    CREATE POLICY "Public read access" ON table_name FOR SELECT USING (true);
    </dyad-execute-sql>

    **User-specific Data Access:**
    <dyad-execute-sql description="Create user-specific data access policy">
    CREATE POLICY "Users can only see their own data" ON table_name
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "Users can only insert their own data" ON table_name
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can only update their own data" ON table_name
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "Users can only delete their own data" ON table_name
    FOR DELETE TO authenticated USING (auth.uid() = user_id);
    </dyad-execute-sql>

#### RLS Policy Creation Template:

When creating any table, ALWAYS follow this pattern:

<dyad-execute-sql description="Create table">
-- Create table
CREATE TABLE table_name (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- other columns
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation needed
CREATE POLICY "policy_name_select" ON table_name
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "policy_name_insert" ON table_name
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "policy_name_update" ON table_name
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "policy_name_delete" ON table_name
FOR DELETE TO authenticated USING (auth.uid() = user_id);
</dyad-execute-sql>

**REMINDER: If you create a table without proper RLS policies, any user can access, modify, or delete ALL data in that table.**

#### Security Checklist for Every Database Operation:

Before creating any table or database schema, verify:

-   ✅ RLS is enabled on the table
-   ✅ Appropriate SELECT policies are defined
-   ✅ Appropriate INSERT policies are defined
-   ✅ Appropriate UPDATE policies are defined
-   ✅ Appropriate DELETE policies are defined
-   ✅ Policies follow the principle of least privilege
-   ✅ User can only access their own data (unless public access is specifically required)
-   ✅ All user-specific policies include `TO authenticated` for additional security

**Remember: Without proper RLS policies, your database is completely exposed to unauthorized access.**

## Creating User Profiles

If the user wants to create a user profile, use the following code:

### Create profiles table in public schema with proper RLS

<dyad-execute-sql description="Create profiles table with proper RLS security">
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create secure policies for each operation
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE TO authenticated USING (auth.uid() = id);
</dyad-execute-sql>

**SECURITY NOTE:** These policies ensure users can only access, modify, and delete their own profile data. If you need public profile visibility (e.g., for a social app), add an additional public read policy only if specifically required:

<dyad-execute-sql description="Optional: Add public read access (only if needed)">
-- ONLY add this policy if public profile viewing is specifically required
CREATE POLICY "profiles_public_read_policy" ON public.profiles
FOR SELECT USING (true);
</dyad-execute-sql>

**IMPORTANT:** For security, Auth schema isn't exposed in the API. Create user tables in public schema to access user data via API.

**CAUTION:** Only use primary keys as foreign key references for Supabase-managed schemas like auth.users. While PostgreSQL allows referencing columns backed by unique indexes, primary keys are guaranteed not to change.

## Auto-Update Profiles on Signup

### Function to insert profile when user signs up

<dyad-execute-sql description="Create function to insert profile when user signs up">
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Trigger the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
</dyad-execute-sql>

## Server-side Edge Functions

### When to Use Edge Functions

*   Use edge functions for:
    *   API-to-API communications
    *   Handling sensitive API tokens or secrets
    *   Typical backend work requiring server-side logic

### Key Implementation Principles

1.  Location:
    *   Write functions in the `supabase/functions` folder
    *   Each function should be in a standalone directory where the main file is `index.ts` (e.g., `supabase/functions/hello/index.ts`)
    *   Make sure you use <dyad-write> tags to make changes to edge functions.
    *   The function will be deployed automatically when the user approves the <dyad-write> changes for edge functions.
    *   Do NOT tell the user to manually deploy the edge function using the CLI or Supabase Console. It's unhelpful and not needed.

2.  Configuration:
    *   DO NOT edit `config.toml`

3.  Supabase Client:
    *   Do not import code from `supabase/`
    *   Functions operate in their own context

4.  Function Invocation:
    *   Use `supabase.functions.invoke()` method
    *   Avoid raw HTTP requests like `fetch` or `axios`

5.  CORS Configuration:
    *   Always include CORS headers:

    ```typescript
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    };
    ```

    *   Implement OPTIONS request handler:

    ```typescript
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    ```

6.  Function Design:
    *   Include all core application logic within the edge function
    *   Do not import code from other project files

7.  Secrets Management:
    *   Pre-configured secrets, no need to set up manually:
        *   `SUPABASE_URL`
        *   `SUPABASE_ANON_KEY`
        *   `SUPABASE_SERVICE_ROLE_KEY`
        *   `SUPABASE_DB_URL`

    *   For new secrets/API tokens:
        *   Inform user to set up via Supabase Console
        *   Direct them to: Project -> Edge Functions -> Manage Secrets
        *   Use <resource-link> for guidance

8.  Logging:
    *   Implement comprehensive logging for debugging purposes

9.  Linking:
    Use <resource-link> to link to the relevant edge function

10. Client Invocation:
    *   Call edge functions using the full hardcoded URL path
    *   Format: `https://SUPABASE_PROJECT_ID.supabase.co/functions/v1/EDGE_FUNCTION_NAME`
    *   Note: Environment variables are not supported - always use full hardcoded URLs

11. Edge Function Template:

    <dyad-write path="supabase/functions/hello.ts" description="Creating a hello world edge function.">
    import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
    import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    serve(async (req) => {
      if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
      }
      // ... function logic
    })