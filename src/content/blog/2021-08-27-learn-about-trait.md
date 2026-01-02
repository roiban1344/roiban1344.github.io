---
title: "第12日目 - The book 第10.2節をよむ - ジェネリクス"
date:   2021-08-27 03:01:00 +0900
---


## sin1

$$2^{64} \sin 1$$ の整数部分を知るためにはテイラー展開の何次の項まで足せばよいか．

$$
\begin{align}
20!=2432902008176640000&\\
<2^{64}=18446744073709551616&\\
<21!=51090942171709440000&
\end{align}
$$

だから，真値に対する誤差を1より小さくするには$$20$$次までは必要．$$\sin$$ のテイラー展開は偶数項しかないから実際には $$19$$ 次まで足して，

$$
\frac{1}{1!}-\frac{1}{3!}+\frac{1}{5!}-\cdots
-\frac{1}{19!}
=\frac{102360822438075317}{121645100408832000}
=a_{20}
$$

の $$\sin 1$$ との誤差は $$1/21!$$ 以下になる．

$$
b_{20} = a_{20} + \frac{1}{21!} = 
\frac{42991545423991633141}{51090942171709440000}
$$

とすると，$$\sin 1\in [a_{20}, b_{20}]$$. 実際に計算することで

$$
\lfloor 2^{64}a_{20}\rfloor = \lfloor 2^{64}b_{20}\rfloor = 15522399902203605024
$$

が分かって，

$$
\lfloor 2^{64}\sin 1\rfloor = 15522399902203605024
$$

と結論付けられる．この数を$$A$$とする．多少注目されてもよさそうな値だが，これでグーグル検索すると荷物検索を提案されただけだった．

同様に $$\cos$$は，

$$
\lfloor 2^{64}\cos 1\rfloor = 9966818358784711825
$$

でこちらは$$B$$とする．

$$
\begin{align}
    \sin 1 &\in \left[ \frac{A}{2^{64}}, \frac{A+1}{2^{64}} \right],\\
    \cos 1 &\in \left[ \frac{B}{2^{64}}, \frac{B+1}{2^{64}} \right],\\
\end{align}
$$

を使って区間演算をする．

倍角：

$$
\begin{align}
    \sin 2 = 2\sin 1 \cos 1 
    &\in \left[ \frac{16773576919535988475}{2^{64}}, \frac{16773576919535988479}{2^{64}} \right],\\
    \cos 2 = \cos^21-\sin^21&\in \left[ \frac{-7676554190868976274}{2^{64}}, \frac{-7676554190868976271}{2^{64}} \right],\\
\end{align}
$$

……みたいなことをしていく．$$2^{64}$$同士の積は`i128`でオーバーフローするからダメだな．$$2^{63}$$を分母とする分数の構造体を定義して，さらにそれらを両端に持つ「区間」を構造体として定義する．すると自前の構造体+`num`クレートの関数くらいで $$\mid 2^{32} \sin i\mid$$ が $$1\leq i \leq 64$$ の範囲では求まるはず．加法定理に使う乗算は高々6回で済むので，掛け算1回で区間の幅が4倍に広がるとして足りる．

というのはメモ書きに留めて一旦Rust本読む．構造体のコピーを理解していないときっと躓く．

## [Traits: Defining Shared Behavior \- The Rust Programming Language](https://doc.rust-lang.org/book/ch10-02-traits.html#traits-defining-shared-behavior)

*Trait*は型が持つ機能を規定する．他の言語のinterfaceと似ているが，少し違う．

トレイトの定義中にはメソッドのシグネチャのみを書く．

`構造体 implements トレイト`ではなくて`impl トレイト for 構造体`か．

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self, location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

```

これをlib.rsに定義して，`summarize`メソッドをmain.rsで使おうとすると`use traits::Summary`が必要になった．どういうことだろう．`summarize`が`pub`でないのがいけないのかと思って足すとこれも怒られる．

ある型にトレイトをimplementさせるには，その型かトレイトの少なくともどちらか一方がローカルに定義されている必要がある．どちらも外部の場合は許されない．これを*coherence*，*orphan rule*という．どこかで勝手にimplementが行うことは破壊的であるため．

トレイトの関数にはシグネチャのみを記述する代わりに，デフォルト実装を書くこともできる．このデフォルト実装中には，トレイトが持つ他の関数を利用できる．

あるトレイトをimplementしている型の値を引数に取りたいとき，`impl Trait`が型として扱える．

```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

これだけなら型パラメータ`T`がいらない．実際には`T`のある方法，*trait bound*を使った記法のシンタックスシュガーになっている．

```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

同じ型の引数が複数ある時はこっちのほうが簡潔に書ける．使いよう．

## [Specifying Multiple Trait Bounds with the + Syntax](https://doc.rust-lang.org/book/ch10-02-traits.html#specifying-multiple-trait-bounds-with-the--syntax)

複数のtrait boundを課す場合，`+`でトレイトをつなげる．記号は`+`だがだいたい積集合の意味になるはず．

`<T: Trait>`はシグネチャの直後に`where`を付けて書いてもよい．

関数の戻り値を`impl Trait`にすることもできる．これはクロージャやイテレータを使うときに役立つ．
ただし共通のトレイトをimplementしているからといって複数の型を返すことはできない．

## [Fixing the largest Function with Trait Bounds](https://doc.rust-lang.org/book/ch10-02-traits.html#fixing-the-largest-function-with-trait-bounds)

戻ってきた．`>`は`std::cmp::PartialOrd`トレイトに定義されているが，これはpreludeに含まれるため明示的にスコープに入れる必要がなかった．
`Copy`トレイトをtrait boundに設定したが，`Clone`トレイトと`clone`メソッドで代用もできる．または戻り値を参照に変えてもよい．

> Try implementing these alternate solutions on your own!

Implemented.

```rust
fn largest2<T: PartialOrd + Clone>(list: &[T]) -> Option<T> {
    if list.len() == 0 {
        return None;
    }
    let mut largest = list[0].clone();
    for item in list {
        if *item > largest {
            largest = item.clone();
        }
    }
    Some(largest)
}

fn largest3<T: PartialOrd>(list: &[T]) -> Option<&T> {
    if list.len() == 0 {
        return None;
    }
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    Some(&largest)
}
```

3が一番自然だな．スライスで受け取っているのだからコピーして返す必要がない．

## [Using Trait Bounds to Conditionally Implement Methods](https://doc.rust-lang.org/book/ch10-02-traits.html#using-trait-bounds-to-conditionally-implement-methods)

構造体がジェネリック型で定義されているとき，trait boundを設けたメソッドを定義できる．

さらに，あるtrait boundを持つ任意の型に対してトレイトのimplementationを行うことを*blanket implementation*という．

```rust
impl<T: Display> ToString for T {

}
```

初めて見ると一瞬戸惑う．`T`という型に`ToString`トレイトに規定されたメソッドが実装されていて，この`T`には`Display`がtrait boundとして設けられている．具体的な型はしていされていないが，`ToString`のimplementationを行うためには`Display`のメソッドを利用するということになる．
`Display`をtrait boundにもつ全ての型が`ToString`をimplementしていることにもなる．つまりdisplayさえできればto_stringもできる．

> Blanket implementations appear in the documentation for the trait in the “Implementors” section.

これか．

[ToString in std::string \- Rust](https://doc.rust-lang.org/std/string/trait.ToString.html#impl-ToString-6)

今日はここまで．次のライフタイムが難しそー……．