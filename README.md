# 刘袁个人作品集网站

> AI应用与安全工程师 | React + Vite + GSAP + Three.js

## 🌐 双平台部署

| 平台 | 地址 | 适用区域 |
|------|------|----------|
| Cloudflare Pages | [liuyuan-site.pages.dev](https://liuyuan-site.pages.dev) | 海外及港澳台 |
| GitHub Pages | [sun6792.github.io/liuyuan_site](https://sun6792.github.io/liuyuan_site) | 中国大陆 |

> GitHub Pages 通过 GitHub Actions 自动部署，每次 push 到 main 分支后自动更新。

## 🔧 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 📦 构建

```bash
npm run build       # 输出到 dist/
npm run preview     # 预览构建结果
```

## 🚀 性能优化 (2026.06.27)

| 优化项 | 优化前 | 优化后 | 效果 |
|--------|--------|--------|------|
| Google Fonts | 外部加载 (被墙) | 本地自托管 | 国内可加载 |
| avatar.jpg | 430KB | 11KB JPG + 8KB WebP | 减小 97% |
| 视频 poster | ❌ 无 | 15KB 占位图 | 加载时显示 |
| ocean-bg.mp4 | 2.3MB (未使用) | 已删除 | 节省带宽 |
| 静态资源缓存 | ❌ 无 | `_headers` 配置 | 重复访问秒开 |

### 待优化：视频压缩

`ocean-hero.mp4` 仍为 6MB，推荐用以下工具压缩到 1-2MB：

**方案 A**（Windows 桌面工具）：
1. 下载 [HandBrake](https://handbrake.fr/)
2. 导入 `public/ocean-hero.mp4`
3. Preset: Web → Vimeo YouTube HQ 1080p
4. Video 标签页: Constant Quality RF 28~30, Encoder H.264
5. Audio 标签页: 删除音轨
6. Start Encode

**方案 B**（命令行，需安装 ffmpeg）：
```bash
ffmpeg -i ocean-hero.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  -c:v libx264 -crf 28 -preset fast -movflags +faststart -an \
  ocean-hero-compressed.mp4
```
