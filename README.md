# roiban1344.github.io

https://roiban1344.github.io/

## 構成

- **フレームワーク**: Jekyll
- **テーマ**: Minima
- **ホスティング**: GitHub Pages

## ローカル開発

### Docker / Podman を使う場合

```bash
cd docs

# Podman の場合
podman compose up

# Docker の場合
docker compose up
```

http://localhost:4000 でサイトを確認できます。ライブリロード対応で、ファイル変更が自動反映されます。

### ネイティブ Ruby を使う場合

#### 必要なもの

- Ruby 3.1〜3.3（4.0 は非対応）
- Bundler

#### セットアップ

```bash
cd docs
bundle install
```

#### 開発サーバーの起動

```bash
bundle exec jekyll serve
```

http://localhost:4000 でサイトを確認できます。

## ブログ記事の追加

`docs/_posts/` ディレクトリに以下の形式でファイルを作成します：

```
YYYY-MM-DD-title.md
```

例：

```markdown
---
layout: post
title: "記事タイトル"
date: 2026-01-01 12:00:00 +0900
---

記事の内容...
```