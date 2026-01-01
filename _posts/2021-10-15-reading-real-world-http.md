---
layout: post
title: "Real World HTTP読み"
date:   2021-10-15 02:10:00 +0900
---

# Go

『Real World HTTP』読んでる。面白い。文字の羅列に見えていたcurlコマンドの出力やDevTools＞Networkの読める場所が増えるのは楽しい。
さすがに古いかな、と思いつつ『ネットワークはなぜつながるのか』も読んでいたが、ちゃんとoutdatedな部分はそうと分かるのも助かる（アプリケーション層寄りの部分に限られるけど）。

で、サンプルコードにはGoが使われているので[チュートリアル](https://golang.org/doc/tutorial/getting-started)や[A Tour of Go](https://tour.golang.org/welcome/1)等も見てみたのだが、たまたま同時期にGoの「好き嫌い」に関する話題がバズっていた。

- [Go言語を嫌う6個の理由 \- さめたコーヒー](https://www.kbaba1001.com/entry/2021/09/17/073149)
- [Goへのヘイトに対する考え方](https://zenn.dev/nobonobo/articles/74808a8d5e6f1e)
- [Go言語が好きな理由](https://zenn.dev/moutend/articles/2edaa5d11f5ef12b5cfa)

この中で触れられていて、学び始めて早い段階で気付くのが「モダンな」構文をあえて取り込まずに言語仕様をコンパクトに保っている、という部分で、
たとえばループは愚直にfor文を回す必要がある。イテレータを扱う構文が盛り盛りに用意されているRustに同時に触れているとこれはカルチャーショックで、
この記事で心構えができていなかったら多分えーっと思っていた。

エラーを関数の返り値として受け取って `if err == nil` みたいな形で処理するというのも『Real World HTTP』のサンプルコードで早々に出会う特徴。
これを含めて、なぜこういう言語設計になっているか、というのが公式のQAに載っている。

[Frequently Asked Questions \(FAQ\) \- The Go Programming Language](https://golang.org/doc/faq#exceptions)

とはいえまあこういうのはコーディング上の表層的な部分なので、Goが真価を発揮するらしいマルチコア処理の強さとかも体験したい……。

# Rust

メルセンヌ数の記事を書いたあたりから学びが停止している！！

C++やJavaだと連結リストや木を実装することはポインタと参照の概念を知れば取り掛かれる演習問題、みたいに位置付けられていたけれど、
そのあたりの扱いに厳しいRustでは事情が異なる。

[Smart Pointers \- The Rust Programming Language](https://doc.rust-lang.org/book/ch15-00-smart-pointers.html)

というのをまだお話レベルでしか知らない。はよやろう。以前書いた分割の列挙アルゴリズムを改良したい。

# 二次篩法

わ、忘れてた……。そうだ素因数分解がしたかったんだった。

[Quadratic sieve \- Wikipedia](https://en.wikipedia.org/wiki/Quadratic_sieve)

やりたいことリストとしてのgithub.io。