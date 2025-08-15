# Application Sitemap

This document outlines the complete navigation structure and routes of the Content Planning Platform.

## Public Routes

These routes are accessible to all users, including those who are not authenticated.

*   `/login`: User login page.
*   `/signup`: User registration page.
*   `/pricing`: Displays available subscription plans and pricing details.
*   `/success`: Post-payment success page (e.g., after Stripe checkout).

## Protected Routes

These routes require the user to be authenticated. Access is managed by the `ProtectedRoute` component.

*   `/` (Dashboard): The main dashboard providing an overview of content activities, quick actions, and key metrics.
*   `/calendar`: The editorial calendar for planning, scheduling, and organizing content.
*   `/ideation`: A dedicated space for capturing, organizing, and developing content ideas.
*   `/strategy`: Defines and manages content pillars, strategic goals, and content briefs.
*   `/library`: The central content library for organizing and managing assets, templates, and resources.
*   `/analytics`: Provides insights into content performance, channel analytics, and planning recommendations.
*   `/collaboration`: Facilitates team collaboration, shared projects, and activity tracking.
*   `/social-accounts`: Manages connected social media accounts for publishing.

## User Journey Examples

### New User Onboarding
1.  `/signup` (Register)
2.  `/login` (Sign in)
3.  `/` (Dashboard)
4.  `/social-accounts` (Connect social accounts)
5.  `/pricing` (Choose a plan)
6.  `/success` (Subscription confirmation)

### Daily Content Management
1.  `/` (Dashboard - check overview)
2.  `/calendar` (Schedule new content or review existing)
3.  `/ideation` (Add new ideas or develop existing ones)
4.  `/social-accounts` (Check publishing queue)

### Strategic Planning
1.  `/strategy` (Review/edit content pillars and goals)
2.  `/ideation` (Brainstorm ideas aligned with strategy)
3.  `/analytics` (Analyze performance to inform future strategy)