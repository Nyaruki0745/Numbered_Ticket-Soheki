/**
 * 整理券システム 設定ファイル
 * このファイルは管理画面（admin.html）から自動更新されます。
 * 手動編集も可能ですが、管理画面での変更で上書きされます。
 */

const CONFIG = {

  GAS_URL: "https://script.google.com/macros/s/AKfycbz8WeAE2qiI1Ibshfj2CEDu9Hh-0twm_gf0FKOPPM3dyBwjBak5ATBBbPCXX2eFuYcFdw/exec",

  GITHUB_OWNER: "Nyaruki0745",
  GITHUB_REPO:  "Numbered_Ticket-Soheki",
  GITHUB_PATH:  "config.js",
  GITHUB_BRANCH: "main",

  SHEETS: [
    {
      sheetName: "DebugB",
      code: "XB1",
      label: "B組デバッグ用シート",
      expireAfterMinutes: 5
    },
    {
      sheetName: "DebugC",
      code: "XC1",
      label: "C組デバッグ用シート",
      expireAfterMinutes: 5
    }
  ],

  CALL_BEFORE_MINUTES: 0,
  POLL_INTERVAL_MS: 15000,

  EXPIRE_AFTER_MINUTES: 0,

  QR_MODE: "number",
  COMMON_QR_VALUE: "SEIRIKEN_CHECK",

  STATUSES: {
    reserved: { label: "予約済", color: "status-reserved" },
    calling: { label: "呼出中", color: "status-calling" },
    received: { label: "受付済", color: "status-received" },
    entered: { label: "入場済", color: "status-entered" },
    absent: { label: "不在", color: "status-absent" },
    expired: { label: "失効", color: "status-expired" }
  },

  APP_TITLE: "整理券システム",
  MONITOR_TITLE: "呼出モニター",
  ADMIN_TITLE: "管理画面"
};
