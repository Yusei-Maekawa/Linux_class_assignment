/**
 * ================================================================================
 * PokéAPI - ポケモン情報取得
 * ================================================================================
 *
 * 【API概要】
 * - API名: PokéAPI (RESTful Pokémon API)
 * - 提供元: PokéAPI Team (https://pokeapi.co/)
 * - 認証: 不要（完全無料・オープンソース）
 * - 料金: 完全無料（商用利用可）
 * - 制限: 1IPあたり100リクエスト/分（キャッシュ推奨）
 *
 * 【使用エンドポイント】
 * 1. ポケモン基本情報: https://pokeapi.co/api/v2/pokemon/{name or id}
 * 2. ポケモン種族情報: https://pokeapi.co/api/v2/pokemon-species/{id}
 *    ※ 日本語名を取得するために種族情報も取得
 *
 * 【リクエスト方法】
 * - 英語名で検索: /pokemon/pikachu
 * - 図鑑番号で検索: /pokemon/25
 * - メソッド: GET
 *
 * 【ポケモン基本情報レスポンス例】(/pokemon/25)
 * {
 *   "id": 25,                  // 図鑑番号
 *   "name": "pikachu",         // 英語名
 *   "height": 4,               // 高さ（デシメートル単位）→ 10で割ってメートル
 *   "weight": 60,              // 重さ（ヘクトグラム単位）→ 10で割ってキログラム
 *   "sprites": {
 *     "front_default": "..."   // 正面画像URL
 *   },
 *   "types": [{                // タイプ情報
 *     "type": { "name": "electric" }
 *   }],
 *   "stats": [{                // ステータス情報
 *     "base_stat": 35,
 *     "stat": { "name": "hp" }
 *   }],
 *   "species": {               // 種族情報へのリンク
 *     "url": "https://pokeapi.co/api/v2/pokemon-species/25/"
 *   }
 * }
 *
 * 【種族情報レスポンス例】(/pokemon-species/25)
 * {
 *   "names": [
 *     { "language": { "name": "ja" }, "name": "ピカチュウ" },
 *     { "language": { "name": "en" }, "name": "Pikachu" }
 *   ]
 * }
 *
 * 【日本語対応について】
 * PokéAPIは英語名/番号でのみ検索可能なため、
 * 日本語名→英語名の変換辞書（pokemonNameMap）を用意
 *
 * ================================================================================
 */

/**
 * 日本語ポケモン名 → 英語名 変換辞書
 *
 * PokéAPIは英語名でしか検索できないため、
 * 主要なポケモンの日本語名から英語名への変換テーブルを用意
 *
 * 使用例: pokemonNameMap["ピカチュウ"] → "pikachu"
 */
const pokemonNameMap = {
  // ===== 第1世代（カントー地方）御三家 =====
  フシギダネ: "bulbasaur", // #001 くさ/どく
  フシギソウ: "ivysaur", // #002
  フシギバナ: "venusaur", // #003
  ヒトカゲ: "charmander", // #004 ほのお
  リザード: "charmeleon", // #005
  リザードン: "charizard", // #006 ほのお/ひこう
  ゼニガメ: "squirtle", // #007 みず
  カメール: "wartortle", // #008
  カメックス: "blastoise", // #009

  // ===== 人気ポケモン =====
  ピカチュウ: "pikachu", // #025 でんき
  ライチュウ: "raichu", // #026
  ピチュー: "pichu", // #172（第2世代）

  // ===== イーブイ系統（ブイズ） =====
  イーブイ: "eevee", // #133 ノーマル
  シャワーズ: "vaporeon", // #134 みず
  サンダース: "jolteon", // #135 でんき
  ブースター: "flareon", // #136 ほのお
  エーフィ: "espeon", // #196 エスパー（第2世代）
  ブラッキー: "umbreon", // #197 あく（第2世代）
  リーフィア: "leafeon", // #470 くさ（第4世代）
  グレイシア: "glaceon", // #471 こおり（第4世代）
  ニンフィア: "sylveon", // #700 フェアリー（第6世代）

  // ===== 伝説・幻のポケモン =====
  ミュウ: "mew", // #151 幻
  ミュウツー: "mewtwo", // #150 伝説
  ルギア: "lugia", // #249 伝説
  ホウオウ: "ho-oh", // #250 伝説
  レックウザ: "rayquaza", // #384 伝説
  ディアルガ: "dialga", // #483 伝説
  パルキア: "palkia", // #484 伝説
  ギラティナ: "giratina", // #487 伝説
  ゼクロム: "zekrom", // #644 伝説
  レシラム: "reshiram", // #643 伝説
  ゼルネアス: "xerneas", // #716 伝説
  イベルタル: "yveltal", // #717 伝説
  ソルガレオ: "solgaleo", // #791 伝説
  ルナアーラ: "lunala", // #792 伝説
  ザシアン: "zacian", // #888 伝説
  ザマゼンタ: "zamazenta", // #889 伝説
  コライドン: "koraidon", // #1007 伝説
  ミライドン: "miraidon", // #1008 伝説

  // ===== その他人気ポケモン =====
  カビゴン: "snorlax", // #143
  ゲンガー: "gengar", // #094
  ギャラドス: "gyarados", // #130
  ラプラス: "lapras", // #131
  プリン: "jigglypuff", // #039
  カイリュー: "dragonite", // #149
  ルカリオ: "lucario", // #448
  ガブリアス: "garchomp", // #445
  ゲッコウガ: "greninja", // #658
}

