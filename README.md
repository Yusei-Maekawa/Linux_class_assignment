# Web API サンプルサイト

Linux サーバ構築演習 課題9 - Web API を使った Web アプリケーション

## 概要

このサイトでは4つの異なる Web API を使用して、API の基本的な使い方を学習できます。

## ファイル構成

```
.
├── index.html      # メインHTML（ページ構造）
├── style.css       # スタイルシート
├── weather.js      # 天気API（OpenWeatherMap）
├── pokemon.js      # ポケモンAPI（PokéAPI）
├── cat.js          # 猫画像API（The Cat API）
├── joke.js         # ジョークAPI（JokeAPI）+ 翻訳API（MyMemory）
└── README.md       # このファイル
```

## 使用API一覧

### 1. OpenWeatherMap API（天気情報）

| 項目 | 内容 |
|------|------|
| 公式サイト | https://openweathermap.org/ |
| 認証 | **APIキー必要** |
| 料金 | 無料プラン: 1,000回/日 |
| エンドポイント | `https://api.openweathermap.org/data/2.5/weather` |

#### APIキー取得手順
1. https://openweathermap.org/ にアクセス
2. 「Sign In」→「Create an Account」で無料アカウント作成
3. ログイン後、「API keys」タブでキーを確認
4. `weather.js` の `WEATHER_API_KEY` に設定

```javascript
const WEATHER_API_KEY = "あなたのAPIキー";
```

---

### 2. PokéAPI（ポケモン情報）

| 項目 | 内容 |
|------|------|
| 公式サイト | https://pokeapi.co/ |
| 認証 | **不要** |
| 料金 | 完全無料 |
| エンドポイント | `https://pokeapi.co/api/v2/pokemon/{name}` |

#### 特徴
- 認証不要で即座に利用可能
- 日本語名での検索に対応（主要ポケモンのみ）
- 種族情報APIで正式な日本語名を取得

---

### 3. The Cat API（猫画像）

| 項目 | 内容 |
|------|------|
| 公式サイト | https://thecatapi.com/ |
| 認証 | **不要** |
| 料金 | 無料 |
| エンドポイント | `https://api.thecatapi.com/v1/images/search` |

#### 特徴
- 最もシンプルなAPI（認証不要、パラメータ不要）
- 毎回ランダムな猫画像が返される
- 1リクエストで完結

---

### 4. JokeAPI + MyMemory翻訳API

| 項目 | JokeAPI | MyMemory |
|------|---------|----------|
| 公式サイト | https://v2.jokeapi.dev/ | https://mymemory.translated.net/ |
| 認証 | **不要** | **不要** |
| 料金 | 無料 | 無料（1日1000語） |
| エン���ポイント | `https://v2.jokeapi.dev/joke/{category}` | `https://api.mymemory.translated.net/get` |

#### 特徴
- 2つのAPIを組み合わせて使用
- JokeAPIで英語のジョークを取得
- MyMemory APIで日本語に翻訳

---

## 技術解説

### fetch API

現代のブラウザに標準搭載されているHTTPリクエスト機能です。

```javascript
// 基本的な使い方
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

### async/await

非同期処理を同期的なコードのように書ける構文です。

```javascript
// async関数の中でawaitを使用
async function getData() {
    const response = await fetch(url);  // 完了まで待機
    const data = await response.json(); // 完了まで待機
    return data;
}
```

### エラーハンドリング

try-catch文でエラーを適切に処理します。

```javascript
try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('エラーが発生しました');
    }
    const data = await response.json();
} catch (error) {
    console.error(error.message);
}
```

---

## セットアップ手順

### 1. ファイルをサーバーに配置

```bash
# 例: Apacheの場合
sudo cp -r * /var/www/html/
```

### 2. OpenWeatherMap APIキーを設定

`weather.js` を編集:
```javascript
const WEATHER_API_KEY = "取得したAPIキー";
```

### 3. ブラウザでアクセス

```
http://サーバーのIPアドレス/
```

---

## トラブルシューティング

### 天気が取得できない
- APIキーが正しく設定されているか確認
- APIキーは発行後、有効化まで最大2時間かかる場合あり

### ポケモンが見つからない
- 日本語名は主要ポケモンのみ対応
- 英語名または図鑑番号（1-1008）で検索可能

### CORSエラーが発生する
- ブラウザから直接APIにアクセスする場合、一部APIでCORSエラーが発生することがある
- 本サイトで使用しているAPIはすべてCORS対応済み

---

## 参考リンク

- [MDN - Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)
- [MDN - async/await](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Asynchronous/Promises)
- [OpenWeatherMap ドキュメント](https://openweathermap.org/api)
- [PokéAPI ドキュメント](https://pokeapi.co/docs/v2)

---

## 作成者

前川 雄世  
Linux サーバ構築演習 課題10
