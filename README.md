# Sparkle

理想の体型になりたい人を支援するwebアプリケーションです。<br>
日々の見た目と食事内容を記録し、他の人に共有することで、モチベーションを維持することができます。<br>
また、体重を記録しないことで、体重に囚われないダイエット・肉体改造をすることができます。

URL <https://sparkle-v.herokuapp.com/>

# 特に見ていただきたい点

- React + Rails APIで完全SPA化を行っている点

- 開発環境にDockerを導入し、静的解析ツール「hadolint」を使用してDockerfileをベストプラクティスに沿って記述している点

- CircleCIとGithubを連携して、Githubにpushしたら自動的にRuboCopとRSpecを走らせている点

- Modelにロジックを記述して、Fat Controllerにならないように意識している点

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
  - AWS（S3）
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
