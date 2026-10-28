# デザイン・内容の参照

確認日: 2026-10-28

- 既存プロジェクト: `C:\Users\yomas\github\Github_Profile`
- プロフィールのremote: `https://github.com/AMZ-jpcslr/AMZ-jpcslr.git`
- 参照ポートフォリオ: `C:\Users\yomas\github\Portfolio` / `master` / `337f2fd`
- 公開ポートフォリオ: <https://portfolio-amz-jpcslr.vercel.app/>
- 名前・説明: `site/index.html`、`site/music/author-narratives.js`
- 8作品・作品URL・現状: `site/music/content.js`、`site/music/author-narratives.js`、`dist/projects.js`
- 色: `site/music/music.css`、`site/music/books.css`、`site/music/paper.css`、`content.js` の `bookColors`
- 技術一覧: 既存プロフィールを継承。作品ごとの技術は既存プロフィールとポートフォリオを参照。

本の布張りの色、深緑、生成りのノート、罫線、色違いの付箋をSVGとして描き直しました。表紙の付箋のみ、SVG内の宣言的CSSアニメーションで約1.2秒間、1回動かします。通常の文章と作品一覧は静止表示です。素材のダウンロード、外部バッジ、アクセス解析は使っていません。利用人数や改善率などの数値は追加していません。

## READMEのアニメーション方式

- [GitHub公式: 基本の構文](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax): 画像と `picture` に対応。
- [W3C SVG 2: secure animated mode](https://www.w3.org/TR/SVG2/conform.html#secure-animated-mode): 画像としてのSVGで宣言的アニメーションを有効にし、スクリプトや外部参照を無効にする処理モード。
- [MDN: SVG as an image](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image): `img`内のSVGではJavaScriptや外部リソースが制限される。
- [公開READMEでの実例: Platane/snk](https://github.com/Platane/snk): SVGアニメーションをGitHubのREADMEに埋め込む実装例。確認にのみ使用し、素材やコードは流用していません。

READMEにはアニメーションSVGを画像として読み込むだけで、README側のJavaScript・CSS・ホバー操作を前提にしません。`picture` で reduced motion に応じた静止SVGを選び、SVG内部にも軽減指定を保持します。ローカルのプレビューに加え、公開後のプロフィールでも画像・アニメーション・静止表示を確認します。

READMEと画像は `npm run build` で生成します。古いterminal / skill画像は以前の履歴用に残していますが、現在のREADMEからは参照していません。
