---
layout: post
title: "第14日目 - binary exponentiation - シンタックスハイライト"
date:   2021-08-29 22:50:00 +0900
---

{% include use_mathjax.html %}

ドンピシャなタイトルなので買ってしまった．

> Rustでわかるメモリ管理
しくみを知る／アプリを作る／ライブラリを読む

[Software Design 2021年9月号｜技術評論社](https://gihyo.jp/magazine/SD/archive/2021/202109)

Rustのメモリ安全性から実際どんな恩恵が受けられるのか，という視点をほとんど欠いているので，HTTPサーバ作りによるデモはいずれなぞってみたい．

しばらく前に買ったこれも技術評論社なのか．

> Rustで実装！
作って学ぶRDBMSのしくみ

[WEB\+DB PRESS Vol\.122｜技術評論社](https://gihyo.jp/magazine/wdpress/archive/2021/vol122)

一通りドキュメント読んだらやってみる．

## Binary Exponentiation

```rust
        let s1 = sin[i / 2].unwrap();
        let c1 = cos[i / 2].unwrap();
        let s2 = sin[(i + 1) / 2].unwrap();
        let c2 = cos[(i + 1) / 2].unwrap();
        sin[i] = Some(s1 * c2 + c1 * s2);
        cos[i] = Some(c1 * c2 - s1 * s2);
```

この部分がいわゆるbinary exponentiation（高速べき乗）とは違うことに気付いた．本来はこうだろう：

$$
\begin{align}
    \sin(m) &= 
    \left\{
        \begin{array}{cc}
        2\sin(m/2)\cos(m/2) & m\mbox{ is even},\\
        \sin 1\cos(m-1)+\cos 1\sin(m-1) & m\mbox{ is odd}
        \end{array}
    \right.\\
    \cos(m) &= 
    \left\{
        \begin{array}{cc}
        \cos^2(m/2)-\sin^2(m/2) & m\mbox{ is even},\\
        \cos 1\cos(m-1)-\sin 1\sin(m-1) & m\mbox{ is odd}
        \end{array}
    \right.
\end{align}
$$

で，これを実装すると $$i=3645$$ でパニクってしまった．

![誤差の拡大の比較](https://github.com/roiban1344/rust-study/blob/main/sin64/i-vs-error-width-compare.png?raw=true)

誤差の拡大の比較．青が昨日の（偽高速べき乗）と赤が上の式の基づく本来の高速べき乗．レジェンドのマーカーサイズの変更がうまくいかん……．

[python \- Setting a fixed size for points in legend \- Stack Overflow](https://stackoverflow.com/questions/24706125/setting-a-fixed-size-for-points-in-legend)

見ると分かる通り，本来の高速べき乗の方が誤差の拡大が速い．定数倍ではなくて指数が違う．

そうか本来の高速べき乗の方が積を取る回数は増えるからか．高速べき乗は一気にある指数に対する冪を求めるときには高速だが，1ずつ求める場合よりはその値を得るために必要な乗算の数は増える．奇数の時一旦指数を1減じてから半分にするから．

## シンタックスハイライト

デフォルトの Jekyll on GitHub Pages のマークダウンのシンタックスハイライトの視認性があまり良くないので変えたかった．

Rougeというらしい．

[rouge \| RubyGems\.org \| コミュニティのGemホスティングサービス](https://rubygems.org/gems/rouge)

GitHub のシンタックスハイライティング．

[Creating and highlighting code blocks \- GitHub Docs](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks)

[zargony/atom\-language\-rust: Rust language support in Atom \- LOOKING FOR MAINTAINER, see \#144](https://github.com/zargony/atom-language-rust)

Linguistはシンタックスハイライターではない．

[markdown \- How do I "use Linguist to perform language detection" on my gitHub page? \- Stack Overflow](https://stackoverflow.com/questions/63671739/how-do-i-use-linguist-to-perform-language-detection-on-my-github-page)

[syntax highlighting \- Can I use GitHub's Linguist as a replacement to Rouge in Jekyll \- Stack Overflow](https://stackoverflow.com/questions/53708740/can-i-use-githubs-linguist-as-a-replacement-to-rouge-in-jekyll/53709148#53709148)

Prism.jsというシンタックスハイライターがある．

[Prism](https://prismjs.com/)

うーん，しかしマークダウンの利便性を失いたくはない．どこをどうカスタマイズすればいいのだろう．