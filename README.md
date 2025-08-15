# ContentFlow: Content Planning Platform

ContentFlow is a comprehensive web application designed to streamline content planning, creation, scheduling, and analysis for individuals and teams. It integrates powerful tools for ideation, calendar management, social media publishing, and performance tracking, all powered by React, TypeScript, and Supabase.

## Technical Requirements

To set up and run ContentFlow locally, ensure you have the following installed:

*   **Node.js**: Version 18.x or higher (LTS recommended)
*   **npm** or **Yarn**: Latest stable version (npm 9.x+ or Yarn 1.x/3.x)
*   **Git**: Latest stable version
*   **Supabase CLI**: For local Supabase development (optional, but recommended for database/edge function development)

### System Dependencies and Prerequisites

*   **Web Browser**: A modern web browser (Chrome, Firefox, Edge, Safari) for development and testing.
*   **Internet Connection**: Required for installing dependencies and interacting with Supabase/Ayrshare/Stripe services.

### Environment Variables

ContentFlow relies on environment variables for sensitive information and service configurations. Create a `.env` file in the root of the project based on the `.env.example` template.

| Variable Name             | Description                                                              | Example Value                               |
| :------------------------ | :----------------------------------------------------------------------- | :------------------------------------------ |
| `VITE_SUPABASE_URL`       | Your Supabase project URL.                                               | `https://your-project-id.supabase.co`       |
| `VITE_SUPABASE_ANON_KEY`  | Your Supabase public (anon) key.                                         | `eyJhbGciOiJIUzI1NiI...`                    |
| `VITE_AYRSHARE_API_KEY`   | Your Ayrshare API Key (used by Edge Function).                           | `your_ayrshare_api_key`                     |
| `VITE_STRIPE_SECRET_KEY`  | Your Stripe Secret Key (used by Edge Function).                          | `sk_test_your_stripe_secret`                |
| `VITE_STRIPE_WEBHOOK_SECRET` | Your Stripe Webhook Secret (used by Edge Function).                     | `whsec_your_stripe_webhook_secret`          |
| `VITE_GOOGLE_CLIENT_ID`   | Google OAuth Client ID (if Google auth is enabled in Supabase).          | `your-google-client-id.apps.googleusercontent.com` |
| `VITE_GOOGLE_OAUTH_SECRETS` | Google OAuth Client Secret (if Google auth is enabled in Supabase).      | `your-google-oauth-secret`                  |
| `VITE_VOICE_ID`           | ElevenLabs Voice ID (if voice features are implemented).                 | `your_voice_id`                             |
| `VITE_AGENT_ID`           | AI Agent ID (if AI agent features are implemented).                      | `your_agent_id`                             |
| `VITE_ELEVENLABS_API_KEY` | ElevenLabs API Key (if voice features are implemented).                  | `your_elevenlabs_api_key`                   |
| `VITE_GEMINI_API_KEY`     | Google Gemini API Key (if Gemini AI integration is implemented).         | `your_gemini_api_key`                       |

**Security Note:** Never commit your `.env` file to version control. It is already included in `.gitignore`.

## Installation Guide

Follow these steps to get ContentFlow up and running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/contentflow.git
    cd contentflow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and populate it with the required variables as documented in the "Environment Variables" section above.

4.  **Set up Supabase:**
    ContentFlow uses Supabase for authentication, database, and edge functions.
    *   **Create a Supabase Project:** Go to [Supabase](https://supabase.com/) and create a new project.
    *   **Configure Auth:** Enable Email/Password authentication. If using Google OAuth, configure it in your Supabase project settings.
    *   **Database Schema:** Apply the necessary SQL schema for `profiles`, `stripe_customers`, `stripe_subscriptions`, `stripe_orders`, `social_posts`, `activity_feed`, `content_pillars`, `strategic_goals`, `assets`, `content_ideas`, `content_briefs`, `team_members`, `shared_projects`, and `scheduled_content` tables, including Row Level Security (RLS) policies and the `handle_new_user` function/trigger. Refer to the `architecture.svg` (or its textual representation) and your Supabase project's SQL editor for details.
    *   **Edge Functions:** Deploy the `ayrshare-proxy`, `stripe-checkout`, and `stripe-portal` Edge Functions to your Supabase project. These functions will handle secure API interactions with Ayrshare and Stripe.
    *   **Webhooks:** Configure Stripe webhooks to your Supabase Edge Function endpoint for handling subscription and payment events.

5.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).

### Common Troubleshooting

*   **`npm install` errors:** Ensure Node.js and npm/yarn versions meet the requirements. Clear npm cache (`npm cache clean --force`) and try again.
*   **Environment variables not loading:** Double-check your `.env` file for typos and ensure it's in the root directory. Restart the development server after any changes to `.env`.
*   **Supabase connection issues:** Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct and your Supabase project is active. Check your browser's console for network errors.
*   **Authentication redirects not working:** Ensure `emailRedirectTo` in `AuthContext.tsx` is correctly configured for your deployment environment.

