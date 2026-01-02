---
title: "MD5 - Go - Docker"
date:   2021-09-18 00:20:00 +0900
---

半月サボった！！！　再開。

## ZennにMD5の記事を投稿

夏休みの成果としてZennに記事を上げた。RFC1321をベースにMD5を実装してみた！という内容。

[RustでMD5を実装（ついでにsin64を計算）](https://zenn.dev/roiban/articles/1c941e297178d3)

sinの近似計算を含めたことで多少は普遍的な価値が付けられたように思う。そうかな……。

GitHub連携で記事を上げられるのが素晴らしい。本当に一切躓くことなく投稿できた。

[Zennの2種類の執筆方法について](https://zenn.dev/zenn/articles/editor-guide)

連携しているリポジトリ：

[roiban1344/zenn\-content](https://github.com/roiban1344/zenn-content)

ところで、Rustタグの記事を読んでいて、WebAssembly（WASM）というのがC++やRustからコンパイルしてウェブブラウザで動作する低レベル志向のプログラムだと知った。
RustやC++からコンパイルして作る。近いうちに触れたい。

[WebAssembly \| MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)

## Reak World HTTP

買った。雰囲気でHTTPに触れすぎているので。

[O'Reilly Japan \- Real World HTTP 第2版](https://www.oreilly.co.jp/books/9784873119038/)

「HTTPを扱う標準ライブラリが抽象化されすぎていないため、HTTPに触れてみるには最適な言語」（まえがきix）だという理由でGo言語が採用されている。

やるか！環境構築を……。

## Go入門

公式サイト：[The Go Programming Language](https://golang.org/)

インストール方法：[Download and install \- The Go Programming Language](https://golang.org/doc/install)

## 1. ダウンロード
[Downloads \- The Go Programming Language](https://golang.org/dl/)

Windowsなのでこれ
> go1.17.1.windows-amd64.msi (124MB)

## 2 インストール

よし。
```
$ go version
go version go1.17.1 windows/amd64
```

## 3 Hello

[Tutorial: Get started with Go \- The Go Programming Language](https://golang.org/doc/tutorial/getting-started)

> 他のモジュールに含まれるパッケージをコード内でインポートするとき、
そのコード自身のモジュールで依存性を管理する必要がある。
モジュールは`go.mod`ファイルの中で定義され、
利用している外部パッケージを含むモジュールを追跡する。
`go.mod`ファイルは常にコードと共存していて、リポジトリにも同時に上げる。

"Dependency tracking"の定訳って何だろう？

この`go.mod`が`Cargo.toml`みたいなものということか？　`cargo new`みたいに`go mod init example/hello`で`example/hello`モジュールが定義される。ただし作られるのは`go.mod`一つだけで、コードの雛形までは作ってくれない。

```
$ go mod init example/hello
go: creating new go.mod: module example/hello
```

`go.mod`の中身：
```
module example/hello

go 1.17
```

`hello.go`：
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
```

標準ライブラリの中に`fmt`パッケージがあってそれを明示的にインポートする。

[fmt package \- fmt \- pkg\.go\.dev](https://pkg.go.dev/fmt)

```
$ go run .
Hello, World!

```

OK。ディレクトリを指定しないと、
```
$ go run
go run: no go files listed
```

となる。この`go run .`では`go.mod`は書き変わらない。

## 4 外部モジュール

[pkg\.go\.dev](https://pkg.go.dev/)でモジュールを探す。crates.ioだな。

`rsc.io/quote`パッケージを使う。

hello.go:
```
package main

import "fmt"

import "rsc.io/quote"

func main() {
	fmt.Println(quote.Go())
}
```

`go mod tidy`でモジュールがインストールされ、`go.sum`が作られる。`.lock`みたいなものかな。
```
$ go mod tidy
go: finding module for package rsc.io/quote
go: downloading rsc.io/quote v1.5.2
go: found rsc.io/quote in rsc.io/quote v1.5.2
go: downloading rsc.io/sampler v1.3.0
go: downloading golang.org/x/text v0.0.0-20170915032832-14c0d48ead0c
```

"Tidy"ってちょっとおもしろいな。身繕い。今回は`go.mod`も書き変わる。あれ、ということは人が依存関係を書き込むのは`.go`ファイルということか。

`go.sum`にはモジュールのチェックサムが書き込まれる。だから`.sum`。このファイルはコミットする。

> Ensure your go.sum file is committed along with your go.mod file. 

[Modules · golang/go Wiki](https://github.com/golang/go/wiki/Modules#releasing-modules-all-versions)

そしてラン。

```
$ go run .
Don't communicate by sharing memory, share memory by communicating.
```

何だこれは。プログラムの並行性に関してGoが採用している思想？

- [go \- Explain: Don't communicate by sharing memory; share memory by communicating \- Stack Overflow](https://stackoverflow.com/questions/36391421/explain-dont-communicate-by-sharing-memory-share-memory-by-communicating)
- [Share Memory By Communicating \- go\.dev](https://go.dev/blog/codelab-share)

環境はできたので後は追々。

## Docker

「重要度は高くないのでインストールしなくても支障はありませんが」とのことだが良い機会なので入れる。

Windows 10 Homeで使うにはWindows Subsystem for Linux 2（WSL2）というのがいるらしいので入れる。

[Windows 10 に WSL をインストールする \| Microsoft Docs](https://docs.microsoft.com/ja-jp/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package)

LinuxディストリビューションとしてUbuntuを選択。よく分からないので……。

あとはこれに従うだけ。

[Install Docker Desktop on Windows \| Docker Documentation](https://docs.docker.com/desktop/windows/install/)

1年前はホームエディションのWindowsでDockerを利用しようとすると仮想マシンが必要だったはずだけど、このWSLの公開という画期的な出来事があって大きく状況が変わったらしい？

Docker使えるようになりたい……。