---
layout: post
title: "第9日目 - The book 第9章を読む - エラー処理"
date:   2021-08-24 01:34:00 +0900
---

{% include use_mathjax.html %}

## Numberphile

ここのところ寝る前に見るのがNumberphileになっている．

面白かったやつその1：

[The Square\-Sum Problem \- Numberphile \- YouTube](https://www.youtube.com/watch?v=G1m7goLCJDY&ab_channel=Numberphile)

$$1$$から$$n$$までの正整数の順列で，全ての隣り合う2数が平方数になるようなものは存在するか？という問題．

$$n=15$$が最小．次が$$16,17$$と続いて飛んで$$23$$．$$n=17$$の場合：

$$
17,8,1,15,10,6,3,13,12,4,5,11,14,2,7,9,16.
$$

$$1$$ から $$n$$ の値をもつ頂点があって，和が平方数になる場合にのみ異なる二つの頂点を結ぶ辺が存在するようなグラフのハミルトン路が存在する，とも言い換えられる．

……で，OEISる（ググる）ときちんと登録されていて，$$n\geq 25$$の全ての$$n$$でこのような順列が存在することが動画公開の10日後に証明されていて戦慄……．

*Numbers n such that there is a permutation of the numbers 1 to n such that the sum of adjacent numbers is a square.*
[A090461 \- OEIS](https://oeis.org/A090461)

ここに含まれない数列[A078107](https://oeis.org/A078107)のほうは有限性が証明されていることになる．

面白かっやたやつその2：

[How many ways can circles overlap? \- Numberphile \- YouTube](https://www.youtube.com/watch?v=bRIL9kMJJSc&t=435s&ab_channel=Numberphile)

$$n$$ 個の円（大きさは異なっていてもよいが直線は円に含めない）を描く方法は何通りあるか？という問題．円が2個なら3通り．
◎，〇〇，ベン図．「ベン図」ってUnicodeにありそうだけど見つからないな．これはLaTeX→$$\circ\!\!\circ$$

円が3個なら14通りと一気に増えて，重複なく数え上げるのはちょっとした頭の体操になる．現状

$$
1,3,14,173,16951
$$

までは知られていてこれは動画公開時より更新されていない．

*Number of arrangements of n circles in the affine plane.*
[A250001 \- OEIS](https://oeis.org/A250001)

良い～～～…………．幾何学と組合せ論のインターセクション．

幾何学は本当に考慮に入れる必要があり，というのは楕円だと実現できる配置が円では実現できない場合があるから．

*Number of arrangements of n pseudo-circles in the affine plane.*
[A288559 \- OEIS](https://oeis.org/A288559)

とはいえこちらも6まで．難しすぎる．

Numberphileはプログラミング向けの絶好の素材を提供してくれる．

## The book 第9章 "Error Handling" をよむ
さてRust．

Rustはエラーを大きく2つに分ける：*recoverable*と*unrecoverable*．文字通り．
"Exception"は持たない．
「エラー」と「例外」の微妙なニュアンスに頭を悩ませる必要はない？

Recoverableは`Result`型で分岐処理を行い，unrecoverableは`panic!`マクロによってそれ以上の処理を止める．

### 9.1 Unrecoverable Errors with panic!
`panic!`マクロのデフォルト挙動は*unwind*で，その時点で占有していたリソースを全て解放する．
ただしこれは重い処理なので，Cargo.tomlに`panic='abort'`を書き込んで，リソースの解放をOS任せにして
パニクった瞬間に処理をabortすることもできる．

Cでは*buffer overread*といって，配列の割り当てられていない領域を読む動作はundefinedとして
実行可能で，脆弱性になりうる．Rustではこれはパニックを生む．そうか，「未定義動作」ではないのか．
逆に未定義動作というものはRustにはあるのだろうか．

盛り上がっている：[Does Rust have undefined behaviour? : rust](https://www.reddit.com/r/rust/comments/1gys8y/does_rust_have_undefined_behaviour/)

良い講義スライド：[kondo\-yoshida\-rust\.pdf](https://www.eidos.ic.i.u-tokyo.ac.jp/~tau/lecture/programming_languages/presentations/2020/kondo-yoshida-rust.pdf)

ラストノミコン：[Introduction \- The Rustonomicon](https://doc.rust-lang.org/nomicon/index.html)

配列のインデックス超過はそもそもコンパイルしない：

```rust
    let platonic_solid_vertices = [4, 6, 8, 12, 20];

    println!("{}", platonic_solid_vertices[5]);
```

```
error: this operation will panic at runtime
 --> src\main.rs:5:20
  |
5 |     println!("{}", platonic_solid_vertices[5]);
  |                    ^^^^^^^^^^^^^^^^^^^^^^^^^^ index out of bounds: the length is 5 
but the index is 5
  |
  = note: `#[deny(unconditional_panic)]` on by default
```

```diff
-    let platonic_solid_vertices = [4, 6, 8, 12, 20];
+    let platonic_solid_vertices = vec![4, 6, 8, 12, 20];
```

ベクターにするとコンパイルしてパニクる．

```
    Finished dev [unoptimized + debuginfo] target(s) in 0.03s
     Running `target\debug\error_handling.exe`
thread 'main' panicked at 'index out of bounds: the len is 5 but the index is 5', src\main.rs:5:20
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
error: process didn't exit successfully: `target\debug\error_handling.exe` (exit code: 
101)
```

`RUST_BACKTRACE=1 cargo run`で*backtrace*を出力できる．

```
thread 'main' panicked at 'index out of bounds: the len is 5 but the index is 5', src\main.rs:5:20
stack backtrace:
   0: std::panicking::begin_panic_handler
             at /rustc/a178d0322ce20e33eac124758e837cbd80a6f633\/library\std\src\panicking.rs:515
   1: core::panicking::panic_fmt
             at /rustc/a178d0322ce20e33eac124758e837cbd80a6f633\/library\core\src\panicking.rs:92
   2: core::panicking::panic_bounds_check
             at /rustc/a178d0322ce20e33eac124758e837cbd80a6f633\/library\core\src\panicking.rs:69
   3: core::slice::index::{{impl}}::index<i32>
             at /rustc/a178d0322ce20e33eac124758e837cbd80a6f633\library\core\src\slice\index.rs:184
   4: core::slice::index::{{impl}}::index<i32,usize>
             at /rustc/a178d0322ce20e33eac124758e837cbd80a6f633\library\core\src\slice\index.rs:15
   5: alloc::vec::{{impl}}::index<i32,usize,alloc::alloc::Global>
             at /rustc/a178d0322ce20e33eac124758e837cbd80a6f633\library\alloc\src\vec\mod.rs:2428
   6: error_handling::main
             at .\src\main.rs:5
   7: core::ops::function::FnOnce::call_once<fn(),tuple<>>
             at /rustc/a178d0322ce20e33eac124758e837cbd80a6f633\library\core\src\ops\function.rs:227
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.error: process didn't exit successfully: `target\debug\error_handling.exe` (exit code: 101)
```

このバックトレースはdebugモードでのみ見られる．つまり`--release`フラグを付けないデフォルトの`cargo run`時．

## 9.2 Recoverable Errors with Result

数当てゲームでも使った`Result`型について．

[Result in std::result \- Rust](https://doc.rust-lang.org/std/result/enum.Result.html)

`Ok`と`Err`の2つのvariantsからなるenum型．どちらもpreludeに含まれている．

ファイルを開ける操作．
```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt"); 
}

```

`f`に意図的に間違った型注釈を与えてコンパイルすれば`File::open`がどのような型を返すか分かる，というがメモ帳とコンパイラしかない場合はそれが一番早いのか？　`cargo doc --open`で読みこんでいるパッケージへのリファレンスも作られるかと思って試すと残念ながらそれはなかった．VSCodeを使っていれば`std::result::Result<std::fs::File, std::io::Error>`型が戻ることは分かる．

`Err`のほうの中身は`{:?}`で展開できる．

```
thread 'main' panicked at 'Problem opening the file: Os { code: 2, kind: NotFound, message: "指定されたファイルが見つかりま
せん．" }', src\main.rs:8:23
```

ファイルが見つからないとき新規作成するにはこうする：

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let file_name = "hello.txt";
    let f = File::open(file_name);

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create(file_name) {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => {
                panic!("Problem opening the file: {:?}", other_error)
            }
        },
    };
}
```

3重入れ子の`match`．`Result`にはクロージャを引数に取るメソッドがいくつも用意されていて，`match`のないコンパクトなコードへとブラッシュアップできる．

```rust
fn main() {
    let file_name = "hello.txt";
    let f = File::open(file_name).unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create(file_name).unwrap_or_else(|error| {
                panic!("Problem crating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error)
        }
    });
}

```

むむむ……．だいたいやっていることは分かるとはいえ，`||`をクロージャに使う記法にまだ見慣れないためもあってかやや厳しい．

> A more seasoned Rustacean might write this code instead of Listing 9-5

Seasoned Rustaceanになりてー．

多分遠からずこの記事にはお世話になるだろう：

[RustでOption値やResult値を上手に扱う \- Qiita](https://qiita.com/tatsuya6502/items/cd41599291e2e5f38a4a)

今日はここまで．