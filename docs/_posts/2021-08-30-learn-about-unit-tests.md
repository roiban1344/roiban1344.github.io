---
layout: post
title: "title"
date:   2021-08-31 00:00:00 +0900
---

{% include use_mathjax.html %}

## sin1は無理数か？

[How to prove \[math\]\\sin\{1\}\[/math\] irrational \- Quora](https://www.quora.com/How-do-I-prove-sin-1-irrational-The-units-are-radians)

それはもちろんそうだろうとは思ったが証明を思い付かなかった。
調べるとQuoraに実に簡潔な証明があった。

テイラー展開から任意の自然数 $$n$$ に対してある整数sが存在して $$(s/n!, (s+1)/n!)$$ に $$\sin 1$$が含まれることが分かる。
ところが、任意の有理数はある自然数 $$m$$ と整数 $$t$$ によって $$t/m!$$ と表されるから矛盾。$$\square$$

では超越数か？というともちろんそうで、[Lindeman-Weierstrassの定理](https://en.wikipedia.org/wiki/Lindemann%E2%80%93Weierstrass_theorem)から示される。

$$\sin 1=\alpha$$ が代数的数であるとすると、$$e^{i}-2i\alpha e^0-e^{-i}=0$$. ところが、指数の $$i,0,-i$$ は独立な代数的数であり、Lindeman-Weierstrassの定理から$$a e^{i}+be^{0}+c{-1}e^{-i}=0$$を満たす代数的数の組 $$(a,b,c)$$ は $$(0,0,0)$$ に限る。これは矛盾。$$\square$$。

[trigonometry \- Proof that cos\(1\) is transcendental? \- Mathematics Stack Exchange](https://math.stackexchange.com/questions/677900/proof-that-cos1-is-transcendental)

まあLindeman-Weierstrassの定理の証明は全然知らないのだけれど……。

名前だけは大昔から知っている本：

[無理数と超越数｜森北出版株式会社](https://www.morikita.co.jp/books/mid/006091)

では[周期](https://en.wikipedia.org/wiki/Period_(algebraic_geometry))か？というと、これは軽く見ただけでは分からなかった。多分違うだろう。

