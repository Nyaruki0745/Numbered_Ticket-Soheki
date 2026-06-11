/**
 * GAS API クライアント
 * すべてのGAS通信はこのモジュールを経由する
 */

const API = (() => {

  // 認証セッション（タブ間で共有）
  let _session = null; // { sheetName, code, password, label }

  // ---------- セッション管理 ----------

  function setSession(sheetObj) {
    _session = { ...sheetObj };
  }

  function getSession() {
    return _session;
  }

  function clearSession() {
    _session = null;
  }

  function hasSession() {
    return _session !== null;
  }

  // ---------- 共通リクエスト ----------

  async function request(action, params = {}) {
    if (!_session) throw new Error("未ログインです");

    const payload = {
      action,
      sheetName: _session.sheetName,
      password:  _session.password,
      ...params
    };

    const res = await fetch(CONFIG.GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "GASエラー");
    return data;
  }

  // ---------- 各API ----------

  /** 認証確認（ログイン時に呼ぶ） */
  async function auth(sheetName, password) {
    const payload = {
      action: "auth",
      sheetName,
      password
    };
    const res = await fetch(CONFIG.GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "認証失敗");
    return data;
  }

  /**
   * 整理券登録
   * @param {number} count - 人数
   * @param {string} startTime - "HH:MM"
   * @param {string} endTime   - "HH:MM"
   */
  async function register(count, startTime, endTime) {
    return request("register", {
      count,
      startTime,
      endTime,
      identCode: _session.code
    });
    // GASが返す: { success, ticketNumber, ticketId }
  }

  /**
   * ステータス変更
   * @param {string} ticketNumber - "A01-0001"
   * @param {string} newStatus    - STATUSES のキー
   */
  async function updateStatus(ticketNumber, newStatus) {
    return request("updateStatus", { ticketNumber, newStatus });
  }

  /**
   * 統計取得
   */
  async function getStats() {
    return request("getStats");
    // GASが返す: { success, stats: { total, reserved, calling, received, entered, absent, expired } }
  }

  /**
   * 呼出リスト取得（モニター用）
   * GAS側で「現在時刻 >= 開始時間 - CALL_BEFORE_MINUTES かつ ステータス=予約済or呼出中」を返す
   */
  async function getCallingList(sheetName, password) {
    const payload = {
      action: "getCallingList",
      sheetName,
      password,
      callBeforeMinutes: CONFIG.CALL_BEFORE_MINUTES
    };
    const res = await fetch(CONFIG.GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "取得失敗");
    return data; // { success, list: [{ ticketNumber, count, startTime, endTime, status }] }
  }

  return {
    setSession, getSession, clearSession, hasSession,
    auth, register, updateStatus, getStats, getCallingList
  };
})();
