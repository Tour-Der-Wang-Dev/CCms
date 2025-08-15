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

Directory names MUST be all lower-case (src/pages, src/components, etc.). File names may use mixed-case if you like.