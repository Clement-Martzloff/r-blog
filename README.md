# Micro Blog

A multi-language blog platform built with Next.js (App Router), featuring markdown-based posts, a liking system, and automated content generation using LLMs.

## Core Features

- **Multi-language Blog:** Displays a list of blog posts and individual post details, supporting English (en-US) and French (fr-FR).
- **Markdown/MDX Content:** Blog posts are written and stored in Markdown/MDX format in the `content/posts/` directory, organized by language.
- **Post Liking:** Anonymous users can "like" individual blog posts. Like counts are stored in the database.
- **Automated Blog Post Generation:** Includes a script (`writePostFromReddit.ts`) that leverages external data sources (like Reddit) and an LLM (e.g., Mistral). The process involves:
  - Fetching source data (e.g., from a specified subreddit).
  - Structuring prompts for the LLM to generate content based on the fetched data.
  - Receiving **structured JSON output from the LLM, adhering to the MDAST (Markdown Abstract Syntax Tree) specification**. This ensures the content is well-formed and predictable.
  - Compiling this MDAST JSON structure into **ready-to-write Markdown/MDX** files using a compiler like Remark (as implemented in `infrastructure/adapters/RemarkMdastCompiler.ts`).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [Neon Serverless PostgreSQL](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Content:** Markdown/MDX
- **Markdown Processing:** [Remark](https://remark.js.org/), [MDAST](https://github.com/syntax-tree/mdast) (for abstract syntax tree representation and generation)
- **AI/LLM:** [Mistral API](https://mistral.ai/) (via `infrastructure/adapters/MistralApiMdastFactory.ts` for generating structured MDAST JSON)

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm, pnpm, or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd micro-blog
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # pnpm install
    # or
    # yarn install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root directory by copying the example (if one exists) or creating it from scratch. You will need the following variables:

    - `DATABASE_URL`: Your Neon Serverless PostgreSQL connection string.
    - `MISTRAL_API_KEY`: Your API key for the Mistral AI service (required for the `reddit-to-post` script).

4.  **Database Setup:**
    Push the database schema to your Neon database:
    ```bash
    npm run db:push
    ```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running the Content Generation Script

To automatically generate a blog post from a Reddit URL using the LLM past the value of your subreddit in the **TARGET_SUBREDDIT** variable in the [writePostFromReddit](/writePostFromReddit.ts).ts and run :

```bash
# Ensure your .env file has MISTRAL_API_KEY
npm run reddit-to-post
# Example:
# npm run reddit-to-post
```

_(Note: Check `writePostFromReddit.ts` for the exact arguments required)_

## Project Structure

- `content/posts/`: Contains the Markdown/MDX blog post files, organized by locale (`en-US`, `fr-FR`).
- `core/`: Defines the core domain logic, use cases, and ports (interfaces) following Ports & Adapters architecture.
  - `domain/`: Core entities and business rules.
  - `ports/`: Interfaces for external dependencies (database, file system, APIs).
  - `usecases/`: Application-specific logic orchestrating domain objects and ports.
- `infrastructure/`: Implementation details for ports and framework-specific code.
  - `adapters/`: Concrete implementations of the ports defined in `core/ports`.
  - `persistence/`: Database interaction logic (Drizzle schema, repositories).
  - `framework/nextjs/`: Next.js specific code (actions, server functions, utilities).
- `src/`: Next.js application code.
  - `app/`: App Router implementation (pages, layouts, components).
  - `components/`: Shared UI components.
  - `lib/`: Utility functions, dictionaries for i18n.
  - `middleware.ts`: Handles internationalization routing.

## Coding Standards & Architecture

- **Ports & Adapters:** The core logic is decoupled from infrastructure concerns using interfaces (ports) and concrete implementations (adapters).
- **SOLID Principles:** Code aims to follow SOLID principles for maintainability and testability.
- **Next.js App Router:** Iincluding Server/Client component usage and file structure.
- **TypeScript:** The entire codebase uses TypeScript for type safety.
- **MDAST for Content Generation:** Leverages MDAST and structured JSON output from LLMs for reliable, automated Markdown generation, ensuring consistency and predictability.
- **Styling:** Uses Tailwind CSS utility classes primarily, with `shadcn/ui` for pre-built components.

## What Could Be Done

- **Parameterize Content Script:** Allow passing arguments (e.g., subreddit, output directory, language) to the `writePostFromReddit.ts` script via CLI flags instead of relying on hardcoded values within the script.
- **User Authentication & Comments:** Implement user accounts and a commenting system.
- **Admin Panel:** Create an interface for managing blog posts, users, and settings.
- **Expanded i18n:** Add support for more languages and improve translation management.
- **Testing:** Increase test coverage (unit, integration, end-to-end).
- **CI/CD:** Set up a continuous integration and deployment pipeline.
- **LLM Enhancements:** Explore more sophisticated LLM integration (e.g., fine-tuning, different models, improved prompt engineering).
- **Content Sources:** Integrate additional automated content sources beyond Reddit.
- **Schema Validation:** Add validation for the LLM's MDAST JSON output to ensure robustness.
