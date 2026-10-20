# チュートリアル
[English](Tutorial.md) | [简体中文](Tutorial.zh_CN.md)

このチュートリアルは、Web や JavaScript の開発経験がまだ少ない開発者向けの入門ガイドです。Web 開発に
慣れている方は、CCL の設計ドキュメントを直接お読みください。

## はじめに
CCL の導入と開発はそれほど難しくありません。まず、ローカルにインストールした Apache や、アクセス
可能なクラウド上の nginx など、Web サーバーの開発環境を用意してください。次に、ブラウザからその
サーバーに正しくアクセスできることを確認します。ローカルで開発している場合は、

    http://localhost/

にアクセスして接続を確認してください。

**ご注意：** CCL の開発は必ずサーバー環境上で行ってください。開発中にリソースが読み込めない場合は、
アドレスバーの URL が `file:` などではなく `http:` または `https:` で始まっていることを確認してください。

**ノート：** Linux で開発する場合は、どの静的 Web サーバーソフトウェアでも構いません。Windows で
開発する場合は、参考までに XAMPP をお勧めします。

### ライブラリの入手
GitHub から CCL を Zip 形式でダウンロードすることもできますが、開発や更新が難しくなるため
お勧めしません。CCL を利用・拡張するには、次のいずれかの方法をお勧めします。

- 外部ライブラリとして npm または bower から導入する： `npm install comment-core-library --save`
    を実行するだけで、最新の安定版 CCL を入手できます。必要なファイルは
    `node_modules/comment-core-library/dist/` から参照できます。
- Git リポジトリを直接クローンする： `git clone https://github.com/jabbany/CommentCoreLibrary.git`
    を実行すると、CCL のリポジトリ全体をクローンできます。作業ディレクトリは `/var/www/` や
    `D:\webroot\htdocs` など、Web 開発サーバー配下のサブフォルダに置くことをお勧めします。その後、
    CommentCoreLibrary フォルダに移動して `pnpm install` を実行すれば、開発を始められます
    （ビルド方法は [BUILDING.md](../BUILDING.md) を参照してください）。

一つ目の方法は、CCL の機能を自分のプロジェクトに組み込みたい場合に向いています。二つ目の方法は、
CCL 自体の開発に興味がある方向けです。

### 正しい使い方
ビルド済みの CCL は `dist/` ディレクトリにあります。特に重要なファイルは `CommentCoreLibrary.js` と
`style.css` の二つです。それぞれ CCL の JavaScript エンジン部分と CSS による表示部分を担っており、
どちらも省略できません。また、これらを圧縮した `.min.js` と `.min.css` もあります。圧縮版はコードが
一行にまとめられていて行番号でのデバッグがしにくいため、開発時は非圧縮版を使い、本番環境では圧縮版を
使うことをお勧めします。

読み込むには、HTML ファイルのヘッダーに次のように追加します。

````HTML
<head>
    ... その他のヘッダー情報 ...
    <link rel="stylesheet" href="dist/css/style.css" />
    <script src="dist/CommentCoreLibrary.js"></script>
    ... その他のヘッダー情報 ...
</head>
````

ファイルのパスは環境に合わせて適切に調整してください。

次に、弾幕を表示したい場所に、次のような HTML の DOM 構造を配置します。

````HTML
<div id='my-player' class='abp'>
    <div id='my-comment-stage' class='container'></div>
</div>
````

弾幕は `container` の div の中に挿入されます。二重の入れ子構造にすることで、弾幕の container を
実際のコンテナとは異なるサイズにでき、字幕を避けて表示するといったことが可能になります。

### API
API の呼び出しは簡単です。ページの DOM を用意したら、CommentManager を結び付けるだけです。

````JavaScript
var CM = new CommentManager(document.getElementById('my-comment-stage'));
CM.init(); // 初期化
````

その後、`CM` インスタンスで次の機能が使えます。

````JavaScript
// 弾幕リストを読み込む
var danmakuList = [
    {
        "mode":1,
        "text":"Hello World",
        "stime":0,
        "size":25,
        "color":0xffffff
    }
];
CM.load(danmakuList);

// 弾幕を挿入する
var someDanmakuAObj = {
    "mode":1,
    "text":"Hello CommentCoreLibrary",
    "stime":1000,
    "size":30,
    "color":0xff0000
};
CM.insert(someDanmakuAObj);

// 弾幕の再生を開始する（開始していない状態では弾幕は動きません）
CM.start();

// 再生を停止する（弾幕の動きを止めます）
CM.stop();

// タイムラインの時刻を更新する
CM.time(500);
CM.time(1000);
````

詳しい使い方は `demo/tutorial` を参考にしてください。この例のコードの大部分が含まれています。

### コミュニティ


### 弾幕送信
CommentCoreLibrary には弾幕を送信する機能はありませんが、ユーザーのコメントを記録したい場合は、
自分でサーバーを用意すれば簡単に実装できます。具体的な実装は、ご自身のサーバーの要件に合わせて
決めてください。

### 弾幕受信と生放送
リアルタイムで弾幕データを表示する方法の例は[こちら](DoingItRight.md)にまとめています。
