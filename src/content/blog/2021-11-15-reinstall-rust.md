---
title: "Rust再インストール"
date:   2021-11-15 07:54:24 +0900
---

覚え書き。

突然`cargo check`が働かなくなった。

```
$ cargo check
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
info: latest update on 2021-11-01, rust version 1.56.1 (59eed8a2a 2021-11-01)
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
info: latest update on 2021-11-01, rust version 1.56.1 (59eed8a2a 2021-11-01)
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
info: latest update on 2021-11-01, rust version 1.56.1 (59eed8a2a 2021-11-01)
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
info: latest update on 2021-11-01, rust version 1.56.1 (59eed8a2a 2021-11-01)
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
info: latest update on 2021-11-01, rust version 1.56.1 (59eed8a2a 2021-11-01)
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
info: latest update on 2021-11-01, rust version 1.56.1 (59eed8a2a 2021-11-01)
error: 'cargo.exe' is not installed for the toolchain 'stable-x86_64-pc-windows-msvc'
To install, run `rustup component add cargo`
```

```
$ rustup component add cargo
info: syncing channel updates for 'stable-x86_64-pc-windows-msvc'
info: latest update on 2021-11-01, rust version 1.56.1 (59eed8a2a 2021-11-01)
error: Missing manifest in toolchain 'stable-x86_64-pc-windows-msvc'   
```

これと似た状況。

[error: toolchain 'stable\-x86\_64\-pc\-windows\-msvc' does not support components · Issue \#1793 · rust\-lang/rustup](https://github.com/rust-lang/rustup/issues/1793)

が、`rustup uninstall stable`がエラーを吐いて二進も三進もいかなくなったので結局`rustup`ごとアンインストールして再インストール。

```
$ rustup self uninstall


Thanks for hacking in Rust!

This will uninstall all Rust toolchains and data, and remove
%USERPROFILE%\.cargo/bin from your PATH environment variable.

Continue? (y/N) y

info: removing rustup home
info: removing cargo home
info: removing rustup binaries
info: rustup is uninstalled
```

```
$ rustc --version
rustc 1.56.1 (59eed8a2a 2021-11-01)

$ rustup --version
rustup 1.24.3 (ce5817a94 2021-05-31)
info: This is the version for the rustup toolchain manager, not the rustc compiler.
info: The currently active `rustc` version is `rustc 1.56.1 (59eed8a2a 2021-11-01)`

$ cargo --version
cargo 1.56.0 (4ed5d137b 2021-10-04)
```

すると治った。

よく分からん……。`error: 'cargo.exe' is not installed for the toolchain 'stable-x86_64-pc-windows-msvc'`ってどういう状況？