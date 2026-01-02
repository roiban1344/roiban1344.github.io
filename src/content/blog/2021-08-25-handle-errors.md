---
title: "第10日目 - The book 第9章を読む（続）"
date:   2021-08-25 02:51:00 +0900
---

## The book 第9章のつづきから

ここから．
[Recoverable Errors with Result \- The Rust Programming Language](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#shortcuts-for-panic-on-error-unwrap-and-expect)

ちょいちょい見てきた`unwrap`．`Result`型のメソッドで，`Ok`なら中身を取り出す一方，エラーに遭遇した場合はパニクる．

> Returns the contained Ok value, consuming the self value.
>
>Because this function may panic, its use is generally discouraged. Instead, prefer to use pattern matching and handle the Err case explicitly, or call unwrap_or, unwrap_or_else, or unwrap_or_default.

- [Result in std::result \- Rust](https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap)
- [Option & unwrap \- Rust By Example](https://doc.rust-lang.org/rust-by-example/error/option_unwrap.html)

ただし`unwrap`は引数を取らず，エラーメッセージは固定．`expect`（数当てゲームで見た）はエラーメッセージをカスタマイズできる．

### [Recoverable Errors with Result \- The Rust Programming Language](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#propagating-errors)

↑ヘッダーにもリンク付けられるんだ．

エラーの伝播について．関数内部で発生したエラーの処理の判断をその呼び出しもとに委ねたいときはその関数自身も`Result`型を返すようにすればよい．

Throwしない！投げない！`throw`はキーワード（予約語）にすら含まれていない．

- [Keywords \- The Rust Reference](https://doc.rust-lang.org/reference/keywords.html)

- [Rust でキーワード\(予約語\)を識別子として使う方法 \(raw identifier\)と，その例外](https://zenn.dev/magurotuna/articles/52d38178ff3086)

その証拠に`throw`という変数名は自由に使える．`catch`もいいが`try`はダメ．今のところ役割はないが，2018エディションからキーワード入りしている．
```rust
    let throw = "投";
    let catch = "掴";
    //let try = "試";
```

### [Recoverable Errors with Result \- The Rust Programming Language](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#a-shortcut-for-propagating-errors-the--operator)

`match`式のアーム中で`Err`を`return`する処理は，`Result`に`?`を後置することで代用できる．

ただし`match`で書いた場合と異なる点があり，`?`はその関数から発生するエラーをまとめ上げたエラー型に変換してくれる（という理解で正しいだろうか）．

`?`はさらにメソッドを繋げることもできる．
```rust
fn read_user_name_from_file(file_name: &str) -> Result<String, io::Error> {
    let mut s = String::new();
    File::open(file_name)?.read_to_string(&mut s)?;
    Ok(s)
}

```

おおー．`?.`はTSでも見るが意味が違う．

と思ったら必ずしもそうとは言い切れない．`Option`の中で`None`を早期リターンすることもできて，その場合nullチェックを行うTSの用法に似ている．

> When applied to values of the Option<T> type, it propagates Nones.

[Operator expressions \- The Rust Reference](https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-question-mark-operator)


ただしあくまでもnullを返すわけではない．`Option`か`Result`内にしか登場できない．

実はファイルを読む操作はもっと簡単に書けて，`std::fs::read_to_string`だけで済む．

これはいい記事かも．

[Rust のエラーハンドリングはシンタックスシュガーが豊富で完全に初見殺しなので自信を持って使えるように整理してみたら完全に理解した \- Qiita](https://qiita.com/nirasan/items/321e7cc42e0e0f238254)

### [Recoverable Errors with Result \- The Rust Programming Language](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#the--operator-can-be-used-in-functions-that-return-result)

`?`は`std::ops::Try`トレイトを実装した型を戻り値に取る関数内部でしか使えない．つまり標準では`Option`と`Result`．

ただし`main`は条件付きで例外で，`Result<(), Box<dyn Error>>`を返すように書けば使える．

`dyn`とは……．

[dyn \- Rust](https://doc.rust-lang.org/std/keyword.dyn.html)



## [To panic\! or Not To panic\! \- The Rust Programming Language](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html#to-panic-or-not-to-panic)

関数を書くときは，`panic!`するかしないかの判断はその呼び出しもとに丸投げしてよいから，`Result`で書くのがデフォルトの選択になる．ではいつパニックするコードを書くべきか？

コード例を書くとき，プロトタイピングをするときにロバストなエラー処理をする必要はない．テストもある場所でパニックしたら回復してはいけない．`panic!`はどこで問題が起こったか教えてくれるから．

コンパイラによって処理できないロジックで必ず`Ok`が返ることが分かる箇所では，原理的には`panic!`を返しうるコードを書いてもよい．
明らかに有効なIPアドレスのパースなど．ベクターのサイズを判定したうえで`pop().unwrap()`するのもこの例か？

*Bad state*に陥った場合に`panic!`するのもよい．これは脆弱性につながるため開発時に取り除くべきバグで，
標準ライブラリーのメモリ割り当て領域外参照がパニクるのはこの理由による．

値が不正かどうか検査するのは骨の折れる作業だが，型チェックはこれを軽減してくれている．Nullチェックを手で入れる必要はない．

### [To panic\! or Not To panic\! \- The Rust Programming Language](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html#creating-custom-types-for-validation)

数当てゲームのバリデーションのブラッシュアップ．入力値が整数としてパース可能でも1から100までの間でなければ弾きたい．
しかし値のチェックを毎回要求すると，関数としての再利用可能性を損ねる．


この場合，1から100までの値のみをフィールドに持つ構造体を定義して，単に値で持つのではなくこの構造体を返して値のやり取りを行うことにするとよい．`new`メソッドではこの範囲外の値で初期化しようとするとパニクる．フィールドはパブリックにはせず，ゲッターメソッドを用意する．

結局パニクらないためには`new`するときにチェックが要るのか，と思ったらこの例は"contract"を破るから，ということらしい．
必ず`new`を通して初期化するため，そこ以外でのチェックは要らない．
パニクるのはどんなときかAPI documentationに明記するから，値のチェックが分散するということもない．

## 第10章　[Generic Types, Traits, and Lifetimes \- The Rust Programming Language](https://doc.rust-lang.org/book/ch10-00-generics.html#generic-types-traits-and-lifetimes)

ジェネリクスとトレイトとライフタイム．ライフタイム？　
ライフタイムはジェネリクスの一種で，参照の有効性を担保しつつ借用を可能にする．
構造体をフィールドに持つ構造体がうまく扱えなかったのはこれを理解していないためだろうか．

最大値を返す関数．せっかくなので`Option`を使う．

```rust
fn main() {
    let list = [3, 2, 4, 5, 1];
    println!("The largest numer is {}", largest(&list).unwrap());
}

fn largest(list: &[i32]) -> Option<i32> {
    if list.len() == 0 {
        return None;
    }
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    Some(largest)
}
```

### 10.1 [Generic Data Types \- The Rust Programming Language](https://doc.rust-lang.org/book/ch10-01-syntax.html#generic-data-types)

Rustでも型パラメーターには慣習として`T`から使う，というのが明言されている．

```diff
- fn largest(list: &[i32]) -> Option<i32> {
+ fn largest<T>(list: &[T]) -> Option<T> {
```

こうしてジェネラライズ？しようとするとコンパイラに怒られる．

```
error[E0369]: binary operation `>` cannot be applied to type `T`
  --> src\main.rs:12:17
   |
12 |         if item > largest {
   |            ---- ^ ------- T
   |            |
   |            T
   |
help: consider restricting type parameter `T`
   |
6  | fn largest<T: std::cmp::PartialOrd>(list: &[T]) -> Option<T> {
   |             ^^^^^^^^^^^^^^^^^^^^^^

error: aborting due to previous error
```

それにしても分かりやすいな．一旦the bookのほう読まずにやってみよう．

`implements`キーワードではなくてコロンを使うと知った．アドバイスに従うと，

```diff
+ use std::cmp::PartialOrd;

- fn largest(list: &[i32]) -> Option<i32> {
+ fn largest<T: PartialOrd>(list: &[T]) -> Option<T> {
```

まだ怒られる．

```
error[E0508]: cannot move out of type `[T]`, a non-copy slice
  --> src\main.rs:12:23
   |
12 |     let mut largest = list[0];
   |                       ^^^^^^^
   |                       |
   |                       cannot move out of here
   |                       move occurs because `list[_]` has type `T`, which does not implement the `Copy` trait
   |                       help: consider borrowing here: `&list[0]`

error[E0507]: cannot move out of a shared reference
  --> src\main.rs:13:18
   |
13 |     for &item in list {
   |         -----    ^^^^
   |         ||
   |         |data moved here
   |         |move occurs because `item` has type `T`, which does not implement the `Copy` trait
   |         help: consider removing the `&`: `item`
```

`Copy`トレイトを実装していないのがいけない．"consider borrowing here: `&list[0]`"とあるのでそうする．

すると`largest`は`T`から参照の`&T`に変わるのでそれに合わせて他も変える．

```diff
-    let mut largest = list[0];
-    for &item in list {
+    let mut largest = &list[0];
+    for item in list {

-    Some(largest)
+    Some(*largest)
```

借用している値の参照であるため，デリファレンスによって所有権を関数外にムーブさせることはできない（という使い方であっているだろうか）．

```
error[E0507]: cannot move out of `*largest` which is behind a shared reference
  --> src\main.rs:18:10
   |
18 |     Some(*largest)
   |          ^^^^^^^^ move occurs because `*largest` has type `T`, which does not implement the `Copy` trait
```

となると`Copy`をimplementしてコンパイルするか見よう．

```diff
- fn largest<T: PartialOrd>(list: &[T]) -> Option<T> {
+ fn largest<T: PartialOrd, Copy>(list: &[T]) -> Option<T> {
```

当て推量だが複数のトレイトのimplementはカンマ区切りであっていた．

```
 --> src\main.rs:5:41
  |
5 |     println!("The largest numer is {}", largest(&list).unwrap());
  |                                         ^^^^^^^ cannot infer type for type parameter `Copy` declared on the function `largest`
```

型注釈がいる．が，ここで立ち往生してしまう．

```diff
-    println!("The largest numer is {}", largest(&list).unwrap());
+    let largest: i32 = largest(&list).unwrap();
+    println!("The largest numer is {}", largest);
```

こういうことではないらしい．

> For more information about this error, try `rustc --explain E0282`.

とあるので見てみる．

> This error indicates that type inference did not result in one unique possible
type, and extra information is required. In most cases this can be provided
by adding a type annotation. Sometimes you need to specify a generic type
parameter manually.

うーむ．`largest<i32>`としてもダメだ．

で，よく見ると元のエラーメッセージでは

> cannot infer type for type parameter `Copy` declared on the function `largest`

と`Copy`が型パラメータと見なされていることに気付く．

> 当て推量だが複数のトレイトのimplementはカンマ区切りであっていた．

あってへんやんけ．というか`Result`で既に見ていたな．

`&`で繋ぐか`|`か…などといくつか試して`+`に行き当たる．

```diff
- fn largest<T: PartialOrd, Copy>(list: &[T]) -> Option<T> {
+ fn largest<T: PartialOrd + Copy>(list: &[T]) -> Option<T> {
```

するとコンパイルした．

```
The largest number is 5
```

（タイポ）

`Copy`のimplementを要求するというのは実質プリミティブ型を仮定することになっているのだろうか．

[Copy in std::marker \- Rust](https://doc.rust-lang.org/std/marker/trait.Copy.html)

そんなことはなかった．

答え合わせしようと思ったら一旦お預けになっていた！

### [In Struct Definitions](https://doc.rust-lang.org/book/ch10-01-syntax.html#in-struct-definitions)

構造体は`struct Point<T>`みたいに型パラメータを入れる．

### [In Enum Definitions](https://doc.rust-lang.org/book/ch10-01-syntax.html#in-enum-definitions)

列挙型．

```rust
enum Option<T> {
    Some(T),
    None,
}
```

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

Variantsのパラメータには型が入る．これはジェネリクスでなくても同じだが，意識すると奇妙な感じがする．

### [In Method Definitions](https://doc.rust-lang.org/book/ch10-01-syntax.html#in-method-definitions)
メソッドの場合は`impl`の直後にも型パラメータを書く：

```rust
impl <T> MyStruct<T>{
    fn myMethod(&self) -> &T{
        ...
    } 
}
```

`impl`のほうはジェネリクスにしないで，特定の型パラメータを持つ場合にのみ定義されるメソッドを定義することもできる．

```rust
impl MyStruct<f32>{
```

`impl`の型パラメータと構造体のそれが異なっていてもよい．

```rust
impl<T> MyStruct<U>{
```

### [Performance of Code Using Generics](https://doc.rust-lang.org/book/ch10-01-syntax.html#performance-of-code-using-generics)

*Monomorphization*．ジェネリック型はコンパイル時に具体的な型へ読み替えられるため，実行時にパフォーマンス面でジェネリクスを使わない場合との差異は生じない．

この次traitの話．