// ============================================================================
// CẦU NỐI TỰ ĐỘNG CHO MỌI CÔNG CỤ TRONG THƯ MỤC "tools/"
// Chỉ cần nhúng <script src="../assets/tool-bridge.js"></script> vào bất kỳ file HTML nào
// ============================================================================
(function () {
  const COMPANIES = window.WORKSPACE_COMPANIES || {};
  const params = new URLSearchParams(window.location.search);
  const compId = params.get("company") || localStorage.getItem("WS_ACTIVE_COMPANY_V1") || "cat-nguyen";
  const comp = COMPANIES[compId] || COMPANIES["cat-nguyen"];

  if (comp) {
    localStorage.setItem("WS_ACTIVE_COMPANY_V1", comp.id);
    // Expose global active company object so any new HTML tool can read window.WorkspaceCompany
    window.WorkspaceCompany = comp;
    window.WS_ACTIVE_COMP_OBJ = comp;
  }

  // Helper function for new tools to isolate localStorage keys automatically per company
  window.wsStorageKey = function (baseKey) {
    const prefix = (window.WorkspaceCompany && window.WorkspaceCompany.storagePrefix) || "CN";
    return `${prefix}_${baseKey}`;
  };

  // Add print-hiding CSS for top strip
  const style = document.createElement("style");
  style.textContent = "@media print { .ws-top-strip { display: none !important; } }";
  document.head.appendChild(style);

  // Inject top navigation & company switcher bar once DOM is ready
  window.addEventListener("DOMContentLoaded", () => {
    if (!comp || document.querySelector(".ws-top-strip")) return;
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
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="color:#a8a29e;font-size:12px;">Đổi công ty:</span>
        <select onchange="localStorage.setItem('WS_ACTIVE_COMPANY_V1',this.value);location.search='?company='+this.value" style="background:#1e1b18;color:#fff;border:1px solid ${comp.accentColor};border-radius:6px;padding:4px 9px;font-size:12px;font-weight:600;cursor:pointer;">
          ${Object.values(COMPANIES).map(c => `<option value="${c.id}" ${c.id === comp.id ? "selected" : ""}>${c.shortName}</option>`).join("")}
        </select>
      </div>
    `;
    document.body.prepend(bar);

    // Auto-fill any element with data-ws-field="fullName | mst | address | warehouse | signer | shortCode"
    document.querySelectorAll("[data-ws-field]").forEach(el => {
      const field = el.getAttribute("data-ws-field");
      if (comp[field]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.value = comp[field];
        else el.textContent = comp[field];
      }
    });
    document.querySelectorAll("img[data-ws-logo]").forEach(img => {
      img.src = comp.logo;
    });
  });
})();
