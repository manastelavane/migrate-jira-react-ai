# Angular to Next.js Migration Plan (Same Codebase)

> For agentic workers: use this file as the single migration source of truth. Keep checkbox status updated as work progresses.

## Goal

Migrate the existing Angular app in this repository to a React/Next.js app incrementally, without creating a new repository, while preserving feature behavior and reducing downtime risk.

## Current Status

- [x] Next.js app scaffolded in same repo at `apps/next`
- [x] Root scripts added to run both Angular and Next.js
- [x] Shared contracts extracted and consumed by both apps
- [x] Project routes implemented in Next.js
- [x] Board page migrated (read-only first)
- [x] Issue detail page migrated (read-only first)
- [x] State and data layer migrated from Akita-based flow
- [x] Interaction features migrated (DnD, modal workflows, editors)
- [ ] Test migration completed (unit + e2e)
- [ ] Angular app and dependencies removed

## Scope and Constraints

- Same repository only (no new codebase)
- Parallel run approach: Angular remains available until parity is reached
- Migrate by vertical slices (route-by-route), not by big-bang rewrite
- Prioritize core user flows first (board and issue detail)

## Target Repository Structure

```text
.
├── apps/
│   ├── next/
│   │   ├── src/
│   │   │   ├── app/                         # Next App Router pages/layouts
│   │   │   │   ├── (project)/
│   │   │   │   │   └── project/
│   │   │   │   │       ├── board/page.tsx
│   │   │   │   │       ├── settings/page.tsx
│   │   │   │   │       └── issue/[id]/page.tsx
│   │   │   ├── components/                  # Reusable UI components
│   │   │   │   ├── common/
│   │   │   │   ├── board/
│   │   │   │   ├── issue/
│   │   │   │   └── layout/
│   │   │   ├── config/                      # App config, env mapping, constants
│   │   │   ├── interfaces/                  # App-facing TS interfaces/types
│   │   │   ├── utils/                       # Pure helpers
│   │   │   ├── hooks/                       # Custom React hooks
│   │   │   ├── services/                    # API/data-access layer
│   │   │   ├── store/                       # Zustand store slices/selectors
│   │   │   ├── providers/                   # Query/Sentry/theme providers
│   │   │   └── styles/                      # Global/theme styles
│   │   ├── public/
│   │   ├── next.config.ts
│   │   └── package.json
│   └── (angular stays in current root during migration)
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── interfaces/                  # Domain contracts shared by Angular + Next
│       │   ├── constants/
│       │   ├── adapters/                    # Transform legacy JSON -> UI/domain shape
│       │   └── utils/
└── docs/plans/
    └── 2026-06-12-angular-to-nextjs-migration-plan.md
```

Note: Angular can remain at root during migration for speed. Optional re-organization to `apps/angular` can be done after major parity.

## Library Migration Matrix

| Angular / Current | Next.js / React Replacement | Decision |
|---|---|---|
| `@angular/core`, `@angular/common`, `@angular/platform-browser*` | `next`, `react`, `react-dom` | Required |
| `@angular/router` | Next App Router (`app/` + `next/navigation`) | Required |
| `@angular/forms` | `react-hook-form` + `zod` + `@hookform/resolvers` | Required |
| `@datorama/akita` (+ Akita plugins) | `zustand` + `@tanstack/react-query` | Required |
| `ng-zorro-antd` | `antd` (React) | Recommended for faster UI parity |
| `@ant-design/icons-angular` | `@ant-design/icons` | Required if using Ant Design |
| `@angular/cdk` drag-drop | `@dnd-kit/core` + `@dnd-kit/sortable` | Required for board interactions |
| `ngx-quill` + `quill` | `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/pm` | Chosen: Tiptap (React 19 compatible; react-quill dropped React 19 support) |
| `@ngneat/content-loader` | `react-content-loader` or `antd` Skeleton | Optional |
| `@ngneat/until-destroy` | Native React cleanup in `useEffect` | Remove |
| `@sentry/angular` | `@sentry/nextjs` | Required |
| Protractor (`e2e/`) | Playwright | Required |
| `vitest` | Keep Vitest + React Testing Library, or move to Jest | Keep Vitest initially |

## Phase Plan

## Phase 0: Baseline and Runtime Safety (Completed/In Progress)

- [x] Scaffold Next.js app in `apps/next`
- [x] Add root scripts to run both applications
- [ ] Add a lightweight migration command set at root (`dev:next`, `dev:angular`, `build:next`)
- [ ] Confirm both apps run independently without port conflicts

Exit criteria:
- Angular runs as before
- Next.js runs in parallel

## Phase 1: Shared Contracts First

Purpose: stabilize data model before UI migration.

- [x] Create `packages/shared/src/interfaces` and move/copy shared domain interfaces:
  - Issue
  - Project
  - User
  - Comment
