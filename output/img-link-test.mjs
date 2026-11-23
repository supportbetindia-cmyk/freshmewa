// Scratch check for the cover-image link rule in app/admin/(panel)/blog/actions.ts (same regex).
const isImageLink = (s) => /^\/(?![/\\])\S+$/.test(s) || /^https:\/\/\S+$/.test(s);
const cases = [["/images/blog/a.jpg", true], ["https://cdn.example.com/a.webp", true], ["//evil.com/a.jpg", false], ["/\\evil.com", false],
  ["javascript:alert(1)", false], ["http://x.com/a.jpg", false], ["images/a.jpg", false], ["/images/a b.jpg", false], ["https://", false]];
let bad = 0;
for (const [v, want] of cases) { const got = isImageLink(v); if (got !== want) bad++; console.log(got === want ? "ok  " : "FAIL", JSON.stringify(v), "->", got); }
process.exit(bad);
