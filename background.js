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
  const config = {
    cherry_pick: {
      btn: "cherry_pick",
      default: true,
      url: "https://devops.cscec.com/osc/_source/osc/cip-economic/cost-react-1/-/cherry_pick/new",
    },
    pipeline: {
      btn: "pipeline",
      default: true,
      url: "https://devops.cscec.com/osc/_ipipe/new-ipipe/pipelines/list?viewId=FAVORITE",
    },
    my_board: {
      btn: "my_board",
      default: true,
      url: "https://devops.cscec.com/osc/_team/osc/workspaces/cip-economic/boards/ad788dc8-5436-42f1-8ba6-a9ac535046ce",
    },
  };
  const defaultPrompt =
    "根据我的gitlab提交记录生成简短日报；1、按“[日期]：内容”格式输出，每天控制在50字以内；2、如内容包含“生产”，“开发”相关任务，需重点提及并优先保留；3、日志内容稍微具体点，不要过于笼统，避免假大空；内容如下：";
  const defaultProject = "cip-economic/cost-react-1";
  const defaultCommitHistoryBranch = "uat";
  const defaultEditorType = "vscode";
  const defaultOnlyMyself = false;
  const defaultFilterMergeCommit = false;
  const defaultAutoCheckRowCount = 0;
  const result = await chrome.storage.local.get("userInfo");
  const { 
    urlButtons = [], 
    prompt = "", 
    project = "", 
    editorType = "", 
    commitHistoryBranch = "",
    onlyMyself,
    filterMergeCommit,
    autoCheckRowCount,
  } = result.userInfo || {};
  let _prompt = "";
  let _project = "";
  let _urlButtons = [];
  let _editorType = "";
  let _commitHistoryBranch = "";
  let _onlyMyself = null;
  let _filterMergeCommit = null;
  let _autoCheckRowCount = null;
  if (!prompt) _prompt = defaultPrompt;
  if (!project) _project = defaultProject;
  if (urlButtons.length === 0) _urlButtons = Object.values(config);
  if (!editorType) _editorType = defaultEditorType;
  if (!commitHistoryBranch) _commitHistoryBranch = defaultCommitHistoryBranch;
  if (onlyMyself === undefined) _onlyMyself = defaultOnlyMyself;
  if (filterMergeCommit === undefined) _filterMergeCommit = defaultFilterMergeCommit;
  if (autoCheckRowCount === undefined) _autoCheckRowCount = defaultAutoCheckRowCount;
  await chrome.storage.local.set({
    userInfo: {
      ...(result.userInfo || {}),
      ...(_prompt ? { prompt: _prompt } : {}),
      ...(_project ? { project: _project } : {}),
      ...(_urlButtons.length > 0 ? { urlButtons: _urlButtons } : {}),
      ...(_editorType ? { editorType: _editorType } : {}),
      ...(_commitHistoryBranch ? { commitHistoryBranch: _commitHistoryBranch } : {}),
      ...(_onlyMyself !== null ? { onlyMyself: _onlyMyself } : {}),
      ...(_filterMergeCommit !== null ? { filterMergeCommit: _filterMergeCommit } : {}),
      ...(_autoCheckRowCount !== null ? { autoCheckRowCount: _autoCheckRowCount } : {}),
    },
  });
}
async function injectContentScriptsToAllTabs() {
  const windows = await chrome.windows.getAll({ populate: true });
  for (const window of windows) {
    if (window.tabs) {
      for (const tab of window.tabs) {
        if (
          tab.url &&
          (tab.url.includes("devops.cscec.com") ||
            tab.url.includes("dcs-uat-gray.cscec.com"))
        ) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content.js"],
            });
          } catch (e) {
            // 忽略注入失败
          }
        }
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
