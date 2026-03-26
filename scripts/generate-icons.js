// Run: node scripts/generate-icons.js
// Generates simple PWA icons as SVG-based placeholders
import { writeFileSync } from 'fs';

const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#000"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="sans-serif" font-weight="900" font-size="${size * 0.4}">取</text>
</svg>`;

[192, 512].forEach((size) => {
  writeFileSync(`public/icons/icon-${size}.svg`, svg(size));
  console.log(`Generated icon-${size}.svg`);
});
