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

## Directory Structure

The project follows a clear and modular directory structure to ensure maintainability and scalability.

*   `src/`: Contains all source code.
    *   `assets/`: Static assets like images, fonts, etc.
    *   `components/`: Reusable UI components.
        *   `components/auth/`: Authentication-related components.
        *   `components/calendar/`: Components specific to the calendar page.
        *   `components/analytics/`: Components specific to the analytics page.
        *   `components/collaboration/`: Components specific to the collaboration page.
        *   `components/dashboard/`: Components specific to the dashboard page.
        *   `components/library/`: Components specific to the library page.
        *   `components/ideation/`: Components specific to the ideation page.
        *   `components/social/`: Components specific to social media features.
        *   `components/strategy/`: Components specific to the strategy page.
        *   `components/subscription/`: Components related to subscription management.
    *   `contexts/`: React Context API providers for global state management (e.g., `AuthContext`).
    *   `hooks/`: Custom React hooks for reusable logic.
    *   `lib/`: Utility functions, configurations, and external service initializations (e.g., `supabase.ts`).
    *   `pages/`: Top-level components representing different views/routes of the application.
    *   `services/`: API service integrations (e.g., `ayrshareService.ts`, `stripeService.ts`).
    *   `types/`: TypeScript type definitions.
    *   `utils/`: General utility functions.
    *   `config/`: Application-wide configurations (e.g., `ayrshare.ts`, `stripe-config.ts`).

Directory names MUST be all lower-case (e.g., `src/pages`, `src/components`). File names may use mixed-case (e.g., `App.tsx`, `AuthContext.tsx`).

## Code Formatting and Best Practices

*   **TypeScript First**: All new files and modifications should leverage TypeScript for type safety.
*   **Functional Components**: Prefer functional components with React hooks over class components.
*   **Atomic Design Principles**: Strive to create small, focused, and reusable components. Components should ideally be 100 lines of code or less. Refactor larger components into smaller, more manageable pieces when necessary.
*   **Prop Drilling vs. Context**: Use React Context for global state or props that need to be passed down many levels. For direct parent-child communication, prop drilling is acceptable.
*   **Error Handling**: Implement user-friendly error messages using toast notifications for important events. Avoid `try/catch` blocks unless specifically requested, as errors should generally bubble up for centralized handling and debugging.
*   **Responsiveness**: All UI components and layouts must be responsive and adapt gracefully to different screen sizes (mobile, tablet, desktop) using Tailwind CSS utilities.
*   **Accessibility**: Ensure components are built with accessibility in mind (e.g., proper ARIA attributes, keyboard navigation).
*   **Performance**: Optimize for performance by using `React.memo`, `useCallback`, `useMemo` where appropriate, and lazy loading components for larger pages.
*   **No Direct DOM Manipulation**: Avoid direct DOM manipulation using `document.getElementById` or similar methods; use React's declarative approach.
*   **Consistent Naming**: Follow consistent naming conventions for variables, functions, and components (e.g., PascalCase for components, camelCase for functions and variables).
*   **Comments**: Add comments for complex logic, non-obvious implementations, or to explain the purpose of a component/function.
*   **No Partial Implementations**: All code changes must be fully functional and complete. Do not leave placeholders or `TODO` comments for the user to implement.