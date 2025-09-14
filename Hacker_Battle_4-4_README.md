Hacker Battle 4.4: Final Mix

概要

このドキュメントは、`opening_animation.html` に実装された「Hacker Battle 4.4: Final Mix」演出の物語構成と実装上のフックを日本語で整理したものです。視聴者は「Creator（創造主）」となり、Guardian AI "FALCON" と謎のハッカー "SPIDER" の壮大な戦いを追体験します。

目次

1. 章ごとの物語と演出（解説）
2. 実装フック（関数・変数）一覧
3. 調整パラメータ（視覚・音量・性能）
4. 実行方法（ローカル）
5. テストと微調整の提案
6. 免責 / 注意事項


1. 章ごとの物語と演出（解説）

第1章：侵蝕 - The Breach
- 物語: SPIDERが急襲し、システムの中枢に侵入。FALCONが覚醒するトリガーとなるシーン。
- 実装: `mainSequence` の該当ステップに `chapter: 'breach'` が設定されています。演出は `performChapterEffect('breach')` で発動します。
- 視覚: 赤いログ表示、画面のシェイク、アラーム音。

第2章：覚醒 - The Awakening
- 物語: FALCONが起動し、エンブレムを表示して反撃を宣言します。
- 実装: `chapter: 'awakening'`、`performChapterEffect('awakening')`。ロゴは `drawLogo()` または `createMaxIntegerSpectacle()` 内のロゴ描画フックで表示されます。
- 視覚: FALCONエンブレムのフェードイン、低音の起動サウンド。

第3章：量子領域の攻防 - The Quantum Front
- 物語: 量子球体の登場と巨大なコード・ヴォルテックス（約1,000兆行）。
- 実装: `chapter: 'quantum'`。3D量子ビジュアルは three.js を使用するモジュールで描画され、`createMaxIntegerSpectacle()` 内の `quantum` 分岐で制御されます。
- 視覚: 紫色の量子球体、ログの大量流出（仮想化されたログ生成）。

第4章：AI対AIの代理戦争 - The AI Ghost War
- 物語: AIゴーストの増殖とハンターキラー群の衝突（約2,000兆行）。
- 実装: `chapter: 'ai_war'`。粒子システム（three.js instanced meshes）で緑（FALCON）と赤（SPIDER）の粒子衝突を表現します。

第5章：自爆攻撃 - The Singularity Gambit
- 物語: SPIDERが局所シンギュラリティを発生させ、自爆を試みる（約2,500兆行）。
- 実装: `chapter: 'singularity'`。画面全体を黒いコアに吸い込むような表現と、赤黒のカラーリングで破壊を可視化します。

第6章：最終決戦 - The Ultimate Siege
- 物語: FALCONの総力反撃。最終的に JS の安全な最大整数（Number.MAX_SAFE_INTEGER）相当の累積コード数に到達します（約9,007兆...）。
- 実装: `chapter: 'ultimate'`。`createMaxIntegerSpectacle()` でクライマックス演出をトリガーし、最終カウントアップ表示を行います。`performChapterEffect('ultimate')` にて最も激しいパーティクル、フラッシュ、画面震えを起動します。

最終章：再生 - The Restoration
- 物語: SPIDER の駆逐とシステムの再生。マトリックス・レインで締めくくります。
- 実装: `chapter: 'restoration'`。`performChapterEffect('restoration')` がマトリックスレインを表示するフックです。


2. 実装フック（関数・変数）一覧

- mainSequence: 各物語ステップの配列。各要素に `chapter` プロパティが付与されています。
- runSequence / executeSequence: mainSequence を順に実行するコントローラー。
- performChapterEffect(chapter): 章ごとの視覚・音響演出を担当する関数。必要に応じて追加のパラメータで挙動を調整できます。
- createMaxIntegerSpectacle(count, viewer, duration): 巨大なログ/パーティクルの視覚化を行う主要なスペクタクル関数。最終決戦のクライマックス処理はこちらが中心になります。
- humanReadableBigInt(big): BigInt を日本語桁（兆等）で読みやすく整形するユーティリティ。
- formatBigIntWithTooltip(el, big): 要素に完全な数値ツールチップを設定。大きな数の精度表示に役立ちます。
- impactBurst(intensity, team): フラッシュ、シェイク、パーティクルスパイクを発生させる。`team` は `'falcon'` または `'spider'`。
- playSoundWithVolume(name, intensity): モード（Extreme/Balanced/Color）を考慮して音量を調整して鳴らすユーティリティ。


3. 調整パラメータ（視覚・音量・性能）

- エフェクトモード: `Extreme`（派手） / `Balanced`（中庸） / `Color`（色重視）。UI 上で切り替え可能。
- particleCount: 三次元粒子数。高性能マシンは増やしても良いが、一般的にはデフォルトで制限されています。
- flashIntensity / shakeMagnitude: 端末に合わせて小さく調整してください。強すぎる場合は `Balanced` モードに設定してください。
- audioVolumeGlobal: サウンドが大きすぎる場合はブラウザのタブ音量または `playSoundWithVolume()` のデフォルトを下げてください。


4. 実行方法（ローカル）

注意: Web Audio API や AudioWorklet、three.js の一部機能はローカルファイル（file://）だと制限される場合があります。必ず簡易 HTTP サーバーで開いてください。

例（PowerShell）：

```powershell
# Python がインストールされている場合
cd "C:\Users\black\Desktop\『 AI 』 ホームページ\Ryuya-Official"
python -m http.server 8000
# ブラウザで http://localhost:8000/opening_animation.html を開く
```

Windows 10/11 の簡易サーバー（PowerShell）でも可:

```powershell
cd "C:\Users\black\Desktop\『 AI 』 ホームページ\Ryuya-Official"
# PowerShell 5.1 以下で実行可能なシンプル HTTP サーバーを使う一例（Python が最も簡単）
```


5. テストと微調整の提案

- 音量/フラッシュ: 最初に `Balanced` モードで再生し、PC のパフォーマンスと体感を確認してください。
- パーティクル数: 低スペックでは `particleCount` を下げてクラッシュやフレーム落ちを回避してください。
- 大きな数表示: 過度な精度表示が不要な場合は `humanReadableBigInt()` のフォーマットを変更して桁を落としてください。


6. 免責 / 注意事項

- 本プロジェクトは視覚・音響が強烈な表現を含みます。光に敏感な方やてんかんの既往がある方は視聴を避けてください。
- ブラウザやデバイスによっては AudioWorklet が利用できない場合があります。その場合、サウンドは軽量なフォールバックになります。


作成者: 自動生成（編集者はファイル作成者）
更新日: 2025-09-13
