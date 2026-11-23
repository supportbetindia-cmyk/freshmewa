import sharp from "sharp";

const SUBJECT_ALPHA = 0.22;

for (const file of process.argv.slice(2)) {
  const { data, info } = await sharp(file)
    .resize({ width: 1000, withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;

  const px = (x, y) => (y * w + x) * 3;
  const corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)];
  const bg = Math.max(...corners.map((i) => Math.min(data[i], data[i + 1], data[i + 2])));

  const soft = new Float32Array(n);
  const rgb = new Float32Array(n * 3);
  for (let p = 0; p < n; p++) {
    let a = 0;
    for (let k = 0; k < 3; k++) {
      const c = Math.min(255, (data[p * 3 + k] * 255) / bg);
      rgb[p * 3 + k] = c;
      a = Math.max(a, (255 - c) / 255);
    }
    soft[p] = a < 0.03 ? 0 : a;
  }

  const background = new Uint8Array(n);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (background[p] || soft[p] >= SUBJECT_ALPHA) continue;
    background[p] = 1;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < n - w) stack.push(p + w);
  }

  const R = 2;
  const nearBg = (p) => {
    const x = p % w, y = (p / w) | 0;
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && background[yy * w + xx]) return true;
      }
    return false;
  };

  const out = Buffer.alloc(n * 4);
  for (let p = 0; p < n; p++) {
    const o = p * 4;
    if (background[p] || (soft[p] < 0.6 && nearBg(p))) {
      const a = soft[p];
      for (let k = 0; k < 3; k++) out[o + k] = a ? Math.round(255 - (255 - rgb[p * 3 + k]) / a) : 0;
      out[o + 3] = Math.round(a * 255);
    } else {
      for (let k = 0; k < 3; k++) out[o + k] = data[p * 3 + k];
      out[o + 3] = 255;
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 1 })
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(file.replace(/\.\w+$/, ".webp"));
  console.log("✓", file, "bg", bg);
}
