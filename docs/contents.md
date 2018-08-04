<style>
body {
  font-family: 'Source Code Pro', 'ヒラギノ';
}
</style>

# 目次

1. 活動の概要
2. 関数型プログラミング言語
3. Standard ML  
  3.1 Standard ML の特徴  
  3.2 開発環境  
  3.3 式の評価, 束縛, 関数, コメント, ファイルの使用, コンパイル  
  3.4 主なデータ型とリテラル  
  3.5 関数定義, パターンマッチング, if, 相互再帰/高階関数, 関数式, 部分適用, 中置演算子  
  3.6 リスト操作関数, リストの畳み込み  
  3.7 datatype 宣言, 型シノニム, 抽象データ型, 標準のデータ型  
  3.8 参照型, 評価順序, 例外処理  
  3.9 モジュール, ストラクチャ, シグネチャ, シグネチャ制約の透明性, ファンクタ
4. コンパイラの構成  
  3.1 字句解析器  
  3.2 構文解析器
5. 後期の活動について
6. 参考文献

# 1. 活動の概要

&emsp;この班では, 関数型プログラミング言語 **Standard ML** を用いて, コンパイラを開発することを目標として活動した. 活動期間は通年であるが, 前期の活動としては, まず Standard ML の構文や言語機能についての勉強会を開くという形式をとった. 前期活動の終盤では, コンパイラ全体の構成についての勉強会を行い, 字句解析器や構文解析器について学んだ.

&emsp;以下, 勉強会を通じて得られた知見をまとめる.

# 2. 関数型プログラミング言語

&emsp;関数型プログラミング言語とは, 関数によってプログラムを構成するプログラミングスタイルを基本とする言語である. Standard ML の他に, LISP や Haskell, OCaml などが代表的な関数型プログラミング言語として知られている.

# 3. Standard ML

## 3.1 Standard ML の特徴

&emsp;Standard ML は, プログラミング言語 ML の標準仕様, あるいは一方言として位置付けられる関数型プログラミング言語である. 以下のような特徴を持っている.

- 強力な型システム
- パターンパッチング機構
- 高度なモジュールシステム
- 命令型言語的な機能

&emsp;関数がプログラムの主役となる関数型言語では, 関数は第一級オブジェクト(first-class object)である. ここで, 第一級オブジェクトとは, 変数に格納したり, 関数の引数や戻り値に使用できるデータのことをいう.

## 3.2 開発環境

&emsp;Standard ML の処理系としては, コンパイラ **mlton** と, 対話的実行環境 **Standard ML of New Jersey** (以下, **smlnj**) が存在する. そのため, ソースファイルを用いてプログラムを作成することも, ソースファイルを作成せずに式の評価や型システムの動作を対話的にテストすることもできる.

&emsp;mlton と smlnj は、どちらも apt, pacman, brew といったパッケージ管理システム経由で導入が可能である. このプロジェクト活動においては, macOS 環境では brew 経由で, Ubuntu 環境では apt 経由で, Arch linux 環境では pacman 経由で導入した.

## 3.3 式の評価と束縛, 関数, コメント, ファイル

### 式の評価と束縛

&emsp;smlnj は sml コマンドで起動する. 式を入力して改行すれば評価される. 複数行に渡る構文で記述している場合, 改行して入力を続けることができる.

```sml
- 2 * 3 + 4 * 5;
val it = 26 : int
- it - 20;
val it = 6 : int
```

&emsp;セミコロンは式の終端を表す. smlnj は式を1度評価するごとに, その結果を名前 ``it`` に束縛する. ``it`` を用いると, 前回の式の評価結果を用いた新たな式の評価が可能である.

&emsp;関数型言語では, 代入は行わずに, 異なる概念である**束縛**を行う. 束縛は, 式と名前を対応付ける操作を指す. 例えば先ほど示したサンプルでは, 最初は名前 ``it`` を ``26`` で束縛し, 次は ``6`` で束縛している.

