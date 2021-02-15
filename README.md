# Sparkle

理想の体型になりたい人を支援するwebアプリケーションです。<br>
日々の見た目と食事内容を記録し、他の人に共有することで、モチベーションを維持することができます。<br>
また、体重を記録しないことで、体重に囚われないダイエット・肉体改造をすることができます。

URL <https://sparkle-v.herokuapp.com>

# 開発背景

私は食べることが大好きで太りやすい体質です。<br>
過去に、「痩せるためにはとりあえず体重を減らせば良い」という間違った知識を持ってダイエットを行った経験があります。<br>
結果、体重は減りましたが自分の理想の体型にはなれずに毎日体調が悪い日々が続きました。<br>
当時は、体重を減らすために、「無茶な食事制限・水分の節制・激しい有酸素運動」などを行い、体がボロボロの状態でした。<br>
体重計には1日10回以上乗り、体重が増えたり減ったりするたびに一喜一憂し、過食と絶食を繰り返し、体だけでなく心もかなり疲弊していました。<br>
そして、一喜一憂に疲れて体重計に乗らなくなりました。<br>
体重計に乗らなくなったことで、精神的にとても楽になり、過食と絶食も自然と治りました。<br>
痩せたか太ったかの判断は自分の見た目だけで行うようになり、自分の見た目を毎日よく見ることで、日々の体の変化がよく分かるようになりました。<br>
そして、無理なく痩せることができる食事量も自然に分かるようになり、今では、体重は分かりませんが自分の満足のいく体型をキープできています。<br>
きっと以前の私のように、体重に囚われたダイエットをして苦しんでいる人は多いと思います。<br>
そういった人達の助けになればと思って、体重を記録しないことで体重に囚われないダイエットができるこのアプリケーションを開発しました。

# 特に見ていただきたい点

- フロントエンドにReact / TypeScript、バックエンドにRails APIを使用して、SPAを開発している点

- 開発環境にDockerを導入し、静的解析ツール「hadolint」を使用してDockerfileをベストプラクティスに沿って記述している点

- CircleCIとGithubを連携して、Githubにpushしたら自動的にRuboCopとRSpecを走らせている点

- Modelにロジックを記述して、Fat Controllerにならないように意識している点

- RSpecで満遍なく単体テストと結合テストを行っている点（総テスト件数：199件）

- React.memo / useCallback / useMemo を使用して、パフォーマンスの向上を意識している点

- GitHubのIssueやプルリクを活用して疑似チーム開発を行っている点

# 機能一覧

- ユーザー登録・表示・更新・削除
- ログイン・ログアウト
- 1日の記録の作成・削除
- 複数画像保存・表示・削除・プレビュー表示・プレビュー削除
- メモ保存・表示・更新
- フォロー・フォロー解除
- フォローリストとフォロワーリストの表示
- いいね・いいね解除
- いいねリストの表示
- コメント作成・表示・削除・返信
- 無限スクロール
- 各種フィールドのバリデーション（クライアント・サーバ）
- ライトモード・ダークモードの切り替え

# 使用技術一覧

### 【フロントエンド】
  - React
  - Redux
  - TypeScript
  - Material-UI
  - JSX
  - CSS

### 【バックエンド】
  - Ruby 2.7.2
  - Ruby on Rails 6.0.3.4

### 【データベース】
  - MySQL

### 【開発環境】
  - Docker
  - Docker Compose
  - nginx
  - puma

### 【本番環境】
  - Heroku
  - AWS（S3、RDS）
  - puma

### 【テスト】
  - RSpec
  - FactoryBot

### 【その他】
  - RuboCop
  - CircleCI
  - hadolint

# 作成者

- 前田 翔平

# ライセンス

sparkle is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
