---
title: "第11日目 - sin"
date:   2021-08-26 04:13:00 +0900
---


## LeetCode

登録して1問だけ解いた．競プロみたいに言語間での公平性を保証する必要がないため，標準入力のパースは不要で関数を定義するというスタイルが新鮮．

[LeetCode \- The World's Leading Online Programming Learning Platform](https://leetcode.com/)

これはどんどん解いていきたい．

## sin1の近似値

MD5のこれに関して．
>    This step uses a 64-element table T[1 ... 64] constructed from the
   sine function. Let T[i] denote the i-th element of the table, which
   is equal to the integer part of 4294967296 times abs(sin(i)), where i
   is in radians. The elements of the table are given in the appendix.


区間 $$[0,a]\in\mathbb{R}$$ で定義された$$C^{n+1}$$級関数$$f(x)$$に対して，

$$
f(x) = \sum_{k=0}^n \frac{f(0)}{k!}x^k + \frac{f(c)}{(n+1)!}x^{n+1}
$$

を満たす$$c\in(0,a)$$が存在する．$$f(x)=\sin x$$，$$n$$ を $$2n+1$$ に読み替えて $$x > 0$$ に対してこれを適用すると，

$$
\sin x = \sum_{k=0}^n \frac{(-1)^kx^{2k+1}}{(2k+1)!} + \frac{(-1)^{n+1}\sin c\, x^{2n+3}}{(2n+3)!}
$$

を満たす $$c\in (0,x)$$ が存在して $$\|\sin x\|\leq 0$$ だから，

$$
\left|\sin x-\sum_{k=0}^n \frac{(-1)^kx^{2k+1}}{(2k+1)!}\right| \leq \frac{x^{2n+3}}{(2n+3)!}
$$

という，$$\sin$$のテイラー級数の有限項での打ち切りの誤差の厳密な評価が与えられる．同様に，

$$
\left|\cos x-\sum_{k=0}^n \frac{(-1)^kx^{2k}}{(2k)!}\right| \leq \frac{x^{2n+2}}{(2n+2)!}.
$$

OK．

さて$$x=1$$とする．だいたい$$\pi/3$$だから

$$
\begin{align}
\sin 1&\simeq \sqrt{3}/2=0.866\cdots,\\
\cos 1&\simeq 1/2=0.5
\end{align}
$$

になるはずである．誤差項が$$x$$に関して5次になる場合を使うともっと良い精度かつ厳密な評価が得られて，

$$
\begin{align}
\left|\sin 1 - \frac{5}{6}\right| &\leq \frac{1}{120},\\
\left|\cos 1 - \frac{13}{24}\right| &\leq \frac{1}{120}
\end{align}
$$

から

$$
\begin{align}
\sin 1\in \left[\frac{100}{120},\, \frac{101}{120}\right],\\
\cos 1\in \left[\frac{65}{120},\, \frac{66}{120}\right]
\end{align}
$$

が分かる．

一方，$$x=1/2$$の場合，

$$
\begin{align}
\sin \frac{1}{2} \in \left[\frac{23}{48},\, \frac{23}{48}+\frac{1}{120\cdot 2^5}\right],\\
\cos \frac{1}{2} \in \left[\frac{337}{384},\, \frac{337}{384}+\frac{1}{120\cdot 2^5}\right]
\end{align}
$$

倍角公式から，

$$
\begin{align}
\sin 1 = 2\sin \frac{1}{2}\cos\frac{1}{2}
&\in\left[
    \frac{7751}{9216},\,
    \frac{6206011}{7372800}
    \right],\\
\cos 1 = \cos^2\frac{1}{2}-\sin^2\frac{1}{2}
&\in\left[
    \frac{885291}{1638400},
    \frac{886449}{1638400}
    \right].
\end{align}
$$

あえて厳密に有理数として計算する．すると区間の幅はどちらも$$\frac{579}{819200}$$になる．一致することはごく単純な計算から分かるが，一瞬意表を突かれた．

この逆数が$$1414.8\cdots$$なので，$$x=1$$のテイラー展開を使う場合の誤差項が$$6$$次の場合の約半分になる．あれ，それほど劇的に良いわけでもない……．

というのは次数が低いからで，次数が高いほど$$x=1/2$$のほうの収束の速さが効いてくる．

0に十分近い$$x$$で
$$
\begin{aligned}
\sin x &\in \left[a_{n-1}, a_{n-1}+\frac{x^n}{n!}\right],&
\cos x &\in \left[b_{n-1}, b_{n-1}+\frac{x^n}{n!}\right],\\
\sin \frac{x}{2} &\in \left[a'_{n-1}, a'_{n-1}+\frac{x^n}{2^nn!}\right],&
\cos \frac{x}{2} &\in \left[b'_{n-1}, b'_{n-1}+\frac{x^n}{2^nn!}\right]
\end{aligned}
$$

の場合に後者の2倍角から計算したときの区間幅は

$$
2\left(a'_{n-1}+b'_{n-1}+\frac{x^n}{2^n n!}\right)\frac{x^n}{2^n n!}
< \frac{x^n}{2^{n-2} n!}
$$

だから，冪で区間幅の縮小は速くなる．

しかし，十分大きな$$n$$では倍角を計算するより次数を上げるほうが区間幅は狭まるのか．なら$$\sin (1/2)$$から$$\sin 1$$を計算するより$$\sin 1$$を計算する方が速い？

実際にやれよという話で，やりたい．が準備が足りない．

一旦$$2^{32} \sin 1$$の整数部分を求めるところまでやろう．

$$
12! = 479001600 < 2^{32} = 4294967296 < 13 != 6227020800
$$

なので，$$13$$次までの誤差項があれば精度は足りる．

$$
a_{12} = 1 - \frac{1}{3!} + \frac{1}{5!} - \frac{1}{7!} + \frac{1}{9!} - \frac{1}{11!} = \frac{33588829}{39916800}
$$

$$
\sin 1 \in 
\left[
a_{12},\ 
a_{12} + \frac{1}{13!}
\right]
$$

から，

$$
\lfloor 2^{32}\sin 1 \rfloor
\in \left[
    3614090359.\ldots,
    3614090360.\ldots
    \right].
$$

「精度は足りる」←嘘だった．

$$
a_{13} := 1 - \frac{1}{3!} + \frac{1}{5!} - \frac{1}{7!} + \frac{1}{9!} - \frac{1}{11!} + \frac{1}{13!} =\frac{209594293}{249080832}
$$

まで精度を上げると，

$$
\left\lfloor 2^{32}a_{13} \right\rfloor
=\left\lfloor 2^{32}\left(a_{13}+\frac{1}{14!}\right)\right\rfloor
=3614090360
$$

から，$$2^{32}\sin 1$$ の整数部分は $$3614090360$$ だと結論付けられる．Hexでは`d76aa478`.

RFC1321中のMD5のCによる実装（[p.12](https://www.ietf.org/rfc/rfc1321.txt))を見ると，この値がしっかり現れている．
```c
  /* Round 1 */
  FF (a, b, c, d, x[ 0], S11, 0xd76aa478); /* 1 */
```

$$2^{32}\sin 64$$を何の工夫もなしにテイラー級数のみから求めるには，まず誤差項が$$1$$未満になるために$$171$$次まで要求される：

$$
\frac{64^{171}}{171!} < 1 < \frac{64^{170}}{170!}.
$$

この$$171$$は$$64\,e\simeq 174$$から来ている（スターリングの公式）．$$2^{32}\sin 64$$の近似値の区間幅が1未満になるにはもう少し必要で，$$192$$次になる．これをまともに有理数のまま計算すると桁数が爆発する．

……とはいってもせいぜい100桁オーダーなので数式処理システムは難なくやってのけてしまうが．ただ分母にどんどん値の評価に本質的ではない素因数が蓄積してしまうのが気持ち良くない．

## 精度保証付き数値計算

精度保証付き数値計算における四則演算の基本は数を「区間」として操作することで，区間演算という．区間演算の遂行には丸めの方向を厳密に取り扱う必要があるが，浮動小数点数は丸めの方向が実装依存になっているためそのままでは実現できない．

演算子オーバーロードによって区間演算を行えるC++のライブラリがある．

[kv \- a C\+\+ Library for Verified Numerical Computation](http://verifiedby.me/kv/index.html)

作成者のwebサイト．数値計算の専門家．

[区間演算の実装について\(1\) \- kashiの日記](http://verifiedby.me/adiary/070)

この記事が面白かった．

[調和級数の部分和で遊んでみた \- kashiの日記](http://verifiedby.me/adiary/0153)

非整数に対する数値計算による厳密な結果というものについて驚くほど何も知らないことに気付く．円周率の計算の世界記録が具体的に何をやっているか実際のところを何も知らない．何桁目の数が何であるか確定させるのはどんな誤差評価に基づいているのだろうか．どんな形式で数値を持つのだろうか．

Rust本読めてない！　また明日．