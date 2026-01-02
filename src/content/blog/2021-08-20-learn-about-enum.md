---
title: "第6日目 - The book 第6章をよむ（続） - 列挙型とmatch式"
date:   2021-08-20 03:45:00 +0900
---

文字コード分からなすぎるので買った．日本語を扱うコードを恐れないようになりたい

[［改訂新版］プログラマのための文字コード技術入門：書籍案内｜技術評論社](https://gihyo.jp/book/2019/978-4-297-10291-3)

そういえばこれも気になっている．

[チャイニーズ・タイプライター｜単行本｜中央公論新社](https://www.chuko.co.jp/tanko/2021/05/005437.html)

> 中国語タイプライターを作ろうとした人びとの知的・技術的葛藤と格闘を，西洋，中国，日本を舞台にダイナミックに辿る圧巻の文化史．製品開発やその宣伝を跡づける興味深い図版多数収載．

## The book 第6章"Enums and Pattern Matching"よむ（続）

### The `match` Control Flow Operator

> The power of match comes from the expressiveness of the patterns and the fact that the compiler confirms that all possible cases are handled.

網羅性検査．素晴らしい．

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}
```

漫然と読んでいて気付いていなかったが，列挙型のvariant同士は等号比較ができないのか．

```rust
error[E0369]: binary operation `==` cannot be applied to type `Coin`
  --> src\main.rs:32:32
   |
32 |     println!("{}", Coin::Penny == Coin::Penny);
   |                    ----------- ^^ ----------- Coin
   |                    |
   |                    Coin
   |
   = note: an implementation of `std::cmp::PartialEq` might be missing for `Coin`  
```

JavaのComparableインターフェースみたいなものを実装している必要がある．

### Patterns that Bind to Values

へ～……．

> From 1999 through 2008, the United States minted quarters with different designs for each of the 50 states on one side.

[50州25セント硬貨 \- Wikipedia](https://ja.wikipedia.org/wiki/50%E5%B7%9E25%E3%82%BB%E3%83%B3%E3%83%88%E7%A1%AC%E8%B2%A8)

オハイオ州の宇宙服を着たニール・アームストロングの図柄が良い．

`match`のアームはenumのvariantの中身を取り出せる．中身．前の章見てもvalueとしか言っていないな．Fieldではない．

### Matching with `Option<T>`

```rust
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }

```

Variantが「実体」なのかそうでないのかでやや捉え難さを感じる．

### Matches Are Exhaustive
`match`がパターンを尽くしていない場合，コンパイルしないこと．*Exhaustive*という．

### The `_` Placeholder
ワイルドカード．`switch`文の`default`．

## 6.3 Concise Control Flow with `if let`

（`if let`は網羅性検査の恩恵を失わせるということに関して）
> In other words, you can think of if let as syntax sugar for a match that runs code when the value matches one pattern and then ignores all other values.

何故代入でもないのに等号1つ`=`なんだろう．

次の7章がパッケージの扱い方．

## TODO
VSCodeと同じ見た目でpretty printしたい．