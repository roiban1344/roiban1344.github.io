---
layout: post
title: "第7日目 - The book 第7, 8章をよむ - パッケージの利用・コレクション"
date:   2021-08-21 20:51:00 +0900
---

"Trait"がPHPにもある概念だということを遅まきながら思い出した．使ったことないけど……．

## The book 第7章 "Managing Growing Projects with Packages, Crates, and Modules"をよむ

機能の分割の一般的な効用について．Package, crate, moduleの区別を意識する必要がある．

### 7.1 Packages and Crates
`cargo new my-project`コマンドで作られるのは`my-project`パッケージ．
パッケージは`Cargo.toml`を持ち，クレートがどのようにビルドされるかの指示書になっている．
`src/main.rs`はパッケージと同名の`my-project`バイナリクレートのクレートルート．
`src/lib.rs`というファイルを持つこともできて，こちらは`my-project`ライブラリクレートのクレートルート．
クレートは名前空間を定める．

### 7.2 Defining Modules to Control Scope and Privacy
モジュールはちょうどディレクトリのように関数，列挙型，定数……etc.に名前を付けてまとめる．
これはコーディング時と利用時にどこに何の機能があるか探し当てるのに役に立つ．

### 7.3 Paths for Referring to an Item in the Module Tree
あるモジュールにある機能を利用するには，module tree上のパスを指定する．絶対パス（`crate::`から始める）と相対パスのどちらも使える．

モジュールは*privacy boundary*を定める．Rustでは，デフォルトのprivacyのレベルはprivateにあたる．外部からの利用には`pub`キーワードを付ける必要がある．

`super`キーワードは親モジュールへの相対パスの起点として使える．

構造体の関数やフィールドを外部から利用するには，たとえ構造体自身が`pub`であっても明示的に`pub`キーワードを付ける必要がある．

列挙型のvariatnは，その列挙型自身がpublicなら自動的にpublicになるため`pub`キーワードを付けない．

### 7.4 Bringing Paths into Scope with the use Keyword
`use`文でシンボリックリンクを貼るように，パスによる機能の呼び出しを短縮できる．

`use crate::parent_module_name::child_module_name`を書くと`child_module_name::function_name()`で関数が使える．慣習として，外部の関数を使うときは`use`文はその関数の親モジュールまでに留める．関数ごと`use`してもよいが，それの由来が分からなくなってしまうから．構造体/列挙型を持ち込むときはその構造体/列挙型名まで`use`する．文法的には禁じられていないがrustaceanたちはこれに慣れている．

`Result`は同名の構造体が`std::fmt`や`std::io`モジュールに含まれるため，同時に単に`Result`だけで指定することはできない．この場合，`as`を使ってエイリアスを定義して利用することができる．

Cargo.tomlの`[dependencies]`へパッケージをバージョンとともに書き込み，`use`することで外部パッケージが使える．

`use`文はカーリーブラケットでネストできる．

`use ~~::*`で全てのpublicな要素をuseできる．

と書いていて気付いたが，"import"という語が出てこないな．"Export"も`re-exporting`の形でしか登場しない．

### 7.5 Separating Modules into Different Files
`src/lib.rs`の先頭に`mod module_name;`を宣言すると，`src/module_name.rs`が`src/lib.rs`内に書き込んだ場合と同じようにモジュールとして利用できる．入れ子のモジュールはディレクトリに対応する．

この章で説明されたことは概念レベルでは他の言語にもある話だから実際書いていけば分かるはず……．
外部クレートの利用がCargo.tomlに書くだけで済む？のは特徴的か．あとデフォルトでprivateであること．Javaのpackage privateとも違う．

## The book 第8章 "Common Collections"をよむ

複数の値をもつデータ構造を*collection*と呼ぶ．
配列やタプルはコンパイル時からサイズ固定でスタック上に保持されるが，collectionはヒープ上にあってランタイム時に値の追加や削除が行われ，サイズが変わる．

