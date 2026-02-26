/**
 * 扩展配置广播注入（content 层）
 * 与 config-injector.js（页面层）、manifest content_scripts + web_accessible_resources 配合使用：
 * - 本脚本：注入 config-injector、从 storage 读配置、通过 postMessage 推到页面；处理 SYNC_CONFIG 广播。
 * - config-injector.js：仅接收 postMessage，写入 window.__EXTENSION_REGITLAB_CONFIG，供替换 JS 只读。
 * - popup 修改三项配置后发 BROADCAST_EXTENSION_CONFIG → background 向各标签页发 SYNC_CONFIG → 本脚本收后更新当前页。
 */

function injectConfigListener() {
  if (document.getElementById("__extension_config_listener__")) return;
  const script = document.createElement("script");
  script.id = "__extension_config_listener__";
  script.src = chrome.runtime.getURL("config-injector.js");
  script.onload = function () {
    // 等页面内监听器就绪后再推配置，避免新开页面收不到首次数据
    chrome.storage.local.get(["userInfo"], (result) => {
      updateConfig(result.userInfo || {});
    });
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

function updateConfig(userInfo = {}) {
  const config = {
    autoCheckRowCount: userInfo.autoCheckRowCount || 0,
    onlyMyself: userInfo.onlyMyself === true,
    filterMergeCommit: userInfo.filterMergeCommit === true,
    email: userInfo.email || "",
  };
  window.postMessage(
    { type: "__EXTENSION_REGITLAB_CONFIG_UPDATE__", data: config },
    "*"
  );
}

// 注入页面脚本（仅负责接收消息）；首次配置在 script.onload 里推，保证监听器已就绪
injectConfigListener();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.userInfo) {
    updateConfig(changes.userInfo.newValue || {});
  }
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "SYNC_CONFIG") {
    chrome.storage.local.get(["userInfo"], (result) => {
      updateConfig(result.userInfo || {});
      sendResponse?.({ ok: true });
    });
    return true;
  }
});
