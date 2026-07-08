import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillPath = path.join(
    __dirname,
    "..",
    ".github",
    "skills",
    "pr-description-updater",
    "SKILL.md",
);
const contents = fs.readFileSync(skillPath, "utf8");

test("SKILL.md has frontmatter with name and description", () => {
    const frontmatter = contents.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(frontmatter, "missing frontmatter block");
    assert.match(frontmatter![1], /name:\s*pr-description-updater/);
    assert.match(frontmatter![1], /description:\s*.+/);
});

test("SKILL.md defines the required PR body sections", () => {
    for (const heading of [
        "## Summary",
        "## Changes",
        "## Checklist",
        "## Testing",
        "## Notes",
    ]) {
        assert.ok(contents.includes(heading), `missing "${heading}" section`);
    }
});