/**
 * ポケモンタイプ名 英語 → 日本語 変換辞書
 *
 * APIから取得したタイプ名を日本語で表示するために使用
 */
const typeNameJapanese = {
  normal: "ノーマル",
  fire: "ほのお",
  water: "みず",
  electric: "でんき",
  grass: "くさ",
  ice: "こおり",
  fighting: "かくとう",
  poison: "どく",
  ground: "じめん",
  flying: "ひこう",
  psychic: "エスパー",
  bug: "むし",
  rock: "いわ",
  ghost: "ゴースト",
  dragon: "ドラゴン",
  dark: "あく",
  steel: "はがね",
  fairy: "フェアリー",
}

/**
 * ポケモン情報を取得するメイン関数
 *
 * 【処理フロー】
 * 1. 入力フィールドからポケモン名/番号を取得
 * 2. 日本語名の場合は英語名に変換
 * 3. PokéAPI（ポケモン基本情報）にリクエスト
 * 4. 種族情報APIで日本語名を取得
 * 5. 画面に結果を表示
 */
async function getPokemon() {
  // ステップ1: DOM要素から入力値を取得
  const pokemon = document.getElementById("pokemon").value.trim()
  const resultBox = document.getElementById("pokemon-result")

  // ステップ2: 入力バリデーション
  if (!pokemon) {
    resultBox.innerHTML = '<p class="error">ポケモン名または番号を入力してください</p>'
    return
  }

  // ステップ3: 日本語名→英語名の変換
  // 辞書にない場合はそのまま小文字化して使用（英語名または番号として扱う）
  const pokemonLower = pokemon.toLowerCase()
  const englishName = pokemonNameMap[pokemon] || pokemonLower

  // ステップ4: ローディング表示
  resultBox.innerHTML = '<p class="loading">読み込み中...</p>'

  try {
    // ステップ5: ポケモン基本情報APIにリクエスト
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(englishName)}`)

    // ステップ6: エラーハンドリング
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("ポケモンが見つかりませんでした（日本語名は一部のみ対応）")
      }
      throw new Error("データの取得に失敗しました")
    }

    // ステップ7: JSONレスポンスをパース
    const data = await response.json()

    // ステップ8: 種族情報APIで日本語名を取得
    // data.species.url には種族情報APIのURLが含まれている
    const speciesResponse = await fetch(data.species.url)
    const speciesData = await speciesResponse.json()

    // names配列から日本語（ja）のエントリを探す
    const japaneseName = speciesData.names.find((n) => n.language.name === "ja")?.name || data.name

    // ステップ9: 表示関数を呼び出し
    displayPokemon(data, japaneseName)
  } catch (error) {
    resultBox.innerHTML = `<p class="error">${error.message}</p>`
  }
}

/**
 * ポケモン情報を画面に表示する関数
 *
 * @param {Object} data - PokéAPIからのレスポンスデータ
 * @param {string} japaneseName - 日本語のポケモン名
 *
 * 【表示項目】
 * - ポケモン画像（スプライト）
 * - 日本語名、英語名、図鑑番号
 * - タイプ（カラーバッジ形式）
 * - 身長・体重
 * - 基礎ステータス（HP、攻撃、防御など）
 */
function displayPokemon(data, japaneseName) {
  const resultBox = document.getElementById("pokemon-result")

  // タイプごとの背景色定義（ゲームの公式配色に近い色）
  const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  }

  // タイプバッジのHTML生成
  // ポケモンは複数タイプを持つことがあるので、mapで全タイプを処理
  const typeBadges = data.types
    .map((t) => {
      const color = typeColors[t.type.name] || "#888"
      const jpType = typeNameJapanese[t.type.name] || t.type.name
      return `<span class="type-badge" style="background: ${color}">${jpType}</span>`
    })
    .join("")

  // ステータス名の日本語化辞書
  const statNameJapanese = {
    hp: "HP",
    attack: "こうげき",
    defense: "ぼうぎょ",
    "special-attack": "とくこう",
    "special-defense": "とくぼう",
    speed: "すばやさ",
  }

  // ステータス表示HTMLの生成（最初の6つを表示）
  const stats = data.stats
    .slice(0, 6)
    .map(
      (s) => `
        <div class="stat-item">
            <div class="stat-name">${statNameJapanese[s.stat.name] || s.stat.name}</div>
            <div class="stat-value">${s.base_stat}</div>
        </div>
    `,
    )
    .join("")

  // 最終的なHTML生成
  // height: デシメートル単位 → メートルに変換（÷10）
  // weight: ヘクトグラム単位 → キログラムに変換（÷10）
  resultBox.innerHTML = `
        <div class="pokemon-info">
            <img src="${data.sprites.front_default}" alt="${japaneseName}">
            <p class="pokemon-name">${japaneseName} <small>(${data.name})</small> #${data.id}</p>
            <div class="pokemon-types">${typeBadges}</div>
            <p>身長: ${data.height / 10}m / 体重: ${data.weight / 10}kg</p>
            <div class="stats">${stats}</div>
        </div>
    `
}
