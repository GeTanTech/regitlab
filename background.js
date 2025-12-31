importScripts("./replacement/rules.js");
const urlReplacements = getUrlReplacements();
let isSettingUp = false;
async function setupReplacementRules() {
  if (isSettingUp) return;
  isSettingUp = true;

  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map((r) => r.id);

    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
      });
    }
  } catch (e) {
    console.error("移除旧规则失败:", e);
    isSettingUp = false;
    return;
  }

  const rules = [];

  // 处理JS文件替换
  urlReplacements.js.forEach(({ remoteUrl, localPath, id }) => {
    const localUrl = chrome.runtime.getURL(localPath);
    rules.push({
      id: id,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: localUrl },
      },
      condition: {
        urlFilter: remoteUrl,
        resourceTypes: ["script"],
      },
    });
  });

  // 处理CSS文件替换
  urlReplacements.css.forEach(({ remoteUrl, localPath, id }) => {
    const localUrl = chrome.runtime.getURL(localPath);
    rules.push({
      id: id,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: localUrl },
      },
      condition: {
        urlFilter: remoteUrl,
        resourceTypes: ["stylesheet"],
      },
    });
  });

  // 处理JSON请求替换
  urlReplacements.json.forEach(({ remoteUrl, localPath, id }) => {
    const localUrl = chrome.runtime.getURL(localPath);
    rules.push({
      id: id,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: localUrl },
      },
      condition: {
        urlFilter: remoteUrl,
        resourceTypes: ["xmlhttprequest"],
      },
    });
  });

  if (rules.length > 0) {
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
      });
    } catch (e) {
      console.error("添加规则失败:", e);
    }
  }

  isSettingUp = false;
}
// 外层执行：覆盖浏览器重启、插件唤醒等场景
setupReplacementRules();
chrome.runtime.onInstalled.addListener(async (details) => {
  // 判断触发原因：install（首次安装）、update（插件更新），避免重复执行
  if (details.reason === "install" || details.reason === "update") {
    await setupReplacementRules();
  }
});