# 工房ノート — GitHubプロフィール

[ポートフォリオ](https://portfolio-amz-jpcslr.vercel.app/)と同じ「紙と真鍮と歯車でできた、からくり修理屋の工房」の見た目にそろえています。クリーム色の方眼紙、真鍮の札と歯車、セージ緑の歯車、黒いキー帽の英字ラベル、セリフ体の英字見出しを使い、ポートフォリオのイラストと作品画面をSVGに埋め込んでいます。

## 編集と確認

Node.js 22以上で動作します。パッケージのインストールや外部APIは不要です。

```sh
npm run build
npm run check
npm run preview
```

[プレビュー](http://127.0.0.1:4175)または `preview.html` を開きます。画像はOSやGitHubの配色に合わせて昼（クリーム色）と夜（ポートフォリオの夜の工房の色）を切り替え、540px以下では縦長の画像を使います。プレビューの Light / Dark ボタンは本文の背景だけを切り替えるので、夜の画像を確認するときはOSのダークモードを使ってください。

- `profile.json`: 名前、自己紹介、所属、スキル、ツール使用歴、作品と掲載順。
- `scripts/notebook-art.mjs`: ヘッダー、見出し、作品カード、About、区切りのSVGを生成します。色と歯車の形はポートフォリオの `notebook/style.css` と `notebook/gears/` に合わせています。
- `scripts/generate.mjs`: READMEとプレビューの組み立て。
- `scripts/prepare-images.py`: ポートフォリオのリポジトリからイラストと作品画面を縮小して `assets/source/` へ保存します（画像を差し替えるときだけ、Pillowを入れて手動で実行）。
- `assets/notebook/`: 自動生成する画像。直接編集すると再生成で上書きします。

作品カードと「コード」はGitHubへ、「制作の背景」はポートフォリオの作品ページへ移動します。歯車はSVG内のCSSでゆっくり回り、計器の針が左右に振れます。動きを減らす設定では止まります。外部フォント・JavaScript・外部画像は使いません。

`npm run check` と `git diff --check` の後に、READMEと生成画像を同じコミットに含めてpushすると、Overviewに反映されます。
