---
title: "Docker - 署名 - BigInt"
date:   2021-09-28 03:12:00 +0900
---

# Docker

せっかくWSL2でDockerが使えるようになったのにDockerが分からなすぎるから買った。

[仕組みと使い方がわかる Docker＆Kubernetesのきほんのきほん \| マイナビブックス](https://book.mynavi.jp/ec/products/detail/id=120304)

表紙の見た目通りにイラストが多用されていて、さすがに易しすぎるかなとも思ったが、素直にこういうレベルから説いてくれる本を買うのが一番近道という感。
気持ちの説明とか、学ぶ指針を与えてくれる点で大学の講義の初回に少し似ている。

実際知っていることも多かったが、簡単なことで分かっていないこともあった。

例えば、Dockerfileの`COPY`。Dockerfileは設計図であってDocker Hubのようなリポジトリで配布するのはイメージの方だから、
自前の環境のパスを含む`COPY`を書いてもいい。Dockerfileだけを持ち出した他の環境でイメージが作れなくてもそれは仕方がない。
設計図なので材料が揃っていることまでは保証しない。

# コミットへ署名

素のコミットはconfigのusernameとemailにしか作成者の情報が残されないことを知った。

[Git でコミット作成者を偽装する方法／署名付きコミットでの対策 \- Qiita](https://qiita.com/s6n/items/bb869f740a53a3bf169e)

コミッターの偽装を防止するにはコミットシグネチャを作成して署名する必要がある。設定するとGitHub上では"Verified"のシンボルが付く。
これで少なくとも署名無しコミットが偽装されたものである可能性を疑うことができるようになる。

[About commit signature verification \- GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

自動入力の設定ができていなくてちょっと面倒だけれど"Verified"が付くのは安心感がある。このブログも今回から署名入り。

# num-bigint

メルセンヌ数で遊んでいる。そこで以前使った`num`クレートに含まれている`num-bigint`を継続して使おうと思ったら、思わぬバグに遭遇した。

```rust
use num_bigint::BigInt;
use num_traits::identities::One;

const CRITICAL_VALUE: u32 = 2112;

fn main() {
    let a = (BigInt::one() << CRITICAL_VALUE) - 1;
    let _ = &a * &a;
}

```

*Cargo.toml*:
```
[dependencies]
num-bigint = "0.4"
num-traits = "0.2.14"
```

$a=2^{2112}-1$ の自乗。これがなぜかパニクる。観測した範囲では $n\geq 2112$ なら $2^{n}-1$ の自乗が同じようにパニクり、それ未満だと問題ない。2112がなぜか臨界値になっている。

定義域が離散的な場合の「臨界値」がギリギリ安全側か危険側かは迷うところである。というのはさておき。

```
thread 'main' panicked at 'assertion failed: carry == 0', /home/roiban1344/.cargo/registry/src/github.com-1ecc6299db9ec823/num-bigint-0.4.2/src/biguint/addition.rs:83:5
```

ソースの該当箇所：

[num\-bigint/addition\.rs at master · rust\-num/num\-bigint](https://github.com/rust-num/num-bigint/blob/master/src/biguint/addition.rs#L46-L84)

`2112`かそれに近い定数が書き込まれているわけでもなく、簡単には推察できそうにない。

2112って何だ……？ $2^{11}+2^6$ か。2進法で $100001000000$。何か起こりそうと言えば起こりそうだけれど……。

結局使い方で解決できる問題ではないし、するべきでもないと思ったので `rug` クレートに乗り換えた。

[rug \- crates\.io: Rust Package Registry](https://crates.io/crates/rug)

GNU製のライブラリGMPのFFIであるため、*Cargo.toml*に書くだけで使える純Rust製の`num-bigint`より手間がかかる。
Windowsのホスト環境だとなかなかうまくいかず、WSL2のUbuntu環境に移行することになった。
そもそもDocker環境を用意しようとしたのもそのためだった。結局Ubuntuホスト側で作業しているけれど。

明らかに速いので結果的には乗り換えて良かった。核の部分が科学技術計算で広く使われているらしい歴史と信頼性のあるライブラリなのも良い。