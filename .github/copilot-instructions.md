# Copilot Instructions for r-stories

## Quick Commands

| Task | Command |
|------|---------|
| Start dev server (hot reload) | `bun run dev` |
| Build for production | `bun run build` |
| Lint and type-check | `bun run lint` then `tsc -b` |
| Preview production build | `bun run preview` |

**Package manager**: Use Bun (not npm/yarn). Install: `bun add <package>`, remove: `bun remove <package>`.

## Architecture

**r-stories** is a React gallery app showcasing R visualization examples. The core architecture:

- **Single-page app** with dynamic routing powered by React Router
- **Markdown-based stories**: Story definitions in `src/stories/` subdirectories as `story.md` files
- **Auto-discovered stories**: All story markdown files are collected via `import.meta.glob()` and parsed by `parseMarkdownStory()`, exported from `src/stories/index.ts`
- **Story model**: Each story has frontmatter (id, title, category, description) and variant sections (each with optional description, R code block, and image)
- **Layout**: Two-column layout with sidebar navigation (organized by category) and main content area showing the preview, code, and variant selector

### Story Loading Pipeline

1. Vite's `import.meta.glob()` loads all `story.md` files as raw text
2. `parseMarkdownStory()` parses frontmatter (YAML-like) and variant sections (headings with code blocks)
3. Each code block followed by an image reference becomes a variant
4. Image paths are resolved relative to the story's folder using `import.meta.url`
5. Stories are filtered to ensure they have at least one valid variant

## Key Conventions

### Adding a New Story

Stories are defined in markdown files. Each story gets its own folder under `src/stories/` (organized by category).

**Example structure:**
```
src/stories/plots/scatter/
├── story.md          # Story definition
├── scatter-basic.png
├── scatter-colored.png
└── scatter-faceted.png
```

**Markdown format** (`src/stories/plots/scatter/story.md`):
```markdown
---
id: plots/scatter
title: Scatter Plot
category: Plots
description: Different ways to create a scatter plot with ggplot2.
---

## Basic

A simple scatter plot.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg)) +
  geom_point()
```

![](./scatter-basic.png)

## Colored

Color points by cylinder count.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg, color = factor(cyl))) +
  geom_point()
```

![](./scatter-colored.png)
```

**Frontmatter fields:**
- `id` – Unique identifier (becomes route path: `/plots/scatter`)
- `title` – Display name for the story
- `category` – Sidebar category grouping
- `description` – Optional story overview

**Variant sections:**
- Each `## Heading` becomes a variant
- Optional text between heading and code block becomes variant description
- `\`\`\`r ... \`\`\`` code block is required
- `![](./image-name.png)` references an image in the same folder (required)
- Variant ID is auto-generated from heading (lowercase, spaces → hyphens)

### Code Style & Linting

- **TypeScript**: Strict mode enabled. Files use `.ts` (data/utilities) or `.tsx` (React components)
- **Linting**: ESLint with React hooks and refresh plugins. Run `bun run lint` before committing
- **Formatting**: No explicit prettier config; follow existing code indentation (2 spaces)
- **Tailwind CSS**: Used for styling. CSS modules in `src/index.css` and component styles inline via class names

### Routing & Navigation

- All routes resolve to `App.tsx` which parses the path and finds the matching story and variant
- Story paths map directly to IDs: `/plots/scatter` → story ID `plots/scatter`
- Variant paths: `/plots/scatter/basic` → story ID `plots/scatter`, variant ID `basic`
- Invalid paths auto-redirect to the first story's first variant

### File Organization

- `src/stories/` – Story definitions (markdown files + images), organized by category folder
- `src/stories/index.ts` – Auto-imports all stories via `import.meta.glob()` and parses them
- `src/stories/types.ts` – TypeScript interfaces (`Story`, `StoryVariant`)
- `src/stories/parseMarkdownStory.ts` – Markdown parser for story files
- `src/App.tsx` – Main router and layout component
- `src/index.css` – Global styles and layout classes

## TypeScript Configuration

The project uses references to split configuration:
- `tsconfig.app.json` – App source code
- `tsconfig.node.json` – Build tooling (Vite config, ESLint)

Compile with `tsc -b` (builds all referenced projects).

## Vite Configuration

- **Base path**: `/r-stories/` (for GitHub Pages deployment)
- **React plugin**: Uses @vitejs/plugin-react (Oxc-based)
- Source maps and HMR enabled in dev mode

## Dependencies to Know

- **React 19.2** – UI framework
- **React Router 7.18** – Client-side routing
- **Shiki 4.5** – Syntax highlighting (available if needed for code blocks)
- **Tailwind CSS 4.3** – Utility-first styling
- **TypeScript 6.0** – Type checking
- **Vite 8.0** – Build tool and dev server
