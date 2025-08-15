# Application Architecture Diagram (Textual Representation)

This document describes the architecture of the Content Planning Platform, outlining its key components, data flows, and integrations. This textual representation can be used to generate visual diagrams (e.g., using Mermaid, PlantUML, or other diagramming tools).

## Legend

*   **[Component]**: A distinct part of the application (e.g., Frontend, Database).
*   **<Sub-Component>**: A specific module or feature within a component.
*   **{External Service}**: A third-party API or platform.
*   **[->]**: Data flow / Interaction direction.
*   **[--]**: Data storage / Relationship.
*   **Color Coding (Conceptual for Diagram):**
    *   **Blue**: Frontend / Client-side
    *   **Green**: Backend / Supabase Core
    *   **Orange**: External APIs
    *   **Purple**: Data Stores
    *   **Grey**: Authentication / Security

## Architecture Overview

```mermaid
graph TD
    subgraph User
        A[User Browser]
    end

    subgraph Frontend (React Application)
        direction LR
        B[App.tsx] --> C(React Router)
        C --> D{Protected Routes}
        C --> E{Public Routes}
        D --> F[Dashboard Page]
        D --> G[Calendar Page]
        D --> H[Ideation Page]
        D --> I[Strategy Page]
        D --> J[Library Page]
        D --> K[Analytics Page]
        D --> L[Collaboration Page]
        D --> M[Social Accounts Page]
        E --> N[Login Page]
        E --> O[Signup Page]
        E --> P[Pricing Page]
        E --> Q[Success Page]

        F -- Components --> F1[QuickActions]
        F -- Components --> F2[RecentActivity]
        F -- Components --> F3[ContentPillars]
        F -- Components --> F4[UpcomingDeadlines]

        G -- Components --> G1[CalendarGrid]
        G -- Components --> G2[ContentCard]
        G -- Components --> G3[SocialPublisher]

        H -- Components --> H1[IdeaBoard]
        H -- Components --> H2[IdeaCapture]
        H -- Components --> H3[TopicClusters]

        I -- Components --> I1[ContentBriefs]
        I -- Components --> I2[ContentPillarsStrategy]
        I -- Components --> I3[StrategicGoals]

        J -- Components --> J1[AssetGrid]
        J -- Components --> J2[AssetList]
        J -- Components --> J3[FolderTree]

        K -- Components --> K1[MetricsOverview]
        K -- Components --> K2[ContentPerformance]
        K -- Components --> K3[ChannelAnalytics]
        K -- Components --> K4[PlanningInsights]
        K -- Components --> K5[SocialAnalytics]

        L -- Components --> L1[TeamMembers]
        L -- Components --> L2[RecentCollaboration]
        L -- Components --> L3[SharedProjects]
        L -- Components --> L4[ActivityFeed]
        L -- Components --> L5[SocialCollaboration]

        M -- Components --> M1[SocialAccountManager]
        M -- Components --> M2[PublishingQueue]

        P -- Components --> P1[SubscriptionStatus]
        Q -- Components --> Q1[SubscriptionStatus]

        B -- Context --> R(AuthContext)
        R -- Service --> S(Supabase Client)
        F,G,H,I,J,K,L,M,N,O,P,Q -- Service --> S
        G3,K5,M1,M2 -- Service --> T(Ayrshare Service)
        P,Q,P1,Q1 -- Service --> U(Stripe Service)
    end

    subgraph Backend (Supabase)
        direction LR
        S -- Auth --> V[Supabase Auth]
        S -- Database --> W[Supabase Database]
        S -- Edge Functions --> X[Supabase Edge Functions]
        X -- Function --> X1(ayrshare-proxy)
        X -- Function --> X2(stripe-checkout)
        X -- Function --> X3(stripe-portal)
    end

    subgraph External Services
        Y[Ayrshare API]
        Z[Stripe API]
    end

    subgraph Data Stores
        W -- Table --> W1[profiles]
        W -- Table --> W2[content_pillars]
        W -- Table --> W3[content_ideas]
        W -- Table --> W4[scheduled_content]
        W -- Table --> W5[social_posts]
        W -- Table --> W6[social_interactions]
        W -- Table --> W7[strategic_goals]
        W -- Table --> W8[content_briefs]
        W -- Table --> W9[team_members]
        W -- Table --> W10[shared_projects]
        W -- Table --> W11[assets]
        W -- Table --> W12[activity_feed]
        W -- Table --> W13[stripe_customers]
        W -- Table --> W14[stripe_subscriptions]
        W -- Table --> W15[stripe_orders]
    end

    A --> B
    A -- Login/Signup --> N,O
    A -- Pricing --> P
    A -- Success Redirect --> Q

    S --> V
    S --> W
    S --> X

    X1 --> Y
    X2 --> Z
    X3 --> Z

    V -- Manages --> W1
    W -- Data --> F,G,H,I,J,K,L,M,P,Q

    T --> X1
    U --> X2
    U --> X3

    Y -- Data --> K5,M1,M2
    Z -- Data --> P,Q,P1,Q1
```

## Detailed Component Breakdown

### Frontend Architecture (React Application)

*   **`App.tsx`**: The root component, responsible for setting up `React Router` for navigation, `DndProvider` for drag-and-drop functionality, and `AuthProvider` for global authentication state. It defines public and protected routes.
*   **`React Router`**: Manages client-side routing, mapping URLs to specific pages (`Dashboard`, `Calendar`, `Ideation`, `Login`, `Signup`, `Pricing`, `Success`, etc.).
*   **`AuthContext.tsx`**: A React Context that provides authentication state (`user`, `session`, `loading`) and methods (`signUp`, `signIn`, `signOut`) to all child components. It interacts directly with the `Supabase Client`.
*   **`ProtectedRoute.tsx`**: A higher-order component (HOC) that wraps routes requiring authentication, redirecting unauthenticated users to the login page.
*   **Pages (`src/pages/`)**: Top-level components representing different views of the application (e.g., `Dashboard`, `Calendar`, `Analytics`, `SocialAccounts`). These pages orchestrate data fetching and display relevant sub-components.
*   **Components (`src/components/`)**: Reusable UI elements and feature-specific modules, categorized by their domain (e.g., `calendar/`, `dashboard/`, `social/`). They receive data via props or consume contexts/services.

