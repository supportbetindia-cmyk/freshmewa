/**
 * Where to go after login. Only our own pages ("/checkout") — never "//evil.com" or "https://evil.com",
 * otherwise anyone could send a "Fresh Mewa login" link that ends on their site (an "open redirect").
 */
export function safeNext(next: unknown) {
  return typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : "/account";
}