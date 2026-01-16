/**
 * ================================================================================
 * JokeAPI - ランダムジョーク取得 + MyMemory翻訳API
 * ================================================================================
 *
 * 【JokeAPI 概要】
 * - API名: JokeAPI v2
 * - 提供元: Sv443 (https://v2.jokeapi.dev/)
 * - 認証: 不要（完全無料）
 * - 料金: 無料
 * - 制限: 120リクエスト/分
 *
 * 【使用エンドポイント】
 * URL: https://v2.jokeapi.dev/joke/{category}
 * メソッド: GET
 *
 * 【カテゴリ一覧】
 * - Programming: プログラミング関連のジョーク
 * - Misc: その他のジョーク
 * - Dark: ダークユーモア（要注意）
 * - Pun: 駄洒落
 * - Spooky: ホラー系
 * - Christmas: クリスマス関連
 * - Any: ランダム
 *
 * 【リクエストパラメータ】
 * - safe-mode: 不適切なジョークを除外
 * - lang: 言語（現状英語のみ対応が多い）
 * - type: "single"（一発ネタ）or "twopart"（問答形式）
 *
 * 【レスポンス例 - single type】
 * {
 *   "type": "single",
 *   "joke": "Why do programmers...",
 *   "category": "Programming"
 * }
 *
 * 【   スポンス例 - twopart type】
 * {
 *   "type": "twopart",
 *   "setup": "Why do programmers prefer dark mode?",
 *   "delivery": "Because light attracts bugs.",
 *   "category": "Programming"
 * }
 *
 * ================================================================================
 *
 * 【MyMemory Translation API 概要】
 * - API名: MyMemory Translation API
 * - 提供元: MyMemory (https://mymemory.translated.net/)
 * - 認証: 不要（匿名利用可）
 * - 料金: 無料（1日1000語まで）
 *        ※ メールアドレス登録で10,000語/日
 * - 制限: 500文字/リクエスト
 *
 * 【使用エンドポイント】
 * URL: https://api.mymemory.translated.net/get
 * メソッド: GET
 *
 * 【リクエストパラメータ】
 * - q: 翻訳するテキスト
 * - langpair: 言語ペア（例: "en|ja" = 英語→日本語）
 *
 * 【対応言語ペアの例】
 * - en|ja: 英語→日本語
 * - ja|en: 日本語→英語
 * - en|es: 英語→スペイン語
 * - en|fr: 英語→フランス語
 *
 * 【レスポンス例】
 * {
 *   "responseStatus": 200,
 *   "responseData": {
 *     "translatedText": "翻訳されたテキスト"
 *   }
 * }
 *
 * ================================================================================
 */

/**
 * テキストを日本語に翻訳する関数
 *
 * @param {string} text - 翻訳する英語テキスト
 * @returns {Promise<string>} - 翻訳された日本語テキスト
 *
 * 【処理フロー】
 * 1. MyMemory APIにリクエスト
 * 2. 成功時は翻訳テキストを返す
 * 3. 失敗時は元のテキストをそのまま返す（フォールバック）
 */
async function translateToJapanese(text) {
  try {
    // MyMemory APIにリクエスト
    // langpair=en|ja で英語から日本語への翻訳を指定
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`)

    const data = await response.json()

    // レスポンスステータスが200の場合、翻訳成功
    if (data.responseStatus === 200) {
      return data.responseData.translatedText
    }

    // 翻訳失敗時は原文を返す
    return text
  } catch {
    // エラー時も原文を返す（ユーザー体験を損なわないため）
    return text
  }
}

/**
 * ランダムなジョークを取得して表示するメイン関数
 *
 * 【処理フロー】
 * 1. JokeAPIからジョークを取得
 * 2. ジョークのタイプ（single/twopart）を判定
 * 3. MyMemory APIで日本語に翻訳
 * 4. 英語原文と日本語訳を画面に表示
 *
 * 【ジョークのタイプ】
 * - single: 一発ネタ（joke プロパティのみ）
 * - twopart: 問答形式（setup + delivery）
 */
async function getJoke() {
  const resultBox = document.getElementById("joke-result")

  // ステップ1: ローディング表示
  resultBox.innerHTML = '<p class="loading">ジョークを取得中...</p>'

  try {
    // ステップ2: JokeAPIにリクエスト
    // Programming,Misc: プログラミング系とその他からランダム取得
    // safe-mode: 不適切な内容を除外
    const response = await fetch("https://v2.jokeapi.dev/joke/Programming,Misc?safe-mode")

    if (!response.ok) {
      throw new Error("ジョークの取得に失敗しました")
    }

    const data = await response.json()

    // APIがエラーを返した場合
    if (data.error) {
      throw new Error("ジョークが見つかりませんでした")
    }

    // ステップ3: 翻訳中の表示
    resultBox.innerHTML = '<p class="loading">日本語に翻訳中...</p>'

    // ステップ4: ジョークタイプに応じた処理
    if (data.type === "single") {
      // 一発ネタの場合
      const jokeJa = await translateToJapanese(data.joke)

      resultBox.innerHTML = `
                <div class="joke-text">
                    <p class="joke-setup">${data.joke}</p>
                    <p class="joke-japanese">🇯🇵 ${jokeJa}</p>
                </div>
            `
    } else {
      // 問答形式（twopart）の場合
      // setup（ボケ/前振り）とdelivery（オチ）を別々に翻訳
      const setupJa = await translateToJapanese(data.setup)
      const deliveryJa = await translateToJapanese(data.delivery)

      resultBox.innerHTML = `
                <div class="joke-text">
                    <p class="joke-setup">${data.setup}</p>
                    <p class="joke-japanese">🇯🇵 ${setupJa}</p>
                    <p class="joke-delivery">${data.delivery}</p>
                    <p class="joke-japanese">🇯🇵 ${deliveryJa}</p>
                </div>
            `
    }
  } catch (error) {
    resultBox.innerHTML = `<p class="error">${error.message}</p>`
  }
}

/**
 * 【応用例】特定カテゴリのジョークのみ取得
 *
 * async function getProgrammingJoke() {
 *     const response = await fetch(
 *         'https://v2.jokeapi.dev/joke/Programming?safe-mode&type=twopart'
 *     );
 *     return await response.json();
 * }
 */

/**
 * 【応用例】複数のジョークを一度に取得
 *
 * async function getMultipleJokes(count) {
 *     const response = await fetch(
 *         `https://v2.jokeapi.dev/joke/Any?safe-mode&amount=${count}`
 *     );
 *     const data = await response.json();
 *     return data.jokes; // 配列で返される
 * }
 */
