// Cookie lab — recreates what @neondatabase/auth does with session_data (same lib: jose, same alg: HS256).
// Uses a FAKE secret, not yours. Run: node output/cookie-lab.mjs
import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { createHmac, randomBytes } from "node:crypto";

const secret = new TextEncoder().encode("lab-secret-not-the-real-one-1234567890");
const line = (t) => console.log(`\n── ${t} ${"─".repeat(Math.max(3, 70 - t.length))}`);

line("1. Session token = random bytes");
const token = randomBytes(24).toString("base64url");
console.log("session_token:", token, `(${token.length} chars, 2^192 possibilities — can't be guessed)`);

line("2. Server signs session_data (what line 418-432 of the SDK does)");
const jwt = await new SignJWT({ user: { id: "u_123", email: "customer@example.com", role: "user" } })
  .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("5m").setSubject("u_123").sign(secret);
const [h, p, s] = jwt.split(".");
console.log("cookie value:", jwt.slice(0, 60) + "…");
console.log("  header   :", Buffer.from(h, "base64url").toString());
console.log("  payload  :", Buffer.from(p, "base64url").toString(), " ← readable by anyone!");
console.log("  signature:", s);

line("3. The signature is just HMAC-SHA256(header.payload, secret)");
const manual = createHmac("sha256", secret).update(`${h}.${p}`).digest("base64url");
console.log("computed by hand:", manual, manual === s ? "✓ same" : "✗");

line("4. Server verifies (SDK line 572: jwtVerify)");
console.log("valid:", (await jwtVerify(jwt, secret)).payload.user);

line("5. ATTACK: customer edits role → admin");
const evilPayload = Buffer.from(JSON.stringify({ ...decodeJwt(jwt), user: { id: "u_123", email: "customer@example.com", role: "admin" } })).toString("base64url");
await jwtVerify(`${h}.${evilPayload}.${s}`, secret).then(() => console.log("accepted?!"), (e) => console.log("rejected:", e.code));

line("6. ATTACK: forge a new signature with a guessed secret");
const forged = await new SignJWT({ user: { id: "u_123", role: "admin" } }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("5m")
  .sign(new TextEncoder().encode("password123"));
await jwtVerify(forged, secret).then(() => console.log("accepted?!"), (e) => console.log("rejected:", e.code));

line("7. ATTACK: 'alg: none' (classic JWT bug — no signature at all)");
const none = `${Buffer.from('{"alg":"none"}').toString("base64url")}.${evilPayload}.`;
await jwtVerify(none, secret, { algorithms: ["HS256"] }).then(() => console.log("accepted?!"), (e) => console.log("rejected:", e.code));

line("8. Expiry: a 5-minute cookie, checked 6 minutes later");
const old = await new SignJWT({ user: { id: "u_123" } }).setProtectedHeader({ alg: "HS256" })
  .setIssuedAt(Math.floor(Date.now() / 1000) - 360).setExpirationTime(Math.floor(Date.now() / 1000) - 60).sign(secret);
await jwtVerify(old, secret).then(() => console.log("accepted?!"), (e) => console.log("rejected:", e.code, "→ SDK falls back to asking Neon with session_token"));

line("9. What the browser stores (one Set-Cookie line)");
console.log(`Set-Cookie: __Secure-neon-auth.local.session_data=${jwt.slice(0, 20)}…; Path=/; Max-Age=300; HttpOnly; Secure; SameSite=Lax`);
console.log("cookie size:", jwt.length, "bytes (browsers cap each cookie at ~4096)");
