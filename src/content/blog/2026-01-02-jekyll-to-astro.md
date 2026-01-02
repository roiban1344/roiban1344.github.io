---
title: "Jekyll から Astro へ移行した"
date: 2026-01-02 14:30:00 +0900
---

以下の内容は全部 Cursor が書いたものである。

---

このブログを Jekyll から Astro にリプレースした。

## 動機

- Jekyll は Ruby ベースで、ローカル開発環境の構築がやや面倒だった
- Astro は Node.js ベースで、フロントエンド開発者にとって馴染みやすい
- Content Collections による型安全なコンテンツ管理に興味があった

## 要件

移行にあたって以下の要件を設定した。

| 要件 | 優先度 | 解決策 |
|------|--------|--------|
| 数式描画 | MUST | KaTeX (remark-math + rehype-katex) |
| コンテナ開発 | MUST | Dev Container |
| CI デプロイ | MUST | GitHub Actions |
| シンプルな見た目 | SHOULD | カスタム CSS (minima 風) |

## 構成の変化

### Before (Jekyll)

```
_config.yml          # Jekyll 設定
_posts/              # 投稿
_includes/           # 部分テンプレート
Gemfile              # Ruby 依存管理
Dockerfile           # コンテナ
```

### After (Astro)

```
astro.config.mjs     # Astro 設定
src/content/blog/    # 投稿
src/layouts/         # レイアウト
src/pages/           # ページ
package.json         # Node.js 依存管理
.devcontainer/       # Dev Container
```

## 数式サポート

MathJax から KaTeX に変更した。記法は同じ `$$...$$` がそのまま使える。

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

KaTeX は MathJax より軽量で高速。ただし一部の高度な LaTeX 記法（`\begin{align}` の一部機能など）はサポートされていない場合がある。

## URL 構造の維持

既存の URL 構造 `/YYYY/MM/DD/slug/` を維持するため、動的ルーティング `[...slug].astro` を使用した。

```javascript
// src/pages/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => {
    const date = post.data.date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const slug = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    return {
      params: { slug: `${year}/${month}/${day}/${slug}` },
      props: post,
    };
  });
}
```

## 投稿の移行

25 件の投稿を移行した。主な変更点：

- `layout: post` の削除（Astro では不要）
- `{% include use_mathjax.html %}` の削除（グローバルで KaTeX を読み込むため）
- frontmatter の `date` フォーマットはそのまま維持

## 開発環境

Dev Container を使用すると、VS Code で開くだけで開発環境が構築される。

```json
{
  "name": "Astro Blog",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",
  "postCreateCommand": "npm install",
  "forwardPorts": [4321]
}
```

## デプロイ

GitHub Actions で `npm run build` → `dist/` を GitHub Pages にデプロイ。Jekyll のときとほぼ同じワークフロー構造。

## 感想

- Astro の Content Collections は便利。スキーマ定義で frontmatter のバリデーションができる
- 静的サイト生成のビルドが速い
- TypeScript サポートが充実している