---
layout: post
title: "Next.js 14の公式学習コース"
date:   2023-11-06 23:00:00 +0900
---

書くハードルを下げようの回。

やった：[Learn Next\.js \| Next\.js](https://nextjs.org/learn/dashboard-app)

[Overview \| Acme Dashboard](https://nextjs-dashboard-xi-azure.vercel.app/dashboard)

App Router版の学習コース。[Pages Router版のブログアプリを作るチュートリアル](https://nextjs.org/learn-pages-router/basics/create-nextjs-app)が長らく公式から最初に提供される学習コースとして君臨していたが、とうとう置き換わった。

旧チュートリアルはそもそもデータフェッチやフォームを扱っていなくて、各々よろしくやってね、という感じだったが、
React Server ComponentとServer Actionsの登場により完全に状況が変わった。
とりあえずサーバー側に処理を書いておけばセキュリティ的にはな要件を満たせる、という点は設計指針にも強力な影響を与えている。

また、ZodもTailwind CSSもNextAuth.jsも入っていてお得。