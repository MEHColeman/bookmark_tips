// Smoke test: package.json parses. A project whose manifest is broken cannot
// install, build or run, so this fails before any real test could.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("the project manifest", () => {
  it("package.json parses to an object", () => {
    const raw = readFileSync(new URL("../package.json", import.meta.url), "utf8");
    const pkg = JSON.parse(raw);
    expect(pkg).toBeTypeOf("object");
    expect(pkg).not.toBeNull();
  });
});
