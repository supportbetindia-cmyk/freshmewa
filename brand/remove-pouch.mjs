// One-off: remove the third-party pouch from brand/chai-makhana-original.webp, keep chai + bowl + makhana.
import sharp from "sharp";

const { data, info } = await sharp("brand/chai-makhana-original.webp").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;

const hsv = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let hh = 0;
  if (d) hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(hh * 60 + 360) % 360, mx ? d / mx : 0, mx / 255];
};

// Pouch outline (original 1024×1536 coords): left edge runs (560,110) → (300,650); the open mouth runs (330,640) → (1000,760).
const leftEdgeX = (y) => 560 - (y - 110) * (260 / 540);
const mouthY = (x) => 640 + (x - 330) * (120 / 670);

for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const i = (y * w + x) * 4;
  if (data[i + 3] === 0) continue;
  const [hue, sat, val] = hsv(data[i], data[i + 1], data[i + 2]);
  const yellowFabric = hue >= 33 && hue <= 58 && sat > 0.33 && val > 0.5;
  const rightOfEdge = x > leftEdgeX(Math.min(y, 650)) - 6;
  // Everything right of the pouch edge and above a line just below the mouth goes (incl. makhana half inside it)…
  if (rightOfEdge && y < mouthY(x) + 45) {
    data[i + 3] = 0;
  } else if (yellowFabric && x > leftEdgeX(Math.min(y, 650)) - 40 && y < mouthY(x) + 70) {
    data[i + 3] = 0; // lip of the pouch just below the mouth line (not the glass bowl's yellow reflections)
  } else if (rightOfEdge && y < mouthY(x) + 95) {
    // …then fade the cut row softly so the spill trails off instead of looking sliced
    data[i + 3] = Math.round(data[i + 3] * ((y - (mouthY(x) + 45)) / 50) ** 1.5);
  }
}

// Drop leftover specks: connected opaque regions smaller than one makhana.
const seen = new Uint8Array(w * h);
for (let p = 0; p < w * h; p++) {
  if (seen[p] || data[p * 4 + 3] < 20) continue;
  const comp = [p];
  seen[p] = 1;
  for (let k = 0; k < comp.length; k++) {
    const q = comp[k], x = q % w;
    for (const n of [q - 1, q + 1, q - w, q + w]) {
      if (n < 0 || n >= w * h || seen[n] || data[n * 4 + 3] < 20) continue;
      if ((n === q - 1 && x === 0) || (n === q + 1 && x === w - 1)) continue;
      seen[n] = 1;
      comp.push(n);
    }
  }
  // smaller than one whole makhana = crumb or cut fragment
  if (comp.length < 2500) for (const q of comp) data[q * 4 + 3] = 0;
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .trim({ threshold: 1 })
  .resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 86, alphaQuality: 90 })
  .toFile("public/images/hero/chai-makhana.webp");
console.log("✓ public/images/hero/chai-makhana.webp");
