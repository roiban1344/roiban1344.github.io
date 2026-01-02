---
title: "第0日目 - GitHub Pages入門"
date:   2021-08-13 00:02:20 +0900
---


## 導入

重い腰を上げて途中で投げ出していたGitHub Pages+Jekyll環境を導入した．Windows環境．公式ドキュメントの手順が十分丁寧なのでこれらに従えばできる．Rubyの導入が一番手間．

[Getting started with GitHub Pages \- GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages)

[Quickstart \| Jekyll • Simple, blog\-aware, static sites](https://jekyllrb.com/docs/)

ひとつ引っ掛かったのが以下のステップ10．

[Creating a GitHub Pages site with Jekyll \- GitHub Docs](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll)

GemFileには依存するパッケージ（"gem"と呼ぶのか）のバージョンが書き込まれているが，GitHub Pagesの利用にあたっては最低限[GitHub Pagesの最新版の依存性の一覧](https://pages.github.com/versions/)から[github-pages](https://rubygems.org/gems/github-pages)パッケージのバージョンを手動で追記してやる必要がある．現在のバージョンは217だから，この行にはこう書かなくてはならない：

```
gem "github-pages", "~> 217", group: :jekyll_plugins
```

ここに [jekyll](https://rubygems.org/gems/jekyll) のバージョンである3.9.0を書き込んだせいでページが壊れてしばらく悩んだ．よく読もう！

GitHub Pagesを生成するためのファイル一式（Jekyllを使っている場合は`jekyll new`で生成される）はリポジトリのrootか `/docs` 下に作ることができて，とりあえず`/docs`下に作ってみた．が，本来の用途はホームページ単体ではないリポジトリにドキュメントを付けることのようなので，この方法に何かメリットがあるかは不明．後々移すかも．

[Configuring a publishing source for your GitHub Pages site \- GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 数式

数式を表示するにはMathJaxを読み込んで `$$`で $$LaTeX$$ 形式の数式を囲ってやるだけでいい．[MathJax公式](https://www.mathjax.org/#gettingstarted)にあるように，以下の2行を書き込めば，

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

数式が使えるようになる．

Jacobiの三重積恒等式：

$$
\sum_{n=-\infty}^\infty z^n q^{\frac{n\,(n+1)}{2}}
=\prod_{n=1}^\infty (1-q^n)(1+z\,q^n)(1+z^{-1}q^{n-1}).
$$

Cauchy行列式：

$$
\det
\begin{pmatrix}
\frac{1}{1-x_1y_1} & \frac{1}{1-x_1y_2} & \cdots & \frac{1}{1-x_1y_n}\\
\frac{1}{1-x_2y_1} & \frac{1}{1-x_2y_2} & \cdots & \frac{1}{1-x_2y_n}\\
\vdots & \vdots & \ddots & \vdots\\
\frac{1}{1-x_ny_1} & \frac{1}{1-x_ny_2} & \cdots & \frac{1}{1-x_ny_n}\\
\end{pmatrix}
=
\prod_{1\leq i\leq n,\, 1\leq j \leq n}\frac{1}{1-x_i y_j}
\prod_{1\leq i < j \leq n}(x_i-x_j)
\prod_{1\leq i < j \leq n}(y_i-y_j).
$$

今はデフォルトのテーマを使っているので，上のスクリプト2行を `/_includes/use_mathjax.html` というファイルに分離してmarkdownソース上でincludeしている．カスタムのテーマを使えば，YAML front matterの `use_mathjax: true`みたいな記述だけで数式利用の有無を切り替えられるらしいが今はやらない．

[Themes \| Jekyll • Simple, blog\-aware, static sites](https://jekyllrb.com/docs/themes/)

KaTeXというライブラリはより高速だと聞くが，MathJaxに比べると GitHub Pagesへの導入は手間がかかりそう．

[JekyllでMathJaxからKaTeXに移行した \| 晴耕雨読](https://tex2e.github.io/blog/latex/mathjax-to-katex)


ところで最近のVSCodeのアップデートでmarkdown上でのKaTeXによる数式レンダリングがサポートされていたことを知った．この記事もVSCodeで作業していて，エディタ上のプレビューでも数式が見られて嬉しい．ただしインライン数式は記法が異なる影響で崩れる．

> VS Code's built-in Markdown preview can now render math equations using KaTeX.

[Visual Studio Code June 2021](https://code.visualstudio.com/updates/v1_58#_math-formula-rendering-in-the-markdown-preview)

明日からRustやる．