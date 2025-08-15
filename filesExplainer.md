# File Structure Documentation

This document outlines the hierarchical structure of the Content Planning Platform codebase, providing a brief functional description for each file and indicating its import complexity.

## Hierarchical Structure

```
.
├── src/
│   ├── App.tsx 🔴 (12 imports) - Main application component, handles routing and global providers.
│   ├── main.tsx 🟢 (3 imports) - Entry point for the React application.
│   ├── index.css 🟢 (0 imports) - Global Tailwind CSS styles.
│   ├── contexts/
│   │   └── AuthContext.tsx 🟡 (4 imports) - React context for managing user authentication state with Supabase.
│   ├── lib/
│   │   └── supabase.ts 🟢 (1 import) - Initializes and exports the Supabase client instance.
│   ├── pages/
│   │   ├── Analytics.tsx 🟡 (6 imports) - Displays content performance and channel analytics.
│   │   ├── Calendar.tsx 🟡 (7 imports) - Provides an editorial calendar for content planning and scheduling.
│   │   ├── Collaboration.tsx 🟡 (6 imports) - Manages team members, shared projects, and activity feed.
│   │   ├── Dashboard.tsx 🟡 (5 imports) - Main user dashboard with quick actions and content overviews.
│   │   ├── Ideation.tsx 🟡 (5 imports) - Facilitates content idea capture and organization.
│   │   ├── Library.tsx 🟡 (5 imports) - Manages content assets, templates, and resources.
│   │   ├── Login.tsx 🟡 (5 imports) - User login interface.
│   │   ├── Pricing.tsx 🟡 (5 imports) - Displays pricing plans and handles Stripe checkout.
│   │   ├── Signup.tsx 🟡 (6 imports) - User registration interface.
│   │   ├── SocialAccounts.tsx 🟡 (4 imports) - Manages connected social media accounts.
│   │   ├── Strategy.tsx 🟡 (4 imports) - Defines content pillars, briefs, and strategic goals.
│   │   └── Success.tsx 🟡 (4 imports) - Displays post-Stripe checkout success message.
│   ├── components/
│   │   ├── Navigation.tsx 🔴 (10 imports) - Top navigation bar with user menu and route links.
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx 🟢 (3 imports) - HOC for protecting routes based on authentication status.
│   │   ├── calendar/
│   │   │   ├── CalendarGrid.tsx 🟡 (5 imports) - Renders the main calendar grid for month/week/day views.
│   │   │   └── ContentCard.tsx 🟡 (4 imports) - Draggable card representing a piece of content.
│   │   ├── collaboration/
│   │   │   ├── ActivityFeed.tsx 🟡 (4 imports) - Displays recent team activities.
│   │   │   ├── RecentCollaboration.tsx 🟡 (5 imports) - Shows recent collaborative actions and comments.
│   │   │   ├── SharedProjects.tsx 🟡 (4 imports) - Lists shared content projects with progress.
│   │   │   └── TeamMembers.tsx 🟡 (4 imports) - Displays team members and their roles.
│   │   ├── dashboard/
│   │   │   ├── ContentPillars.tsx 🟡 (4 imports) - Overview of content pillars and their progress.
│   │   │   ├── QuickActions.tsx 🟡 (3 imports) - Provides quick navigation shortcuts to key features.
│   │   │   ├── RecentActivity.tsx 🟡 (4 imports) - Shows recent user activities on the dashboard.
│   │   │   └── UpcomingDeadlines.tsx 🟡 (3 imports) - Lists upcoming content deadlines.
│   │   ├── ideation/
│   │   │   ├── IdeaBoard.tsx 🟡 (4 imports) - Displays content ideas in a board format.
│   │   │   ├── IdeaCapture.tsx 🟡 (4 imports) - Modal for capturing new content ideas.
│   │   │   └── TopicClusters.tsx 🟡 (2 imports) - Organizes content ideas into thematic clusters.
│   │   ├── social/
│   │   │   ├── PublishingQueue.tsx 🟡 (5 imports) - Displays scheduled and published social media posts.
│   │   │   ├── SocialAccountManager.tsx 🟡 (5 imports) - Manages connection status of social media accounts.
│   │   │   ├── SocialCollaboration.tsx 🔴 (7 imports) - Facilitates discussion and approval on social posts.
│   │   │   └── SocialPublisher.tsx 🔴 (9 imports) - Modal for creating and scheduling social media posts.
│   │   ├── strategy/
│   │   │   ├── ContentBriefs.tsx 🟡 (4 imports) - Lists and manages content briefs.
│   │   │   ├── ContentPillarsStrategy.tsx 🟡 (4 imports) - Details the strategy for each content pillar.
│   │   │   └── StrategicGoals.tsx 🟡 (4 imports) - Tracks progress towards strategic content goals.
│   │   ├── subscription/
│   │   │   └── SubscriptionStatus.tsx 🟡 (5 imports) - Displays the user's current subscription status.
│   │   ├── library/
│   │   │   ├── AssetGrid.tsx 🔴 (7 imports) - Displays content assets in a grid view.
│   │   │   ├── AssetList.tsx 🔴 (7 imports) - Displays content assets in a list view.
│   │   │   └── FolderTree.tsx 🟡 (4 imports) - Provides a hierarchical view of library folders.
│   ├── config/
│   │   └── ayrshare.ts 🟢 (0 imports) - Configuration for Ayrshare supported platforms.
│   ├── services/
│   │   ├── ayrshareService.ts 🟢 (2 imports) - Service for interacting with Ayrshare API via Edge Functions.
│   │   └── stripeService.ts 🟡 (3 imports) - Service for interacting with Stripe API via Edge Functions and database.
│   └── stripe-config.ts 🟢 (0 imports) - Configuration for Stripe products and pricing.
```

## Statistics

*   **Total Files:** 46
*   **Complexity Distribution:**
    *   🟢 (0-3 imports): 10 files (21.7%)
    *   🟡 (4-7 imports): 30 files (65.2%)
    *   🔴 (8+ imports): 6 files (13.0%)