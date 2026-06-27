/**
 * Fix all asset loading issues for Cloudflare Pages deployment
 * 1. Compress avatar.jpg → WebP + smaller JPG
 * 2. Generate video poster image
 * 3. Self-host Google Fonts
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const srcDir = path.resolve(__dirname, '..', 'src');

function download(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── 1. Compress avatar ────────────────────────────────────────
async function compressAvatar() {
  const input = path.join(publicDir, 'avatar.jpg');
  if (!fs.existsSync(input)) {
    console.log('[avatar] No avatar.jpg found, skipping');
    return;
  }

  const origKB = (fs.statSync(input).size / 1024).toFixed(0);
  console.log(`[avatar] Original: ${origKB}KB`);

  // Generate WebP (much better compression)
  await sharp(input)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .webp({ quality: 78 })
    .toFile(path.join(publicDir, 'avatar.webp'));

  const webpKB = (fs.statSync(path.join(publicDir, 'avatar.webp')).size / 1024).toFixed(0);
  console.log(`[avatar] WebP: ${webpKB}KB`);

  // Compress original JPG
  await sharp(input)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 72, progressive: true, mozjpeg: true })
    .toFile(input + '.opt');

  fs.renameSync(input + '.opt', input);
  const newKB = (fs.statSync(input).size / 1024).toFixed(0);
  console.log(`[avatar] Compressed JPG: ${newKB}KB (was ${origKB}KB)`);
}

// ─── 2. Generate video poster ──────────────────────────────────
async function generatePoster() {
  const posterPath = path.join(publicDir, 'ocean-hero-poster.jpg');

  // Create a dark oceanic gradient poster (1920x1080)
  const svgPoster = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#06111a"/>
        <stop offset="50%" stop-color="#0a2030"/>
        <stop offset="100%" stop-color="#061018"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#1a4a5a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#g)"/>
    <rect width="1920" height="1080" fill="url(#glow)"/>
    <text x="960" y="540" text-anchor="middle" fill="rgba(200,220,235,0.12)"
          font-family="sans-serif" font-size="120" font-weight="900" letter-spacing="20">
      LIUYUAN
    </text>
  </svg>`;

  await sharp(Buffer.from(svgPoster))
    .jpeg({ quality: 50, progressive: true })
    .toFile(posterPath);

  const posterKB = (fs.statSync(posterPath).size / 1024).toFixed(0);
  console.log(`[poster] Generated ocean-hero-poster.jpg: ${posterKB}KB`);
}

// ─── 3. Self-host Google Fonts ─────────────────────────────────
async function downloadFonts() {
  const fontsDir = path.join(publicDir, 'fonts');
  if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

  // We need Inter (300,400,500,600,700,800,900) and JetBrains Mono (400,500,600,700)
  // Download from Google Fonts CSS API and extract woff2 URLs

  // Inter woff2 — using a direct URL format that works broadly
  const interWeights = ['300','400','500','600','700','800','900'];
  const jetbrainsWeights = ['400','500','600','700'];

  const cssFiles = [];

  // Inter: download the full CSS with all weights
  const interCssUrl = `https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,${interWeights.join(';14..32,')}`;
  console.log(`[fonts] Downloading Inter CSS...`);
  try {
    const interCss = await download(interCssUrl);
    cssFiles.push({ family: 'Inter', css: interCss.toString() });
  } catch(e) {
    console.log(`[fonts] Inter download failed: ${e.message}, trying alternative...`);
    // Fallback: try each weight individually
    for (const w of interWeights) {
      try {
        const css = await download(`https://fonts.googleapis.com/css2?family=Inter:wght@${w}`);
        cssFiles.push({ family: 'Inter', css: css.toString(), weight: w });
      } catch(e2) { console.log(`[fonts] Inter ${w} failed: ${e2.message}`); }
    }
  }

  // JetBrains Mono
  const jbCssUrl = `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${jetbrainsWeights.join(';')}`;
  console.log(`[fonts] Downloading JetBrains Mono CSS...`);
  try {
    const jbCss = await download(jbCssUrl);
    cssFiles.push({ family: 'JetBrains Mono', css: jbCss.toString() });
  } catch(e) {
    console.log(`[fonts] JetBrains Mono download failed: ${e.message}`);
  }

  // Parse CSS files and download individual woff2 files
  let combinedCSS = '';
  for (const entry of cssFiles) {
    const css = entry.css;
    // Extract all url() references
    const urlRegex = /url\((https:\/\/[^)]+)\)/g;
    let match;
    const urls = [];
    while ((match = urlRegex.exec(css)) !== null) {
      urls.push(match[1]);
    }

    // Download each font file
    let modifiedCSS = css;
    for (const url of urls) {
      const filename = url.split('/').pop();
      const localPath = path.join(fontsDir, filename);

      if (!fs.existsSync(localPath)) {
        try {
          console.log(`[fonts] Downloading ${filename}...`);
          const fontData = await download(url);
          fs.writeFileSync(localPath, fontData);
          console.log(`[fonts]   OK (${(fontData.length/1024).toFixed(0)}KB)`);
        } catch(e) {
          console.log(`[fonts]   Failed: ${e.message}`);
          continue;
        }
      } else {
        console.log(`[fonts] ${filename} already exists`);
      }

      // Replace remote URL with local path
      modifiedCSS = modifiedCSS.replace(url, `/fonts/${filename}`);
    }

    combinedCSS += modifiedCSS + '\n';
  }

  // Write the combined local CSS
  fs.writeFileSync(path.join(fontsDir, 'fonts.css'), combinedCSS);
  console.log(`[fonts] Generated fonts/fonts.css`);

  return combinedCSS;
}

// ─── 4. Remove unused assets ───────────────────────────────────
function removeUnused() {
  const files = ['ocean-bg.mp4'];
  for (const f of files) {
    const fp = path.join(publicDir, f);
    if (fs.existsSync(fp)) {
      const sizeMB = (fs.statSync(fp).size / 1024 / 1024).toFixed(1);
      fs.unlinkSync(fp);
      console.log(`[clean] Removed unused ${f} (${sizeMB}MB)`);
    }
  }

  // Also remove unused svg files
  for (const f of ['favicon.svg', 'icons.svg']) {
    const fp = path.join(publicDir, f);
    const distFp = path.join(__dirname, '..', 'dist', f);
    // Keep them but note they should stay
  }
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('🔧 Fixing assets for Cloudflare Pages deployment\n');

  try { await compressAvatar(); } catch(e) { console.error('[avatar] Error:', e.message); }
  console.log();

  try { await generatePoster(); } catch(e) { console.error('[poster] Error:', e.message); }
  console.log();

  try { await downloadFonts(); } catch(e) { console.error('[fonts] Error:', e.message); }
  console.log();

  removeUnused();

  console.log('\n✅ Asset optimization complete!');
}

main().catch(console.error);