### 関数

&emsp;以下で, 2 つの int 型データを渡して和を得る add 関数を, 2 種類の方法で定義する.

```sml
- fun add (x: int) (y: int): int = x + y;
val add = fn : int -> int -> int
- add 1 2;
val it = 3 : int
```

```sml
- fun add x y = x + y;
val add = fn : int -> int -> int
- add 1 2;
val it = 3 : int
```

&emsp;どちらも挙動は全く同じだが, 前者では全ての引数と戻り値の型を明記し, 後者では可能な限り型を省略している. ここでは, Standard ML の型推論を最大限利用している. 型推論とは, コンパイル時に不足している型の情報を推論する機能である.

### コメント

```sml
(* コメントは (* ネスト可能 *) *)
```

### ファイル

```sml
(* file: test1.sml *)
fun add x y = x + y
val m = 2
val n = 3
```

&emsp;上の内容のソースコードを, ``test1.sml`` という名前で保存する.

```sml
- use "test1.sml";
[opening test1.sml]
val add = fn : int -> int -> int
val m = 2 : int
val n = 3 : int
val it = () : unit

- add 4 5;
val it = 9 : int
```

&emsp;smlnj で ``use "...";`` を評価させると, 文字列型データで指定したソースファイルをコンパイルして対話的実行環境にインポートする.

## 3.4 主なデータ型

### 基本データ型

| 型名 | 説明 | リテラルの例 |
| --- | --- | --- |
| bool | 論理型 | true, false |
| int | 整数型(符号付き整数型) | 123, 0x1a, ~123 (負数) |
| word | ワード型 (符号なし整数型) | 0w123, 0wx1a |
| real | 実数型 | 3.14, ~3.14, 1.23e4, 1.23e~4 |
| char | 文字型 | #"a", #"\n" |
| string | 文字列型 | "abc\n" |
| unit | ユニット型 (0-タプル) | () |

### 複合型

| 型 (例) | 説明 | リテラルの例 |
| --- | --- | --- |
| int * int * string | タプルの例 | (123, 456, "abc") |
| { a: int, b: int, <br>c: string } | レコード型 | { a = 123, b = 456, <br>c = "abc" } |
| int list | リスト型 (値の列) | [3, 1, 4, 2, 5] |

### 論理型

&emsp;論理値の値は true または false である. 論理型データの演算に用いる演算子として, not (否定), andalso (論理積), orelse (論理和) が挙げられる.

```sml
- not true;
val it = false : bool
- it orelse true;
val it = true : bool
```

### 数値型

&emsp;数値型の演算には ~ (単項マイナス), + (加算), - (減算), * (乗算), abs (絶対値) などを用いることができる. 除算演算子には / (real 型用) と div (int, word 型用) の 2 種類がある. 剰余演算子は mod で, int 型と word 型で利用できる.

```sml
- 2 * 3;
val it = 6 : int
- ~ it;
val it = ~6 : int
- abs it;
val it = 6 : int
- 10.0 / 3.0;
val it = 3.33333333333 : real
- 10 div 3;
val it = 3 : int
- 10 mod 3;
val it = 1 : int
```

&emsp;これらの算術演算子は, 2 つの引数が同一の型でなければ利用できない. 例えば ``2 + 3.0`` は型エラーとなる. ``real(2) + 3.0`` のように, 適切な型に揃える必要がある.

&emsp;実数型から整数型への変換には ceil (∞方向丸め), floor (-∞方向丸め), trunc (0方向丸め), round (四捨五入) といった関数が利用できる.

### 文字型/文字列型

&emsp;``\n`` のようなエスケープシーケンスが利用できる. また, 文字列の連結には ``^`` 演算子を用いる.

```sml
- "abc" ^ "def\n"
val it = "abcdef\n" : string
```

### タプル型/ユニット型

