export function safeNext(next: unknown) {
  return typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : "/account";
}