# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run generate   # static site generation
npm run preview    # preview production build
npx nuxi typecheck # TypeScript check — must pass before every commit
npm run db:push    # apply schema changes to .data/scenes.sqlite (uses drizzle-kit push)
npm run db:studio  # open Drizzle Studio to inspect the DB
```

## Architecture

**Nuxt 4 + Tailwind v4 + Pinia** browser game with a choose-your-adventure foundation and a visual admin editor.

### Key Nuxt 4 conventions
- `app/` is `srcDir` — all source lives there. `~` resolves to `app/`, not the project root.
- Tailwind v4 via `@tailwindcss/vite` Vite plugin. Single CSS entry: `app/assets/css/main.css`.
- `noUncheckedIndexedAccess` is enabled — array/object indexing returns `T | undefined`. Use `!` assertions only when the value is guaranteed present.

### Game runtime (`/`)
- `app/stores/game.ts` — Pinia store, single source of truth for runtime state: `currentSceneId`, `flags`, `inventory`, `stats`, `history`.
- `app/pages/index.vue` — game loop: reads current scene, renders choices as buttons, calls `choice.effect()` if present, then `game.goToScene()`.
- Scene data is imported statically from `app/data/scenes.json` — flat keyed object `{ [sceneId]: Scene }`. Each scene has `text` and `choices[]`. Choices support optional `condition` and `effect` functions.

### Admin editor (`/admin`)
- `app/stores/admin.ts` — Pinia store holding an editable deep clone of `scenes.json`. All mutations go through store actions (`updateSceneText`, `updateChoiceText`, `updateChoiceTarget`, `renameScene`, `addScene`, `addChoice`, `removeChoice`, `disconnectChoice`). `renameScene` cascades the ID change to all `nextScene` references.
- `app/composables/useAdminGraph.ts` — derives Vue Flow `nodes[]` and `edges[]` from the admin store reactively. BFS from `"start"` computes column depth for auto-layout; stored positions override BFS when available. Node IDs: `scene:{id}`. Edge IDs: `e-scene:{sceneId}:{choiceIdx}-scene:{targetId}`. Edges use `sourceHandle: 'choice:{idx}'` to connect from a specific choice row.
- `app/components/AdminSceneNode.vue` — custom Vue Flow node. Choices are embedded inside the card (not separate nodes). Each choice row has its own `<Handle :id="\`choice:${idx}\`">` on the right. `dragHandle: '.drag-handle'` restricts dragging to the top grip bar. `inheritAttrs: false` is required (fragment root).
- `app/pages/admin.vue` — Vue Flow canvas. `@connect` parses `sourceHandle` to call `updateChoiceTarget`. `@edges-change` on `remove` calls `disconnectChoice`. Components passed to `nodeTypes` must be wrapped with `markRaw()`.
- `server/api/scenes.patch.ts` — upserts all scenes to the DB.
- `server/api/positions.patch.ts` — upserts a single node position (called on every drag-stop).

### Database (Drizzle + SQLite)
- DB file: `.data/scenes.sqlite` (gitignored). Created automatically on first request.
- `server/db/schema.ts` — three tables: `scenes` (id, text, choices as JSON), `node_positions` (scene_id, x, y), `users` (id, name, email, created_at).
- `server/db/index.ts` — singleton `useDb()` with WAL pragma. Import this in any server route that needs the DB.
- `server/db/seed.ts` — `seedIfEmpty()` seeds from `app/data/scenes.json` on the first call to `GET /api/scenes`. After seeding, `scenes.json` is only a fallback seed source.
- `GET /api/scenes` returns `{ scenes: Record<string, Scene>, positions: Record<string, {x,y}> }` — used by both the game page (`useFetch`) and the admin store (`fetchScenes`).
- Schema changes: edit `server/db/schema.ts` then run `npm run db:push`.

### Vue Flow specifics
- `@vue-flow/background`, `@vue-flow/controls`, `@vue-flow/minimap` are separate packages from `@vue-flow/core` — import and add their CSS individually.
- Custom node components need `inheritAttrs: false` when they have a fragment root (card div + Handle siblings).
- Components in `nodeTypes` must be wrapped with `markRaw()` from Vue.

## Commit style

Short single-line messages, no body, no co-author trailers. Always run `npx nuxi typecheck` first.
