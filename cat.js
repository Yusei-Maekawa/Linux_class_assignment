/**
 * ================================================================================
 * The Cat API - ランダム猫画像取得
 * ================================================================================
 *
 * 【API概要】
 * - API名: The Cat API
 * - 提供元: TheCatAPI.com (https://thecatapi.com/)
 * - 認証: 不要（APIキーなしで利用可能）
 *         ※ APIキーを使うと追加機能（お気に入り、投票等）が使える
 * - 料金: 無料（商用利用も可）
 * - 制限: APIキーなし: 10リクエスト/分
 *        APIキーあり: 制限緩和
 *
 * 【使用エンドポイント】
 * URL: https://api.thecatapi.com/v1/images/search
 * メソッド: GET
 *
 * 【リクエストパラメータ】（すべてオプション）
 * - limit: 取得する画像数（デフォルト: 1、最大: 10）
 * - size: 画像サイズ ("full", "med", "small", "thumb")
 * - mime_types: 画像形式 ("jpg", "png", "gif")
 * - breed_ids: 品種ID（特定の猫種のみ取得）
 *
 * 【レスポンス例】
 * [
 *   {
 *     "id": "abc123",           // 画像の一意ID
 *     "url": "https://...",     // 画像URL
 *     "width": 1200,            // 画像幅
 *     "height": 800             // 画像高さ
 *   }
 * ]
 *
 * 【特徴】
 * - 認証不要で最もシンプルに使えるAPI
 * - 毎回ランダムな猫画像が返される
 * - GIF画像（動く猫）も取得可能
 *
 * 【類似API】
 * - The Dog API (https://thedogapi.com/) - 同じ構造で犬画像
 * - Random Fox API - 狐画像
 *
 * ================================================================================
 */

/**
 * ランダムな猫画像を取得するメイン関数
 *
 * 【処理フロー】
 * 1. The Cat APIにGETリクエストを送信
 * 2. レスポンスから画像URLを取得
 * 3. 画像を画面に表示
 *
 * 【使用技術】
 * - fetch API: ブラウザ標準のHTTPリクエスト機能
 * - async/await: 非同期処理を同期的に記述
 * - try/catch: エラーハンドリング
 */
async function getCatImage() {
  // 結果表示用のDOM要素を取得
  const resultBox = document.getElementById("cat-result")

  // ステップ1: ローディング表示
  resultBox.innerHTML = '<p class="loading">猫を探しています...</p>'

  try {
    // ステップ2: fetch APIでHTTPリクエストを送信
    // パラメータなしでGETリクエスト → ランダムな猫画像1枚が返る
    const response = await fetch("https://api.thecatapi.com/v1/images/search")

    // ステップ3: HTTPステータスチェック
    // response.ok: ステータスコードが200-299の場合true
    if (!response.ok) {
      throw new Error("画像の取得に失敗しました")
    }

    // ステップ4: JSONレスポンスをパース
    // APIは配列形式で返すため、data[0]で最初の要素にアクセス
    const data = await response.json()

    // ステップ5: データ存在チェックと画像表示
    if (data && data.length > 0) {
      // data[0].url に画像のURLが含まれている
      resultBox.innerHTML = `<img src="${data[0].url}" alt="ランダムな猫" class="cat-image">`
    } else {
      throw new Error("画像が見つかりませんでした")
    }
  } catch (error) {
    // エラー時の表示
    resultBox.innerHTML = `<p class="error">${error.message}</p>`
  }
}

/**
 * 【応用例】特定の品種の猫を取得する場合
 *
 * async function getCatByBreed(breedId) {
 *     const response = await fetch(
 *         `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
 *     );
 *     const data = await response.json();
 *     return data[0];
 * }
 *
 * 品種IDの例:
 * - "beng": ベンガル
 * - "siam": シャム
 * - "pers": ペルシャ
 * - "ragd": ラグドール
 * - "munc": マンチカン
 */

/**
 * 【応用例】GIF画像のみ取得する場合
 *
 * async function getCatGif() {
 *     const response = await fetch(
 *         'https://api.thecatapi.com/v1/images/search?mime_types=gif'
 *     );
 *     const data = await response.json();
 *     return data[0];
 * }
 */