&emsp;<b>タプル</b> (tuple) は, 複数の値を組にしたものである. 例えば, 整数 ``123`` と文字列 ``"abc"`` のタプルは ``(123, "abc")`` のように書き, その型は ``int * string`` と書く.

&emsp;タプルの n (>= 1) 番目の要素を取り出すには ``#n`` という関数を利用する.

```sml
- (123, (456, "abc"));
val it = (123, (456, "abc")) : int * (int * string)
- #1 (#2 it);
val it = 456 : int
```

&emsp;<b>ユニット</b> (unit) は, 要素数が 0 のタプルで表現される. ユニット型の唯一の値は ``()`` であり, 型名は ``unit`` である. ユニット型は, 例えば, 意味のある値を返さない関数の戻り値の型として用いられる. 文字列を出力する print 関数の戻り値の型はユニット型である.

### レコード型

&emsp;<b>レコード</b> (record) はラベル付きの値の集合である.

```sml
- val taro = { name = "Taro", age = 25 };
val taro = {age=25,name="Taro"} : {age:int, name:string}
- #age taro
val it = 25 : int
```

&emsp;上の例では, ラベルとして ``name`` と ``age`` を持つレコードを生成している. ここで作成したレコード ``taro`` の型は ``{ age: int, name: string }`` であり, 各要素を取り出すには ``#name`` や ``#age`` のような名前の関数 (セレクタ関数) を用いる.

### リスト型

&emsp;<b>リスト</b> (list) は要素を一列に連結してデータ構造である. リテラルのシンタックスは ``[1, 2, 3]`` のようになっており, この場合型は ``int list`` と書きます. 要素数 0 のリスト (空リスト) は ``[]`` または ``[]`` と書く.

```sml
- [1, 2, 3];
val it = [1,2,3] : int list
- nil;
val it = [] : 'a list
- [];
val it = [] : 'a list
```

### 多相型

&emsp;以下のプログラムでは, 恒等関数 (引数の値をそのまま返す関数) を定義している.

```sml
- fun id x = x;
val id = fn : 'a -> 'a
```

&emsp;``id`` 関数の型は ``'a -> 'a`` と推論されていることがわかる. ``'a`` のようにアポストロフィで始まるパラメータは<b>型変数</b> (type variable) と呼ばれ, 任意の型を表す. ``'a -> 'a`` は, ``id`` 関数が, 例えば ``int -> int`` 型としても振る舞い, ``char -> char`` 型としても振舞うことを示している.

### 等値型

&emsp;1 個のアポストロフィで始まる型変数は任意の型を表すが, 2 個以上のアポストロフィで始まる型変数 (``''a`` など) は<b>等値型</b> (equality type) を表す. 等値型とは, 関数 ``=`` で等値比較可能な型である. bool, int, char, string などの離散的なデータ型は等値型であり, 等値型から構成されるタプルやリストなどの複合型も等値型である.

```sml
fun id (x : ''a) = x;
val id = fn : ''a -> ''a
```

&emsp;すべての等値型には, 比較演算子 ``=`` および ``<>`` を用いることができる.

## 3.5 関数定義, パターンマッチング, if, 相互再帰/高階関数, 関数式, 部分適用, 中置演算子

### 関数定義

&emsp;以下のプログラムは, 自然数の冪乗 (``x`` の ``y`` 乗) を返す関数 ``power`` を定義している.

```sml
fun power x 0 = 1
  | power x y = x * power x (y - 1)
```

&emsp;関数の宣言は ``fun`` キーワードから始まり, ``=`` の左に関数名と引数, 右に式を記述する. 複数のケースを書きたい場合, 上記の例のように縦棒 ``|`` を使って関数の記述を継続することができる.

上記のソースコードを ``power.sml`` というファイル名で保存し, smlnj から読み込むと, 次のように動作する.

