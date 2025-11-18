# Ryuya Official WebsiteRyuya Official — ローカル開発と設定



AI Creator × Singer-Songwriter × Novelist, Ryuyaのオフィシャルサイトこのリポジトリは静的サイト（HTML/CSS/JS）です。簡単にローカルで確認できます。



## 🎨 Featuresセットアップ（ローカル）



- **Premium Design**: 最高品質のUI/UXデザイン1) シンプルな HTTP サーバを起動（Windows PowerShell の例）

- **Ultra Effects**: 3D tilt、ホログラフィック、ネオン、量子パーティクル、ニューラルネットワーク可視化

- **Fully Responsive**: 390px〜2560px+まで完全対応```powershell

- **Security Headers**: セキュリティヘッダー実装済み# Python がインストールされている場合（推奨）

- **OGP Optimized**: SNSシェア用OGP画像最適化済み# カレントディレクトリをこのプロジェクトのルートに合わせてから実行

python -m http.server 8000

## 📁 Project Structure# ブラウザで http://localhost:8000 を開く

```

```

Ryuya-Official/2) API キーの扱い

├── index.html           # ホームページ（プレミアムエフェクト搭載）

├── profile.html         # プロフィール（Ryuya、紫苑、伊織暁斗）- YouTube Data API を使って最新動画を取得したい場合は、API キーを取得して `js/config.local.js` を作成してください。

├── songs.html          # 楽曲一覧（Spotify埋め込み）- 既存の `js/config.example.js` をコピーして `js/config.local.js` とし、`youtubeApiKey` にキーを入れてください。例:

├── SNS.html            # SNSリンク集

├── css/```javascript

│   └── style.css       # カスタムCSS（1600+ lines）window.SITE_CONFIG = {

├── js/  youtubeApiKey: 'YOUR_REAL_API_KEY'

│   ├── app.js          # メインJavaScript（600+ lines）};

│   ├── sns.js          # SNSページ用```

│   └── config.example.js

├── assets/- セキュリティ: `js/config.local.js` は公開リポジトリにコミットしないでください。

│   └── images/         # 画像ファイル

│       ├── ogp-image.png3) 検証ポイント

│       ├── Ryuya.png

│       ├── 紫苑.png- ナビゲーション: 全ページで SNS が右端です。

│       └── 伊織暁斗.png- SNS ページ: `SNS.html`（ルート）を開くと各種埋め込み／フィードが表示されます。API キー未設定の場合は iframe / チャンネルリンクのフォールバックが動作します。

├── tools/

│   └── generate-ogp.html  # OGP画像生成ツール4) 進行中タスク

└── netlify.toml        # Netlify設定

```- デザイン微調整、不要ファイルのクリーンアップ、最終ブラウザ検証を継続します。問題や追加のデザイン要望があれば教えてください。


## 🚀 Local Development

### シンプルHTTPサーバーで起動

```powershell
# Python（推奨）
python -m http.server 8000

# Node.js（http-server）
npx http-server -p 8000

# PHP
php -S localhost:8000
```

ブラウザで `http://localhost:8000` を開いてください。

### YouTube API設定（オプション）

SNSページで最新動画を表示する場合：

1. `js/config.example.js` をコピーして `js/config.js` を作成
2. YouTube Data API キーを取得して設定

```javascript
window.SITE_CONFIG = {
  youtubeApiKey: 'YOUR_API_KEY'
};
```

**注意**: `js/config.js` は `.gitignore` に含まれています。

## 🎮 Keyboard Shortcuts

- `Ctrl + Shift + E`: Extreme Mode切替
- `Ctrl + Shift + M`: Matrix Rain切替

## 🌐 Deployment

Netlifyにデプロイ済み: https://ryuya-official.netlify.app

### OGP検証ツール

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [OGP Image Checker](https://www.opengraph.xyz/)

## 📝 Technologies

- HTML5
- CSS3 (Tailwind CSS)
- Vanilla JavaScript
- Three.js (3D backgrounds)
- Canvas API (Particle systems)
- Font Awesome
- Google Fonts

## 🔒 Security

- CSP Headers
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy

## 📄 License

© 2023-2025 Ryuya. All rights reserved.
