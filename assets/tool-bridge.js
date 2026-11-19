// ============================================================================
// CẦU NỐI TỰ ĐỘNG CHO MỌI CÔNG CỤ TRONG THƯ MỤC "tools/"
// Chỉ cần nhúng <script src="../assets/tool-bridge.js"></script> vào bất kỳ file HTML nào
// ============================================================================
(function () {
  const COMPANIES = window.WORKSPACE_COMPANIES || {};

  // 1. Kiểm tra phiên đăng nhập & phân quyền từ Cổng Hệ Thống (index.html)
  function getAuthorizedUser() {
    try {
      const sessionEmail = localStorage.getItem("WS_CURRENT_SESSION_V4");
      if (!sessionEmail) return null;
      const usersRaw = localStorage.getItem("WS_PORTAL_USERS_V4");
      if (!usersRaw) return null;
      const usersDB = JSON.parse(usersRaw);
      const user = usersDB[sessionEmail.trim().toLowerCase()];
      if (!user || user.status !== "approved") return null;
      return user;
    } catch (e) {
      return null;
    }
  }

  const currentUser = getAuthorizedUser();

  // Chặn truy cập trực tiếp link công cụ nếu chưa đăng nhập hoặc chưa được duyệt
  if (!currentUser) {
    window.location.replace("../index.html");
    return;
  }

  // Lọc danh sách công ty đúng theo phân quyền của tài khoản
  let allowedIds = Array.isArray(currentUser.allowedCompanies)
    ? currentUser.allowedCompanies.filter((id) => Boolean(COMPANIES[id]))
    : [];

  if (allowedIds.length === 0 && currentUser.role === "admin") {
    allowedIds = Object.keys(COMPANIES);
  }

  if (allowedIds.length === 0) {
    window.location.replace("../index.html");
    return;
  }

  // 2. Xác định công ty đang thao tác & chặn đổi trái phép qua thanh địa chỉ URL
  const params = new URLSearchParams(window.location.search);
  const requestedId =
    params.get("company") ||
    localStorage.getItem("WS_ACTIVE_COMPANY_V1") ||
    allowedIds[0];

  const compId = allowedIds.includes(requestedId) ? requestedId : allowedIds[0];
  const comp = COMPANIES[compId];

  if (comp) {
    localStorage.setItem("WS_ACTIVE_COMPANY_V1", comp.id);
    window.WorkspaceCompany = comp;
    window.WS_ACTIVE_COMP_OBJ = comp;

    // Nếu URL đang chứa mã công ty không hợp lệ, tự động sửa lại URL cho khớp
    if (params.get("company") && params.get("company") !== comp.id) {
      params.set("company", comp.id);
      const cleanUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  // Hàm hỗ trợ tự động tách dữ liệu localStorage theo từng công ty
  window.wsStorageKey = function (baseKey) {
    const prefix = (window.WorkspaceCompany && window.WorkspaceCompany.storagePrefix) || "CN";
    return `${prefix}_${baseKey}`;
  };

  // Ẩn thanh điều hướng khi bấm in (Ctrl+P)
  const style = document.createElement("style");
  style.textContent = "@media print { .ws-top-strip { display: none !important; } }";
  document.head.appendChild(style);

  // 3. Tạo thanh điều hướng & hiển thị công ty theo đúng phân quyền
  window.addEventListener("DOMContentLoaded", () => {
    if (!comp || document.querySelector(".ws-top-strip")) return;

    const allowedCompaniesList = allowedIds.map((id) => COMPANIES[id]);

    // Chỉ hiện ô chọn "Đổi công ty" nếu tài khoản được cấp quyền từ 2 công ty trở lên
    const switcherHtml =
      allowedCompaniesList.length > 1
        ? `
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="color:#a8a29e;font-size:12px;">Đổi công ty:</span>
            <select onchange="localStorage.setItem('WS_ACTIVE_COMPANY_V1',this.value);location.search='?company='+this.value" style="background:#1e1b18;color:#fff;border:1px solid ${comp.accentColor};border-radius:6px;padding:4px 9px;font-size:12px;font-weight:600;cursor:pointer;">
              ${allowedCompaniesList
                .map(
                  (c) =>
                    `<option value="${c.id}" ${c.id === comp.id ? "selected" : ""}>${c.shortName}</option>`
                )
                .join("")}
            </select>
          </div>
        `
        : `
          <div style="display:flex;align-items:center;gap:8px;color:#a8a29e;font-size:12px;">
            <span>👤 <strong style="color:#f5efe6;">${currentUser.name || currentUser.email}</strong></span>
            <span style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:3px 9px;border-radius:6px;font-size:11.5px;">🔒 Cố định 1 pháp nhân</span>
          </div>
        `;

    const bar = document.createElement("div");
    bar.className = "ws-top-strip no-print";
    bar.style.cssText = `background:#12100d;color:#f5efe6;border-bottom:1.5px solid ${comp.accentColor};padding:7px 20px;display:flex;justify-content:space-between;align-items:center;font-family:'Segoe UI',sans-serif;font-size:12.5px;position:sticky;top:0;z-index:9999;gap:12px;flex-wrap:wrap;`;
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <a href="../index.html" style="background:rgba(212,175,55,0.14);color:#f5d77f;border:1px solid rgba(212,175,55,0.45);padding:5px 12px;border-radius:7px;text-decoration:none;font-weight:700;">← Cổng Hệ Thống</a>
        <div style="display:flex;align-items:center;gap:9px;background:rgba(255,255,255,0.04);border:1px solid rgba(212,175,55,0.3);padding:3px 10px;border-radius:8px;">
          <img src="${comp.logo}" alt="${comp.shortCode}" style="height:24px;width:auto;object-fit:contain;" />
          <span>Pháp nhân: <strong style="color:${comp.accentColor}">${comp.fullName}</strong></span>
        </div>
      </div>
      ${switcherHtml}
    `;
    document.body.prepend(bar);

    // Tự động điền thông tin pháp nhân vào các thẻ có thuộc tính data-ws-field
    document.querySelectorAll("[data-ws-field]").forEach((el) => {
      const field = el.getAttribute("data-ws-field");
      if (comp[field]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.value = comp[field];
        else el.textContent = comp[field];
      }
    });
    document.querySelectorAll("img[data-ws-logo]").forEach((img) => {
      img.src = comp.logo;
    });
  });
})();
