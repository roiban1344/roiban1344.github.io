---
layout: post
title: "第2日目 - The book 第3章をよむ - 変数・関数・制御構文"
date:   2021-08-15 23:14:00 +0900
---

{% include use_mathjax.html %}

## fizzbuzzする

`match`がいいなぁ．`match`の良さを味わうためにfizzbuzzしてみる．[Re：FizzBuzzから始めるRust生活 \- cats cats cats](https://hinastory.github.io/cats-cats-cats/2020/04/01/refizz-starting-life-in-rust-world/)で一度見たが，あえて何も見ずに書いてみると，単にダブルクオートだと`String`型にならないこと（`&str`になる）とか，`for`のダミー変数に`let`が不要なこととかで躓く．が，エディタのスニペットとメッセージのおかげで公式ドキュメントをググらずに書けた．

```rust
fn main() {
    for i in 1..=100 {
        let line = match (i % 3, i % 5) {
            (0, 0) => String::from("fizzbuzz"),
            (0, _) => String::from("fizz"),
            (_, 0) => String::from("buzz"),
            (_, _) => i.to_string(),
        };
        println!("{}", line);
    }
}
```

[rust\-study/main\.rs at main · roiban1344/rust\-study](https://github.com/roiban1344/rust-study/blob/main/projects/fizzbuzz/src/main.rs)

Range operatorもいいなぁ．これも自分の知っている中ではPerlっぽい．末尾がinclusiveな場合の記法がちゃんと用意されているのも良い．

ググるとSwiftで半開区間が`0..<100`みたいに書けるらしい．へー．

[Range \| Apple Developer Documentation](https://developer.apple.com/documentation/swift/range)

## sieveする

ついでにエラトステネスの篩も書いてみる．

```rust
fn main() {
    let n = 100;
    let mut is_prime = vec![true; n + 1];
    let mut primes = vec![];
    for d in 2..=n {
        if is_prime[d] {
            primes.push(d);
            for i in (2 * d..=n).step_by(d) {
                is_prime[i] = false;
            }
        }
    }
    for p in primes {
        println!("{}", p);
    }
}
```

- `for`ループのステップを変更したい場合は[`step_by`](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.step_by)が使える．ただしステップは正数．
- `if`の直後の括弧は要らない．付けるとコンパイル時に警告される：
```
warning: unnecessary parentheses around `if` condition
 --> src\main.rs:6:11
  |
6 |         if(is_prime[d]){
  |           ^^^^^^^^^^^^^ help: remove these parentheses
  |
  = note: `#[warn(unused_parens)]` on by default
```
- こう書くと`primes`が`std::vec::Vec<usize>`型で推論される．配列の長さの部分で使っているため．正しく動作するがやや気持ち悪い．`as`で明示的に型変換できる．

```rust
fn main() {
    let n: u32 = 100;
    let mut is_prime = vec![true; (n + 1) as usize];
    let mut primes = vec![];
    for d in 2..=n {
        if is_prime[d as usize] {
            primes.push(d);
            for i in (2 * d..=n).step_by(d as usize) {
                is_prime[i as usize] = false;
            }
        }
    }
    for p in primes {
        println!("{}", p);
    }
}
```

[rust\-study/main\.rs at main · roiban1344/rust\-study](https://github.com/roiban1344/rust-study/blob/main/projects/sieve/src/main.rs)

## The book Chap.3 よむ
Common Programming Concepts．どの言語にもあるような基本的な機能の説明．

変数や関数の名前として使えないキーワード（予約語）がRustにも当然あるが，現在機能は持っていないものの将来的に追加される可能性があるため使えないものがある．以下が一覧．`do`とか`try`とか今のところないのか．

[A \- Keywords \- The Rust Programming Language](https://doc.rust-lang.org/book/appendix-01-keywords.html#keywords-reserved-for-future-use)

### 3.1 Variables and Mutability
変数のミュータビリティに関して．

#### Differences Between Variables and Constants

`let`は他の言語の「定数」を想起させるが，実際には異なる．Rustにも`const`宣言はあって`let`とは異なる．`const`宣言時には型注釈を入れなくてはならない．また，どのスコープで宣言することができてどこからでも参照できる点で異なる．

たぶんJavaScriptの`const`には似ている．あちらはシャドウイングが効かず，宣言と値の代入を分離できなくて時々不便に感じることがあるが……．

#### Shadowing
同名の変数を再宣言することができる．型が違っていてもよい点で`mut`による値の変更とは異なる．

[rust\-study/projects/variables/src at main · roiban1344/rust\-study](https://github.com/roiban1344/rust-study/tree/main/projects/variables/src)

### 3.2 Data types
Rustが持つデータ型には"scalar"と"compound"がある．

#### Scalar types
Rustには整数・浮動小数点数・ブーリアン・文字の4つの主要なスカラー型がある．

##### Integer Types
符号付き整数は`i`，符号なし整数は`u`から始まって後にビット数が続く．ビット数は`8`，`16`，`32`，`64`，`128`．$n$ ビット整数は，

符号付き：$[-2^{n-1}, 2^{n-1})$

符号なし：$[0, 2^n)$

の範囲の値を取る．

$$
\begin{align}
    \begin{array}{|cl|}\hline
    n & 2^{n-1}-1\\ \hline
    8 & 127 \\
    16 & 32767 = 7\cdot31\cdot151\\
    32 & 2147483647\\
    64 & 9223372036854775807=7^2\cdot73\cdot127\cdot337\cdot92737\cdot649657\\
    128 & 170141183460469231731687303715884105727 \\\hline
    \end{array}
\end{align}
$$

Table 1. 符号付き $$n$$ ビット整数の最大値．

符号付き$$8,\,32,\,128$$ ビット整数の最大値はメルセンヌ素数である．$$16,\,64$$ ビットは合成数．

[メルセンヌ数 \- Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%AB%E3%82%BB%E3%83%B3%E3%83%8C%E6%95%B0)

リュカテスト書いてみたいな．

`isize`，`usize`型は機械依存．32ビットか64ビット．

整数リテラルにはsuffixとして型名を，prefixによって基数を指定できる．
`0x`: 16進法，`0o`：8進法，`0b`：2進法．
`u8`では"byte"を`b'3'`とか`b'F'`のように書ける．

また，numeric separatorとして`_`を先頭以外の場所に任意個数挿入できる．

デバッグモードではオーバーフローは検出されて`panic`を起こす．これは実はすごい？　`--release`フラグを付けると，桁落ちを起こしてそのままプログラムを継続する．リリースモードでも実行時エラーとして処理したいなら，そのための関数が用意されている．

##### Floating-Point Types
Rustには`f32`と`f64`の二つの浮動小数点数型があって，デフォルトは後者．整数型は32ビットが最も高速に動作するためこれがデフォルトだが，浮動小数点数ではそれほど差異がない．

浮動小数点数の仕様を定めたIEEE 754標準というものがあり，Rustもこれに従っている．

[IEEE 754 \- Wikipedia](https://en.wikipedia.org/wiki/IEEE_754)

##### Numeric Operations

加減乗除と剰余．

##### The Boolean Type

ブーリアン型は`true`と`false`の2値のみをとる．サイズは1バイト．

##### The Character Type

`char`型は単一の文字．シングルクオートで囲む．4バイトの"Unicode Scalar Value"で，`U+0000`から`U+D7FF`までと`U+E000`から`U+10FFFF`まで（両端含む）の範囲を取る．

サンプル．
```rust
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let heart_eyed_cat = '😻';
}
```

Emojiってよく分かってないんだよな……．いやそれを言えば文字コードについて正しく説明もできないけど……．

#### Compound Types
タプルと配列．

##### The Tuple Type

PythonやJavaScript同様"destructuring"できる．`tie`はいらない．

```rust
    let tup = (3, 0.14, 'π');
    let (i, f, c) = tup;
    println!("{} {} {}", i, f, c);
```

値への直接アクセスは`.0`とか`.1`のようにピリオドによる．

##### The Array Type
固定長・全ての要素が同じ型の配列型．

> Arrays are useful when you want your data allocated on the stack rather than the heap

ふむ……．

角括弧で全ての要素を書き下すと配列型になる．宣言は`[i32; 5]`のようにする．`[要素の型; 長さ]`．要素の型の代わりにリテラルを入れるとその値で初期化できる．

### 3.3 Functions
Rustでは変数・関数名はスネークケース．

#### Function Parameters

パラメーターには型注釈をかならず付ける必要がある．

#### Function Bodies COntain Statements and Expressions

関数は一連のstatement（文）に続いてexpression（式：末尾にセミコロンがない）で終わることもある．Rustは"expression-based"な言語である．

文は値を返さない．代入は文で，値を返さないから
```rust
let x = (let y = 42)
```
とか
```rust
x = y = 42
```
とかはコンパイルしない．

関数・マクロの呼び出し，`{}`ブロックは式になる．

```rust
fn main() {
    let x = {
        let x = 3;
        println!("x = {}", x);
        x
    };
    let y = {
        let y = 1;
        println!("y = {}", y);
        y;
    };

    assert_eq!(x, 3);
    assert_eq!(y, ());
}

```

```
warning: path statement with no effect
  --> src\main.rs:10:9
   |
10 |         y;
   |         ^^
   |
   = note: `#[warn(path_statements)]` on by default
```

### 3.4 Comments
スラッシュ2つでコメント．以上．他の言語同様"documentation comment"もある．

### 3.5 Control Flow
Rustにも`if`とloopの制御構文がある．
#### `if` Expressions
`if`や`else`に直結するブロックのことを"arm"と呼んだりする．

`if`で評価されるのは必ず`bool`で，`if 整数型`はRustではコンパイルしない．`bool`への暗黙の型変換は行われず，truthyとかfalsyといった概念はない．

#### Handling Multiple Conditions with `else if`

#### Using `if` in a `let` Statement

`if`は式なので（だから厳密には「`if`文」というと誤りか），三項演算子がこれで書ける．

```rust
    let x = 127;
    let is_even = if x % 2 == 0 { true } else { false };
```

各アームの値は同じ型でなくてはならない．

#### Repetition with Loops
`loop`，`while`，`for`について．

#### Repeating Code with `loop`

#### Returning Values from Loops
`loop`式からは`break 値`で抜けだす．

#### Conditional Loops with `while`

#### Looping Through a Collection with `for`
`while`でインデックスを配列の長さに達するまでインクリメントする方法は良くない．

> It’s also slow, because the compiler adds runtime code to perform the conditional check on every element on every iteration through the loop.

確かに．だから`for(ダミー変数;条件;イテレート)`という記法は用意すらされていないのか．他の言語なら「拡張for文」と言われるものがRustでは普通のfor文になっている．for式か．

`Range`に`rev()`メソッドを付けると逆転できる．

第3章終わり．次の章からRust固有の概念である所有権の説明．