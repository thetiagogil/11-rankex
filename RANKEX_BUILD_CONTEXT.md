# Rankex MVP Build Context

Current date: May 20, 2026.

## Project

Build `11-rankex` as a Next.js + TypeScript + Supabase app.

Project path:

```txt
C:\Users\talme\Documents\Dev\Tiago\11-rankex
```

Reference project:

```txt
C:\Users\talme\Documents\Dev\Tiago\rankex-reference
```

`11-rankex` currently only contains `.git`, so treat it as a fresh scaffold.

## Reference Project Notes

`rankex-reference` is a Vite/TanStack Router app with localStorage state. Use it as visual/product reference only.

Reference stack observed:

```txt
Vite
React 19
TanStack Router
Tailwind CSS 4
Radix/shadcn-style components
lucide-react
framer-motion
@dnd-kit drag and drop
localStorage auth/list/social stores
```

Important reference files:

```txt
src/routes/index.tsx
src/routes/dashboard.tsx
src/routes/explore.tsx
src/routes/list.$listId.tsx
src/routes/settings.tsx
src/routes/u.$handle.tsx
src/lib/tracker-store.ts
src/lib/auth-store.tsx
src/lib/social-store.tsx
src/components/app-header.tsx
src/components/tracker/NewListDialog.tsx
src/components/tracker/ItemDialog.tsx
src/components/tracker/SortableItemList.tsx
src/components/tracker/TierView.tsx
src/styles.css
```

The reference product is currently branded as `Tops X Tracker`; final app should be `Rankex`.

The reference has some mojibake/encoding issues in emoji strings. Do not blindly copy those strings.

## Product Direction

Rankex is a ranked-list app.

Recommended MVP:

- landing page
- auth page
- server-side demo login
- protected dashboard
- create/edit/delete ranked lists
- public/private list visibility
- add/edit/delete list items
- drag-and-drop reorder list items
- item fields: title, note, score, tier
- ranked view
- tier view
- explore page for public lists
- settings page for shared profile fields
- mobile acceptable
- build/lint pass
- no service-role key in app runtime

Defer unless explicitly requested:

- full social graph
- comments
- follows
- notifications
- uploads/avatars
- external APIs
- admin tooling
- payments
- complex sharing/remix flows

The reference includes likes, bookmarks, follows, comments, remixing, profiles, and explore. Treat these as later-phase unless the user confirms they are MVP requirements.

## Target App Architecture

Follow the same architecture used in `10-echoes`:

```txt
src/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ providers.tsx
│  ├─ auth/
│  ├─ login/
│  ├─ api/auth/demo/route.ts
│  └─ (protected)/
│     ├─ layout.tsx
│     ├─ dashboard/
│     ├─ lists/[listId]/
│     ├─ explore/
│     └─ settings/
├─ features/
│  ├─ auth/
│  ├─ lists/
│  └─ settings/
├─ shared/
│  ├─ components/
│  ├─ constants/
│  ├─ server/
│  └─ utils/
├─ lib/
│  ├─ env.ts
│  ├─ routing/
│  └─ supabase/
└─ types/
   └─ database.types.ts
```

Dependency direction:

```txt
app -> features -> shared/lib
```

Domain ownership:

```txt
features/lists = ranked-list domain
app/(protected)/dashboard = route composition
app/(protected)/lists/[listId] = route composition
app/(protected)/explore = route composition
features/settings = profile/settings behavior
shared = reusable UI/layout/auth helpers
lib = env, routing, Supabase infrastructure
```

## Auth

Follow `10-echoes` auth pattern:

- Supabase SSR auth
- protected route group
- `requireUser()`
- `POST /api/auth/demo`
- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`
- never expose demo password in UI
- no service-role key in app runtime

Use the shared Supabase project and shared `core.profiles`.

Settings should edit shared profile fields:

```txt
core.profiles.display_name
core.profiles.username
core.profiles.bio
```

## Database Direction

Use `00-databases` shared Supabase project.

Observed current state:

```txt
00-databases/projects/shared/supabase/config.toml
```

already exposes `rankex` in the API schemas list:

```txt
schemas = ["core", "easyqa", "trackio", "echoes", "rankex", "public", "graphql_public"]
```

But there is no Rankex schema folder yet.

Create:

```txt
00-databases/projects/shared/schema/rankex
```

Recommended MVP schema:

```txt
rankex.lists
rankex.list_items
```

Suggested table shape:

```txt
rankex.lists:
id bigint identity primary key
user_id uuid references core.profiles(id) on delete cascade
title text not null
topic text
emoji text
description text
is_public boolean not null default false
created_at timestamptz
updated_at timestamptz

rankex.list_items:
id bigint identity primary key
list_id bigint references rankex.lists(id) on delete cascade
title text not null
note text
score integer null check 0-100
tier text null check in ('S','A','B','C','D')
position integer not null
created_at timestamptz
updated_at timestamptz
```

RLS:

- owners can select/insert/update/delete their own lists
- authenticated and anon users can select public lists
- owners can manage items in their own lists
- authenticated and anon users can select items for public lists
- no anon writes
- no service-role key in app runtime

Add deterministic demo seed later:

```txt
00-databases/projects/shared/seeds/demo/rankex_demo.sql
```

Update local Supabase seed config so local reset includes Rankex demo data.

Regenerate shared database types after schema changes.

If `@thetiagogil/shared-db-types` is available, use it. Otherwise follow `10-echoes` local `src/types/database.types.ts` pattern and keep imports isolated.

## UI Direction

Use `rankex-reference` visual language:

- dark editorial background
- gold primary gradient
- serif display headings
- clean dense cards
- ranked podium/rank badges
- tier badges S/A/B/C/D
- dashboard cards
- public/private visibility pills
- drag handle for reordering
- responsive mobile layout

Do not copy the reference architecture or localStorage stores.

Use `10-echoes` component discipline:

- route components stay route-local under `_components`
- list domain components live under `features/lists/components`
- validation and formatting live under `features/lists/lib`
- mutations and queries live under `features/lists/server`
- keep client components focused; extract hooks/components when files get large

## Verification

Before calling done:

```txt
npm run lint
npm run build
```

Use Browser to check:

- landing page
- auth/demo login
- dashboard
- create list
- add item
- reorder item
- list detail mobile layout
- explore public list view
- settings page
