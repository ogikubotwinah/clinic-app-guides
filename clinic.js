// この医院の設定（アプリ一覧 index.html が読む・2026-11-01）
// 他院へ出すときは、このファイルだけを差し替える（ページは全院共通）。差し替え箇所の一覧＝cto/knowledge/lamarck-guide-localization.md
//   name     … 病院名（一覧の見出しの下と、タブの名前）
//   netcheck … 開けないときの接続チェックのページ
//   apps     … 入れたアプリだけを書く。書いていないアプリは一覧で薄く「未導入」になる
//              lan＝院内用・wan＝院外用（'none'＝院内のみ）・{}＝開く画面が無い（ガイドだけ）
window.CLINIC = {
  name: '荻窪ツイン動物病院',
  netcheck: 'https://serverpc.tail2de5bb.ts.net:10000/netcheck',
  apps: {
    'resv': { lan: 'https://giiv6wcx.lamarck-lan.com:14000', wan: 'https://serverpc.tail2de5bb.ts.net:8455' },
    'emr': { lan: 'https://giiv6wcx.lamarck-lan.com:13800/', wan: 'https://serverpc.tail2de5bb.ts.net:8452/' },
    'dicom': { lan: 'https://giiv6wcx.lamarck-lan.com:14400/', wan: 'http://100.111.66.29:4400/' },
    'karte-voice': { lan: 'https://giiv6wcx.lamarck-lan.com:13600', wan: 'https://serverpc.tail2de5bb.ts.net:8449' },
    'nyuin': { lan: 'https://giiv6wcx.lamarck-lan.com:13500', wan: 'https://serverpc.tail2de5bb.ts.net:8446' },
    'vet-link': { lan: 'https://giiv6wcx.lamarck-lan.com:13007', wan: 'https://serverpc.tail2de5bb.ts.net:8450' },
    'kintai': { lan: 'https://giiv6wcx.lamarck-lan.com:14100/my', wan: 'https://serverpc.tail2de5bb.ts.net:8453/my' },
    'petty-cash': { lan: 'https://giiv6wcx.lamarck-lan.com:13400', wan: 'https://serverpc.tail2de5bb.ts.net:8445' },
    'inventory': { lan: 'https://giiv6wcx.lamarck-lan.com:14200', wan: 'https://serverpc.tail2de5bb.ts.net' },
    'filaria': { lan: 'https://giiv6wcx.lamarck-lan.com:13300', wan: 'https://serverpc.tail2de5bb.ts.net:8451' },
    'health': { lan: 'https://giiv6wcx.lamarck-lan.com:13100', wan: 'https://serverpc.tail2de5bb.ts.net:8443' },
    'dental': { lan: 'https://giiv6wcx.lamarck-lan.com:15173', wan: 'http://serverpc.tail2de5bb.ts.net:5173' },
    'lit-library': { lan: 'https://giiv6wcx.lamarck-lan.com:13900', wan: 'http://100.111.66.29:3900' },
    'case-bank': { lan: 'https://giiv6wcx.lamarck-lan.com:13700', wan: 'https://serverpc.tail2de5bb.ts.net:8456' },
    'phone': {},   // 開く画面が無い（ガイドだけ）
    'mypage': {},   // 開く画面が無い（ガイドだけ）
    'linkage': {},   // 開く画面が無い（ガイドだけ）
  }
};
