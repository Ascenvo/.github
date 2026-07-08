# .github

Central workflow repository for the Ascenvo organization. Reusable GitHub Actions workflows defined here are called from other repos via `workflow_call`, so CI, branch policy, and PR automation stay consistent org-wide without being duplicated in every project.

## Workflows

All workflows live in [`.github/workflows`](.github/workflows) and support both direct triggers and `workflow_call` reuse.

- **`ci.yml`** (`status-checks`) — Runs on PRs into `develop`/`production`/`release/**` and on pushes to `production`/`develop`. Detects whether the repo is a Node project and, if so, runs `lint`, `format-check`, `typecheck`, `test`, and `test:coverage` (each only `--if-present`), uploads a coverage artifact when produced, then builds.
- **`branch-policy.yml`** — Runs on PRs targeting `production`. Fails unless the PR's head branch is `develop` or `release/*`, enforcing that `production` only receives promotions from those branches.
- **`pr-description.yml`** — Runs on PR open/reopen/synchronize. Gathers PR metadata, commits, changed files, and diff via `gh` and `git`, sends them to a configured chat-completions API (`API_KEY` / `API_BASE_URL` / `MODEL` secrets) along with the prompt in [`skills/pr-description-updater/SKILL.md`](.github/skills/pr-description-updater/SKILL.md), validates the response against [`schemas/pr-description-body.schema.json`](.github/schemas/pr-description-body.schema.json), and updates the PR body via `gh pr edit` if it changed. Skips fork PRs (no secrets access on `pull_request` events).

## Other files

- **`CODEOWNERS`** — Requires `@ascenvo/platform-engineering-team` review on all changes.
- **`schemas/pr-description-body.schema.json`** — JSON Schema the AI-generated PR description output must satisfy.
- **`skills/pr-description-updater/SKILL.md`** — Prompt/instructions defining the required PR description structure (Summary, Changes, Checklist, Testing, Notes) and evidence rules (no invented test results, preserve existing manual content).

## Development

This repo is itself a Node/TypeScript project (used to test the workflow logic and tooling):

```bash
npm install
npm run lint          # eslint
npm run format-check  # prettier --check
npm run typecheck     # tsc --noEmit
npm test              # tsx --test test/*.test.ts
npm run test:coverage
```

Tests in [`test/`](test) cover the workflow YAML (`workflows.test.ts`), the PR description schema (`schema.test.ts`), and the skill file (`skill.test.ts`).
