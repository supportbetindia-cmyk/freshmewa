// Run: node lib/account.test.ts
import assert from "node:assert/strict";
import { formatAddress, newOrderId, sameAddress, validateAddress, validateCheckout, withDefault } from "./orders.ts";

const good = {
  name: "Asha Rao",
  phone: "9876543210",
  email: "",
  line: "12, MG Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};
assert.deepEqual(validateCheckout(good), {}, "valid form has no errors");

const bad = validateCheckout({ ...good, phone: "12345", pincode: "056003", email: "nope", state: "" });
assert.deepEqual(Object.keys(bad).sort(), ["email", "phone", "pincode", "state"]);
assert.ok(validateCheckout({ ...good, phone: "5876543210" }).phone, "Indian mobiles start 6–9");

assert.match(newOrderId(1700000000000), /^FM-[0-9A-Z]+$/);
assert.ok(sameAddress(good, { ...good, line: "  12, mg road, INDIRANAGAR " }), "address match ignores case/space");

// Add New Address form
const addr = { ...good, name: "", email: "asha@example.com", line2: "", locality: "Indiranagar", landmark: "Metro station" };
assert.deepEqual(validateAddress(addr), {}, "name and optional lines may be blank");
assert.deepEqual(Object.keys(validateAddress({ ...addr, email: "", phone: "" })).sort(), ["email", "phone"]);
assert.equal(
  formatAddress(addr),
  "12, MG Road, Indiranagar, Indiranagar, Near Metro station, Bengaluru, Karnataka 560038",
);

const list = [{ id: "a", ...good }, { id: "b", ...good }, { id: "c", ...good }];
assert.deepEqual(withDefault(list, "c").map((a) => a.id), ["c", "a", "b"], "default moves to the front");
assert.deepEqual(withDefault(list, "zzz").map((a) => a.id), ["a", "b", "c"], "unknown id = unchanged");

console.log("account: all checks passed");