## Development Guidelines

### Code Style Conventions and Formatting

*   **TypeScript First**: All new code should be written in TypeScript (`.ts`, `.tsx`).
*   **Tailwind CSS**: All styling should be done using Tailwind CSS utility classes. Avoid custom CSS files or inline styles unless absolutely necessary.
*   **Component Granularity**: Create small, focused, and reusable React components. Each new component or hook must reside in its own dedicated file.
*   **Shadcn/ui**: Prioritize using `shadcn/ui` components for UI elements.
*   **Lucide React**: Use `lucide-react` for all icons.
*   **Date-fns**: Use `date-fns` for all date manipulation.
*   **ESLint & Prettier**: The project is configured with ESLint for code quality and Prettier for consistent formatting. Ensure your IDE is set up to use these tools on save.
    *   To manually lint and fix: `npm run lint` and `npm run format`.

### Git Workflow

We follow a feature-branch workflow.

1.  **Branch Naming**: Use the format `[type]/[ticket-number]-[description]`.
    *   `type`: `feat` (feature), `fix` (bug fix), `chore` (maintenance), `docs` (documentation), `refactor` (code refactoring).
    *   `ticket-number`: Reference to your issue tracker (e.g., `CP-123`).
    *   `description`: A short, kebab-cased description of the change.
    *   Example: `feat/CP-456-add-social-publisher`

2.  **Commit Messages**: Write clear, concise commit messages. Start with the type and scope, followed by a brief description.
    *   Example: `feat(calendar): Implement new content modal`

### Pull Request Template

When opening a Pull Request, please use the following template:

```markdown
## Description

[Briefly describe the changes introduced by this PR. What problem does it solve? What new functionality does it add?]

## Related Issue(s)

[Link to any relevant GitHub issues, e.g., `Closes #123`, `Fixes #456`]

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactor
- [ ] Chore (e.g., dependency updates, build process changes)

## How Has This Been Tested?

[Describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. List any relevant details for your test configuration.]

- [ ] Manual testing (describe steps)
- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end tests

## Screenshots (if applicable)

[Add screenshots or GIFs demonstrating the changes, especially for UI updates.]

## Checklist

- [ ] My code follows the project's code style guidelines.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] New and existing unit tests pass locally with my changes.
- [ ] Any dependent changes have been merged and published in downstream modules.
```

### Code Review Criteria

*   **Readability**: Is the code easy to understand? Are variable and function names clear?
*   **Maintainability**: Is the code modular and easy to modify in the future?
*   **Correctness**: Does the code correctly implement the intended functionality and handle edge cases?
*   **Performance**: Are there any obvious performance bottlenecks?
*   **Security**: Are there any potential security vulnerabilities (especially for Supabase interactions)?
*   **Adherence to Guidelines**: Does the code follow the established style, architectural, and library usage guidelines?
*   **Testability**: Is the code structured in a way that makes it easy to test?

## Deployment Process

ContentFlow is a client-side React application with a Supabase backend.

1.  **Frontend Deployment**:
    *   The React application can be deployed to any static site hosting service (e.g., Vercel, Netlify, AWS S3 + CloudFront).
    *   Build the application: `npm run build` (or `yarn build`). This will create a `dist/` directory with the production-ready static files.
    *   Configure your hosting service to deploy the contents of the `dist/` directory.
    *   Ensure your environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are correctly set in your hosting provider's environment settings for the production build.

2.  **Supabase Backend**:
    *   Your Supabase project (database, authentication, storage, Edge Functions) is already hosted and managed by Supabase.
    *   **Edge Functions Deployment**: Any changes to `supabase/functions` will need to be deployed via the Supabase CLI or dashboard. Ensure your `AYRSHARE_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and other sensitive keys are set as Supabase Secrets.
    *   **Database Migrations**: Manage database schema changes using Supabase migrations or directly through the SQL Editor.

### Required Credentials and Access Setup

*   **Supabase Project Access**: Ensure your deployment environment has access to your Supabase project's URL and Anon Key.
*   **Ayrshare API Key**: This should be securely stored as a Supabase Secret and accessed only by your Edge Functions.
*   **Stripe API Keys & Webhook Secret**: These should also be securely stored as Supabase Secrets and accessed only by your Edge Functions.

### Rollback Procedures

*   **Frontend**: If a deployment causes issues, revert to a previous working commit in your Git repository and redeploy. Most hosting services provide quick rollback features.
*   **Supabase Edge Functions**: Use the Supabase CLI to revert to a previous function version if a new deployment introduces issues.
*   **Supabase Database**: If a database migration causes issues, revert the migration using Supabase CLI or restore from a recent backup. **Always back up your database before major schema changes.**