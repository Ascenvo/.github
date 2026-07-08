---
name: pr-description-updater
description: Update GitHub pull request descriptions from actual PR metadata and diffs. Use when Codex is asked to draft, refresh, rewrite, or update a PR body/description from the current branch, gh pr view output, commits, changed files, or the diff against the base branch.
---

# PR Description Updater

Generate a GitHub PR description from real PR metadata, commit list, changed files, and diff against the base branch. Produce only the PR body, preserve important existing content, and never invent testing.

## Required Body Structure

Use exactly these top-level sections in this order:

```markdown
## Summary

Briefly explain what this PR changes and why.

## Changes

- Group the main code, UI, API, config, documentation, or test changes.
- Avoid listing every small implementation detail.
- Do not include unrelated speculation.

## Checklist

- [ ] Local testing completed
- [ ] Relevant tests added or updated
- [ ] Existing tests pass
- [ ] No unrelated changes included
- [ ] Documentation updated, if needed

## Testing

Describe verified local or automated testing.

If no testing evidence exists, write:

Not run.

## Notes

Mention migration steps, deployment notes, screenshots, reviewer context, known limitations, or breaking changes.

If there are no notes, write:

None.
```

## Evidence Rules

- Base the description only on provided PR metadata, commits, changed files, diff, existing body, and CI/check evidence.
- Preserve ticket links, screenshots, deployment notes, reviewer instructions, breaking change warnings, and manual notes already written by the author.
- Put preserved content in the closest matching section, usually `Notes`.
- Do not invent testing results.
- Leave checklist items unchecked unless there is clear evidence from the existing PR body, commit messages, test command output, CI status, or explicit author notes.
- Mark `Existing tests pass` only when check data shows relevant test checks passed or explicit notes say tests passed.
- If no testing evidence exists, write exactly `Not run.` under `Testing`.
- If there are no notes, write exactly `None.` under `Notes`.
- Avoid listing every file or tiny implementation detail.

## Output Rule

Return only the final markdown PR body. Do not wrap it in code fences and do not include commentary.
