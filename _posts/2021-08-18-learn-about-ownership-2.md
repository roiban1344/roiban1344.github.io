---
layout: post
title: "第4日目 - The book 第4章をよむ - 所有権（続）"
date:   2021-08-18 05:45:00 +0900
---

{% include use_mathjax.html %}

## Chap.4 Understanding Ownership
### 4.1 What is Ownership?（承前）
承前か？
#### Ways Variables and Data Interact: Clone

Deep copyを作りたければ，`clone`メソッドが使える．スタックではなくヒープ上でのコピーを作成し，ムーブは起こらない．

#### Stack-Only Data: Copy

整数型のような原始的な型は，スタック上でのみ値のやりとりが行われるため，そもそもdeep copyとshallow copyの区別を持たない．値のムーブは起らない．再代入後も変数が利用可能な型には`Copy`トレイトが実装されており，`Drop`トレイトが実装されていないことを意味する．4つの基本的なスカラー型と，`Copy`トレイトを実装している型からなるタプルがこれに該当する．配列は入らない．

トレイトは「実装する」でいいのか．インターフェースとはどう違う？

#### Ownership and Functions

関数の引数として変数を渡すことは，代入と同じように振舞う．`Copy`トレイトを実装していない型を変数として渡すと，ムーブが起こる．

#### Return Values and Scope

関数内部で値が作られる場合も，値のムーブに関して同様のルールが適用される．関数の中で`String::new`されて生成された値は，引数として代入されればその外側の変数に所有権が移り，そうでなければ関数のスコープを抜けた途端にドロップされる．

関数内で値を使ったあとに再利用したい場合，タプルを使って所有権を関数外部に復帰させるという方法を使うことができる．が，そんなことをしなくても，"reference"という方法がある．

### 4.2 References and Borrowing
関数の引数を`&`の付いた参照として渡せば，所有権を奪うことなく値を利用することができる．関数のパラメータを参照として呼ぶことを"borrowing"（借用）という．借りたら返す．というより所有権が移されていない値はスコープに入る前後で元の値に対して何も起こさない．借用されている値を関数内部でミューテートすることは不可能．

#### Mutable References
`&mut`を変数の頭に付ければmutable referenceとして関数内部で値を変更できる．

`chmax`が書ける！
```rust
fn main() {
    let mut x = 0;
    let a = [3, 1, 4, 1, 5, 9, 2, 6, 5];
    for e in a {
        chmax(&mut x, e);
        println!("{}", x);
    }
}

fn chmax(x: &mut i32, y: i32) {
    if *x < y {
        *x = y;
    }
}

```

出力；
```
3
3
4
4
5
9
9
9
9
```

あるスコープ内で，特定の変数に対して同時に持つことができるmutable referenceは1つ以下に制限される．

この制約は"data race"（データ競合）をコンパイル時点で回避するのに役立つ．

不変参照と同時に可変参照を持つことはできない．同じスコープ内に存在する不変参照の個数$$i$$と$$m$$に関して，

$$
(i, m) \in  \{(0,0)\} \cup \left\{(n,0)\middle|n\geq 1\right\} \cup \{(0,1)\}.
$$

#### Dangling References
"Dangling pointer"（宙吊りのポインタ）が作られる可能性はRustでは排除される．データへの参照がある限りは，そのデータの実体も存在することが保証される．"Lifetime"に関する制約による．

ここで説明された制約でほどよく困ってみるための演習がしたいな……もうしばらくは読みに徹するか．

### 4.3 The Slice Type
スライスを導入するモチベーション．文字列中における位置を数値として取得すると，元の文字列と連動しないため，存在しない位置を指し続けることができてしまう．これはコンパイルするが問題を生じる．

#### String Slices

文字列スライスは，文字列の連続する領域への参照．内部的には，ヒープ上のデータの始点と長さがスタック上に保持される．型は`&str`．

マルチバイト文字の途中をインデックスとして指すとパニクる．

