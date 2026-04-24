# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run generate   # static site generation
npm run preview    # preview production build
```

## Architecture

**Nuxt 4 + Tailwind v4 + Pinia** browser game with a choose-your-adventure foundation designed to support unique custom mechanics beyond typical CYOA.

**Key architectural points:**

- Nuxt 4 uses `app/` as `srcDir` — all source lives under `app/`. The `~` alias resolves to `app/`, not the project root.
- Tailwind v4 is wired via `@tailwindcss/vite` Vite plugin (not `@nuxtjs/tailwindcss`). The single CSS entry is `app/assets/css/main.css` with `@import "tailwindcss"`.
- Pinia store (`app/stores/game.ts`) is the single source of truth for all game state: `currentSceneId`, `flags`, `inventory`, `stats`, `history`. Extend this store for any new mechanics (combat, skill checks, timers, etc.).
- Scene data lives in `app/data/scenes.json` as a flat keyed object `{ [sceneId]: Scene }`. Each scene has `text` and `choices[]`. Choices support optional `condition` and `effect` functions for conditional branching and side effects.
- `app/pages/index.vue` drives the game loop: reads the current scene from the store, renders choices, calls `choice.effect()` if present, then calls `game.goToScene()`.
- Adventures can also be authored as Markdown files in `content/adventures/`. Nuxt Content (backed by `better-sqlite3`) processes them at build/dev time. Scene metadata goes in the frontmatter; narrative prose goes in the body. Use `queryCollection('content')` composable to fetch adventure data at runtime.

## Commit style

Short single-line messages, no body, no co-author trailers.
