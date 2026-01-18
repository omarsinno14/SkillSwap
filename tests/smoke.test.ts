import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("smoke", () => {
  it("has prisma schema", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");
    expect(schema).toContain("model User");
    expect(schema).toContain("model Post");
  });
});
