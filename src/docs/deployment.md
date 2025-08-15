# Deployment Guide

This document outlines the general steps to deploy the Content Planning Platform. The application is a React application, typically deployed as a static site, with its backend services provided by Supabase.

## Prerequisites

Before deploying, ensure you have:
1.  **Node.js and npm/Yarn**: Installed on your local machine.
2.  **Git**: For version control.
3.  **Supabase Project**: A running Supabase project with your database schema and RLS policies configured.
4.  **Ayrshare Account**: An Ayrshare account with your API key.
5.  **Stripe Account**: A Stripe account for payment processing.
6.  **Environment Variables**: All necessary environment variables configured for your deployment environment.

## Environment Variables

The application relies on several environment variables. These should be set in your deployment environment (e.g., Vercel, Netlify, Render, AWS Amplify) and **NOT** committed to your repository.

Create a `.env.local` file in your project root for local development, but ensure it's excluded from version control (it's already in `.gitignore`).

```dotenv
# Supabase Configuration
VITE_SUPABASE_URL="https://ljtuzwiokiupxnqxlkxk.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHV6d2lva2l1cHhucXhsa3hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDYxMjQsImV4cCI6MjA3MDY4MjEyNH0.6ys_VDhZclexcpfETLDA84h2WYtLOe-YSSsMdnwXckY"

# Ayrshare Configuration
VITE_AYRSHARE_API_KEY="YOUR_AYRSHARE_API_KEY" # Get this from your Ayrshare dashboard

# Stripe Configuration (for client-side if needed, but typically handled server-side)
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..." # Your Stripe publishable key
```

**Important**: For production, sensitive keys like `AYRSHARE_API_KEY` should ideally be used in a server-side environment (e.g., Supabase Edge Functions or a dedicated backend) to prevent exposure in the client-side bundle.

## Deployment Steps

### 1. Install Dependencies
Navigate to your project directory and install the required Node.js packages:
```bash
npm install
# or
yarn install
```

### 2. Build the Application
This command compiles your React TypeScript code into optimized static assets:
```bash
npm run build
# or
yarn build
```
The build output will be in the `dist` directory (or `build`, depending on your `vite.config.ts` or `webpack.config.js`).

### 3. Choose a Hosting Provider
You can deploy this application to any static site hosting provider. Popular choices include:
-   **Vercel**: Excellent for React apps, integrates well with Git.
-   **Netlify**: Similar to Vercel, good for continuous deployment.
-   **Render**: Can host static sites and also backend services.
-   **AWS Amplify**: For AWS users, provides a full CI/CD pipeline.

### 4. Configure Deployment

**General Steps for most providers**:
-   **Connect Repository**: Link your Git repository (GitHub, GitLab, Bitbucket) to your hosting provider.
-   **Build Command**: Set the build command to `npm run build` (or `yarn build`).
-   **Output Directory**: Specify the output directory as `dist` (or `build`).
-   **Environment Variables**: Add all necessary `VITE_` prefixed environment variables in your hosting provider's settings.

### 5. Supabase Deployment

Supabase handles its own backend deployment. You manage your database schema, RLS policies, and Edge Functions directly within the Supabase dashboard.
-   **Database Migrations**: Apply any schema changes using Supabase's migration tools or directly in the SQL Editor.
-   **Edge Functions**: Deploy your Edge Functions from the `supabase/functions` directory using the Supabase CLI or dashboard. Ensure all required secrets are set in the Supabase dashboard for your functions.

### 6. Post-Deployment

-   **Domain Setup**: Configure your custom domain if you have one.
-   **SSL/TLS**: Most hosting providers automatically handle SSL certificates.
-   **Monitoring**: Set up monitoring and logging for your deployed application and Supabase project.

By following these steps, your Content Planning Platform should be successfully deployed and accessible.