---
title: "第1日目 - Rust入門"
date:   2021-08-14 23:55:00 +0900
---

Rustやるぞっ

かなり前にこの記事を読んで分からないなりに感銘を受けてから1年以上が経ち…

[Re：FizzBuzzから始めるRust生活 \- cats cats cats](https://hinastory.github.io/cats-cats-cats/2020/04/01/refizz-starting-life-in-rust-world/)

Zennのこの素晴らしい本は半分くらいまでコード真似しながらやってみたものの，所有権と借用を理解する前に投げ出してしまい…

[RustCoder ―― AtCoder と Rust で始める競技プログラミング入門](https://zenn.dev/toga/books/rust-atcoder)

今に至る．

インストールはかなり前に済ませた．"Visual Studio C++ Build tools"が必要というところでだけやや迷う．

[Getting started \- Rust Programming Language](https://www.rust-lang.org/learn/get-started)

かわいー

```
 __________________________
< Hello fellow Rustaceans! >
 --------------------------
        \
         \
            _~^~^~_
        \) /  o o  \ (/
          '_   -   _'
          / '-----' \
```

[rust\-study/main\.rs at main · roiban1344/rust\-study](https://github.com/roiban1344/rust-study/blob/main/hello-rust/src/main.rs)

## The book よむ

一旦公式の "the book" (*The Rust Programming Language*) 読んでみる．

https://doc.rust-lang.org/book/

### 1. Getting Started

#### 1.1 Installation
もうやった．

#### 1.2 Hello, World!
`.rs`のソースファイルを作って`rustc`でコンパイル，実行する手順．

[Hello, World\! \- The Rust Programming Language](https://doc.rust-lang.org/book/ch01-02-hello-world.html#writing-and-running-a-rust-program)

`Cargo.toml`は必須なのかと思っていた．

#### 1.3 Hello, Cargo!
ここから`cargo`使う．

```
$ cargo new hello_world
$ cd hello_world
$ ./target/debug/hello_world
Hello, world!
```

この`/target/debug`下に`hello_cargo.exe`と`hello_cargo.pdb`ファイルが作られている．`debug`? と思ったら`cargo build --release`というオプションがあって，こちらでは最適化の施された実行ファイルが`/target/release`に作られる．何か重い計算をやりたいときはこっちのファイルを使うといいのか．ベンチマークテストで比較してみたいな．

`cargo run`コマンドでも同様に実行できて，

```
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.02s
     Running `target\debug\hello_cargo.exe` 
Hello, world!
```

今回はコンパイル済みのため実行だけ．変更を加えるとコンパイルから始まる．

`cargo check`はコンパイルが通るかどうかだけ検査して実行ファイルを作成しない．

### 2. Programming a Guessing Game
Gussing Game: 数当てゲームを作る．同じMozillaでJavaScriptのチュートリアルでやったことがある．

[A first splash into JavaScript \- Learn web development \| MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/A_first_splash)

#### Setting Up a New Project
```
$ cargo new guessing_game
```

#### Processing a Guess
入力を受け取る部分を書く．C++なら`cin`で済むところが割と面倒になる．競技プログラミング用には`proconio`クレートというのが使われるというのを上述のRustCoderで知った．

[proconio \- crates\.io: Rust Package Registry](https://crates.io/crates/proconio)

[std::prelude](https://doc.rust-lang.org/std/prelude/index.html)!　なんて良い名付けなんだ……．`String`や`Vec`型はここに入っているので`use`なしで使える．

#### Storing Values with Variables
入力を変数`guess`として受け取る．

`String::new()`は`string`型オブジェクトを初期化する．`new`関数は(`String`型の)"associated function"といって，特定のインスタンスではなく型に備わっている．他の言語の静的メソッドに相当．[日本語訳](https://doc.rust-jp.rs/book-ja/ch02-00-guessing-game-tutorial.html#%E5%80%A4%E3%82%92%E5%A4%89%E6%95%B0%E3%81%AB%E4%BF%9D%E6%8C%81%E3%81%99%E3%82%8B)だと「関連関数」となっている．「静的」もそうだが慣れないといまいちピンとこない．

#### Handling Potential Failure with the Result Type 

`read_line`は`io::Result`型を返す．これは`Ok`と`Err`の"variants"（「列挙子」）からなる列挙型．`read_line`が`Err`を返した場合，`.expect`メソッドの引数のメッセージを表示してプログラムが停止する．`Ok`を返した場合は`read_line`の結果をそのまま受け流す．`.expect`を付けなかった場合，コンパイルは通るが適切なエラー処理が行われていないことに関して警告が表示される．

後から気付いたメモ．「そのまま受け流す」と書いたがよく読むとそうではなくて，参照されている`guess`へ文字を付け加えるということらしい．改行文字が来た場合は`break`する．

#### Printing Values with `println!` Placeholders

> The set of curly brackets, `{}`, is a placeholder: think of `{}` as little crab pincers that hold a value in place.

蟹ネタを入れてくる．それとも"crab pincers"は普通に使われる表現なのだろうか．Pythonに似たプレースホルダー付きのprint文が使える．

#### Testing the First Part

ここまでで書いたコードで`cargo run`すると，入力した値をそのまま返すプログラムとして正しく動く．
```rust
use std::io;

fn main() {
    println!("Guess the number!");

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {}", guess);
}
```

```
Guess the number!
Please input your guess.
42
You guessed: 42
```

#### Generating a Secret Number

数当ての対象になる数をランダム生成する機能を追加する．

#### Using a Crate to Get More Functionality

実行ファイルが入ったクレートを"binary crate"（バイナリクレート）と呼んで，他のプログラムで使われる前提のクレートを"library crate"（ライブラリクレート）と呼ぶ．ここでは`rand`ライブラリクレートを使うために`Cargo.toml`にdependencyを追記する．

`Cargo.toml`は"Semantic Versioning"(SemVer)でバージョンを解釈している．数値は"MAJOR.MINOR.PATCH"の形式で，
- MAJOR: APIの変更を含む
- MINOR: 機能は追加されるが後方互換性を保つ
- PATCH: バグの修正

を意味する．`"0.8.3"`は`"^0.8.3"`の意味で，0.8.3以降かつ0.9.0未満の範囲で最新のバージョンが利用される．バグの修正を含む最新のバージョンが選ばれるということ．

```toml
[dependencies]
rand = "0.8.3"
```

`cargo build`で`rand`クレートがダウンロードされる．ドキュメントに
>You may see different version numbers

とあるが，確かに1つパッチ修正が加わっていた．

```
   Compiling rand v0.8.4
```

Crates.ioの`rand`クレートのページ．

[rand \- crates\.io: Rust Package Registry](https://crates.io/crates/rand)

#### Updating a Crate to Get a New Version

将来，依存するクレートのパッチバージョンが上がっているものの何らかの誤りでバグを含んでしまうことがあるかもしれない．もしそういった望ましくない事態が発生しても，`cargo`は`Cargo.toml`から再計算を行うのではなく．`Cargo.lock`のほうを見るので実装時の動作は保証される．`Cargo.lock`は自動生成されるファイルだが，この理由でgit管理下には置くべきだということになるのか．"Dependency"の概念について講義でも受けたい気分がある．

[Dependency hell \- Wikipedia](https://en.wikipedia.org/wiki/Dependency_hell)

[GitHubが狙う「ライブラリのバージョン管理問題」の解決と依存関係地獄の話 \- ぶるーたるごぶりん](https://brutalgoblin.hatenablog.jp/entry/2020/08/07/220036)

#### Generating a Random Number

```
use rand::Rng;
```

で`Rng`（Rngrandom number genertor）トレイトの利用を宣言する．

`cargo doc --open`　面白い！　ドキュメントが生成されて，依存するクレートの仕様を見ることができる．えー便利．

#### Comparing the Guess to the Secret Number

```
use std::cmp::Ordering;
```

で`Ordering`という新しい列挙型を，標準ライブラリからスコープへ入れる．`Less`, `Greater`, `Equal`の3つの列挙子からなる．

`match`文は他の言語のおおよそ`switch`に相当して，可能なパターンに対する網羅的な処理を記述できる．

Rustでは同名の変数を再宣言する"shadowing"が可能．型もミュータビリティも違っていてよい．

`String`に対する`trim`メソッドは空白を削除する．Perlの`chomp`か．

全く本筋と関係ないがこの質問で[Google Books Ngram Viewer](https://books.google.com/ngrams)というのがあることを知った．

[sentence construction \- "a comparison between A and B" or "a comparison of A and B"? \- English Language Learners Stack Exchange](https://ell.stackexchange.com/questions/1183/a-comparison-between-a-and-b-or-a-comparison-of-a-and-b)

ここで`trim`を抜いて
```diff
-    let guess: u32 = guess.trim().parse().expect("Please type a number!");
+    let guess: u32 = guess.parse().expect("Please type a number!");
```
（↑差分のシンタックスハイライティングが効いて嬉しい．[Diff syntax highlighting in Github Markdown \- Stack Overflow](https://stackoverflow.com/questions/40883421/diff-syntax-highlighting-in-github-markdown)）

とするとpanicする．

```
Guess the number!
The secret number is: 92
Please input your guess.
42
thread 'main' panicked at 'Please type a number!: ParseIntError { kind: InvalidDigit }', src\main.rs:20:36
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
error: process didn't exit successfully: `target\debug\guessing_game.exe` (exit code: 101)
```

#### Allowing Multiple Guesses with Looping

`loop`文で停止しないループを書ける．条件なしの`while(true)`を書くより合理的だ．

> The user could always interrupt the program by using the keyboard shortcut ctrl-c. But there’s another way to escape this insatiable monster,...

insatiable: 貪欲な，飽くことを知らない．知らなかった．

#### Quitting After a Correct Guess

数当て成功時に`break`するように変更する．

```diff
-            Ordering::Equal => println!("You win!"),
+            Ordering::Equal => {
+                println!("You win!");
+                break;
+            }
```

この書き方ができるのは気持ちが良い．`if`が要らない．

これで数当てゲームが一応完成した．

#### Handling Invalid Input
不正な入力を無視して再入力できるようにする．

```rust
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
```

これもなかなか．

`secret_number`のプリント文を消してゲームとして完成！

[rust\-study/main\.rs at main · roiban1344/rust\-study](https://github.com/roiban1344/rust-study/blob/main/projects/guessing_game/src/main.rs)


## TODOメモ

- Rustフォーマッターのgit hooksを入れたい．
- 一度ここまで覚えたことでfizzbuzz書く．