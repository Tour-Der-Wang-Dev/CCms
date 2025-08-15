# Database Schema and Row Level Security (RLS)

This document outlines the core database tables used in the Content Planning Platform, their purpose, and the Row Level Security (RLS) policies applied to ensure data privacy and security.

All database interactions are handled via Supabase, and RLS is **MANDATORY** for all tables to prevent unauthorized data access.

## Core Tables

### `public.profiles`
- **Purpose**: Stores user profile information (e.g., first name, last name, avatar URL) linked to `auth.users`.
- **Columns**:
    - `id` (UUID, PK, FK to `auth.users`): Unique identifier for the profile, matching the user's auth ID.
    - `first_name` (TEXT)
    - `last_name` (TEXT)
    - `avatar_url` (TEXT)
    - `updated_at` (TIMESTAMP WITH TIME ZONE): Last update timestamp.
- **RLS Policies**:
    - `profiles_select_policy`: Users can only `SELECT` their own profile data (`auth.uid() = id`).
    - `profiles_insert_policy`: Users can only `INSERT` their own profile data (`auth.uid() = id`).
    - `profiles_update_policy`: Users can only `UPDATE` their own profile data (`auth.uid() = id`).
    - `profiles_delete_policy`: Users can only `DELETE` their own profile data (`auth.uid() = id`).
    - `profiles_public_read_policy` (Optional, if enabled): Allows public read access to profiles (`true`).

### `public.content_pillars`
- **Purpose**: Defines strategic content categories.
- **Columns**: `id`, `user_id`, `name`, `description`, `target_percentage`, `current_percentage`, `content_types`, `kpis`, `color`, `created_at`, `updated_at`, `progress`, `content_count`.
- **RLS Policies**: Users can only access their own content pillars.

### `public.content_ideas`
- **Purpose**: Stores captured content ideas.
- **Columns**: `id`, `user_id`, `title`, `description`, `tags`, `pillar`, `priority`, `stage`, `created_at`, `updated_at`.
- **RLS Policies**: Users can only access their own content ideas.

### `public.scheduled_content`
- **Purpose**: Manages content scheduled for publication.
- **Columns**: `id`, `user_id`, `title`, `description`, `type`, `pillar`, `scheduled_date`, `scheduled_time`, `status`, `created_at`, `updated_at`.
- **RLS Policies**: Users can only access their own scheduled content.

### `public.social_posts`
- **Purpose**: Records social media posts, including content, platforms, and scheduling.
- **Columns**: `id`, `user_id`, `content`, `platforms`, `media_urls`, `scheduled_at`, `status`, `published_at`, `created_at`, `updated_at`.
- **RLS Policies**: Users can only access their own social posts.

### `public.social_interactions`
- **Purpose**: Tracks interactions from social media (e.g., comments, mentions).
- **Columns**: `id`, `user_id`, `platform`, `type`, `author_username`, `author_profile_image`, `content`, `is_read`, `created_at`, `updated_at`.
- **RLS Policies**: Users can only access their own social interactions.

### `public.strategic_goals`
- **Purpose**: Defines and tracks high-level content strategy goals.
- **Columns**: `id`, `user_id`, `title`, `target`, `current`, `progress`, `deadline`, `status`, `created_at`, `updated_at`.
- **RLS Policies**: Users can only access their own strategic goals.

### `public.content_briefs`
- **Purpose**: Stores detailed content briefs for projects.
- **Columns**: `id`, `user_id`, `title`, `description`, `status`, `deadline`, `assigned_to`, `pillar`, `progress`, `created_at`, `updated_at`.
- **RLS Policies**: Users can only access their own content briefs.

### `public.team_members`
- **Purpose**: Manages team members and their roles/permissions within the platform.
- **Columns**: `id`, `user_id`, `member_profile_id`, `role`, `status`, `permissions`, `last_active`, `created_at`, `updated_at`.
- **RLS Policies**: Owners can access their team members.

### `public.shared_projects`
- **Purpose**: Manages projects that can be shared and collaborated on.
- **Columns**: `id`, `user_id`, `title`, `description`, `members`, `progress`, `deadline`, `status`, `created_at`, `updated_at`.
- **RLS Policies**: Users can see their own or shared projects.

### `public.activity_feed`
- **Purpose**: Logs various activities within the application for user's activity feed.
- **Columns**: `id`, `user_id`, `type`, `message`, `time`, `color`, `created_at`.
- **RLS Policies**: Users can only access their own activity feed.

### Stripe Integration Tables (`stripe_customers`, `stripe_subscriptions`, `stripe_orders`)
- **Purpose**: Store data related to Stripe subscriptions and payments.
- **RLS Policies**: Users can only view their own customer, subscription, and order data. These tables are typically managed by Stripe webhooks and should have strict RLS.

## RLS Implementation
All tables have RLS enabled. Policies are designed to ensure that users can only access, insert, update, or delete data that belongs to them (i.e., `auth.uid() = user_id`), unless explicitly defined for shared or public access (e.g., `shared_projects` for members, or `profiles` for public read if enabled).