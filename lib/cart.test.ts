// Run: node lib/cart.test.ts
import assert from "node:assert/strict";
import { addLine, countItems, setLineQty } from "./cart.ts";

let lines = addLine([], "pudina", "60g");
lines = addLine(lines, "pudina", "60g", 2);
lines = addLine(lines, "pudina", "250g");
lines = addLine(lines, "peri-peri", "60g");
assert.deepEqual(lines, [
  { slug: "pudina", pack: "60g", qty: 3 },
  { slug: "pudina", pack: "250g", qty: 1 },
  { slug: "peri-peri", pack: "60g", qty: 1 },
]);
assert.equal(countItems(lines), 5);

assert.equal(addLine(lines, "pudina", "60g", 99)[0].qty, 20, "qty is capped");
assert.equal(setLineQty(lines, "pudina", "60g", 0).length, 2, "qty 0 removes only that pack");
assert.equal(setLineQty(lines, "pudina", "250g", 4)[1].qty, 4);

console.log("cart: all checks passed");