スライスはimmutable borrow（不変借用？）であるため，そのスコープ内で可変借用を行うことがコンパイル時点で禁じられる．存在しない領域を参照し続けることが，ランタイムより前に阻まれる．

#### String Literals Are Slices
文字列リテラルはスライスである．確かにエディタでカーソルを合わせると`&str`になる．

#### String Slices as Parameters
関数の引数を`&str`にすると，`String`が渡されたときはその全体へのスライスとして扱われて便利．

#### Other Slices
配列にもスライスがある．OK．

## 整数の分割を列挙する

[Partition \(number theory\) \- Wikipedia](https://en.wikipedia.org/wiki/Partition_(number_theory))

> A000041		a(n) is the number of partitions of n (the partition numbers).
[A000041 \- OEIS](https://oeis.org/A000041)

$$
\begin{align*}
p(0)&=1,\\
p(1)&=1,\\
p(2)&=2,\\
p(3)&=3,\\
p(4)&=5,\\
p(5)&=7,\\
p(6)&=11,\\
p(7)&=15,\\
p(8)&=22,\\
p(9)&=30,\\
p(10)&=42.
\end{align*}
$$

和が $$n$$ 以下の非増加列をスタックに積んで取り出し，和が $$n$$未満なら要素を追加して積み，ちょうど $$n$$ ならカウント・表示．重複は生じない．

C++ならstackを使うところだが，どうもそのものは標準ライブラリに用意されていないらしい．
[Are there queue and stack collections in Rust? \- Stack Overflow](https://stackoverflow.com/questions/40848918/are-there-queue-and-stack-collections-in-rust)

[std::collections \- Rust](https://doc.rust-lang.org/std/collections/index.html)

普通に`Vec`を使う．Pythonでもそうか．

```rust
fn main() {
    let n = 6;
    let mut s = Vec::<Vec<i32>>::new();
    for i in 1..=n {
        s.push(vec![i]);
    }
    let mut count = 0;
    while s.len() > 0 {
        let partition = s.pop().expect("empty stack");
        let &last = partition.last().expect("empty partition");
        let sum: i32 = partition.iter().sum();
        if sum == n {
            println!("{:?}", partition);
            count += 1;
        } else {
            let res = n - sum;
            for i in 1..=res.min(last) {
                let mut p = partition.clone();
                p.push(i);
                s.push(p);
            }
        }
    }
    println!("p({}) = {}", n, count);
}

```

出力：
```
[6]
[5, 1]      
[4, 2]      
[4, 1, 1]   
[3, 3]      
[3, 2, 1]   
[3, 1, 1, 1]
[2, 2, 2]   
[2, 2, 1, 1]
[2, 1, 1, 1, 1]
[1, 1, 1, 1, 1, 1]
p(6) = 11
```

よし．

しかし配列の末尾要素の取得が`Option`型であるために意味のない`expect`を書くのが微妙……．

`match`で書き換えてみる．

```diff
-    while s.len() > 0 {
-        let partition = s.pop().expect("empty stack");
-        let &last = partition.last().expect("empty partition");
+    loop {
+        let partition = match s.pop() {
+            Some(partition) => partition,
+            None => break,
+        };
+        let &last = match partition.last() {
+            Some(last) => last,
+            None => break,
+        };
```

https://github.com/roiban1344/rust-study/blob/main/projects/partition/src/main.rs

冗長だけどこっちのほうが自然なのかなぁ．

よく考えると`n = 0`のとき`p(0)=0`になっちゃうな．

理解していないのが，`sum`に型注釈がないとコンパイルしないこと．

```
error[E0282]: type annotations needed
  --> src\main.rs:23:26
   |
22 |             let res = n - sum;
   |                 --- consider giving `res` a type
23 |             for i in 1..=res.min(last) {
   |                          ^^^ cannot infer type
   |
   = note: type must be known at this point
```

省くと`res`の方に波及してここでコンパイルエラーになる．`sum`なんだから整数型に決まっているでしょうというは違うのか．

続けて5章読んでいく．