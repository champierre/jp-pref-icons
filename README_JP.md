# jp-pref-icons

日本の都道府県のアイコン画像を、日本の都道府県境界データを使用して生成するツールです。データソースから最新の境界データを自動的にダウンロードし、高品質なPNGアイコンを作成できます。

[![npm version](https://badge.fury.io/js/jp-pref-icons.svg)](https://www.npmjs.com/package/jp-pref-icons)
[![GitHub Release](https://img.shields.io/github/v/release/champierre/jp-pref-icons)](https://github.com/champierre/jp-pref-icons/releases)

📋 **[リリースノート](https://github.com/champierre/jp-pref-icons/releases)** | 🌐 **[English](README.md)**

## 特徴

- 🗾 **都道府県データ**: データソースからの都道府県境界の自動ダウンロード
- 🎨 **カスタマイズ可能**: 色、サイズ、境界線スタイルの調整が可能
- 🌍 **スマートフィルタリング**: 東京都は本土のみ表示（離島を除外して視認性を向上）
- 🔤 **柔軟なテキスト**: 都道府県名の表示・非表示を選択可能
- 📁 **複数フォーマット**: 透明背景のPNGとSVG出力
- 🎯 **選択的生成**: 名前やコードで特定の都道府県を指定可能
- 🖥️ **簡単CLI**: シンプルなコマンドライン操作

## サンプルアイコン

生成される都道府県アイコンの例：

### デフォルトスタイル

| 都道府県 | アイコン | 特徴 |
|----------|----------|------|
| 東京都 | ![東京都アイコン](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/13_Tokyo.png) | 本土フィルタリング（離島除外） |
| 大阪府 | ![大阪府アイコン](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/27_Osaka.png) | コンパクトな都市型府県の形状 |
| 北海道 | ![北海道アイコン](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/01_Hokkaido.png) | 日本最大の都道府県 |

### テキストなしバージョン

| 都道府県 | アイコン | コマンド |
|----------|----------|----------|
| 東京都 | ![東京都テキストなし](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/13_Tokyo_no_text.png) | `--prefecture "東京都" --hide-text` |

### カスタムカラースキーム

| 都道府県 | アイコン | コマンド |
|----------|----------|----------|
| 大阪府（赤） | ![大阪府赤](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/27_Osaka_red.png) | `--prefecture "大阪府" --face "#FF6B6B" --edge "#D63031"` |
| 北海道（青） | ![北海道青](https://raw.githubusercontent.com/champierre/jp-pref-icons/main/samples/01_Hokkaido_blue.png) | `--prefecture "北海道" --face "#74B9FF" --edge "#0984E3"` |

すべてのアイコンの特徴：
- 細いテキスト縁取りによるクリーンでプロフェッショナルな外観
- 汎用性の高い透明背景
- カスタマイズ可能なカラースキームとテキストオプション
- 高品質なアンチエイリアス処理

## インストール

### NPX（推奨 - インストール不要）

```bash
# 現在のディレクトリに全都道府県のアイコンを生成
npx jp-pref-icons

# 特定の都道府県を生成
npx jp-pref-icons --prefecture "東京都"

# テキストなしでアイコンを生成
npx jp-pref-icons --prefecture "東京都" --hide-text

# カスタムスタイル
npx jp-pref-icons --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

### ローカルインストール

```bash
npm install jp-pref-icons
```

## クイックスタート

### NPX使用（インストール不要）

```bash
# 全都道府県を生成（公式データを自動ダウンロード）
npx jp-pref-icons

# 特定の都道府県を生成
npx jp-pref-icons --prefecture "東京都"

# テキストラベルなし
npx jp-pref-icons --prefecture "東京都" --hide-text

# カスタムスタイル
npx jp-pref-icons --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

### ローカルインストール使用

```bash
# 全都道府県を生成（公式データを自動ダウンロード）
node bin/cli.js

# 特定の都道府県を生成
node bin/cli.js --prefecture "東京都"

# テキストラベルなし
node bin/cli.js --prefecture "東京都" --hide-text

# カスタムスタイル
node bin/cli.js --prefecture "東京都" --lw 0.5 --face "#0E7A6F" --size 2048
```

## 使用例

### 基本的な使用方法

```bash
# 全47都道府県を生成
npx jp-pref-icons

# カスタムGeoJSONファイルを使用
npx jp-pref-icons --geojson custom-prefectures.geojson
```

### 特定の都道府県を生成

```bash
# 都道府県名で指定
npx jp-pref-icons --prefecture "東京都"

# 複数の都道府県を指定
npx jp-pref-icons --prefecture "東京都,大阪府,神奈川県"

# 都道府県コードで指定
npx jp-pref-icons --prefecture "13,27,14"

# 名前とコードの混在
npx jp-pref-icons --prefecture "13,大阪府,Tokyo"
```

### スタイリングオプション

```bash
# 細い境界線
npx jp-pref-icons --prefecture "東京都" --lw 0.5

# テキストラベルなし
npx jp-pref-icons --prefecture "東京都" --hide-text

# カスタムカラー
npx jp-pref-icons --prefecture "東京都" --face "#2E8B57" --edge "#1C5F3F" --text "#FFFFFF"

# 大きなサイズでSVGも生成
npx jp-pref-icons --prefecture "東京都" --size 2048 --svg
```

### プログラマティック使用

```javascript
const PrefectureIconGenerator = require('jp-pref-icons');

const generator = new PrefectureIconGenerator({
  size: 256,                     // アイコンサイズ（ピクセル）
  lineWidth: 0.5,               // 境界線の太さ
  faceColor: '#0E7A6F',         // 塗りつぶし色
  edgeColor: '#0A5A52',         // 境界線色
  textColor: '#FFFFFF',         // テキスト色
  outputDir: 'icons',           // 出力ディレクトリ
  generateSVG: false,           // SVGファイルも生成するか
  showText: true,               // 都道府県名を表示するか
  targetPrefectures: '東京都,大阪府' // 特定の都道府県
});

// アイコンを生成（公式データを自動ダウンロード）
generator.generate()
  .then(() => console.log('アイコンの生成が完了しました！'))
  .catch(err => console.error('エラー:', err));

// またはカスタムGeoJSONを使用
generator.generate('custom-prefectures.geojson')
  .then(() => console.log('アイコンを生成しました！'));
```

## CLIオプション

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `--geojson <path>` | カスタムGeoJSONファイルのパス（オプション） | 自動ダウンロード |
| `--out <dir>` | 出力ディレクトリ | `icons` |
| `--size <number>` | アイコンサイズ（ピクセル、正方形） | `256` |
| `--lw <number>` | 線の太さ | `0.5` |
| `--face <color>` | 塗りつぶし色 | `#0E7A6F` |
| `--edge <color>` | 境界線色 | `#0A5A52` |
| `--text <color>` | テキスト色 | `#FFFFFF` |
| `--svg` | SVGファイルも生成 | `false` |
| `--prefecture <names>` | 指定した都道府県のみ生成 | 全都道府県 |
| `--hide-text` | テキストラベルなしでアイコン生成 | `false` |
| `-h, --help` | コマンドのヘルプを表示 | - |
| `-V, --version` | バージョン番号を出力 | - |

## 出力形式

アイコンは以下の命名規則で保存されます：
- `{都道府県コード}_{ローマ字名}.png` (例: `13_Tokyo.png`, `27_Osaka.png`)

## データソース

ツールは以下の日本の都道府県境界データを自動的にダウンロードします：

- [`dataofjapan/land`](https://github.com/dataofjapan/land) リポジトリ - japan.geojson（国土地理院 地球地図日本 http://www.gsi.go.jp/kankyochiri/gm_jpn.html に掲載されているShapefileから変換）

データはメモリ内で処理され、ローカルキャッシュは作成されないため、常に最新の境界情報を確保します。

## 特別な機能

### 東京都の本土フィルタリング

東京都には多くの離島（伊豆諸島、小笠原諸島）が含まれています。ツールは自動的にこれらを除外し、アイコンの視認性を向上させるために本土の東京エリアのみを表示します。

### 鹿児島県の本土フィルタリング

鹿児島県には多数の離島（種子島、屋久島、奄美諸島など）が含まれています。ツールは自動的にこれらを除外し、アイコンの視認性を向上させるために本土部分（薩摩半島・大隅半島）のみを表示します。

### テキストの縁取り

すべての都道府県名テキストには境界線色を使用した細い縁取りが含まれており、どんな背景でも最適な視認性を確保しつつ、クリーンな視覚的外観を維持します。

### 透明背景

生成されるすべてのアイコンは透明背景を持ち、どんな背景色やデザインでも使用できます。

### 高品質レンダリング

アイコンはPuppeteerを使用したSVG-to-PNG変換で生成され、どんなサイズでも高品質なアンチエイリアス出力を保証します。

## 都道府県コード

標準的なJIS都道府県コード（1-47）：
- 1: 北海道 - 13: 東京都 - 27: 大阪府 - 47: 沖縄県

## 依存関係

- `@turf/turf` - 地理空間解析とジオメトリ操作
- `canvas` - サーバーサイドキャンバスレンダリング
- `commander` - CLI引数解析
- `fs-extra` - 拡張ファイルシステム操作
- `puppeteer` - SVGからPNGへの変換

## 開発

```bash
# リポジトリをクローン
git clone https://github.com/champierre/jp-pref-icons.git
cd jp-pref-icons

# 依存関係をインストール
npm install

# テスト用にアイコンを生成
npx jp-pref-icons --prefecture "東京都" --lw 0.5

# 全都道府県を生成
npx jp-pref-icons
```

## ライセンス

MIT

## クレジット

日本の都道府県境界データを使用して構築されています：
- [`dataofjapan/land`](https://github.com/dataofjapan/land) リポジトリ - japan.geojson
- 元データ: 国土地理院 地球地図日本 ( http://www.gsi.go.jp/kankyochiri/gm_jpn.html ) に掲載されているShapefile