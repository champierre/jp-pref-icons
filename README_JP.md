# jp-pref-icons

日本の都道府県のアイコン画像を、公式の政府データを使用して生成するツールです。国土地理院などの公式ソースから最新の境界データを自動的にダウンロードし、高品質なPNGアイコンを作成できます。

## 特徴

- 🗾 **公式データ**: 国土地理院のデータに基づく都道府県境界の自動ダウンロード
- 🎨 **カスタマイズ可能**: 色、サイズ、境界線スタイルの調整が可能
- 🌍 **スマートフィルタリング**: 東京都は本土のみ表示（離島を除外して視認性を向上）
- 🔤 **柔軟なテキスト**: 都道府県名の表示・非表示を選択可能
- 📁 **複数フォーマット**: 透明背景のPNGとSVG出力
- 🎯 **選択的生成**: 名前やコードで特定の都道府県を指定可能
- 🖥️ **簡単CLI**: シンプルなコマンドライン操作

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
  size: 1024,                    // アイコンサイズ（ピクセル）
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
| `--size <number>` | アイコンサイズ（ピクセル、正方形） | `1024` |
| `--lw <number>` | 線の太さ | `2.0` |
| `--face <color>` | 塗りつぶし色 | `#0E7A6F` |
| `--edge <color>` | 境界線色 | `#0A5A52` |
| `--text <color>` | テキスト色 | `#FFFFFF` |
| `--svg` | SVGファイルも生成 | `false` |
| `--prefecture <names>` | 指定した都道府県のみ生成 | 全都道府県 |
| `--hide-text` | テキストラベルなしでアイコン生成 | `false` |

## 出力形式

アイコンは以下の命名規則で保存されます：
- `{都道府県コード}_{ローマ字名}.png` (例: `13_Tokyo.png`, `27_Osaka.png`)

## データソース

ツールは以下の公式日本の都道府県境界データを自動的にダウンロードします：

- **メイン**: `dataofjapan/land` リポジトリ（国土地理院データに基づく）
- **フォールバック**: `smartnews-smri/japan-topography`（代替高品質ソース）

データはメモリ内で処理され、ローカルキャッシュは作成されないため、常に最新の公式境界情報を確保します。

## 特別な機能

### 東京都の本土フィルタリング

東京都には多くの離島（伊豆諸島、小笠原諸島）が含まれています。ツールは自動的にこれらを除外し、アイコンの視認性を向上させるために本土の東京エリアのみを表示します。

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

国土地理院の公式日本政府境界データを使用して構築されています。