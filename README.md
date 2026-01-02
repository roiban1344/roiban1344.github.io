# roiban1344.github.io

https://roiban1344.github.io/

## 構成

- **フレームワーク**: Astro
- **数式描画**: KaTeX (remark-math + rehype-katex)
- **ホスティング**: GitHub Pages

## ローカル開発

### Dev Container を使う場合（推奨）

VS Code で開くと Dev Container の使用を提案されます。そのまま開発環境が構築されます。

### ネイティブ Node.js を使う場合

#### 必要なもの

- Node.js 22+
- npm

#### セットアップ

```bash
npm install
```

#### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:4321 でサイトを確認できます。

#### ビルド

```bash
npm run build
```

`dist/` ディレクトリに静的ファイルが生成されます。

## ブログ記事の追加

`src/content/blog/` ディレクトリに以下の形式でファイルを作成します：

```
YYYY-MM-DD-title.md
```

例：

```markdown
---
title: "記事タイトル"
date: 2026-01-01 12:00:00 +0900
---

記事の内容...
```

## 数式の使用

KaTeX による数式描画がサポートされています。

インライン数式: `$E = mc^2$`

ブロック数式:

```
$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$
```
