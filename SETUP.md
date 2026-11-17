# Clockwork Atelier — GitHubプロフィール

GitHub専用の「異世界の機械工房」をモチーフにしています。真鍮の歯車、深緑の盤面、青緑の計器の光を組み合わせ、ポートフォリオの表紙や作品画像は表示しません。

## 編集と確認

Node.js 22以上で動作します。パッケージのインストールや外部APIは不要です。

```sh
npm run build
npm run check
npm run preview
```

[プレビュー](http://127.0.0.1:4175)または `preview.html` を開きます。Light / Darkは本文の見え方の確認用です。ヘッダーは両テーマ共通の深緑で、540px以下では縦型の画像を使います。実際のGitHubではGitHub側の本文スタイルに従います。

- `profile.json`: 名前、自己紹介、所属、スキル、作品、掲載順。最初の5作品は「アプリ・Bot」、残りは「研究・検証」に表示します。
- `scripts/clockwork-art.mjs`: 歯車・計器・表紙のSVGを生成します。
- `scripts/generate.mjs`: READMEとプレビューの組み立て。
- `scripts/preview-template.html`: ローカル確認用の枠とテーマ切替。
- `assets/clockwork/`: 自動生成する画像。直接編集すると再生成で上書きします。

作品名と「コード」はGitHubへ、「制作の背景」はポートフォリオの作品ページへ移動します。ヘッダーの3つの歯車はSVG内のCSSでゆっくり回転します。大きい歯車は90秒で1周、小さい歯車は逆方向に54秒・45秒で1周します。目盛りと文章は動きません。外部フォント・JavaScript・外部画像は使いません。動きを減らす設定では picture が静止SVGを選び、アニメーションSVG内部でも同じ設定を尊重します。

`npm run check` と `git diff --check` の後に、READMEと生成画像を同じコミットに含めてpushすると、Overviewに反映されます。GitHub Pagesは不要です。旧デザインの画像は履歴用に残っていますが、現在のREADMEは参照しません。
