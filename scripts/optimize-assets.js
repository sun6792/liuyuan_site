/**
 * Asset optimization script
 * 1. Compress ocean-hero.mp4 (6.2MB → ~1.5MB) + generate poster
 * 2. Compress avatar.jpg (440KB → WebP ~40KB)
 * 3. Remove unused ocean-bg.mp4
 */
import { execFile } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const ffmpegPath = path.resolve(__dirname, '..', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');

async function run(cmd, args) {
  console.log(`  Running: ${cmd} ${args.join(' ')}`);
  const { stdout, stderr } = await execFileP(cmd, args, { maxBuffer: 100 * 1024 * 1024 });
  if (stderr) console.log('  ffmpeg:', stderr.slice(-200));
  return stdout;
}

async function compressVideo() {
  const input = path.join(publicDir, 'ocean-hero.mp4');
  const backup = path.join(publicDir, 'ocean-hero-backup.mp4');
  const tmp = path.join(publicDir, 'ocean-hero-tmp.mp4');

  if (!fs.existsSync(input)) {
    console.log('⚠ ocean-hero.mp4 not found, skipping video compression');
    return;
  }

  console.log('\n📹 Compressing ocean-hero.mp4...');

  // Backup original
  console.log('  Backing up original...');
  fs.copyFileSync(input, backup);

  // Compress: scale to 1080p, lower bitrate, efficient codec
  console.log('  Compressing (1080p, CRF 28, fast)...');
  await run(ffmpegPath, [
    '-i', input,
    '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease',
    '-c:v', 'libx264',
    '-crf', '28',
    '-preset', 'fast',
    '-movflags', '+faststart',
    '-an',  // strip audio (hero video has no audio anyway)
    '-y',
    tmp,
  ]);

  const origSize = fs.statSync(input).size;
  const newSize = fs.statSync(tmp).size;
  const reduction = ((1 - newSize / origSize) * 100).toFixed(0);

  console.log(`  Original: ${(origSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`  Compressed: ${(newSize / 1024 / 1024).toFixed(1)}MB (${reduction}% smaller)`);

  // Replace original with compressed
  fs.renameSync(tmp, input);
  console.log('✅ Video compression complete');
}

async function generatePoster() {
  const videoPath = path.join(publicDir, 'ocean-hero.mp4');
  const posterPath = path.join(publicDir, 'ocean-hero-poster.jpg');

  if (!fs.existsSync(videoPath)) {
    console.log('⚠ Video not found, skipping poster generation');
    return;
  }

  console.log('\n🖼  Generating poster image...');
  // Extract frame at 1 second mark
  await run(ffmpegPath, [
    '-i', videoPath,
    '-ss', '00:00:01',
    '-vframes', '1',
    '-q:v', '8',
    '-y',
    posterPath,
  ]);

  // Compress poster with sharp
  const posterBuffer = await sharp(posterPath)
    .resize(1920, 1080, { fit: 'inside' })
    .jpeg({ quality: 60, progressive: true })
    .toBuffer();
  fs.writeFileSync(posterPath, posterBuffer);

  const posterSize = fs.statSync(posterPath).size;
  console.log(`  Poster size: ${(posterSize / 1024).toFixed(1)}KB`);
  console.log('✅ Poster generated');
}

async function compressAvatar() {
  const input = path.join(publicDir, 'avatar.jpg');
  const webpPath = path.join(publicDir, 'avatar.webp');

  if (!fs.existsSync(input)) {
    console.log('⚠ avatar.jpg not found, skipping');
    return;
  }

  console.log('\n👤 Compressing avatar...');
  const origSize = fs.statSync(input).size;
  console.log(`  Original: ${(origSize / 1024).toFixed(0)}KB`);

  // Generate WebP version
  await sharp(input)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .webp({ quality: 78 })
    .toFile(webpPath);

  const webpSize = fs.statSync(webpPath).size;
  console.log(`  WebP: ${(webpSize / 1024).toFixed(0)}KB`);

  // Also compress the jpg
  await sharp(input)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 75, progressive: true })
    .toFile(input + '.compressed');

  fs.renameSync(input + '.compressed', input);
  const newJpgSize = fs.statSync(input).size;
  console.log(`  Compressed JPG: ${(newJpgSize / 1024).toFixed(0)}KB`);

  console.log('✅ Avatar compression complete');
}

async function removeUnused() {
  const unused = path.join(publicDir, 'ocean-bg.mp4');
  if (fs.existsSync(unused)) {
    const size = fs.statSync(unused).size;
    fs.unlinkSync(unused);
    console.log(`\n🗑  Removed unused ocean-bg.mp4 (${(size / 1024 / 1024).toFixed(1)}MB)`);
  }
}

async function main() {
  console.log('🚀 Asset Optimization\n');

  try {
    await compressVideo();
  } catch (e) {
    console.error('❌ Video compression failed:', e.message);
    // Restore backup if exists
    const backup = path.join(publicDir, 'ocean-hero-backup.mp4');
    const input = path.join(publicDir, 'ocean-hero.mp4');
    if (fs.existsSync(backup)) {
      fs.copyFileSync(backup, input);
      console.log('  ↳ Restored backup');
    }
  }

  try {
    await generatePoster();
  } catch (e) {
    console.error('❌ Poster generation failed:', e.message);
  }

  try {
    await compressAvatar();
  } catch (e) {
    console.error('❌ Avatar compression failed:', e.message);
  }

  await removeUnused();

  // Cleanup backup
  const backup = path.join(publicDir, 'ocean-hero-backup.mp4');
  if (fs.existsSync(backup)) {
    fs.unlinkSync(backup);
    console.log('  ↳ Cleaned up backup');
  }

  console.log('\n🏁 All done!');
}

main().catch(console.error);
