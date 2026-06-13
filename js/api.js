/**
 * GAS API クライアント
 * すべてのGAS通信はこのモジュールを経由する
 *
 * 【案B 変更点】
 *   - _session から password フィールドを削除
 *   - パスワードはスタッフがログイン時に入力した値を
 *     _enteredPassword にのみ保持し、リクエストごとに送信
 *   - config.js の SHEETS に password は不要
 */

const API = (() => {

  // 認証セッション（タブ間で共有）
  // ※ password はここには保存しない
  let _session         = null;  // { sheetName, code, label }
  let _enteredPassword = null;  // スタッフが入力した4桁PW（メモリのみ・リロードで消える）

  // ---------- セッション管理 ----------

  function setSession(sheetObj, password) {
    _session         = { sheetName: sheetObj.sheetName, code: sheetObj.code, label: sheetObj.label };
    _enteredPassword = String(password);
  }

  function getSession() {
    return _session;
  }

  function clearSession() {
    _session         = null;
    _enteredPassword = null;
  }

  function hasSession() {
    return _session !== null;
  }

  // ---------- 共通リクエスト ----------

  async function request(action, params = {}) {
    if (!_session)         throw new Error("未ログインです");
    if (!_enteredPassword) throw new Error("パスワードが失われています。再ログインしてください");

    const payload = {
      action,
      sheetName : _session.sheetName,
      password  : _enteredPassword,
      ...params
    };

    const res = await fetch(CONFIG.GAS_URL, {
      method  : "POST",
      headers : { "Content-Type": "text/plain" },
      body    : JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "GASエラー");
    return data;
  }

  // ---------- 各API ----------

  /**
   * 認証確認（ログイン時に呼ぶ）
   * パスワードはGASのスクリプトプロパティで照合される
   */
  async function auth(sheetName, password) {
    const payload = { action: "auth", sheetName, password };
    const res = await fetch(CONFIG.GAS_URL, {
      method  : "POST",
      headers : { "Content-Type": "text/plain" },
      body    : JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "認証失敗");
    return data;
  }

  /**
   * 整理券登録
   * @param {number} count     - 人数
   * @param {string} startTime - "HH:MM"
   * @param {string} endTime   - "HH:MM"
   */
  async function register(count, startTime, endTime) {
    return request("register", {
      count,
      startTime,
      endTime,
      identCode          : _session.code,
      expireAfterMinutes : CONFIG.EXPIRE_AFTER_MINUTES,  // config.js から送信
    });
    // GASが返す: { success, ticketNumber, expireTime }
  }

  /**
   * 整理番号照合
   * @param {string} ticketNumber - "A01-0001"
   */
  async function lookup(ticketNumber) {
    return request("lookup", { ticketNumber });
    // GASが返す: { success, ticket: { ticketNumber, count, startTime, endTime, status, expireTime } }
  }

  /**
   * ステータス変更
   * @param {string} ticketNumber - "A01-0001"
   * @param {string} newStatus    - STATUSES のキー（例: "received"）
   */
  async function updateStatus(ticketNumber, newStatus) {
    return request("updateStatus", { ticketNumber, newStatus });
  }

  /**
   * 統計取得
   * GASが返す: { success, stats: { total, reserved, calling, received, entered, absent, expired } }
   */
  async function getStats() {
    return request("getStats");
  }

  /**
   * 呼出リスト取得（モニター用）
   * セッションがない場合でも sheetName/password を直接渡せる
   */
  async function getCallingList() {
    // _enteredPassword は request() が自動付与するため引数不要
    return request("getCallingList", {
      callBeforeMinutes : CONFIG.CALL_BEFORE_MINUTES
    });
    // GASが返す: { success, list: [{ ticketNumber, count, startTime, endTime, status }] }
  }

  function getPassword() {
    return _enteredPassword;
  }

  // ---------- 管理API（管理パスワード使用） ----------

  /** 管理パスワード認証 */
  async function adminAuth(adminPassword) {
    const res = await fetch(CONFIG.GAS_URL, {
      method  : "POST",
      headers : { "Content-Type": "text/plain" },
      body    : JSON.stringify({ action: "adminAuth", adminPassword })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "管理認証失敗");
    return data;
  }

  /**
   * 現在の config.js をGitHub APIから取得
   * @returns { content: string, sha: string }
   */
  async function getConfig(adminPassword) {
    const res = await fetch(CONFIG.GAS_URL, {
      method  : "POST",
      headers : { "Content-Type": "text/plain" },
      body    : JSON.stringify({
        action        : "getConfig",
        adminPassword,
        owner  : CONFIG.GITHUB_OWNER,
        repo   : CONFIG.GITHUB_REPO,
        path   : CONFIG.GITHUB_PATH,
        branch : CONFIG.GITHUB_BRANCH
      })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "取得失敗");
    return data; // { success, content, sha }
  }

  /**
   * 新しい config.js 内容をGitHub APIでコミット
   * @param {string} adminPassword
   * @param {string} content - 新しいconfig.jsのテキスト全体
   * @param {string} sha     - getConfigで取得したSHA
   * @param {string} commitMessage
   */
  async function saveConfig(adminPassword, content, sha, commitMessage) {
    const res = await fetch(CONFIG.GAS_URL, {
      method  : "POST",
      headers : { "Content-Type": "text/plain" },
      body    : JSON.stringify({
        action        : "saveConfig",
        adminPassword,
        owner         : CONFIG.GITHUB_OWNER,
        repo          : CONFIG.GITHUB_REPO,
        path          : CONFIG.GITHUB_PATH,
        branch        : CONFIG.GITHUB_BRANCH,
        content,
        sha,
        commitMessage
      })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "保存失敗");
    return data; // { success, message, newSha }
  }

  return {
    setSession, getSession, getPassword, clearSession, hasSession,
    auth, register, lookup, updateStatus, getStats, getCallingList,
    adminAuth, getConfig, saveConfig
  };
})();
