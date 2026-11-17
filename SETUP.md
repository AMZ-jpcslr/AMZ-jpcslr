# GitHubプロフィールの編集

公開先は [AMZ-jpcslr/AMZ-jpcslr](https://github.com/AMZ-jpcslr/AMZ-jpcslr) です。GitHubのOverviewにはリポジトリ直下のREADMEと、その中で参照する画像が表示されます。

## 内容と画像を変える

- 自己紹介・スキル・作品・掲載順は `profile.json` を編集します。各作品の `slug` はポートフォリオ詳細ページのパス、`repository` はGitHubリポジトリ名です。
- 表紙は `assets/workshop/cover.png`、作品のサムネイルは `assets/workshop/<slug>.webp` です。元の画像と注記は [参照元](docs/SOURCES.md) に記録しています。
- `description` は短い用途説明、`imageAlt` は画像の説明、任意の `caption` は再現画面などの注記です。表紙に印刷された名前やコピーは画像を差し替えて変更します。

## 再生成・確認

Node.js 22以上で、パッケージのインストールは不要です。

```sh
npm run build
npm run check
npm run preview
```

[ローカルプレビュー](http://127.0.0.1:4175)を開きます。`preview.html` を直接開いても同じ画像を確認できます。Light / Dark の切替はローカル専用です。GitHubでは閲覧者のテーマで本文とリンクの色が決まり、紙色の表紙とサムネイルは共通です。

## 反映

`git diff --check` とプレビューを確認し、設定・生成プログラム・README・画像を一緒にコミットして、プロフィールリポジトリの既定ブランチにpushします。GitHub PagesやVercelの再デプロイは不要です。