- [x] Add `packages/shared/src/constants` for reusable enums/maps (issue type, priority, status)
- [x] Add `packages/shared/src/adapters` to normalize existing JSON payloads for Next usage
- [x] Add `apps/next/src/interfaces` for UI-specific view models (if different from domain interfaces)
- [x] Add `apps/next/src/utils` and `apps/next/src/config` baseline files
- [x] Wire path aliases so Next app can import shared contracts and local modules cleanly
- [x] Keep Angular app untouched functionally

Exit criteria:
- Next app compiles while importing shared interfaces from `packages/shared`
- At least one page in Next renders data using shared types

## Phase 2: Route Skeleton and Layout in Next

Purpose: establish route parity quickly.

- [x] Add Next routes:
  - `/project/board`
  - `/project/settings`
  - `/project/issue/[id]`
- [x] Add `/` redirect to `/project/board`
- [x] Build base layout shell (sidebar/header/content)
- [x] Add navigation links between core routes

Exit criteria:
- Route parity exists for primary project flows
- Navigation works end-to-end

## Phase 3: Board Page Migration (Read-Only First)

Purpose: migrate the highest-value screen first.

- [x] Render board columns using shared data
- [x] Render issue cards and key metadata
- [x] Add card click to issue detail route
- [x] Keep this phase read-only (no drag/drop edits yet)

Exit criteria:
- Board page provides functional read parity for viewing and navigation

## Phase 4: Issue Detail and Settings (Read-Only)

- [x] Build issue detail page with core fields:
  - title
  - description
  - assignee
  - comments
- [x] Build settings route initial stub + project metadata
- [x] Ensure data loading and route fallback states

Exit criteria:
- Issue detail route is usable and stable
- Settings route exists and is navigable

## Phase 5: State, Data Fetching, and Forms

Purpose: replace Angular state and forms strategy.

- [x] Introduce React Query provider in Next root layout
- [x] Implement data services for project and issue resources
- [x] Introduce Zustand for cross-page UI state (filters, modal visibility)
- [x] Migrate form flows with React Hook Form + Zod validation

Exit criteria:
- No Akita dependency required for migrated Next pages
- Core create/edit flows can be implemented without Angular services

## Phase 6: Advanced Interactions

- [x] Migrate drag and drop board behavior using DnD Kit
- [x] Migrate modal workflows (create/update issue)
- [x] Migrate rich text editor functionality (choose `react-quill` or `@tiptap/react`)
- [x] Add optimistic UI updates where needed

Exit criteria:
- Feature behavior close to current Angular app for key interactions

## Phase 7: Testing and Observability

- [ ] Unit/component tests in Next (Vitest + React Testing Library)
- [ ] E2E migration from Protractor to Playwright for critical happy paths
- [ ] Sentry integration with `@sentry/nextjs`

Exit criteria:
- Minimum test coverage on core routes
- Smoke e2e for board -> issue detail flow

## Phase 8: Angular Decommission and Cleanup

Only start this phase after route and interaction parity.

- [ ] Remove Angular runtime files/configs when no longer needed:
  - `angular.json`
  - Angular app bootstrap/runtime files
  - Angular-specific tsconfig files as applicable
- [ ] Remove Angular dependencies from `package.json`:
  - all `@angular/*`
  - Akita Angular integrations
  - `ng-zorro-antd` and Angular icon package
  - Angular-only testing and builder dependencies
- [ ] Remove Protractor setup and legacy e2e config
- [ ] Prune lockfile and verify clean install
- [ ] Update README with Next.js-first runbook

Exit criteria:
- Repository builds and runs with Next.js only
- No Angular dependencies remain

## Implementation Order (Strict Priority)

1. Shared contracts
2. Route skeleton
3. Board read-only
4. Issue detail read-only
5. State/forms replacement
6. Interactions (DnD/editor/modals)
7. Tests
8. Angular removal

## Suggested Incremental PR Plan

1. PR-01: shared contracts + alias wiring
2. PR-02: route skeleton + app layout
3. PR-03: board read-only
4. PR-04: issue detail + settings baseline
5. PR-05: state/forms migration
6. PR-06: interaction features
7. PR-07: tests + sentry
8. PR-08: angular decommission

## Risks and Mitigation

- UI parity drift:
  - Mitigation: use Ant Design React components for rapid parity.
- Data contract mismatch:
  - Mitigation: enforce shared adapters early in Phase 1.
- Migration fatigue from large scope:
  - Mitigation: merge in thin vertical slices (small PRs).
- Premature Angular deletion:
  - Mitigation: do not remove Angular until Phase 8 criteria are met.

## Next Action Checklist

Immediate next work session should execute these items in order:

1. Create `packages/shared/src/interfaces` and move first 4 domain contracts.
2. Add `packages/shared/src/adapters` utilities for `assets/data/project.json` and `assets/data/auth.json`.
3. Create Next baseline folders: `components`, `config`, `interfaces`, `utils`, `hooks`, `services`, `store`, `providers`.
4. Wire Next imports to shared contracts and local module aliases.
5. Implement `/project/board` route rendering read-only data via new services/adapters.
