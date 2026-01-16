/**
 * ================================================================================
 * OpenWeatherMap API - 天気情報取得
 * ================================================================================
 *
 * 【API概要】
 * - API名: OpenWeatherMap Current Weather Data API
 * - 提供元: OpenWeather Ltd (https://openweathermap.org/)
 * - 認証: APIキー必要（無料プランあり）
 * - 料金: 無料プラン: 1,000回/日、60回/分まで
 *
 * 【APIキー取得方法】
 * 1. https://openweathermap.org/ にアクセス
 * 2. 「Sign In」→「Create an Account」で無料アカウント作成
 * 3. ログイン後、「API keys」タブでキーを確認（自動生成済み）
 * 4. 新規作成する場合は「Generate」ボタンをクリック
 * ※ 新規キーは有効化まで最大2時間かかる場合あり
 *
 * 【使用エンドポイント】
 * URL: https://api.openweathermap.org/data/2.5/weather
 * メソッド: GET
 *
 * 【リクエストパラメータ】
 * - q: 都市名（例: "Tokyo", "London"）
 * - appid: APIキー（必須）
 * - units: 温度単位 ("metric"=摂氏, "imperial"=華氏, 省略時=ケルビン)
 * - lang: 言語コード ("ja"=日本語で天気説明を取得)
 *
 * 【レスポンス例】
 * {
 *   "name": "Tokyo",           // 都市名
 *   "sys": { "country": "JP" }, // 国コード
 *   "main": {
 *     "temp": 25.5,            // 気温（units=metricの場合は摂氏）
 *     "humidity": 60,          // 湿度（%）
 *     "pressure": 1013         // 気圧（hPa）
 *   },
 *   "weather": [{
 *     "description": "晴れ",   // 天気の説明（lang=jaで日本語）
 *     "icon": "01d"            // 天気アイコンコード
 *   }],
 *   "wind": { "speed": 3.5 }   // 風速（m/s）
 * }
 *
 * 【アイコンURL】
 * https://openweathermap.org/img/wn/{icon}@2x.png
 * 例: https://openweathermap.org/img/wn/01d@2x.png
 *
 * 【エラーハンドリング】
 * - 404: 都市が見つからない
 * - 401: APIキーが無効
 * - 429: レート制限超過
 *
 * ================================================================================
 */

// APIキーの設定
// ※ 取得したAPIキーをダブルクォーテーションで囲んで設定してください
// 例: const WEATHER_API_KEY = "abc123def456ghi789"
const WEATHER_API_KEY = "YOUR_API_KEY_HERE"

/**
 * 天気情報を取得するメイン関数
 *
 * 【処理フロー】
 * 1. 入力フィールドから都市名を取得
 * 2. バリデーション（空欄チェック、APIキーチェック）
 * 3. OpenWeatherMap APIにリクエスト送信
 * 4. レスポンスを解析して画面に表示
 */
async function getWeather() {
  // ステップ1: DOM要素から入力値を取得
  const city = document.getElementById("city").value.trim()
  const resultBox = document.getElementById("weather-result")

  // ステップ2: 入力バリデーション
  if (!city) {
    resultBox.innerHTML = '<p class="error">都市名を入力してください</p>'
    return
  }

  // ステップ3: APIキーの設定確認
  if (WEATHER_API_KEY === "YOUR_API_KEY_HERE") {
    resultBox.innerHTML =
      '<p class="error">weather.js の WEATHER_API_KEY にAPIキーを設定してください<br>APIキーは openweathermap.org で無料で取得できます</p>'
    return
  }

  // ステップ4: ローディング表示
  resultBox.innerHTML = '<p class="loading">読み込み中...</p>'

  try {
    // ステップ5: fetch APIでHTTPリクエストを送信
    // encodeURIComponent: 日本語などの特殊文字をURLエンコード
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=ja`,
    )

    // ステップ6: HTTPステータスコードによるエラー処理
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("都市が見つかりませんでした")
      } else if (response.status === 401) {
        throw new Error("APIキーが無効です")
      }
      throw new Error("天気情報の取得に失敗しました")
    }

    // ステップ7: JSONレスポンスをパース
    const data = await response.json()

    // ステップ8: 表示関数を呼び出し
    displayWeather(data)
  } catch (error) {
    // エラー時の表示
    resultBox.innerHTML = `<p class="error">${error.message}</p>`
  }
}

/**
 * 天気情報を画面に表示する関数
 *
 * @param {Object} data - OpenWeatherMap APIからのレスポンスデータ
 *
 * 【表示項目】
 * - 都市名と国コード
 * - 天気アイコン
 * - 気温（摂氏、小数点以下四捨五入）
 * - 天気の説明（日本語）
 * - 詳細情報（湿度、風速、気圧）
 */
function displayWeather(data) {
  const resultBox = document.getElementById("weather-result")

  // アイコンコードからアイコンURLを生成
  // @2xを付けることで高解像度版（2倍サイズ）を取得
  const iconCode = data.weather[0].icon
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  // テンプレートリテラルでHTMLを生成
  resultBox.innerHTML = `
        <div class="weather-info">
            <p class="city-name">${data.name}, ${data.sys.country}</p>
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
            <p class="temp">${Math.round(data.main.temp)}°C</p>
            <p class="description">${data.weather[0].description}</p>
            <div class="details">
                <span>湿度: ${data.main.humidity}%</span>
                <span>風速: ${data.wind.speed} m/s</span>
                <span>気圧: ${data.main.pressure} hPa</span>
            </div>
        </div>
    `
}
