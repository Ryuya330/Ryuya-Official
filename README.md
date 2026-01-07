# Ryuya Official Website

![Ryuya Official](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-blue)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7)

**AI Creator × Singer-Songwriter × Novelist**

Ryuyaのオフィシャルサイトへようこそ！このリポジトリは最新技術を駆使したプレミアムなポートフォリオサイトです。

🌐 **Live Site**: [https://ryuya-official.netlify.app](https://ryuya-official.netlify.app)

---

## ✨ Features

### 🎨 デザイン＆UX
- **プレミアムデザイン**: モダンでエレガントなUI/UX
- **3Dエフェクト**: Three.jsによる動的な背景演出
- **レスポンシブ対応**: スマートフォンからデスクトップまで完全対応（390px〜2560px+）
- **グラスモーフィズム**: 最先端のガラス風デザイン
- **スムーズアニメーション**: 洗練されたトランジションとインタラクション

### 🔐 セキュリティ
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy

### 📱 ソーシャル対応
- OGP最適化（SNSシェア用画像）
- Twitter Card対応
- 各種SNSプラットフォーム連携

---

## 📁 プロジェクト構成

```
Ryuya-Official/
├── index.html              # ホームページ
├── profile.html            # プロフィールページ
├── songs.html              # 楽曲一覧（Spotify埋め込み）
├── art.html                # アート作品ギャラリー
├── netlify.toml            # Netlify設定
├── README.md               # このファイル
├── css/
│   ├── style.css           # メインスタイルシート
│   └── enhanced-artist-tech.css  # 拡張スタイル
├── js/
│   ├── app.js              # メインJavaScript
│   ├── cursor-effects.js   # カーソルエフェクト
│   ├── enhanced-background.js  # 背景アニメーション
│   └── performance-optimizer.js  # パフォーマンス最適化
├── assets/
│   └── images/             # 画像アセット
│       ├── ogp-image.png   # OGP画像
│       └── logos/          # ロゴファイル
└── tools/
    └── generate-ogp.html   # OGP画像生成ツール
```

---

## 🚀 ローカル開発

### 1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/Ryuya-Official.git
cd Ryuya-Official
```

### 2. ローカルサーバーを起動

**Pythonを使用（推奨）**
```bash
python -m http.server 8000
```

**Node.jsを使用**
```bash
npx http-server -p 8000
```

**PHPを使用**
```bash
php -S localhost:8000
```

### 3. ブラウザでアクセス

ブラウザで `http://localhost:8000` を開いてください。

---

## 🛠️ 技術スタック

### フロントエンド
- **HTML5** - セマンティックマークアップ
- **CSS3** - カスタムスタイリング
- **Tailwind CSS** - ユーティリティファーストCSS
- **Vanilla JavaScript** - ピュアJSによる実装

### ライブラリ＆フレームワーク
- **Three.js** - 3D背景アニメーション
- **Font Awesome** - アイコンライブラリ
- **Google Fonts** - カスタムフォント（Inter、Noto Serif JP）

### デプロイ＆ホスティング
- **Netlify** - 継続的デプロイメント
- **Git** - バージョン管理

---

## 📊 パフォーマンス

- Lighthouse Score: 90+
- 最適化されたアセット読み込み
- 遅延読み込み（Lazy Loading）対応
- パフォーマンス監視とデバッグ機能

---

## 🌐 デプロイ

### Netlify（自動デプロイ）

このサイトはNetlifyにデプロイされており、`main`ブランチへのプッシュで自動的に更新されます。

**デプロイURL**: [https://ryuya-official.netlify.app](https://ryuya-official.netlify.app)

### OGP検証ツール

SNSシェア時の表示を確認：
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [OGP Image Checker](https://www.opengraph.xyz/)

---

## 🎯 今後の予定

- [ ] ブログセクション追加
- [ ] 多言語対応（英語・日本語）
- [ ] ダークモード切替機能
- [ ] コンタクトフォーム実装
- [ ] パフォーマンスさらなる最適化

---

## 📝 ライセンス

© 2025 Ryuya. All rights reserved.

このサイトのすべてのコンテンツ（デザイン、コード、画像、テキスト）は著作権で保護されています。

---

## 📮 お問い合わせ

- **Twitter**: [@Ryuya_330](https://twitter.com/Ryuya_330)
- **YouTube**: [Ryuya Official](https://www.youtube.com/@ryuya_official)
- **Website**: [https://ryuya-official.netlify.app](https://ryuya-official.netlify.app)

---

Made with ❤️ by Ryuya
