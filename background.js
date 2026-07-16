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
async function initLocalStorage() {
  const defaultUrlButtons = [
    { btn: "pull_request", default: true, url: "https://devops.cscec.com/osc/_source/osc/cip-economic/cost-react-1/-/pull_requests/new" },
    { btn: "pipeline", default: true, url: "https://devops.cscec.com/osc/_ipipe/new-ipipe/pipelines/list?viewId=FAVORITE" },
    { btn: "my_board", default: true, url: "https://devops.cscec.com/osc/_team/osc/workspaces/cip-economic/boards/ad788dc8-5436-42f1-8ba6-a9ac535046ce" },
  ];
  const defaults = {
    prompt: "根据我的gitlab提交记录生成简短日报;格式:仅输出紧凑的JSON数组字符串，格式为 [{\"Cname\":\"内容\",\"date\":\"YYYY-MM-DD\"},...]。严禁包含换行符、空格、代码块标记或加粗符号。字数:每天的Cname内容不超过100字。内容重点：如包含“生产”、“开发”相关任务，需具体描述并优先保留，描述需具体，避免笼统或假大空。内容如下:",
    project: "cip-economic/cost-react-1",
    editorType: "vscode",
    commitHistoryBranch: "uat",
    onlyMyself: false,
    filterMergeCommit: false,
    branchMapping: JSON.stringify({"a":"dev","d":"stable","8":"release-20260804","9":"release-20260903","10":"release-20261009"})
  };
  const { userInfo = {} } = await chrome.storage.local.get("userInfo");
  const merged = { ...userInfo };
  // 未设置或空字符串时回退到默认值（布尔值 false 不受影响）
  for (const [key, val] of Object.entries(defaults)) {
    if (merged[key] === undefined || merged[key] === "") {
      merged[key] = val;
    }
  }
  // urlButtons：空数组时使用默认值
  if (!merged.urlButtons || merged.urlButtons.length === 0) {
    merged.urlButtons = defaultUrlButtons;
  }
  // 清理旧的 default 按钮后，将最新的 defaultUrlButtons 置顶
  const customButtons = (merged.urlButtons || []).filter((item) => !item?.default);
  merged.urlButtons = [...defaultUrlButtons, ...customButtons];
  await chrome.storage.local.set({ userInfo: merged });
}
const DCS_MENU_SEARCH_FOCUS_HOSTS = [
  "dcs-uat-gray.cscec.com",
  "dcs-uat.cscec.com",
  "dcs-pre.cscec.com",
  "dcs.cscec.com",
];

async function injectDevopsContentScript(tab) {
  if (!tab.url || !tab.url.includes("devops.cscec.com")) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch (e) {
    // 忽略注入失败
  }
}

async function injectDcsMenuSearchFocusScript(tab) {
  if (
    !tab.url ||
    !DCS_MENU_SEARCH_FOCUS_HOSTS.some((h) => tab.url.includes(h))
  ) {
    return;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["dcs-menu-search-focus.js"],
    });
  } catch (e) {
    // 忽略注入失败
  }
}

async function injectContentScriptsToAllTabs() {
  const windows = await chrome.windows.getAll({ populate: true });
  for (const window of windows) {
    if (window.tabs) {
      for (const tab of window.tabs) {
        await injectDevopsContentScript(tab);
        await injectDcsMenuSearchFocusScript(tab);
      }
    }
  }
}

// 外层执行：覆盖浏览器重启、插件唤醒等场景
setupReplacementRules();
chrome.runtime.onInstalled.addListener(async (details) => {
  // 判断触发原因：install（首次安装）、update（插件更新），避免重复执行
  if (details.reason === "install" || details.reason === "update") {
    await setupReplacementRules();
    await injectContentScriptsToAllTabs();
    await initLocalStorage();
  }
  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://static.getan.edu.kg/chrome-extension-install"
    });
    chrome.runtime.setUninstallURL("https://static.getan.edu.kg/chrome-extension-uninstall");
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (
    [
      "getCommitList",
      "getPullRequestList",
      "getMyBranches",
      "clearBranches",
      "runPipeline",
      "autoAcceptPullRequest"
    ].includes(request.action)
  ) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, request, sendResponse);
    });
    return true;
  }
  // 广播扩展配置到所有已打开的 GitLab 页面，使其 window.__EXTENSION_REGITLAB_CONFIG 立即更新
  if (request.action === "BROADCAST_EXTENSION_CONFIG") {
    (async () => {
      const windows = await chrome.windows.getAll({ populate: true });
      for (const window of windows) {
        if (window.tabs) {
          for (const tab of window.tabs) {
            if (
              tab.url && tab.url.includes("devops.cscec.com")
            ) {
              try {
                await chrome.tabs.sendMessage(tab.id, {
                  action: "SYNC_CONFIG",
                });
              } catch (e) {
                // 该标签页可能未加载 content script 或未刷新，忽略
              }
            }
          }
        }
      }
      sendResponse?.({ ok: true });
    })();
    return true;
  }
});