```sml
- use "power.sml";
[opening power.sml]
val power = fn : int -> int -> int
val it = () : unit
- power 2 8;
val it = 256 : int
- power 2 0;
val it = 1 : int
```

&emsp;この ``power`` 関数の宣言の 1 行目と 2 行目を入れ替えてしまうと, ``power x y`` がすべてのケースにマッチしてしまうため, 関数の呼び出しは終了しない.

```sml
fun power x y = x * power x (y - 1)
  | power x 0 = 1    (* こちらの定義には到達しない *)
```

### パターンマッチング

&emsp;これまでの説明で既に使用しているが, パターンには, 変数や整数リテラルの他に, タプルやリスト, レコードも書くことができる.

```sml
- fun length nil = 0
    | length (x::xs) = 1 + length xs;
val length = fn : 'a list -> int
- length [1, 2, 3, 4, 5];
val it = 5 : int
```

&emsp;次の例のように, 興味のない部分にはワイルドカードと呼ばれるパターン ``_`` を使うこともできる.

```sml
- fun second (_, y) = y;
val second = fn : 'a * 'b -> 'a
- second (123, "abc");
val it = "abc" : string
```

&emsp;パターンは, ``val`` 宣言の左辺に使うこともできる. 

```sml
- val (a, b) = (123, "abc");
val a = 123 : int
val b = "abc" : string
```

&emsp;``case`` 式を用いて, 式の中でパターンマッチを行うこともできる.

```sml
- fun length xs =
    case xs of nil => 0
             | x::xs => 1 + length xs;
val length = fn : 'a list -> int
```

### if 式

&emsp;パターンではなく論理式によって場合分けする場合には, ``if`` 式を用いる. あくまで式なので値を持つ. そのため, 「``then`` 式」「``else`` 式」のどちらも省略できない.

```sml
- fun abs x = if x < 0 then ~x else x;
val abs = fn : int -> int
- abs ~5;
val it = 5 : int
```

### 相互再帰関数

&emsp;次のプログラムでは, 引数が偶数のときに真を返す関数 ``even`` と, 引数が奇数のときに真を返す ``odd`` を定義している.

```sml
- fun even 0 = true
    | even n = odd (n - 1)
  and odd 0 = false
    | odd n = even (n - 1);
val even = fn : int -> bool
val odd = fn : int -> bool
- even 2;
val it = true : bool
```

&emsp;相互再帰的な関数は, 互いが互いを参照し合えるように, 1 つの fun 宣言の中に記述する必要がある. そのために, この例のように ``and`` キーワードを用いる.

### 高階関数

&emsp;関数を引数や戻り値に持つ関数は**高階関数**と呼ばれる. 以下に示す ``map`` 関数が, 標準で定義されている高階関数の代表的な例である.

```sml
- fun square x = x * x;
val square = fn : int -> int
- map square [1, 2, 3, 4, 5];
val it = [1, 4, 9, 16, 25] : int list
```

&emsp;関数 ``map`` の定義は, 例えば以下のように書くことができる.

```sml
fun map f nil = nil
  | map f (x::xs) = f x :: map f xs
```

### 関数式

### 部分適用

### 中置演算子

## 3.6 リスト操作関数, リストの畳み込み

&emsp;

## 3.7 datatype 宣言, 型シノニム, 抽象データ型, 標準のデータ型

&emsp;

## 3.8 参照型, 評価順序, 例外処理

&emsp;

# 4. コンパイラの構成

&emsp;

## 4.1 字句解析器

&emsp;

## 4.2 構文解析器

&emsp;

# 5. 後期の活動について

&emsp;

# 6. 参考文献

- Andrew W. Appel 著, 神林 靖 監修/編集, 滝本 宗宏 編集 『最新コンパイラ構成技法』
- 『ウォークスルー Standard ML』 http://walk.northcol.org/sml/
- 『お気楽 Standard ML of New Jersey 入門』 http://www.geocities.jp/m_hiroi/func/index.html#sml
