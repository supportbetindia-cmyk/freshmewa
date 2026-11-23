// Scratch check of the blog sanitizer rules (copied from app/admin/(panel)/blog/actions.ts).
import sanitizeHtml from "sanitize-html";

const allowedHtml = {
  allowedTags: ["h2", "h3", "h4", "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "img", "hr", "code", "pre",
    "table", "thead", "tbody", "tr", "th", "td", "span", "mark"],
  allowedAttributes: {
    a: ["href"], img: ["src", "alt"],
    th: ["colspan", "rowspan", "style"], td: ["colspan", "rowspan", "style"],
    p: ["style"], h2: ["style"], h3: ["style"], h4: ["style"], span: ["style"], mark: ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|center|right|justify)$/],
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/],
      "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: { h1: "h2", b: "strong", i: "em" },
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
};

const input = `
<h2 style="text-align: center">Title</h2>
<p style="text-align: justify">Hi <span style="color: #1e3418">green</span> <mark data-color="#fff3a3" style="background-color: #fff3a3">hl</mark></p>
<table><tbody><tr><th colspan="2">H</th></tr><tr><td style="background-color: rgb(1, 2, 3)">a</td><td onclick="x()">b</td></tr></tbody></table>
<p><a href="javascript:alert(1)">bad link</a> <a href="https://ok.example">good link</a></p>
<img src="/api/blog-images/abc" alt="ok"> <img src="data:image/png;base64,AAAA"> <img src="//evil.example/x.png">
<script>alert(1)</script><p style="position:fixed;color:red">pos</p>
`;
const out = sanitizeHtml(input, allowedHtml);
console.log(out);
const checks = [
  ["table kept", /<table>/.test(out)],
  ["th colspan kept", /colspan="2"/.test(out)],
  ["text-align kept", /text-align: ?center/.test(out)],
  ["colour kept", /color: ?#1e3418/.test(out)],
  ["highlight kept", /<mark/.test(out)],
  ["rgb background kept", /rgb\(1, ?2, ?3\)/.test(out)],
  ["onclick removed", !/onclick/.test(out)],
  ["javascript: link removed", !/javascript:/.test(out)],
  ["good link kept", /https:\/\/ok\.example/.test(out)],
  ["uploaded image kept", /\/api\/blog-images\/abc/.test(out)],
  ["base64 image removed", !/data:image/.test(out)],
  ["protocol-relative image removed", !/evil\.example/.test(out)],
  ["script removed", !/<script|alert\(1\)/.test(out)],
  ["position:fixed removed", !/position/.test(out)],
];
let bad = 0;
for (const [label, ok] of checks) { if (!ok) bad++; console.log(ok ? "ok  " : "FAIL", label); }
process.exit(bad);
