# 制作ノート版の参照元

2026-11-17（日本時間）に、[公開ポートフォリオ](https://portfolio-amz-jpcslr.vercel.app/)の配信内容を確認しました。以前の本棚版のローカルチェックアウトではなく、公開版の「北岡 英磨の制作ノート」を参照しています。

- 表紙: 公開サイトの [共有用イラスト](https://portfolio-amz-jpcslr.vercel.app/og-image.png?v=workshop-20261116) をそのまま使用。
- 自己紹介・スキル: [メッセージ](https://portfolio-amz-jpcslr.vercel.app/#message)と [About Me](https://portfolio-amz-jpcslr.vercel.app/about/) の公開内容をもとに、GitHub用に短く編集。
- 作品の順番、用途、分類、表示画像の種類: [Works](https://portfolio-amz-jpcslr.vercel.app/#works)。各作品の詳細ページに記載されたGitHubリンクを照合。
- 作品画像: Worksの各カードの画像領域（端末枠を含む）を静止画として収録。表示名や用途はREADMEのテキストとして別に掲載。再現画面とBot出力の注記を保持。
- 更新時は公開サイトの `#work-<slug> .work-stage` を再確認し、該当するサムネイルを差し替える。ページ全体やデモ動画は複製していません。

配信先や外部APIをビルド時に呼ばず、表紙と8枚のサムネイルをこのリポジトリから配信します。
