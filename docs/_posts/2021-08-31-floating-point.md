---
layout: post
title: "第15日目 - f32とf64"
date:   2021-08-31 22:15:00 +0900
---

{% include use_mathjax.html %}

## sin1は無理数か？

[How to prove sin1 irrational \- Quora](https://www.quora.com/How-do-I-prove-sin-1-irrational-The-units-are-radians)

それはもちろんそうだろうとは思ったが証明を思い付かなかった．
調べるとQuoraに実に簡潔な証明があった．

テイラー展開から任意の自然数 $$n$$ に対してある整数sが存在して $$(s/n!, (s+1)/n!)$$ に $$\sin 1$$が含まれることが分かる．
ところが，任意の有理数はある自然数 $$m$$ と整数 $$t$$ によって $$t/m!$$ と表されるから矛盾．$$\square$$

これくらい思い付きたかった．というか解析の教科書の演習問題として載っていそうだ．

では超越数か？というともちろんそうで，[Lindeman-Weierstrassの定理](https://en.wikipedia.org/wiki/Lindemann%E2%80%93Weierstrass_theorem)から示される．

$$\sin 1=\alpha$$ が代数的数であるとすると，$$e^{i}-2i\alpha e^0-e^{-i}=0$$. ところが，指数の $$i,0,-i$$ は独立な代数的数であり，Lindeman-Weierstrassの定理から$$a e^{i}+be^{0}+ce^{-i}=0$$を満たす代数的数の組 $$(a,b,c)$$ は $$(0,0,0)$$ に限る．これは矛盾．$$\square$$．

[trigonometry \- Proof that cos\(1\) is transcendental? \- Mathematics Stack Exchange](https://math.stackexchange.com/questions/677900/proof-that-cos1-is-transcendental)

まあLindeman-Weierstrassの定理の証明は全然知らないのだけれど……．

名前だけは大昔から知っている本：

[無理数と超越数｜森北出版株式会社](https://www.morikita.co.jp/books/mid/006091)

では[周期](https://en.wikipedia.org/wiki/Period_(algebraic_geometry))か？というと，これは軽く見ただけでは分からなかった．多分違うだろう．

## float

[数日前にこういうことを書いていた](https://roiban1344.github.io/2021/08/22/practice-for-the-book-chap-8.html)：

> $$i=1,2,\cdots, 64$$ に対して $$2^{32}|\sin(i)|$$の整数部分を利用する．原理的に計算できることは分かるが，
実際やるとなると組み込みのsinなんかでは精度が足りないはずで，どう計算すれば検証できるだろうと考えると面白い．

言っておきながら組み込みの`sin`メソッドは試してすらいなかった．やろう．

```rust
const TABLE: [(i64, i64); 64] = [
    (1, 0xd76aa478),
    (2, 0xe8c7b756),
    (3, 0x242070db),
    //略
    (64, 0xeb86d391),
];

fn main() {
    for (i, t) in TABLE {
        let t_f32 = t_f32(i);
        let t_f64 = t_f64(i);
        println!("{:>2}\t{:>10}\t{:>5}\t{}", i, t, t_f32 - t, t_f64 - t);
    }
}

fn t_f32(i: i64) -> i64 {
    let sin = (i as f32).sin();
    let x = sin.abs() * (4294967296_i64 as f32);
    x.floor() as i64
}

fn t_f64(i: i64) -> i64 {
    let sin = (i as f64).sin();
    let x = sin.abs() * (4294967296_i64 as f64);
    x.floor() as i64
}

```

`数値.sin()`という記法が慣れない．

結果：
各行のデータは$$i$$，$$4294967296|\sin(i)|$$の整数部分の真値，それを`f32`で計算した場合の真値との差，`f64`で計算した場合の差の順．
```
 1      3614090360       -120   0
 2      3905402710        -86   0
 3       606105819        -27   0
 4      3250441966         18   0
 5      4118548399         81   0
 6      1200080426        -42   0
 7      2821735955        -19   0
 8      4249261313         -1   0
 9      1770035416         40   0
10      2336552879         81   0
11      4294925233         79   0
12      2304563134         66   0
13      1804603682        -34   0
14      4254626195        109   0
15      2792965006        114   0
16      1236535329        -33   0
17      4129170786        -98   0
18      3225465664        -64   0
19       643717713        -17   0
20      3921069994         86   0
21      3593408605        -93   0
22        38016083          1   0
23      3634488961        127   0
24      3889429448         56   0
25       568446438         26   0
26      3275163606         42   0
27      4107603335        121   0
28      1163531501         19   0
29      2850285829         -5   0
30      4243563512          8   0
31      1735328473         39   0
32      2368359562        118   0
33      4294588738        -66   0
34      2272392833        127   0
35      1839030562        -34   0
36      4259657740        -12   0
37      2763975236        -68   0
38      1272893353        -41   0
39      4139469664        -96   0
40      3200236656       -112   0
41       681279174         -6   0
42      3936430074          6   0
43      3572445317        123   0
44        76029189          3   0
45      3654602809        -57   0
46      3873151461         27   0
47       530742520          8   0
48      3299628645       -101   0
49      4096336452        -68   0
50      1126891415        -23   0
51      2878612391         89   0
52      4237533241        -57   0
53      1700485571         61   0
54      2399980690        110   0
55      4293915773       -125   0
56      2240044497         47   0
57      1873313359         49   0
58      4264355552         32   0
59      2734768916        -20   0
60      1309151649        -33   0
61      4149444226        126   0
62      3174756917        -53   0
63       718787259          5   0
64      3951481745        111   0
```

見ての通り`f64`では正しく計算できている一方で，なんと`f32`は全滅．
相対誤差で言うと$$10^{-8}$$ くらいなのでこんなものかという気はする．

いや本当か？　誤差を決めているのはどこだ？

## f32とf64をまとめて扱う

その前に，二つの関数`t_f32`と`t_f64`が冗長なのでジェネリクス化しよう．

まず`sin`メソッドのドキュメントを見る．

[f64 \- Rust](https://doc.rust-lang.org/std/primitive.f64.html#method.sin)

あれ，トレイトがない．そう，どうやら`f32`と`f64`の`sin`メソッドは標準ライブラリではトレイトによって結びつけられているわけではないらしい．

> 一方, `sin` や `exp` などの数学関数は `std` ではトレイトとしては用意されていないため, `num_traits::Float` が必要です. 

[\[Rust\] f32 と f64 でコードを共有する \- Qiita](https://qiita.com/osanshouo/items/4fb3d60e9ce321fa849e)

`num-traits`クレート．

[num\-traits \- crates\.io: Rust Package Registry](https://crates.io/crates/num-traits)

`as T`みたいなキャストもできないということ含め全部書いてある．

これを参考に書き換えるとこうなる：

```rust
use num_traits::{Float, FromPrimitive};
```

```rust
fn t_float<T: Float + FromPrimitive>(i: i64) -> i64 {
    let sin = T::from_i64(i).unwrap().sin();
    let x = sin.abs() * T::from_i64(4294967296_i64).unwrap();
    T::to_i64(&x.floor()).unwrap()
}
```

キャストに`unwrap()`がいるのはオーバーフローすることがあるため．
こういうところをきちんと考慮するよう誘導してくれるのは本当に嬉しい．

使い方は`t_float::<f32>(i)`とするだけ．明示的な型注釈が必要．

実行結果は書き換える前のものを再現する．

## sinの実装

ではRustの`std`での`sin`の実装はどうなっているか．`f32`のほうの定義に飛ぶとこうなっている：

```rust
    pub fn sin(self) -> f32 {
        unsafe { intrinsics::sinf32(self) }
    }

```

これは……．ここから先へは飛べない．

[std::intrinsics \- Rust](https://doc.rust-lang.org/std/intrinsics/index.html)

> These are imported as if they were FFI functions, with the special rust-intrinsic ABI.
[intrinsics \- The Rust Unstable Book](https://doc.rust-lang.org/beta/unstable-book/language-features/intrinsics.html)

FFI = Foreign function interface

[Foreign function interface \- Wikipedia](https://ja.wikipedia.org/wiki/Foreign_function_interface)

[Rust の Foreign Function Interface \(FFI\) \- Qiita](https://qiita.com/termoshtt/items/0fa9959f9eb64b0907e2)

[FFI \- The Rustonomicon](https://doc.rust-lang.org/nomicon/ffi.html)

うーむ分からん．Javaだと定義に飛ぶだけで13次のテイラー展開とかが見えたはずなのだけれど．
Rustだと他の言語のライブラリを呼び出しているということなのか？
