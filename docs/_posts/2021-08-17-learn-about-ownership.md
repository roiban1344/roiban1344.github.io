---
layout: post
title: "第3日目 - The book 第4章をよむ - 所有権"
date:   2021-08-17 01:00:00 +0900
---

{% include use_mathjax.html %}

## カプレカー変換

Rustでカプレカー変換する．たまたまこれを見たので．

[6174 \- Numberphile \- YouTube](https://www.youtube.com/watch?v=d8TRcZklX_Q&ab_channel=Numberphile)


4桁の適当な正整数を取る．$$2021$$にしよう．「各桁の数を降順に並べ替えた数」から「各桁の数を昇順に並べ替えた数」を引く操作を繰り返す．これを*カプレカー変換*という．

$$
\begin{align*}
2021
&\rightarrow 2210-0122 = 2088\\
&\rightarrow 8820-0288 = 8532\\
&\rightarrow 8532-2358 = 6174\\
&\rightarrow 7641-1467 = 6174
\end{align*}
$$

で $$6174$$ という固定点に到達する．

面白いのは，4桁の正整数から始めた場合，必ず0か6174のいずれかの固定点に達すること．これを確かめる．

整数`x`を文字列に変換して`char`にばらしてソート，昇順降順の値を得るという方法で書く．

```rust
fn main() {
    let mut x = 1729;
    println!("{}", x);
    for _ in 0..10 {
        x = transform(x);
        println!("{}", x);
    }
}

fn transform(x: i32) -> i32 {
    let mut chars = x.to_string().chars().collect::<Vec<char>>();
    chars.sort();

    let max = chars
        .iter()
        .rev()
        .collect::<String>()
        .parse::<i32>()
        .expect("error");
    let min = chars
        .iter()
        .collect::<String>()
        .parse::<i32>()
        .expect("error");
    max - min
}

```

出力：
```
1729
8442
5994
5355
1998
8082
8532
6174
6174
6174
6174
```

`to_string`とか`chars`はまだ馴染みがあるが`collect`ってなんだ……？　追々学ぼう．

動作は正しいが，4桁の数を入れる限り起こるはずのないエラー処理があるのが気持ち悪い．負数を入れると確かにパースには失敗するから「起こるはずのない」ということもないか．「文字として読んで並べ替える」という感覚からすれば素直な実装だけれど，一貫して数値として扱う方が簡単だろう．`transform`を書き換える：

```rust
fn transform(x: i32) -> i32 {
    let mut a = Vec::<i32>::new();
    let mut x = x;
    while x > 0 {
        let q = x / 10;
        a.push(x - q * 10);
        x = q;
    }
    a.sort();
    let mut y = 0;
    for e in a.iter().rev() {
        y = y * 10 + e;
    }
    let mut z = 0;
    for e in a.iter() {
        z = z * 10 + e;
    }
    y - z
}
```

`let mut x = x;`　これはなるほどと思った．C++だと引数へそのまま関数内で再代入が行える．Rustだとそれはできないのでコピーを取る必要があるが，`x_copy`みたいな新しい名前を考える必要はない．シャドウイングの恩恵だ．

引数や戻り値の型を`i32`にするか`u32`にするかは微妙なところだが一旦これでいく．「負数を受け付けない」というのを型で制約するとしてそれは不都合ないのだろうか．たとえば，定義域が奇数の関数は型では縛れないので，エラー処理をすることになるはず．

さて4桁の数全てに対してカプレカー変換のループの入り口か固定点を求めようとして手が止まった．`BTreeSet`を値に持つ`BTreeMap`の操作がうまくできない．

やりたいことをC++で表現するとこうなる：

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <set>
#include <vector>
using namespace std;

int transform(int x) {
    vector<int> a;
    while(x > 0) {
        int q = x / 10;
        a.push_back(x - q * 10);
        x = q;
    }
    sort(a.begin(), a.end());
    int y = 0;
    for(auto it = a.rbegin(); it < a.rend(); ++it) {
        y = y * 10 + *it;
    }
    int z = 0;
    for(auto it = a.begin(); it < a.end(); ++it) {
        z = z * 10 + *it;
    }
    return y - z;
}

int main() {
    map<int, set<int>> fixed_from;
    for(int n = 1'000; n < 10'000; ++n) {
        int m = n;
        vector<int> met;
        while(find(met.begin(), met.end(), m) == met.end()) {
            met.push_back(m);
            m = transform(m);
        }
        if(fixed_from.count(m)) {
            fixed_from.at(m).insert(n);
        } else {
            fixed_from.insert(make_pair(m, set<int>({n})));
        }
    }
    for(auto x : fixed_from) {
        printf("%d %d\n", x.first, x.second.size());
    }
    return 0;
}

```

[rust\-study/kaprekar\.cpp at main · roiban1344/rust\-study](https://github.com/roiban1344/rust-study/blob/main/projects/kaprekar/cpp/kaprekar.cpp)

出力：
```
0 77
6174 8923  
```

全て0か6174に帰着することが分かる．ちなみに0に帰着するのは以下のパターンaとbの77個．

a. 4桁とも同じ数字のパターン9個．
```
1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999
```
b. 1つ違いの異なる2つの数字（1+3個か3+1個）から成るパターン68個．
```
1000, 1011, 1101, 1110, 
1112, 1121, 1211, 1222, 2111, 2122, 2212, 2221,  
2223, 2232, 2322, 2333, 3222, 3233, 3323, 3332, 
3334, 3343, 3433, 3444, 4333, 4344, 4434, 4443, 
4445, 4454, 4544, 4555, 5444, 5455, 5545, 5554, 
5556, 5565, 5655, 5666, 6555, 6566, 6656, 6665, 
6667, 6676, 6766, 6777, 7666, 7677, 7767, 7776, 
7778, 7787, 7877, 7888, 8777, 8788, 8878, 8887, 
8889, 8898, 8988, 8999, 9888, 9899, 9989, 9998,
```

全然計算効率が良くないのはともかく，setを初期化してmapに追加するというのがRustだとなかなか書けない．エラーメッセージを見つつ修正してみても，あちらを立てればこちらが立たずでどうにもうまくいかない．所有権と借用を理解していないからだ．

というわけでおとなしく第4章を読むことにする．

## The book 第4章 "Understanding Ownership"

[Understanding Ownership \- The Rust Programming Language](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)

### 4.1 What Is Ownership?

Rustはプログラム実行時のメモリを管理する方法として，ガーベジコレクションでもプログラマによる明示的なメモリ管理でもなく，コンパイル時にチェック可能な「所有権」のルールを適用する．文字列を例にとって所有権について学ぶ．

#### The Stack and the Heap
メモリにはスタックとヒープという，異なる構造を持った二つの領域がある．スタックはLIFO（Last In First Out）で，コンパイル時にサイズが分かっていて，固定されているデータがを保持する．ヒープは実行時に初めてサイズが分かるデータに対して，十分大きな領域を用意してその場で割り当てる（allocate）領域で，スタックより効率で劣る．所有権というものを考える理由は，ヒープ上のどの場所にデータがあるか追い，データの重複を避け，不要となったデータを除去することにある．

#### Ownership Rules
所有権のルール：
- Rustにおいて全ての値は"owner"（所有者）という変数に結びつく．
- 値は一度に一つのOwnerのみ
- Ownerはスコープを外れると値は放棄される．

#### Variable Scope
変数は宣言されてから，そのブロックが終了するまでの間有効．

#### The String Type
これまでに見た基本的なデータ型（原始型とタプル・配列）はスタック上に保持される．

文字列リテラルはプログラム上でハードコードされているが，イミュータブルかつ実行前に値が決まっていなくてはならないため，用途が限られる．より広範な用途に供するために`String`型が用意されている．`String::from("string literal")`で文字列リテラルを元に初期化できる．

#### Memory and Allocation
Rustがヒープ上のメモリ解放に対し取る方法は，プログラマがメモリの解放を行うか，反対にGCに全て任せるかという従来の二つの方法とは異なる．「Ownerがスコープから外れれば自動的に値を保持するメモリが解放される」というものである．スコープの終端で`drop`というメモリ解放用の関数が暗黙的に呼ばれている．

[RAII \- Wikipedia](https://ja.wikipedia.org/wiki/RAII)
Resource Acquisition Is Initialization．ふむ……．

#### Ways Variables and Data Interact: Move
こっちはスタックに2つの`5`が積まれる．`i32`型のサイズは既知であるため．
```rust
    let x = 5;
    let y = x;
```

よく似たコードだが以下ではより複雑なことが起こる．スタック上にはポインタ・文字列の長さ（bytes）・メモリ上の総サイズの3つの値が積まれる．文字の実体はヒープの方に乗っている．`s2 = s1`の文でコピーされるのはスタック上の値で，ヒープの方はコピーされない．
```rust
    let s1 = String::from("hello");
    let s2 = s1;
```

`s1`と`s2`は同じスコープ内で定義されているが，もし両者に対して`drop`でメモリ解放が実行されると二重解放エラーになってしまう．これを避けるために，`s2 = s1`まで来た時点で`s1`はアクセスを失う．

`変数=変数`で起こることは他の言語の"shallow copy"に似ているが，ポインタ（+いくつかのスタック上の値）はコピーされるのではなく"move"する．"Move"はカタカナ読みの「ムーブ」が定着している．

値が勝手に"deep copy"されることはない．コピーは節約的に行われる．

ところで"free"は「解放」のほうの「かいほう」で間違いないはずだが辞書がなかなか覚えてくれない……．ゲシュタルト崩壊する．

今日はここまで．