[std::collections \- Rust](https://doc.rust-lang.org/std/collections/index.html)

標準ライブラリのコレクションたち．前も見たが`Queue`や`Stack`そのものはない．

`Vec`は末尾への値の追加/削除が高速なので，`Stack`としても使える．`VecDeque`は名前の通りdeque．

`LinkedList`の説明：

> You want a `Vec` or `VecDeque` of unknown size, and can’t tolerate amortization.

"Amortization"が分からなかった．
[algorithm \- Constant Amortized Time \- Stack Overflow](https://stackoverflow.com/questions/200384/constant-amortized-time)

> You are absolutely certain you *really, truly,* want a doubly linked list.

なんだこの念押しは……．

優先度付きキューは`BinaryHeap`を使う．

このページちょいちょい見ることになりそう．

### 8.1 Storing Lists of Values with Vectors

`Vec`型．ジェネリクスで定義されるため，`new()`で初期化する場合は`Vec::<i32>`のような型注釈が必要．

値付きで初期化する場合，`vec![]`マクロが使える．

値の末尾への挿入は`.push(value)`．

スコープを抜けた瞬間にベクターは要素の値ごとクリーンナップされる．

値の参照は`&`+`[]`オペレータか`.get()`メソッドによる．後者は`Option<&T>`型を返す．前者は存在しない位置を指したときパニックするが後者はエラーハンドリングが効く．

同じスコープ内に不変参照と可変参照を同時に持つことはできないというルールは，ベクターの要素とベクターそのものにも適用される．ベクターの要素への不変参照を持っている間は，ベクターへの要素の挿入はできない．これは，要求するメモリサイズの増大に従ってベクターのデータが丸ごとコピーされて元の要素への参照が宙吊りになってしまうことが起こりうるため．

不変参照に対するイテレーションは`for element in &vector`で行える．値の変更を行う場合は，`for element in &mut vector`と`*element`によるでリファレンスを行う．

異なる型のデータを同じベクターに載せたいときは，列挙型を定義すればよい．TypeScriptの合併型みたいなことは列挙型で実現できるということか．`Option<T>`はnullableを作る方法にもなっている．TSだとランタイムの型による分岐を書くためにはかなり制限が付くけれど，Rustだとmatch式でだいたいそれが実現できる．

### 8.2 Storing UTF-8 Encoded Text with Strings

String型は，テキストとして解釈するためのメソッドを備えたbyteのcollectionとみなすことができる．
ただし，データ上のインデックスと人にとってのインデックスが異なるため，ベクターと同じではない．
エラーの扱いを厳格なものにするRustの設計思想のため扱いが難しい．

Rustに予め備わっている唯一の文字列型はstring sliceである`str`．単に"string"というときは，`String`と`&str`のどちらも指す．
両方ともUTF-8でエンコードされている．

空文字は`String::new()`で初期化できる．これそのものや`len`メソッドで長さを算出してprintしてもエラーにならない．

`Display`トレイトを備える型は`to_string`メソッドで`String`型へ変換できる．`str`型にもこれは備わっている．

文字列リテラル(`str`)から`String`を作るもう一つの方法は`String::from`．既に見た．

文字列末尾への文字列の追加は`push_str`メソッドで行える．`push`メソッドは単一の文字(`char`型)を追加する．

`+`演算子によっても文字列を結合できるが，実体は`add`メソッドでシグネチャが`(self, s: &str)`のようになっているため，第1引数の所有権はムーブする．第2引数には参照を取る．所有権のムーブが起こるのは一見奇妙だが，コピーをむやみやたらと生成しない点で節約的になっている．

`&str`を取るべきところに`&String`がある場合，コンパイラは`&String`型を`&str`へ*coerce*する．強制型変換？

`format!`マクロは`println!`と同様に変数からフォーマットされた文字列を`String`型の文字列として返す．所有権のムーブは起こらない．

ところで，
```rust
    let s0 = String::from("tic");
    let s1 = String::from("tac");
    let s2 = String::from("toe");
    let s = format!("{}-{}-{}", s0, s1, s2);
```
を書くために[Insert Numbers](https://github.com/Inori/vscode-InsertNumbers/)というVSCode拡張を入れた．便利！
[VSCodeのマルチカーソル練習帳 \- Qiita](https://qiita.com/TomK/items/3b1f5be07d708d7bd6c5)

`String`型の変数を構成する成分への`[]`オペレータによるアクセスはコンパイルしない．
```
error[E0277]: the type `String` cannot be indexed by `{integer}`
  --> src\main.rs:28:13
   |
28 |     let c = s[0];
   |             ^^^^ `String` cannot be indexed by `{integer}`
   |
   = help: the trait `Index<{integer}>` is not implemented for `String`
```

`Index<{integer}>`トレイトをimplementしていないことによる．

`String`は`Vec<u8>`のラッパーである．

```rust
    let en = String::from("hello");
    let ru = String::from("Здравствуйте");
    let jp = String::from("こんにちは");
    println!("{} {}", en, en.len());
    println!("{} {}", ru, ru.len());
    println!("{} {}", jp, jp.len());
```

```
hello 5
Здравствуйте 24
こんにちは 15
```

なるほど．

> `pub fn len(&self) -> usize`
Returns the length of this String, in bytes, not [char]s or graphemes. In other words, it may not be what a human considers the length of the string.

たとえラテン文字でも文字列の要素へのインデックスによる参照はコンパイルしない．

ところで国名のtwo-letter abbreveationがISO 3166で決まっていることを知った．
[ISO 3166\-1 alpha\-2 \- Wikipedia](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

Bytes, scalar values, grapheme clusters. 書記素クラスタ．「書記素」←単語登録した．『文字コード技術入門』にも載っているな．

デーヴァナガリーの“नमस्ते”は`char`の配列として`['न', 'म', 'स', '्', 'त', 'े']`に分解するが，4, 6文字目は*diacritics*（ダイアクリティカルマーク．発音区別記号）であって単独では意味をなさない．`char`は"letter"ではない．Grapheme cluseterとしての分解は`["न", "म", "स्", "ते"]`で，「ヒンディー語で4字」といったときの長さになる．

`[]`による取得を実装しないもう一つの理由は，`[]`は定数時間O(1)であることを要求するルールにある．マルチバイト文字を含む場合，n文字目の取得には先頭から数え上げるしかない(O(n))から，意図的に実装していないともいえる．なるほど．

文字列スライスの取得はコンパイルするがランタイムでパニックする．インデックスが単独の文字の途中にくる場合．

```rust
    println!("[..6] {}", &jp[..6]);
    println!("[..7] {}", &jp[..7]);
```

```
[..6] こん
thread 'main' panicked at 'byte index 7 is not a char boundary; it is inside 'に' (bytes 6..9) of ` 
こんにちは`', src\main.rs:36:27
```

前から文字数を数えて使うことを想定しているのだろうか．

`.chars`と`.bytes`メソッドのそれぞれが，charとbyteのイテレータを生成する．Grapheme clusterへの分解は遥かに複雑であるためstdではサポートしておらず，適当なクレートを探してくる必要がある．

"Unicode scalar value"というときの"scalar"ってなんだ？

Emojiを分解する.
```rust
    let emoji = String::from("👩🏻‍💻");
    for c in emoji.chars(){
        println!("{}", c);
    }

    for b in emoji.bytes(){
        println!("{}", b);
    }
```

出力：
```
👩
🏻

💻
240
159
145
169
240
159
143
187
226
128
141
240
159
146
187
```

4つのcharからなっている．肌色で女性，明るい肌色，ゼロ幅joiner，ラップトップ．

> The Woman Technologist: Light Skin Tone emoji is a ZWJ sequence combining 👩 Woman, 🏻 Light Skin Tone, ‍ Zero Width Joiner and 💻 Laptop.
[👩🏻‍💻 Female Technologist: Light Skin Tone Emoji](https://emojipedia.org/woman-technologist-light-skin-tone/)

胸に刻もう．
> To summarize, strings are complicated.

### 8.3 Storing Keys with Associated Values in Hash Maps

`HashMap<K, V>`型．任意の型をキーに持つことができるコレクション．Preludeに入っていないため，`use std::collections::HashMap`でスコープに入れる必要がある．初期化するためのビルトインのマクロなどもない．

これ難しいな……．

```rust
    let teams = vec![String::from("Blue"), String::from("Yellow")];
    let initial_scores = vec![10, 50];
    let mut scores: HashMap<_, _> = teams.into_iter().zip(initial_scores.into_iter()).collect();
```

`zip`メソッドの説明：
> `zip()` returns a new iterator that will iterate over two other iterators, returning a tuple where the first element comes from the first iterator, and the second element comes from the second iterator.

`HashMap`もやはり値の代入で値のムーブが発生する．参照を代入したときは，元の値のライフタイム内に制限される．

`for`文で回した場合，実行順序はランダムに変わる．

```rust
    for (key, value) in &scores{
        println!("{} {}", key, value);
    }
```

1回目：
```
Yellow 50
Red 70
Green 300
Blue 10
```

2回目：
```
Blue 10
Red 70
Green 300
Yellow 50
```

`HashMap`の更新は，キーが既に存在するかどうか，存在した場合上書きするか何もしないかなど，場合によって色々な振る舞いが必要になる．

`insert`は既に存在する場合値を上書きする．

キーが既に存在する場合に上書きしたくなければ，`entry`と`or_insert`メソッドを繋げることでそれができる．C++みたいに`count`による分岐を書かなくてよい．クールだ．

キーが既にある場合に元の値に基づいて上書きしたければ，`or_insert`がmutable referenceを返すのでそれをdereferenceして使う．

`HashMap`のハッシュ生成には`SipHash`というハッシュ関数が用いられている．最速ではないがセキュリティー上の利点がある．

日本語Wikipedia記事がないがヘブライ語がある．

[SipHash \- Wikipedia](https://en.wikipedia.org/wiki/SipHash)

[SipHash – ויקיפדיה](https://he.wikipedia.org/wiki/SipHash)

章末の演習問題をやってみよう．