Ryuya Official — ローカル開発と設定

このリポジトリは静的サイト（HTML/CSS/JS）です。簡単にローカルで確認できます。

セットアップ（ローカル）

1) シンプルな HTTP サーバを起動（Windows PowerShell の例）

```powershell
# Python がインストールされている場合（推奨）
# カレントディレクトリをこのプロジェクトのルートに合わせてから実行
python -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

2) API キーの扱い

- YouTube Data API を使って最新動画を取得したい場合は、API キーを取得して `js/config.local.js` を作成してください。
- 既存の `js/config.example.js` をコピーして `js/config.local.js` とし、`youtubeApiKey` にキーを入れてください。例:

```javascript
window.SITE_CONFIG = {
  youtubeApiKey: 'YOUR_REAL_API_KEY'
};
```

- セキュリティ: `js/config.local.js` は公開リポジトリにコミットしないでください。

3) 検証ポイント

- ナビゲーション: 全ページで SNS が右端です。
- SNS ページ: `SNS.html`（ルート）を開くと各種埋め込み／フィードが表示されます。API キー未設定の場合は iframe / チャンネルリンクのフォールバックが動作します。

4) 進行中タスク

- デザイン微調整、不要ファイルのクリーンアップ、最終ブラウザ検証を継続します。問題や追加のデザイン要望があれば教えてください。
