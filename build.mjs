// 打包腳本：把 src/ 合併成單一 index.html（可直接雙擊開啟或部署）
// 用法：node build.mjs
// 如果有 sounds/ 資料夾（放 .mp3 音檔），會自動把音檔嵌進 index.html，依然只有一個檔案
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(root, 'src', f), 'utf8');

const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const ORDER = ['audio', 'kart', 'track', 'items', 'network', 'main'];

const strip = (code) => code
  .split('\n')
  .filter((l) => !/^import\s/.test(l))
  .map((l) => l.replace(/^export\s+/, ''))
  .join('\n');

// 3D 引擎：有 vendor/three.module.min.js 就直接包進 index.html（離線也能玩）；
// 加上 --cdn 參數則改從網路載入（檔案較小，但要連網）
const VENDOR_THREE = join(root, 'vendor', 'three.module.min.js');
let js;
if (!process.argv.includes('--cdn') && existsSync(VENDOR_THREE)) {
  const code = readFileSync(VENDOR_THREE, 'utf8');
  const m = code.match(/export\s*\{([^}]*)\}\s*;?\s*$/);
  if (!m) throw new Error('無法解析 three.module.min.js 的 export');
  const props = m[1].split(',').map((part) => {
    const [local, exported] = part.trim().split(/\s+as\s+/);
    return `${JSON.stringify(exported || local)}:${local}`;
  });
  js = `const THREE = (() => {\n${code.slice(0, m.index)}\nreturn Object.freeze({${props.join(',')}});\n})();\n\n`;
  console.log('📦 已把 Three.js 3D 引擎包進檔案（離線可玩）');
} else {
  js = `import * as THREE from '${THREE_CDN}';\n\n`;
  console.log('🌐 Three.js 從網路載入（需要連網）');
}
// 後製特效（光暈）：Three.js 官方範例程式合併版，約 27 KB
js += readFileSync(join(root, 'vendor', 'three-postfx.js'), 'utf8') + '\n';
for (const name of ORDER) js += `\n// ===== ${name}.js =====\n${strip(src(`${name}.js`))}\n`;

// 嵌入音檔
let soundScript = '';
const soundDir = join(root, 'sounds');
if (existsSync(soundDir)) {
  const files = readdirSync(soundDir).filter((f) => f.toLowerCase().endsWith('.mp3'));
  if (files.length) {
    const map = {};
    for (const f of files) map[f.replace(/\.mp3$/i, '')] = `data:audio/mpeg;base64,${readFileSync(join(soundDir, f)).toString('base64')}`;
    soundScript = `<script>window.__EMBED_SOUNDS = ${JSON.stringify(map)};</script>\n  `;
    console.log(`🎵 已嵌入 ${files.length} 個音檔：${files.join(', ')}`);
  }
}

let html = src('template.html');
html = html.replace(/\s*<link rel="stylesheet" href="style.css" \/>/, `\n  <style>\n${src('style.css')}\n</style>`);
html = html.replace(/<script type="module" src="js\/main.js"><\/script>/, () => `${soundScript}<script type="module">\n${js}\n</script>`);

if (html.includes('js/main.js') || html.includes('href="style.css"')) throw new Error('template 取代失敗');
writeFileSync(join(root, 'index.html'), html);
console.log(`✅ index.html 已產生（${(Buffer.byteLength(html) / 1024).toFixed(0)} KB）`);