### API Structure (Supabase Edge Functions)

Supabase Edge Functions act as a secure backend for frontend-to-external-API communication, protecting sensitive API keys.

*   **`ayrshare-proxy`**:
    *   **Purpose**: Proxies requests to the Ayrshare API for social media publishing and analytics.
    *   **Methods**: Handles actions like `getConnectedAccounts`, `generateAuthUrl`, `createPost`, `getPostHistory`, `deletePost`, `getAnalytics`, `uploadMedia`.
    *   **Security**: Uses `AYRSHARE_API_KEY` securely from Supabase secrets.
*   **`stripe-checkout`**:
    *   **Purpose**: Creates Stripe Checkout Sessions for subscriptions or one-time payments.
    *   **Methods**: Receives `priceId` and `mode`, returns a checkout session URL.
    *   **Security**: Uses `STRIPE_SECRET_KEY` securely from Supabase secrets.
*   **`stripe-portal`**:
    *   **Purpose**: Creates Stripe Customer Portal Sessions for users to manage their subscriptions.
    *   **Methods**: Returns a customer portal session URL.
    *   **Security**: Uses `STRIPE_SECRET_KEY` securely from Supabase secrets.

### Database Design (Supabase PostgreSQL)

The Supabase database stores all application data, with Row Level Security (RLS) enforced on all tables.

*   **`auth.users`**: Supabase's built-in authentication table.
*   **`public.profiles`**: Stores user profile information (`first_name`, `last_name`, `avatar_url`), linked to `auth.users` by `id`.
*   **`public.content_pillars`**: Defines strategic content categories.
*   **`public.content_ideas`**: Stores raw content ideas.
*   **`public.scheduled_content`**: Manages planned content items on the calendar.
*   **`public.social_posts`**: Records social media posts, their content, platforms, and status.
*   **`public.social_interactions`**: Tracks social media engagement (comments, likes, etc.).
*   **`public.strategic_goals`**: Defines and tracks high-level content strategy goals.
*   **`public.content_briefs`**: Stores detailed content briefs for projects.
*   **`public.team_members`**: Manages team members and their roles/permissions.
*   **`public.shared_projects`**: Defines collaborative projects with assigned members.
*   **`public.assets`**: Stores metadata about digital assets (images, videos, documents).
*   **`public.activity_feed`**: Logs various user and system activities.
*   **Stripe Integration Tables**:
    *   **`public.stripe_customers`**: Stores Stripe customer IDs linked to Supabase users.
    *   **`public.stripe_subscriptions`**: Stores Stripe subscription details.
    *   **`public.stripe_orders`**: Records Stripe payment orders.

### Authentication Flow

1.  **User Initiates**: User navigates to `/login` or `/signup`.
2.  **Input Credentials**: User provides email and password.
3.  **Supabase Auth**: Frontend calls `supabase.auth.signUp` or `signInWithPassword`.
4.  **Session Management**: `AuthContext` listens for `onAuthStateChange` events, updates `user` and `session` state.
5.  **Protected Routes**: `ProtectedRoute` checks `user` state; if authenticated, grants access to main app; otherwise, redirects to `/login`.
6.  **User Profiles**: On new user signup, a Supabase database trigger (`handle_new_user`) automatically creates a corresponding entry in the `public.profiles` table.

### External Integrations

*   **Supabase**:
    *   **Authentication**: Handles user registration, login, session management.
    *   **Database**: PostgreSQL database for all application data.
    *   **Storage**: (Implicitly used for media uploads if integrated with Supabase Storage).
    *   **Edge Functions**: Serverless functions for secure backend logic and API proxies.
*   **Ayrshare**:
    *   **Purpose**: Social media publishing and analytics.
    *   **Integration**: All interactions are proxied through the `ayrshare-proxy` Supabase Edge Function to secure the API key.
    *   **Features**: Connecting social accounts, publishing posts, fetching post history and analytics.
*   **Stripe**:
    *   **Purpose**: Subscription management and payments.
    *   **Integration**: Checkout sessions and customer portal sessions are created via `stripe-checkout` and `stripe-portal` Supabase Edge Functions.
    *   **Features**: Handling pricing plans, subscriptions, and payment processing.

### Data Flow

1.  **User Interaction**: User performs an action in the Frontend (e.g., schedules content, adds an idea, clicks "Publish").
2.  **Frontend Service Call**: The relevant React component or page calls a service (`ayrshareService`, `stripeService`, or directly `supabase` client).
3.  **Supabase Client**: The `supabase` client handles direct database queries or invokes Supabase Edge Functions.
4.  **Edge Function (if applicable)**: For external API calls (Ayrshare, Stripe), an Edge Function is invoked. This function securely uses environment variables (API keys) and makes the actual call to the external service.
5.  **External Service**: The external service (Ayrshare, Stripe) processes the request and returns a response.
6.  **Database Interaction**: Data is read from or written to the Supabase Database (e.g., `scheduled_content`, `social_posts`, `profiles`, `stripe_subscriptions`).
7.  **Response to Frontend**: Data or status is returned through the Supabase client/Edge Function back to the Frontend.
8.  **UI Update**: The Frontend updates the UI based on the received data.