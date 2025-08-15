# Contributing to ContentFlow

We welcome contributions to ContentFlow! By contributing, you agree to abide by our Code of Conduct.

## How to Contribute

1.  **Fork the Repository**: Start by forking the ContentFlow repository to your GitHub account.
2.  **Clone Your Fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/your-username/contentflow.git
    cd contentflow
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Create a New Branch**: Create a new branch for your feature or bug fix. Follow the branch naming conventions: `[type]/[ticket-number]-[description]` (e.g., `feat/CP-123-add-dark-mode`).
    ```bash
    git checkout -b feat/CP-123-add-dark-mode
    ```
5.  **Make Your Changes**: Implement your feature or fix the bug.
    *   Adhere to the [Code Style Conventions](#code-style-conventions-and-formatting).
    *   Write clear and concise [Commit Messages](#commit-messages).
    *   Ensure your changes are tested.
6.  **Test Your Changes**: Run local tests to ensure everything is working as expected.
    ```bash
    npm run dev
    # or
    yarn dev
    ```
7.  **Commit and Push**: Commit your changes and push them to your fork.
    ```bash
    git add .
    git commit -m "feat(ui): Implement dark mode toggle"
    git push origin feat/CP-123-add-dark-mode
    ```
8.  **Open a Pull Request**: Go to the original ContentFlow repository on GitHub and open a new Pull Request from your branch. Fill out the [Pull Request Template](#pull-request-template) completely.

## Code Style Conventions and Formatting

*   **TypeScript First**: All new code should be written in TypeScript (`.ts`, `.tsx`).
*   **Tailwind CSS**: All styling should be done using Tailwind CSS utility classes.
*   **Component Granularity**: Create small, focused, and reusable React components. Each new component or hook must reside in its own dedicated file.
*   **ESLint & Prettier**: The project uses ESLint for code quality and Prettier for consistent formatting. Ensure your IDE is configured to use these tools on save.
    *   You can manually run linting and formatting:
        ```bash
        npm run lint
        npm run format
        ```

## Git Workflow

*   **Branch Naming**: `[type]/[ticket-number]-[description]`
    *   `type`: `feat`, `fix`, `chore`, `docs`, `refactor`
    *   `ticket-number`: (Optional) Reference to an issue tracker ID (e.g., `CP-123`)
    *   `description`: Kebab-cased, short description
    *   Example: `feat/CP-456-add-social-publisher`
*   **Commit Messages**: Start with `type(scope): message` (e.g., `feat(calendar): Implement new content modal`).

## Pull Request Template

Please use the provided Pull Request template when submitting your PR. It helps ensure all necessary information is included for a smooth review process.

## Code Review Criteria

Your Pull Request will be reviewed based on:

*   **Readability**: Is the code easy to understand?
*   **Maintainability**: Is it modular and easy to modify?
*   **Correctness**: Does it work as expected and handle edge cases?
*   **Performance**: Are there any obvious bottlenecks?
*   **Security**: Are there any vulnerabilities, especially with Supabase interactions?
*   **Adherence to Guidelines**: Does it follow project conventions?
*   **Testability**: Is the code easy to test?

Thank you for contributing to ContentFlow!