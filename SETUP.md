# プロフィールの編集・公開

B案のターミナル風プロフィールです。`README.md` がGitHubのOverviewに表示する完成物です。
画像はすべてローカルのSVGで、外部の統計カードサービスや画像APIには依存しません。

## 使い方

Node.js 22以上で動作します。npmパッケージのインストールは不要です。

```sh
npm run build
npm run check
npm run preview
```

表示された `http://127.0.0.1:4175` を開くと、Dark / Lightを切り替えて確認できます。
プレビューはGitHub風の確認画面です。掲載後の余白・文字サイズ・リンク色はGitHub側のスタイルに従うため、完全一致ではありません。
`preview.html` をブラウザで直接開いても動きます。停止はターミナルでCtrl+C。
PowerShellでnpmの実行ポリシーに制限がある場合は `npm.cmd`、または以下を使ってください。

```sh
node scripts/generate.mjs
node scripts/generate.mjs --check
node scripts/serve.mjs
```

## 内容を変える

`profile.json` を編集して、`npm run build` を実行します。

| 項目 | 内容 |
| --- | --- |
| `name` / `alias` / `username` | 表示名、短いハンドル、GitHubユーザー名 |
| `tagline` / `focus` | ヘッダーの一言と関心領域（1〜5行） |
| `about` | 日本語の自己紹介 |
| `portfolio` | ポートフォリオのHTTPS URL |
| `skills` | 技術バッジ（1〜12個） |
| `projects` | メインの作品（1〜8件、2列で表示） |
| `moreProjects` | 折りたたみ部分の作品（0〜8件） |

ヘッダー内の文字がはみ出さないよう、文字数に上限を設けています。ASCII以外の文字は2文字分として数えます。
色やレイアウトは `scripts/generate.mjs` の `palettes` / `terminal` / `body` を編集します。
`README.md`・`assets/`・`preview.html` は生成物なので、直接編集すると次回ビルドで上書きされます。
技術バッジを減らした場合、使わなくなったSVGは残りますがREADMEからは参照されません。

## GitHubのOverviewに掲載する

現在のフォルダ名 `Github_Profile` はそのままで問題ありません。GitHub側には **`AMZ-jpcslr/AMZ-jpcslr`** という公開リポジトリが必要です。

1. GitHubで、ユーザー名と同じ **AMZ-jpcslr** という名前の公開リポジトリを作成します。既に存在する場合はそのリポジトリを使用します。
2. このフォルダの `README.md` と `assets/` を、階層を保ってリポジトリのルートへアップロードします。
3. 今後も編集する場合は `profile.json`、`scripts/`、`package.json`、`SETUP.md`、`.gitignore`、`docs/` も一緒に保存してください。`preview.html` はローカル確認用で、アップロードは任意です。
4. 既定ブランチにコミット後、[プロフィール](https://github.com/AMZ-jpcslr)のOverviewを開いて確認します。

この作業フォルダからGitHubへのアップロード・コミット・プッシュは行っていません。
GitHubのヘッダー、サイドバー、Contribution graph自体は変更しません。

READMEはGitHubが許可するHTMLと画像で構成しています。自由なCSSやJavaScriptはREADME上では動かないため、ターミナルの装飾はSVGで実現しています。プレビューのテーマボタンはローカル確認専用です。実際のGitHub表示では `picture` により閲覧環境のカラースキームに対応します。ユーザーのOS設定とGitHub内のテーマ選択の組み合わせにより、ローカルプレビューと違う画像が選択される場合があります。

紹介文と技術一覧は公開リポジトリの内容に基づく編集案です。能力の習熟度、活動統計、勤務先などを推測して追加していません。根拠は [docs/SOURCES.md](docs/SOURCES.md) に記録しています。

GitHub仕様: [プロフィールREADMEの管理](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme)、[画像とテーマの指定例](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github)。
