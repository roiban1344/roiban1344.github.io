---
layout: post
title: "第8日目 - The book 第8章の演習"
date: 2021-08-23 01:10:00 +0900
---

{% include use_mathjax.html %}

## VSCode スニペット

記事の YAML フロントマターをスニペット登録．`$CURRENT_HOUR`で例えば現在時刻が自動挿入される．

[Snippets in Visual Studio Code](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

date はだいたいコミットのタイミングに書き換えてしまうけれど……．

## モジュールの練習

lib.rs の関数を main.rs から呼び出せなくて半泣きになった．

[Main\.rs and lib\.rs at same level \- help \- The Rust Programming Language Forum](https://users.rust-lang.org/t/main-rs-and-lib-rs-at-same-level/42499)

[Refactoring to Improve Modularity and Error Handling \- The Rust Programming Language](https://doc.rust-lang.org/book/ch12-03-improving-error-handling-and-modularity.html#splitting-code-into-a-library-crate)

実際には`クレート名::関数`で呼び出せる．`use`も`mod`キーワードもいらないが，自身のクレート名を明示的に指定する必要はある．`self`ではない．

エディタをリロードするまではエラーかのように赤線が引かれていたのも罠だった．

## 平均・中央値・最頻値

まずこれを解く：

> Given a list of integers, use a vector and return the mean (the average value), median (when sorted, the value in the middle position), and mode (the value that occurs most often; a hash map will be helpful here) of the list.

proconio で入力を受け付けられるようにした．

平均の算出に除算があるが，割り切れない場合の処理に迷う．Ceil か floor のうち近いほうで，ちょうど中間なら floor に丸める，という処理を書いてみることにした．

```rust
pub fn mean(v: &Vec<i32>) -> i32 {
    let mut sum = 0;
    for &e in v {
        sum += e;
    }
    let len = v.len() as i32;
    div_round(&sum, &len)
}

fn div_round(&a: &i32, &b: &i32) -> i32 {
    let floor = integer::div_floor(a, b);
    let floor = Ratio::from_integer(floor);
    let ceil = integer::div_ceil(a, b);
    let ceil = Ratio::from_integer(ceil);
    let mean = Ratio::new(a, b);
    match (mean - floor).cmp(&(ceil - mean)) {
        Ordering::Greater => ceil.to_integer(),
        Ordering::Less => floor.to_integer(),
        Ordering::Equal => floor.to_integer(),
    }
}
```

`num`クレートが大きな整数も扱えるらしい．いいね．

[num \- Rust](https://docs.rs/num/0.4.0/num/index.html)

中央値も配列の長さの偶奇による場合分けがいる．ソートが要るがもとの配列を変更したくないのと，所有権を奪わないために`&Vec`を引数に持つ．
`clone`は無駄かもしれないがこれが一番自然な気がする．

```rust
pub fn median(v: &Vec<i32>) -> i32 {
    let mut w = v.clone();
    w.sort();
    let len = w.len();
    match integer::div_mod_floor(len, 2) {
        (div, 1) => (w[div] + w[div + 1]) / 2,
        (div, _) => w[div],
    }
}
```

剰余のパターンを尽くすための書き方が気になった．実際には`(div, 0)`と`(div, 1)`でパターンは尽きているが，一方の剰余は`_`でワイルドカード，else としてやる必要がある．もっと自然に書くことはできるのだろうか．

最頻値も迷いどころだ．頻度がおなじものがあるときどれを取るか．結局返り値を`Vec`に取ることにした．`or_insert`がやはり良い．

```rust
pub fn modes(v: &Vec<i32>) -> Vec<i32> {
    let mut entries = HashMap::<i32, i32>::new();
    for e in v {
        let count = entries.entry(*e).or_insert(0);
        *count += 1;
    }
    let mut max_entry = 0;
    for &value in entries.values() {
        if max_entry < value {
            max_entry = value;
        }
    }
    let mut modes = Vec::<i32>::new();
    for (key, val) in entries {
        if val == max_entry {
            modes.push(key);
        }
    }
    modes
}
```

ただコレクションやイテレータのメソッドに習熟していればもっときれいにかけそうな気はする．

[rust\-study/projects/practice/statistics at main · roiban1344/rust\-study](https://github.com/roiban1344/rust-study/tree/main/projects/practice/statistics)

## Pig Latin

次はこれ：

> Convert strings to pig latin. The first consonant of each word is moved to the end of the word and “ay” is added, so “first” becomes “irst-fay.” Words that start with a vowel have “hay” added to the end instead (“apple” becomes “apple-hay”). Keep in mind the details about UTF-8 encoding!

変換則は説明されているがこの pig latin ってなんだ．

[Pig Latin \- Wikipedia](https://en.wikipedia.org/wiki/Pig_Latin)

子供同士の言葉遊びらしい．ネイティブだとこの変換がすらすら行えるのだろうか．

ともかく，このルールを実装してみる．wikipedia の記事によると語頭の連続する子音字全てを末尾に移動するようだが，"The first consonant of each word is moved to"に従ってみる．

で一旦単語だけを対象にやってみたが……`String`しんどいな……！！

```rust
fn to_pig_latin(word: &str) -> String {
    let chars: Vec<char> = word.chars().collect();
    match chars.first() {
        Some(&c) => match c {
            'a' | 'e' | 'i' | 'o' | 'u' => {
                format!("{}hay", word)
            }
            'b' | 'c' | 'd' | 'f' | 'g' | 'h' | 'j' | 'k' | 'l' | 'm' | 'n' | 'p' | 'q' | 'r'
            | 's' | 't' | 'v' | 'w' | 'x' | 'y' | 'z' => {
                let mut word = String::new();
                for &d in &chars[1..] {
                    word = word + &d.to_string()
                }
                word + &c.to_string() + "ay"
            }
            _ => panic!(),
        },
        None => String::from(""),
    }
}

fn main() {
    assert_eq!(&to_pig_latin("first"), "irstfay");
    assert_eq!(&to_pig_latin("apple"), "applehay");
}

```

特に先頭が子音字のほう．イメージとしては"hello"を char のベクターに変換して`v[1..] + v[0] + ay`を返すだけだが，char のベクターから String への変換が標準には用意されていない．もっとスマートな方法はありそうな気がするが，char を 1 文字の String に変換して順に足していく方法で妥協した．

[How do I convert from a char array \[char; N\] to a string slice &str? \- Stack Overflow](https://stackoverflow.com/questions/38359231/how-do-i-convert-from-a-char-array-char-n-to-a-string-slice-str)

「スマートな方法」というが，最初からそれをやろうとして撤退に撤退を重ねた．完成形を見ると 8.2 章で知った通りの内容でしかない．最初は`char`をフィールドに一つ持つ`LatinAlphabet`構造体を定義して，そこに`is_vowel`メソッドなどを impl していこうと思っていた．そして「語」`EnglishWord`を`Vec<LatinAlphabet>`のラッパーの構造体として定義する．`EnglishWord`の`new`は文字列スライスを受けるようにして，ラテンアルファベット以外が来た時に例外処理をすればいいだろう……と思っていた！　最初から複雑なことをやりすぎて失敗した．`LatinAlphabet`がcloneできないことなどで躓いた時点で撤退を決めた．

## MD5ハッシュ

MD5ハッシュ実装してみたい！と思って実装見てみた．`md5sum`コマンドのヘルプに
> The sums are computed as described in RFC 1321.

とある．ちなみに"Rust"は"f5e265d607cb720058fc166e00083fe8"に変換される．

この"RFC1321"でググると[https://www\.ietf\.org/rfc/rfc1321\.txt](https://www.ietf.org/rfc/rfc1321.txt)が出てくる．Cによるサンプルコードが載っている．

しかし当たり前だが複雑だ．デバッグできそうにないこの入り組みように怯んでしまった．

一旦Crate.ioを探る．

[md5 \- crates\.io: Rust Package Registry](https://crates.io/crates/md5)
[md\-5 \- crates\.io: Rust Package Registry](https://crates.io/crates/md-5)

ほぼそのものの名前のクレートが2つある．[こういう関係らしい](https://github.com/RustCrypto/hashes#crate-names)：
> Owners of md5 and sha1 crates declined (1, 2) to participate in this project.

両方dependencyに追加してみようとすると名前が衝突しているようでダメだった．こういう場合どうするんだろう．それで気付いたが，Cargo.tomlへの編集でCargo.lockに瞬時に変更が反映されていた．なんだこの超便利機能．

前者の方がシンプルそうなのでドキュメント通りにやってみる．

```rust
use md5;

fn main() {
    let digest = md5::compute(b"Rust");
    println!("{:x}", digest);
}

```

出力に正しく"f5e265d607cb720058fc166e00083fe8"が得られる．

実装を見てみる．

[md5/lib\.rs at master · stainless\-steel/md5](https://github.com/stainless-steel/md5/blob/master/src/lib.rs)

全然読めん……！！　RFC1321の説明通りであることは何となく分かるが，マクロや`#[~~]`が何をやっているのか検討がつかない．

The book読み進めよう．

ところでRFC1321でちょっと面白いのがここ：
>    This step uses a 64-element table T\[1 ... 64\] constructed from the
   sine function. Let T\[i\] denote the i-th element of the table, which
   is equal to the integer part of 4294967296 times abs(sin(i)), where i
   is in radians. The elements of the table are given in the appendix.

$$i=1,2,\cdots, 64$$ に対して $$2^{32}|\sin(i)|$$の整数部分を利用する．原理的に計算できることは分かるが，
実際やるとなると組み込みのsinなんかでは精度が足りないはずで，どう計算すれば検証できるだろうと考えると面白い．
引数が整数だからテイラー展開は有理数で誤差評価まで行える．
そのまま突っ込んでも収束するが非常に遅い．加法定理（というか指数関数の冪？）を使えば改善するはず．
こういうの精度保証付き数値計算の理論があればシステマチックに計算できるのだろうか．

演習の3つ目は手を付けていないしThe bookも読み進められていないのに日曜日が終わってしまった！　UnionFind構造体を作りかけているので明日やる．