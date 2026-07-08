import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workflowsDir = path.join(__dirname, "..", ".github", "workflows");
const workflowFiles = fs
    .readdirSync(workflowsDir)
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

test("workflows directory is not empty", () => {
    assert.ok(workflowFiles.length > 0, "expected at least one workflow file");
});

for (const file of workflowFiles) {
    test(`${file} parses as valid YAML`, () => {
        const contents = fs.readFileSync(path.join(workflowsDir, file), "utf8");
        const doc = load(contents) as Record<string, unknown>;
        assert.ok(
            doc && typeof doc === "object",
            `${file} did not parse to an object`,
        );
    });

    test(`${file} declares jobs and a trigger`, () => {
        const contents = fs.readFileSync(path.join(workflowsDir, file), "utf8");
        const doc = load(contents) as Record<string, unknown>;
        assert.ok(
            doc.jobs && Object.keys(doc.jobs).length > 0,
            `${file} has no jobs`,
        );
        assert.ok(doc.on, `${file} has no "on" trigger`);
    });
}
