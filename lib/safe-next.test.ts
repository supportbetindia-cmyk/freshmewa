// Run: node lib/safe-next.test.ts
import assert from "node:assert/strict";
import { safeNext } from "./safe-next.ts";

assert.equal(safeNext("/checkout"), "/checkout");
assert.equal(safeNext("/shop/pudina?x=1"), "/shop/pudina?x=1");
for (const bad of ["//evil.com", "/\\evil.com", "https://evil.com", "evil.com", "", null, undefined, ["/checkout"]]) {
  assert.equal(safeNext(bad), "/account", String(bad));
}
console.log("safeNext: ok");