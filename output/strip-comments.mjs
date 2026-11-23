import fs from "node:fs";
import ts from "typescript";

const KEEP = /eslint-disable|@ts-(ignore|expect-error|nocheck)/;
let total = 0;

for (const file of process.argv.slice(2)) {
  const text = fs.readFileSync(file, "utf8");
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : file.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  const found = new Map();
  const add = (pos, end) => found.set(`${pos}:${end}`, [pos, end]);
  const take = (list) => list?.forEach((r) => !KEEP.test(text.slice(r.pos, r.end)) && add(r.pos, r.end));

  const visit = (node) => {
    if (ts.isJsxExpression(node) && !node.expression) {
      if (!KEEP.test(text.slice(node.getStart(sf), node.getEnd()))) add(node.getStart(sf), node.getEnd());
      return;
    }
    take(ts.getLeadingCommentRanges(text, node.getFullStart()));
    take(ts.getTrailingCommentRanges(text, node.getEnd()));
    for (const child of node.getChildren(sf)) visit(child);
  };
  visit(sf);

  const ranges = [...found.values()]
    .map(([pos, end]) => {
      const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
      let lineEnd = text.indexOf("\n", end);
      if (lineEnd === -1) lineEnd = text.length;
      if (!text.slice(lineStart, pos).trim() && !text.slice(end, lineEnd).trim()) return [lineStart, Math.min(lineEnd + 1, text.length)];
      while (pos > lineStart && /[ \t]/.test(text[pos - 1])) pos--;
      return [pos, end];
    })
    .sort((a, b) => a[0] - b[0] || b[1] - a[1])
    .reduce((merged, r) => {
      const last = merged.at(-1);
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push([...r]);
      return merged;
    }, []);
  if (!ranges.length) continue;

  let out = "";
  let at = 0;
  for (const [pos, end] of ranges) {
    out += text.slice(at, pos);
    at = end;
  }
  out += text.slice(at);
  out = out.replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "");
  fs.writeFileSync(file, out);
  total += found.size;
  console.log(`${String(found.size).padStart(3)}  ${file}`);
}
console.log(`removed ${total} comments`);
