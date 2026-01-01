---
layout: post
title: "第5日目 - The book 第5, 6章をよむ - 構造体・列挙型"
date:   2021-08-19 03:00:00 +0900
---

## Chap.5 Using Structs to Structure Related Data

構造体について．C++の構造体はほとんど触ったことがない．

### 5.1 Defining and Instantiating Structs

異なる型の値をまとめて持てるという点で構造体はタプルに似ているが，名前を付けられる点で異なる．構成要素の値の順序を考えなくてよい．JSのオブジェクトと同じモチベーションだ．各データは*field*と呼ぶ．

具体的な値を持つ構造体の実体を*instance*という．「『実体をinstance』という」，同語反復では？

フィールドはインスタンスがミュータブルかそうでないかに応じて，「全てのフィールドがミュータブル」か「全てのフィールドがイミュータブル」かのどちらかである．特定のフィールドだけミュータブルとかはない．

#### Using the Field Init Shorthand when Variables and Fields Have the Same Name

フィールドへの値の代入は，フィールドのキーと同名の時反復しなくてよい．JSで知ってる．*Field init shorthand*という専門用語があるらしい．

#### Creating Instances From Other Instances With Struct Update Syntax

これもJSで知ってる．スプレッド構文だ．ただ，この順序で書くとJSなら下にある`user1`の`username`と`email`が使われるところだ．

```rust
    let user2 = User {
        email: String::from("user2@example.com"),
        username: String::from("anotherusername567"),
        ..user1
    };
```

#### Using Tuple Structs without Named Fields to Create Different Types
タプルで構造体を定義することができる．この場合名前はない．例としてRGB値や3次元座標が挙げられている．

TypeScriptのインターフェースや型であれば，形状が同じであればたとえ名前が違っても同じ型として扱われる．Rustの構造体はそうではない．

#### Unit-Like Structs Without Any Fields
フィールドを持たない構造体も定義出来て*unit-like structs*という．Unit-typetとは空のタプル`()`のこと．トレイトを実装するときに有用になるらしい．

#### Ownership of Struct Data

構造体のフィールドに参照を持つことは可能だが，ライフタイムを慎重に扱う必要がある．10章で学ぶ．

### 5.2 An Example Program Using Structs

長方形構造体．この例あらゆる場所で見るな．

型の持つドキュメントになるという性質を強調する点は，TypeScriptの解説を読むときの感覚に似ている．それはそうか．


`println!`の`{}`の中では色々なフォーマットが行われるが，構造体はできない．プリミティブ型などは`Display`トレイトを実装しているためできる．

`#[derive(Debug)]`を構造体の定義の直前に付けると，`{:?}`なら可能になる．この場合`Debug`トレイトの実装による．`{:#?}`とするとさらに改行まで入れてくれる．

### 5.3 Method Syntax
メソッドについて．

`impl Struct { fn method(&self) -> ... }`が基本．`&mut self`をパラメータに持つこともあるが，所有権を移す`self`を引数に持つことは稀．

#### Where’s the -> Operator?
C, C++には`.`と`->`という，メソッドを呼ぶためのことなる2つの演算子があるが，Rustではautomatic referencing及びdereferencingが行われるため，`->`に相当するものはない．Rustはそのメソッドを呼んでいるのが参照なのかそうでないのか自動で判別する．

#### Methods with More Parameters

メソッドの第n(`>=2`)引数以降に`self`以外の引数を持つことができる．

#### Associated Functions

`self`を引数に取らない関数を*associated function*という．静的メソッド？　メソッドとは呼ばない．この関数は構造体を名前空間に持ち，`::`演算子で呼び出すことができる．

#### Multiple impl Blocks

`impl`ブロックは複数持つことができる．ジェネリック型やトレイトを扱うときに役に立つ．

## Chap.6 Enums and Pattern Matching

列挙型．列挙型は各言語で色々な形で実装されているが，Rustでのそれは関数型言語の*algebric data type*と呼ばれるものに近い．

### Enum Values

Enumの各variantは引数を取ることができて，同じenumに属して？いても引数は異なる型であってよい．

リテラシーがなさすぎてIpAddr列挙型をこう定義するモチベーションがピンとこない……．

[IPアドレス \- Wikipedia](https://ja.wikipedia.org/wiki/IP%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9)

[IpAddr in std::net \- Rust](https://doc.rust-lang.org/std/net/enum.IpAddr.html)

### The Option Enum and Its Advantages Over Null Values
Rustは言語仕様からnullを排除している．すごい．ベクターへの`pop`で`match`か`expect`しないといけないのが一瞬奇妙に思えたけど，あれは`null`が存在しない世界を実現するためのものだったのか．

`Option`型はpreludeライブラリに入っている．Variantsの`Some`と`None`もpreludeに入っているため，`Option::Some`等とする必要がない．`Option`はジェネリックで，`Some`は引数から型推論される．`None`はそうではないから型注釈がいる．

[Option in std::option \- Rust](https://doc.rust-lang.org/std/option/enum.Option.html)

`undefined`はないのだろうか．というかそもそもundefinedはスクリプト言語特有か？

