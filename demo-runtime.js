(function () {
  "use strict";

  document.documentElement.classList.add("demo-mode");
  const nativeFetch = window.fetch.bind(window);

  function jsonResponse(payload, status) {
    return Promise.resolve(new Response(JSON.stringify(payload), {
      status: status || 200,
      headers: {"Content-Type": "application/json; charset=utf-8"}
    }));
  }

  const staticRoutes = new Map([
    ["/api/data", "./demo-data/dashboard.json"],
    ["/api/forecast", "./demo-data/forecast.json"],
    ["/api/forecast/os", "./demo-data/forecast-os.json"],
    ["/api/forecast/platform", "./demo-data/forecast-platform.json"],
    ["/api/forecast/config", "./demo-data/forecast-config.json"],
    ["/api/forecast/history", "./demo-data/history.json"],
    ["/api/forecast/os/history", "./demo-data/history-os.json"],
    ["/api/forecast/platform/history", "./demo-data/history-platform.json"]
  ]);

  window.fetch = async function (input, init) {
    const requestUrl = typeof input === "string" ? input : input.url;
    const url = new URL(requestUrl, window.location.href);
    const path = url.pathname;
    const method = ((init && init.method) || "GET").toUpperCase();

    if (path === "/api/auth/check") {
      return jsonResponse({ok: true, user: "公开演示", role: "demo"});
    }
    if (path === "/api/model-info") {
      return jsonResponse({model: "演示分析助手"});
    }
    if (path === "/api/forecast/auto-status") {
      return jsonResponse({
        vehicle: {last_fetch: "2026-09-01 14:41:43", last_status: "demo"},
        os: {last_fetch: "2026-09-01 14:41:43", last_status: "demo"},
        platform: {last_fetch: "2026-09-01 14:41:43", last_status: "demo"},
        has_plot_libs: true,
        auto_refresh: {enabled: false}
      });
    }
    if (path === "/api/forecast/window/status") {
      return jsonResponse({window_open: false, actual_months: 6, next_advance: "演示环境不自动推进"});
    }
    if (path === "/api/forecast/alerts") {
      return jsonResponse({alerts: []});
    }
    if (path === "/api/login-log") {
      return jsonResponse({logs: []});
    }
    if (path === "/api/chat" && method === "POST") {
      let question = "";
      try {
        question = JSON.parse((init && init.body) || "{}").question || "";
      } catch (_) {}
      return jsonResponse({
        answer: "这是公开演示环境，回答基于页面中的合成快照。当前数据可用于查看车型投入、月度趋势、完成状态和资源集中度；不连接任何企业内部系统。\n\n你的问题：**" + question.replace(/[<>]/g, "") + "**"
      });
    }
    if (staticRoutes.has(path) && method === "GET") {
      return nativeFetch(staticRoutes.get(path), {cache: "no-store"});
    }
    if (path.startsWith("/api/") && method !== "GET") {
      return jsonResponse({ok: false, error: "公开演示环境为只读模式"}, 403);
    }
    if (path.startsWith("/api/")) {
      return jsonResponse({error: "该接口未在公开演示中启用"}, 404);
    }
    return nativeFetch(input, init);
  };

  window.addEventListener("DOMContentLoaded", function () {
    const syncButton = document.getElementById("syncBtn");
    if (syncButton) {
      syncButton.disabled = true;
      syncButton.title = "公开演示使用固定的合成数据快照";
    }
    const syncText = document.getElementById("syncBtnText");
    if (syncText) syncText.textContent = "演示数据（固定快照）";
    const role = document.getElementById("userRole");
    if (role) role.textContent = "演示";
    document.querySelectorAll("#tabAdmin, #forecastEditBar, #forecastOsEditBar, #forecastPlatformEditBar").forEach(function (element) {
      element.remove();
    });
    document.querySelectorAll("#adminPanelConfig, #adminPanelOps, #adminPanelLog, #adminPanelSource, #adminPanelLogin").forEach(function (element) {
      element.remove();
    });
  });
})();
