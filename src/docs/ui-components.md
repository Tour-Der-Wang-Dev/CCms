# UI Component Strategy

The Content Planning Platform leverages a combination of `shadcn/ui` components and custom-built React components, all styled exclusively with Tailwind CSS, to ensure a consistent, responsive, and maintainable user interface.

## Core Principles

-   **Utility-First Styling**: All styling is applied using Tailwind CSS classes directly in the JSX. This promotes rapid development, consistency, and avoids context switching between HTML and CSS files.
-   **Component Granularity**: Components are kept small, focused, and reusable. Each new component or hook resides in its own dedicated file.
-   **Responsiveness**: All UI elements are designed to be fully responsive, adapting seamlessly across various screen sizes (mobile, tablet, desktop) using Tailwind's responsive utility classes.

## `shadcn/ui` Components

`shadcn/ui` provides a set of accessible and customizable UI components built on Radix UI and styled with Tailwind CSS. These components are preferred for common UI patterns to ensure high quality and accessibility.

**Usage Guidelines**:
-   **Prioritize `shadcn/ui`**: Before creating a custom component, check if a suitable `shadcn/ui` component exists.
-   **No Direct Modification**: Do not modify `shadcn/ui` source files directly. If a component needs significant customization beyond what its props allow, create a new custom component that wraps or extends the `shadcn/ui` component, or build it from scratch using Radix UI primitives if necessary.
-   **Consistent Styling**: Ensure that `shadcn/ui` components are styled to match the application's theme using Tailwind CSS overrides or custom themes where applicable.

*(Note: While `shadcn/ui` is listed in the tech stack, the current codebase does not explicitly use `shadcn/ui` components. If you wish to integrate them, you would typically add them via their CLI and then use them in your components.)*

## Custom Components

For UI elements not covered by `shadcn/ui` or requiring specific application logic, custom React components are created.

**Examples from the codebase**:
-   `src/components/Navigation.tsx`: Handles global navigation and user menu.
-   `src/components/analytics/MetricsOverview.tsx`: Displays key performance metrics.
-   `src/components/calendar/CalendarGrid.tsx`: Renders the main calendar view.
-   `src/components/social/SocialPublisher.tsx`: Manages the social media post creation and scheduling flow.

**Development Guidelines for Custom Components**:
-   **Single Responsibility Principle**: Each component should ideally do one thing well.
-   **Props for Customization**: Use props to make components reusable and configurable.
-   **State Management**: Use React's `useState`, `useEffect`, and `useContext` hooks for local and shared state.
-   **Accessibility**: Design and implement components with accessibility in mind (e.g., proper ARIA attributes, keyboard navigation).
-   **File Structure**: Each component (and related types/hooks) should reside in its own file within the `src/components` directory, organized into logical subdirectories (e.g., `src/components/dashboard`, `src/components/social`).

## Styling with Tailwind CSS

Tailwind CSS is the sole styling framework used in this project.

**Key Practices**:
-   **Utility Classes**: Apply styling directly using Tailwind's utility classes (e.g., `flex`, `p-4`, `bg-blue-500`, `text-white`, `rounded-lg`).
-   **Responsive Design**: Use responsive prefixes (e.g., `sm:`, `md:`, `lg:`) to create adaptive layouts for different screen sizes.
-   **Custom Colors/Fonts**: The `tailwind.config.js` file defines custom colors (e.g., `sage`, `warm-blue`, `dusty-purple`) to maintain brand consistency.
-   **No Custom CSS Files**: Avoid creating separate `.css` files or using inline styles unless absolutely necessary for third-party libraries that cannot be styled with Tailwind.