#!/usr/bin/env node
// 使用ガイド(HTML) → アプリ内ヘルプ(help.json) を生成する。
//
// ★なぜ生成するのか：ガイドとアプリ内ヘルプを別々に書くと、必ずどちらかが古くなる。
//   ガイドHTMLを唯一の原本にして、アプリ内ヘルプは常にそこから作り直す。
//
// 使い方：  node tools/build-help.js emr.html > /path/to/help.json
//          node tools/build-help.js emr.html resv.html inventory.html > help.json   （複数まとめ）
//
// 出力：{ "generated": "...", "docs": [ { "app": "emr", "title": "...", "url": "...",
//         "sections": [ { "id": "s3-2", "h": "3-2. 会計の呼び出し", "path": "3. 受付のしごと",
//                         "text": "…本文…", "kw": ["会計","通知",...] } ] } ] }
'use strict';
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ogikubotwinah.github.io/clinic-app-guides/';

// タグを落として読める素のテキストにする。表は「見出し：値」の形に均す。
function toText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, ' [図：$1] ')
    .replace(/<img[^>]*>/gi, ' [図] ')
    .replace(/<\/(tr|div|p|li|table|h[1-6])>/gi, '\n')
    .replace(/<\/(td|th)>/gi, '　')
    .replace(/<li[^>]*>/gi, '・')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
    .trim();
}

// 検索のヒット率を上げるための素朴なキーワード抽出。
// 形態素解析は入れない（依存を増やさない）。カタカナ語・漢字語・英数字の並びを拾う。
function keywords(text) {
  const hits = text.match(/[ァ-ヴー]{2,}|[一-龠]{2,}|[A-Za-z][A-Za-z0-9.]{2,}/g) || [];
  const stop = new Set(['ください', 'できます', 'ところ', 'それぞれ', 'または', 'こちら', 'とき', 'もの', 'ため', 'よう', 'こと', 'とおり', 'すべて', '場合', '確認', '表示', '入力', '選択']);
  const count = {};
  hits.forEach((w) => { if (w.length >= 2 && !stop.has(w)) count[w] = (count[w] || 0) + 1; });
  return Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 24);
}

function parseGuide(file) {
  const html = fs.readFileSync(file, 'utf8');
  const app = path.basename(file, '.html');
  const titleM = html.match(/<title>([^<]*)<\/title>/);
  const title = titleM ? titleM[1].replace(/｜.*$/, '').trim() : app;

  // <div class="wrap"> の中だけを対象にする（head や footer のノイズを避ける）
  const wrapM = html.match(/<div class="wrap">([\s\S]*)<\/div>\s*<\/body>/);
  const body = wrapM ? wrapM[1] : html;

  // h2 で大きく割り、その中を h3 でさらに割る
  const sections = [];
  const h2parts = body.split(/<h2[^>]*>/).slice(1);
  const intro = body.split(/<h2[^>]*>/)[0];
  const introText = toText(intro.replace(/<h1[\s\S]*?<\/h1>/i, ''));
  if (introText) {
    sections.push({ id: 's0', h: 'このアプリの概要', path: '', text: introText, kw: keywords(introText) });
  }
  h2parts.forEach((part, i) => {
    const h2 = toText(part.split('</h2>')[0]);
    const rest = part.slice(part.indexOf('</h2>') + 5);
    const h3parts = rest.split(/<h3[^>]*>/);
    const head = toText(h3parts[0]);
    if (head) sections.push({ id: 's' + (i + 1), h: h2, path: '', text: head, kw: keywords(h2 + '\n' + head) });
    h3parts.slice(1).forEach((sp, j) => {
      const h3 = toText(sp.split('</h3>')[0]);
      const t = toText(sp.slice(sp.indexOf('</h3>') + 5));
      if (t || h3) sections.push({ id: 's' + (i + 1) + '-' + (j + 1), h: h3, path: h2, text: t, kw: keywords(h3 + '\n' + t) });
    });
  });
  return { app: app, title: title, url: BASE_URL + path.basename(file), sections: sections };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('使い方: node tools/build-help.js <guide.html> [guide2.html ...] > help.json');
  process.exit(1);
}
const docs = files.map(parseGuide);
const total = docs.reduce((n, d) => n + d.sections.length, 0);
process.stderr.write('取り込み: ' + docs.map((d) => d.app + '(' + d.sections.length + '節)').join(' / ') + ' = 合計' + total + '節\n');
process.stdout.write(JSON.stringify({ generated: files.join(','), docs: docs }, null, 1));
