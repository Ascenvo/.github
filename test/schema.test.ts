import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(
    __dirname,
    "..",
    ".github",
    "schemas",
    "pr-description-body.schema.json",
);

test("pr-description-body.schema.json is valid JSON", () => {
    const contents = fs.readFileSync(schemaPath, "utf8");
    assert.doesNotThrow(() => JSON.parse(contents));
});

test('pr-description-body.schema.json requires a string "body" field', () => {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    assert.equal(schema.type, "object");
    assert.ok(
        Array.isArray(schema.required) && schema.required.includes("body"),
    );
    assert.equal(schema.properties?.body?.type, "string");
});
