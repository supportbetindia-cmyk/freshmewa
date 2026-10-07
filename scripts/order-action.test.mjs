// Run: node scripts/order-action.test.mjs — no live database or orders are touched.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/admin/(panel)/orders/actions.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
let result = { id: "FM-TEST" };
let failure;
let writes = 0;
const refreshed = [];
const exports = {};
const dependencies = {
  "next/cache": { revalidatePath: (...args) => refreshed.push(args) },
  "@/lib/orders": { orderStatuses: ["placed", "shipped", "delivered", "cancelled"] },
  "@/lib/db/orders": { setOrderStatus: async () => { writes++; if (failure) throw failure; return result; } },
};
runInNewContext(outputText, { exports, require: (name) => {
  assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
  return dependencies[name];
} });
const submit = (id, status) => {
  const data = new FormData();
  data.set("id", id);
  data.set("status", status);
  return exports.updateStatus(null, data);
};

assert.ok((await submit("", "shipped")).error);
assert.ok((await submit("   ", "shipped")).error);
assert.ok((await submit("FM-TEST", "invalid")).error);
assert.equal(writes, 0);
result = undefined;
assert.match((await submit("FM-TEST", "shipped")).error, /no longer exists/);
assert.equal(refreshed.length, 0);
result = { id: "FM-TEST" };
assert.ok((await submit("FM-TEST", "shipped")).success);
assert.deepEqual(refreshed, [["/admin/orders", "layout"]]);
failure = new Error("Database unavailable");
await assert.rejects(submit("FM-TEST", "shipped"), (error) => error === failure);
assert.equal(refreshed.length, 1);
console.log("Order action: invalid input, missing order, success and unexpected error checks passed.");
