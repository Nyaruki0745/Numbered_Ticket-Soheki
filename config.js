/**
 * 整理券システム 設定ファイル
 * このファイルは管理画面（admin.html）から自動更新されます。
 * 手動編集も可能ですが、管理画面での変更で上書きされます。
 */

const CONFIG = {

  // -------------------------------------------------------
  // GAS Web App エンドポイント
  // -------------------------------------------------------
  GAS_URL: "https://script.google.com/macros/s/AKfycbxp_CdFPXLqJ5rz696dtREYIC_Mu341Wz9gDAVpHUjEJUXdu-oBNEJbd4ASGVICbKgM8Q/exec",

  // -------------------------------------------------------
  // GitHub リポジトリ情報（管理画面からconfig.jsを自動更新するために使用）
  // owner: GitHubユーザー名
  // repo:  リポジトリ名
  // path:  config.jsのリポジトリ内パス（通常は "config.js"）
  // branch: ブランチ名（通常は "main"）
  // -------------------------------------------------------
  GITHUB_OWNER: "Nyaruki0745",
  GITHUB_REPO:  "Numbered_Ticket-Soheki",
  GITHUB_PATH:  "config.js",
  GITHUB_BRANCH: "main",

  // -------------------------------------------------------
  // シート設定
  // sheetName:          スプレッドシートのシート名（認証キーも兼ねる）
  // code:               整理番号の先頭3桁（他シートと重複不可・英数字）
  // label:              UI上の表示名
  // callBeforeMinutes:  （省略可）このシート専用の呼出タイミング（分）
  // expireAfterMinutes: （省略可）このシート専用の失効タイミング（分）
  // autoAbsentEnabled:  （省略可・true/false）終了時間〜失効時間の間、
  //                      呼出中(calling)を自動で不在(absent)にするか
  //
  // ※ パスワードはGASのスクリプトプロパティ「PASSWORDS」に保管
  // -------------------------------------------------------
  SHEETS: [
    {
      sheetName: "1日目_2組",
      code: "A01",
      label: "1日目 2組"
    },
    {
      sheetName: "1日目_3組",
      code: "B02",
      label: "1日目 3組"
    },
    {
      sheetName: "2日目_2組",
      code: "C03",
      label: "2日目 2組"
    }
  ],

  // -------------------------------------------------------
  // 呼出設定（グローバルデフォルト）
  // シートごとに callBeforeMinutes で上書き可能
  // -------------------------------------------------------
  CALL_BEFORE_MINUTES: 0,
  POLL_INTERVAL_MS: 15000,

  // -------------------------------------------------------
  // 失効設定（グローバルデフォルト）
  // シートごとに expireAfterMinutes で上書き可能
  // -------------------------------------------------------
  EXPIRE_AFTER_MINUTES: 0,

  // -------------------------------------------------------
  // QRコード設定
  // QR_MODE: "number" = QRの内容が整理番号そのもの
  //          "common" = QR共通・番号は口頭/手入力で確認
  // -------------------------------------------------------
  QR_MODE: "number",
  COMMON_QR_VALUE: "SEIRIKEN_CHECK",

  // -------------------------------------------------------
  // ステータス定義（表示名・色クラス）
  // -------------------------------------------------------
  STATUSES: {
    reserved:  { label: "予約済",  color: "status-reserved"  },
    calling:   { label: "呼出中",  color: "status-calling"   },
    received:  { label: "受付済",  color: "status-received"  },
    entered:   { label: "入場済",  color: "status-entered"   },
    absent:    { label: "不在",    color: "status-absent"    },
    expired:   { label: "失効",    color: "status-expired"   }
  },

  // -------------------------------------------------------
  // UI設定
  // -------------------------------------------------------
  APP_TITLE: "整理券システム",
  MONITOR_TITLE: "呼出モニター",
  ADMIN_TITLE: "管理画面"
};
