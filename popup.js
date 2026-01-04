class CoreController {
  constructor() {
    this.userInfoService = new UserInfoService();
    this.urlButtonManager = new UrlButtonManager();
    this.dcsService = new DcsService();
    this.gitlabService = new GitlabService();
    this.commonHelper = new CommonHelper();
    this.pipelineService = new PipelineService();
    this.eventHandlers = [];
  }
  init = () => {
    this.urlButtonManager.loadUrlButtons();
    this.userInfoService.renderUserInfo();
    this.addEventListener();
  };
  wrapHandler = (handler, domain, checkConfig = []) => {
    return async (...args) => {
      try {
        const { isInWhiteList, tab } = await this.commonHelper.validateDomain(
          domain
        );
        if (!isInWhiteList) return;
        const userInfo = await this.userInfoService.getUserInfo();
        const { email, project, geminiKey, prompt } = userInfo || {};
        if (checkConfig?.includes("gitlab")) {
          if (!email || !project) {
            this.commonHelper.showMessage("请先配置邮箱和项目");
            return;
          }
        }
        if (checkConfig?.includes("gemini")) {
          if (!geminiKey || !prompt) {
            this.commonHelper.showMessage("请先配置Gemini API Key和提示词");
            return;
          }
        }
        return await handler.apply(handler, [{ tab, userInfo }, ...args]);
      } catch (error) {
        console.error(error);
        this.commonHelper.showMessage("执行异常: 刷新页面后重试");
      }
    };
  };
  addEventListener = () => {
    this.dcsAndListeners();
    this.settingsAndListeners();
    this.gitlabAndListeners();
    this.pipelineAndListeners();
  };
  dcsAndListeners = () => {
    // 获取用户信息按钮
    const getUserBtn = document.getElementById("get-user-btn");
    if (getUserBtn) {
      const handler = this.wrapHandler(this.dcsService.fetchUserInfo, ["gray"]);
      getUserBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: getUserBtn,
        event: "click",
        handler,
      });
    }
  };
  settingsAndListeners = () => {
    // 监听 email 和 project 输入变化
    const emailInput = document.getElementById("email-input");
    const projectInput = document.getElementById("project-input");
    if (emailInput) {
      const handler = () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "email",
          emailInput.value.trim()
        );
      };
      emailInput.addEventListener("input", handler);
      this.eventHandlers.push({
        element: emailInput,
        event: "input",
        handler,
      });
    }
    if (projectInput) {
      const handler = () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "project",
          projectInput.value.trim()
        );
      };
      projectInput.addEventListener("input", handler);
      this.eventHandlers.push({
        element: projectInput,
        event: "input",
        handler,
      });
    }
    // 监听gemini-key-input和prompt-input输入变化
    const geminiKeyInput = document.getElementById("gemini-key-input");
    const promptInput = document.getElementById("prompt-input");
    if (geminiKeyInput) {
      const handler = () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "geminiKey",
          geminiKeyInput.value.trim()
        );
      };
      geminiKeyInput.addEventListener("input", handler);
      this.eventHandlers.push({
        element: geminiKeyInput,
        event: "input",
        handler,
      });
    }
    if (promptInput) {
      const handler = () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "prompt",
          promptInput.value.trim()
        );
      };
      promptInput.addEventListener("input", handler);
      this.eventHandlers.push({
        element: promptInput,
        event: "input",
        handler,
      });
    }
    // 设置页面开关按钮
    const settingsIcon = document.getElementById("settings-icon");
    const settingsPanel = document.getElementById("settings-panel");
    const settingsCloseBtn = document.getElementById("settings-close-btn");
    if (settingsIcon && settingsPanel) {
      const handler = () => {
        settingsPanel.classList.remove("hide");
        settingsPanel.classList.add("show");
      };
      settingsIcon.addEventListener("click", handler);
      this.eventHandlers.push({
        element: settingsIcon,
        event: "click",
        handler,
      });
    }
    if (settingsCloseBtn && settingsPanel) {
      const handler = () => {
        settingsPanel.classList.remove("show");
        settingsPanel.classList.add("hide");
      };
      settingsCloseBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: settingsCloseBtn,
        event: "click",
        handler,
      });
    }
    // 添加跳转按钮
    const addMenuButton = document.getElementById("add-menu-button");
    if (addMenuButton) {
      const handler = this.wrapHandler(this.urlButtonManager.addUrlButton, []);
      addMenuButton.addEventListener("click", handler);
      this.eventHandlers.push({
        element: addMenuButton,
        event: "click",
        handler,
      });
    }
  };
  gitlabAndListeners = () => {
    // 获取上周日报按钮
    const getLastWeekCommitListBtn = document.getElementById(
      "get-last-week-commit-list-btn"
    );
    if (getLastWeekCommitListBtn) {
      const handler = this.wrapHandler(
        this.gitlabService.fetchLastWeekCommits,
        ["devops"],
        ["gitlab"]
      );
      getLastWeekCommitListBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: getLastWeekCommitListBtn,
        event: "click",
        handler,
      });
    }
    // 获取本周日报按钮
    const getCurrentWeekCommitListBtn = document.getElementById(
      "get-current-week-commit-list-btn"
    );
    if (getCurrentWeekCommitListBtn) {
      const handler = this.wrapHandler(
        this.gitlabService.fetchCurrentWeekCommits,
        ["devops"],
        ["gitlab"]
      );
      getCurrentWeekCommitListBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: getCurrentWeekCommitListBtn,
        event: "click",
        handler,
      });
    }
    // 创建Pull Request按钮
    const autoPullTitleBtn = document.getElementById("auto-pull-title-btn");
    if (autoPullTitleBtn) {
      const handler = this.wrapHandler(
        this.gitlabService.autoCreatePullRequest,
        ["devops"],
        ["gitlab"]
      );
      autoPullTitleBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: autoPullTitleBtn,
        event: "click",
        handler,
      });
    }
    // 接受Pull Request按钮
    const autoAcceptPullRequestBtn = document.getElementById(
      "auto-accept-pull-request-btn"
    );
    if (autoAcceptPullRequestBtn) {
      const handler = this.wrapHandler(
        this.gitlabService.autoAcceptPullRequest,
        ["devops"],
        ["gitlab"]
      );
      autoAcceptPullRequestBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: autoAcceptPullRequestBtn,
        event: "click",
        handler,
      });
    }
    // 清空我的分支按钮
    const clearMyBranchesBtn = document.getElementById("clear-my-branches-btn");
    if (clearMyBranchesBtn) {
      const handler = this.wrapHandler(
        this.gitlabService.clearMyBranches,
        ["devops"],
        ["gitlab"]
      );
      clearMyBranchesBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: clearMyBranchesBtn,
        event: "click",
        handler,
      });
    }
  };
  pipelineAndListeners = () => {
    // 运行成本gray流水线按钮
    const costGrayBtn = document.getElementById("run-pipeline-btn-cost-gray");
    if (costGrayBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["cost", "gray", "run-pipeline-btn-cost-gray"]);
      costGrayBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: costGrayBtn,
        event: "click",
        handler,
      });
    }
    // 运行成本uat流水线按钮
    const costUatBtn = document.getElementById("run-pipeline-btn-cost-uat");
    if (costUatBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["cost", "uat", "run-pipeline-btn-cost-uat"]);
      costUatBtn.addEventListener("click", handler);
      this.eventHandlers.push({ element: costUatBtn, event: "click", handler });
    }
    // 运行公共gray流水线按钮
    const publicGrayBtn = document.getElementById(
      "run-pipeline-btn-public-gray"
    );
    if (publicGrayBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["public", "gray", "run-pipeline-btn-public-gray"]);
      publicGrayBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: publicGrayBtn,
        event: "click",
        handler,
      });
    }
    // 运行公共uat流水线按钮
    const publicUatBtn = document.getElementById("run-pipeline-btn-public-uat");
    if (publicUatBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["public", "uat", "run-pipeline-btn-public-uat"]);
      publicUatBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: publicUatBtn,
        event: "click",
        handler,
      });
    }
    // 运行目标gray流水线按钮
    const targetGrayBtn = document.getElementById(
      "run-pipeline-btn-target-gray"
    );
    if (targetGrayBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["target", "gray", "run-pipeline-btn-target-gray"]);
      targetGrayBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: targetGrayBtn,
        event: "click",
        handler,
      });
    }
    // 运行目标uat流水线按钮
    const targetUatBtn = document.getElementById("run-pipeline-btn-target-uat");
    if (targetUatBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["target", "uat", "run-pipeline-btn-target-uat"]);
      targetUatBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: targetUatBtn,
        event: "click",
        handler,
      });
    }
    // 运行收入gray流水线按钮
    const incomeGrayBtn = document.getElementById(
      "run-pipeline-btn-income-gray"
    );
    if (incomeGrayBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["income", "gray", "run-pipeline-btn-income-gray"]);
      incomeGrayBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: incomeGrayBtn,
        event: "click",
        handler,
      });
    }
    // 运行收入uat流水线按钮
    const incomeUatBtn = document.getElementById("run-pipeline-btn-income-uat");
    if (incomeUatBtn) {
      const wrappedHandler = this.wrapHandler(
        this.pipelineService.runPipeline,
        ["devops"],
        []
      );
      const handler = () => wrappedHandler(["income", "uat", "run-pipeline-btn-income-uat"]);
      incomeUatBtn.addEventListener("click", handler);
      this.eventHandlers.push({
        element: incomeUatBtn,
        event: "click",
        handler,
      });
    }
  };
  removeEventListener = () => {
    this.eventHandlers.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventHandlers = [];
  };
}
class CommonHelper {
  constructor() {
    // 域名白名单
    this.whiteList = {
      gray: ["https://dcs-uat-gray.cscec.com"],
      devops: ["https://devops.cscec.com"],
    };
  }
  /**
   * 显示消息
   * @param {string} text - 要显示的消息内容
   * @param {string} type - 消息类型，可选值为success, error
   */
  showMessage = (text, type = "error") => {
    const container = document.getElementById("message-container");
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;
    container.appendChild(message);
    setTimeout(() => message.classList.add("show"), 10);
    setTimeout(() => {
      message.classList.remove("show");
      setTimeout(() => container.removeChild(message), 300);
    }, 1500);
  };
  /**
   * 关闭窗口
   * @param {number} delay - 关闭窗口的延迟时间
   */
  closeWindow = (delay = 1500) => {
    setTimeout(() => {
      window.close();
    }, delay);
  };
  /**
   * 获取当前tab
   * @returns {Object} - 当前tab对象
   */
  getCurrentTab = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab;
  };
  /**
   * 检查当前tab的域名是否在白名单中
   * @param {Array} types - 要检查的域名类型
   * @returns {Object} - 包含当前tab对象和是否在白名单的布尔值
   */
  validateDomain = async (types) => {
    const tab = await this.getCurrentTab();
    const url = tab?.url ?? "";
    if (!types.length) {
      return {
        tab,
        isInWhiteList: true,
      };
    }
    for (const type of types) {
      if (this.whiteList[type].some((item) => url.includes(item))) {
        return {
          tab,
          isInWhiteList: true,
        };
      }
    }
    this.showMessage("请在指定的域名下使用");
    return {
      tab,
      isInWhiteList: false,
    };
  };
  /**
   * 格式化日期为YYYY-MM-DD
   * @param {Date} date - 要格式化的日期对象
   * @returns {string} - 格式化后的日期字符串
   */
  formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  /**
   * 获取本周一和本周日的日期
   * @returns {Object} - 包含本周一和本周日的日期对象
   */
  getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay() ? now.getDay() : 7;

    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek - 1));

    const sunday = new Date(now);
    sunday.setDate(now.getDate() + (7 - dayOfWeek));

    return {
      firstDay: this.formatDate(monday),
      lastDay: this.formatDate(sunday),
    };
  };
  /**
   * 获取上周的日期范围
   * @returns {Object} - 包含上周一和上周日的日期对象
   */
  getPreviousWeekRange = () => {
    const { firstDay, lastDay } = this.getCurrentWeekRange();
    const monday = new Date(firstDay);
    monday.setDate(monday.getDate() - 7);
    const sunday = new Date(lastDay);
    sunday.setDate(sunday.getDate() - 7);
    return {
      firstDay: this.formatDate(monday),
      lastDay: this.formatDate(sunday),
    };
  };
  /**
   * 解析URL中的查询参数
   * @param {string} url - 要解析的完整URL地址
   * @returns {Object} - 包含所有查询参数的键值对对象
   */
  parseUrlParams = (url) => {
    // 创建参数存储对象
    const params = {};

    // 找到URL中?的位置
    const queryIndex = url.indexOf("?");
    if (queryIndex === -1) {
      return params; // 如果没有查询参数，返回空对象
    }

    // 截取?后面的查询字符串部分
    const queryString = url.slice(queryIndex + 1);

    // 按&分割成单个参数
    const paramPairs = queryString.split("&");

    // 遍历每个参数对，解析键值
    paramPairs.forEach((pair) => {
      // 按=分割键和值（处理没有值的情况，如 ?test）
      const [key, value = ""] = pair.split("=");

      // 解码URL编码的字符（处理特殊字符如_、%等）
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      // 存入参数对象
      params[decodedKey] = decodedValue;
    });

    return params;
  };

  /**
   * 更新本地存储
   * @param {string} groupName - 存储组名称
   * @param {string} key - 键名
   * @param {any} value - 值
   */
  updateLocalStorage = async (groupName, key, value) => {
    const result = await chrome.storage.local.get([groupName]);
    if (!result[groupName]) {
      await chrome.storage.local.set({ [groupName]: { [key]: value } });
      return;
    }
    const newData = { ...result[groupName], [key]: value };
    await chrome.storage.local.set({ [groupName]: newData });
  };
  /**
   * 获取本地存储
   * @param {string} groupName - 存储组名称
   * @param {string} key - 键名
   * @returns {any} - 值，不存在则返回null
   */
  getLocalStorage = async (groupName, key) => {
    const result = await chrome.storage.local.get([groupName]);
    if (!result[groupName]) {
      return {};
    }
    if (key) {
      return result[groupName]?.[key] || null;
    }
    return result[groupName];
  };
  /**
   * 复制文本到剪切板
   * @param {string} text - 要复制的文本
   */
  copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      this.showMessage("复制失败，插件需要聚焦状态才能复制");
    }
  };
  /**
   * 刷新页面
   */
  reloadPage = async () => {
    const tab = await this.getCurrentTab();
    if (!tab) return;
    await chrome.tabs.reload(tab.id);
  };
  /**
   * 设置按钮加载状态
   */
  setButtonLoading = (buttonId, loading) => {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.disabled = loading;
      if (loading) {
        btn.textContent = "加载中...";
      } else {
        const originalText = btn.getAttribute("data-original-text");
        if (originalText) {
          btn.textContent = originalText;
        }
      }
    }
  };
  /**
   * 更新当前页面跳转到URL
   * @param {string} url - 要跳转的URL
   */
  updateCurrentTabUrl = async (url) => {
    const tab = await this.getCurrentTab();
    if (!tab) return;
    await chrome.tabs.update(tab.id, { url: url });
    this.closeWindow();
  };
}
class UrlButtonManager {
  constructor() {
    this.commonHelper = new CommonHelper();
  }
  /**
   * 加载URL按钮菜单
   */
  loadUrlButtons = async () => {
    const result = await this.commonHelper.getLocalStorage(
      "userInfo",
      "urlButtons"
    );
    const buttons = result || [];
    const container = document.getElementById("url-buttons-container");
    if (buttons.length === 0) {
      container.innerHTML = "";
      return;
    }
    container.innerHTML = buttons
      .map((item, index) => {
        const isDefault = item.default === true;
        const chipClass = isDefault ? "chip-system" : "chip-custom";
        const deleteBtn = isDefault
          ? ""
          : `<span class="chip-delete" data-index="${index}" title="删除">×</span>`;
        return `
        <${isDefault ? "a" : "div"} class="chip ${chipClass}" data-url="${
          item.url
        }" ${isDefault ? 'href="#"' : ""}>
          ${item.btn}
          ${deleteBtn}
        </${isDefault ? "a" : "div"}>
      `;
      })
      .join("");

    container.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        if (e.target.classList.contains("chip-delete")) {
          return;
        }
        const url = chip.getAttribute("data-url");
        if (url) {
          this.commonHelper.updateCurrentTabUrl(url);
        }
      });
    });

    container.querySelectorAll(".chip-delete").forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute("data-index"));
        this.deleteUrlButton(index);
      });
    });
  };
  /**
   * 删除按钮
   * @param {number} index - 要删除的按钮索引
   */
  deleteUrlButton = async (index) => {
    if (confirm("确定要删除这个按钮吗？")) {
      const result = await this.commonHelper.getLocalStorage(
        "userInfo",
        "urlButtons"
      );
      const buttons = result || [];
      buttons.splice(index, 1);
      await this.commonHelper.updateLocalStorage(
        "userInfo",
        "urlButtons",
        buttons
      );
      await this.loadUrlButtons();
    }
  };
  /**
   * 添加自定义跳转按钮
   */
  addUrlButton = async () => {
    const btnNameInput = document.getElementById("btn-name-input");
    const urlInput = document.getElementById("url-input");
    const btnName = btnNameInput.value.trim();
    const url = urlInput.value.trim();
    if (!btnName) {
      this.commonHelper.showMessage("请输入按钮名称");
      return;
    }
    if (!url || !url.includes("http")) {
      this.commonHelper.showMessage("网址不存在或不合法");
      return;
    }
    const result = await this.commonHelper.getLocalStorage(
      "userInfo",
      "urlButtons"
    );
    const buttons = result || [];
    if (buttons.length >= 23) {
      this.commonHelper.showMessage("最多只能添加20个自定义按钮");
      return;
    }
    const newButton = { btn: btnName, url: url, default: false };
    if (buttons.some((item) => item.url === url)) {
      this.commonHelper.showMessage("该网址已存在");
      btnNameInput.value = "";
      urlInput.value = "";
      return;
    }
    buttons.push(newButton);
    await this.commonHelper.updateLocalStorage(
      "userInfo",
      "urlButtons",
      buttons
    );
    btnNameInput.value = "";
    urlInput.value = "";
    this.commonHelper.showMessage("添加成功", "success");
    await this.loadUrlButtons();
  };
}
class GitlabService {
  constructor() {
    this.commonHelper = new CommonHelper();
    this.userInfoService = new UserInfoService();
    this.geminiService = new GeminiService();
  }
  /**
   * 清空我的分支
   */
  clearMyBranches = async ({ tab, userInfo }) => {
    if (
      !tab.url?.includes(
        `https://devops.cscec.com/osc/_source/osc/${userInfo.project}/-/branches`
      )
    ) {
      this.commonHelper.showMessage(
        "当前页面不是我的分支页面，先看一眼确定一下哦"
      );
      return;
    }
    const url = `https://devops.cscec.com/api/code/api/osc/${userInfo.project}/-/branches?filter=my&page=1&per_page=50`;
    const response = await chrome.runtime.sendMessage({
      action: "getMyBranches",
      data: { url },
    });
    let branches = [];
    if (response && response.code === 0 && response.data) {
      const lists = response.data?.list || [];
      branches = lists.map((item) => item?.name).filter(Boolean);
      if (branches.length === 0) {
        this.commonHelper.showMessage("我的分支列表为空");
        return;
      }
    }
    const deleteResponse = await chrome.runtime.sendMessage({
      action: "clearBranches",
      data: { branches: branches, project: userInfo.project },
    });
    if (deleteResponse && deleteResponse.code === 0) {
      this.commonHelper.showMessage("清空我的分支成功", "success");
      this.commonHelper.reloadPage();
      this.commonHelper.closeWindow();
    } else {
      this.commonHelper.showMessage("清空我的分支失败");
    }
  };
  /**
   * 自动填写标题并创建Pull Request
   */
  autoCreatePullRequest = async ({ tab, userInfo }) => {
    if (
      !tab.url?.includes(
        `https://devops.cscec.com/osc/_source/osc/${userInfo.project}/-/pull_requests/new?source_branch`
      )
    ) {
      this.commonHelper.showMessage("当前页面不是创建Pull Request页面");
      return;
    }

    const params = this.commonHelper.parseUrlParams(tab.url);
    const finalUrl = `https://devops.cscec.com/api/code/api/osc/${userInfo.project}/-/pull_requests/new?type=commits&target_branch=${params.target_branch}&check_branch=&source_branch=${params.source_branch}&page=1&per_page=2`;
    const response = await chrome.runtime.sendMessage({
      action: "getPullRequestList",
      data: { url: finalUrl },
    });
    if (response && response.code === 0 && response.data?.title) {
      await this.commonHelper.copyToClipboard(response.data.title);
      this.commonHelper.showMessage(response.data.title, "success");
      this.commonHelper.closeWindow();
    } else {
      this.commonHelper.showMessage(response?.message || "获取Title失败");
    }
  };
  /**
   * 自动接受Pull Request
   */
  autoAcceptPullRequest = async ({ tab, userInfo }) => {
    if (
      !tab.url?.includes(
        `https://devops.cscec.com/osc/_source/osc/${userInfo.project}/-/pull_requests/`
      )
    ) {
      this.commonHelper.showMessage("当前页面不是接受Pull Request页面");
      return;
    }
    const result = await chrome.runtime.sendMessage({
      action: "autoAcceptPullRequest",
    });
    if (result && result.code === 0) {
      this.commonHelper.showMessage("接受Pull Request成功", "success");
      // 更新当前页面跳转到我的分支页面
      setTimeout(async () => {
        await this.commonHelper.updateCurrentTabUrl(
          `https://devops.cscec.com/osc/_source/osc/${userInfo.project}/-/cherry_pick/new`
        );
      }, 1000);
    } else {
      this.commonHelper.showMessage(result?.message || "接受Pull Request失败");
    }
  };
  /**
   * 获取上周的commit列表
   */
  fetchLastWeekCommits = async (args) => {
    const { firstDay, lastDay } = this.commonHelper.getPreviousWeekRange();
    this.fetchCommits(firstDay, lastDay, "get-last-week-commit-list-btn", args);
  };
  /**
   * 获取本周的commit列表
   */
  fetchCurrentWeekCommits = async (args) => {
    const { firstDay, lastDay } = this.commonHelper.getCurrentWeekRange();
    this.fetchCommits(
      firstDay,
      lastDay,
      "get-current-week-commit-list-btn",
      args
    );
  };
  /**
   * 获取指定日期范围的commit列表
   */
  fetchCommits = async (firstDay, lastDay, buttonId, { tab, userInfo }) => {
    const { email, project } = userInfo || {};
    const btn = document.getElementById(buttonId);
    if (btn && !btn.getAttribute("data-original-text")) {
      btn.setAttribute("data-original-text", btn.textContent);
    }
    this.commonHelper.setButtonLoading(buttonId, true);
    // 获取并重置显示区域
    const outputDiv = document.getElementById("ai-report-output");
    const copyBtn = document.getElementById("copy-report-btn");
    const outputGroup = document.getElementById("ai-report-output-group");
    if (outputGroup) outputGroup.style.display = "block";
    if (outputDiv) {
      outputDiv.textContent = "正在获取提交记录...";
      outputDiv.style.color = "#333";
    }
    if (copyBtn) copyBtn.style.display = "none";
    const url = `https://devops.cscec.com/api/code/api/osc/${project}/-/commits?commit_id=&keyword=&committer_name=${email}&author_name=&start_date=${firstDay}&end_date=${lastDay}&count=0&ref=heads%2Fuat&path=&page=1&per_page=200&scope=include_refs`;
    const response = await chrome.runtime.sendMessage({
      action: "getCommitList",
      data: { url },
    });

    if (response && response.code === 0) {
      const lists = response?.data || [];
      const commitList = lists
        .filter((item) => !item.merge_commit)
        .map((item) => {
          return {
            title: item.title || item.message,
            created_at: new Date(
              item.created_at || item.updated_at
            ).toLocaleDateString(),
          };
        });
      if (commitList.length === 0) {
        this.commonHelper.showMessage("该时间段内没有找到提交记录");
        if (outputDiv) outputDiv.textContent = "该时间段内没有找到提交记录。";
        this.commonHelper.setButtonLoading(buttonId, false);
        return;
      }
      const { geminiKey, prompt } = await this.userInfoService.getUserInfo();
      if (geminiKey && prompt) {
        if (outputDiv)
          outputDiv.textContent = "成功获取提交记录...\n正在生成 AI 日报...\n";
        // 调用流式生成接口
        await this.geminiService.generateReportStream(
          geminiKey,
          JSON.stringify(commitList),
          prompt,
          (currentText) => {
            // 实时更新回调
            if (outputDiv) {
              outputDiv.textContent = currentText;
              // 自动滚动到底部
              outputDiv.scrollTop = outputDiv.scrollHeight;
            }
          },
          (fullText) => {
            // 完成回调
            this.commonHelper.showMessage("日报生成完成，点击复制", "success");
            this.commonHelper.setButtonLoading(buttonId, false);
            // 显示复制按钮
            if (copyBtn) {
              copyBtn.style.display = "block";
              copyBtn.onclick = () => {
                this.commonHelper.copyToClipboard(fullText);
                this.commonHelper.showMessage("已复制到剪切板", "success");
                this.commonHelper.closeWindow();
              };
            }
          },
          (errorMessage) => {
            // 错误回调
            if (outputDiv) {
              outputDiv.textContent += `\n\n[错误]: ${errorMessage}`;
              outputDiv.style.color = "red";
            }
            this.commonHelper.setButtonLoading(buttonId, false);
          }
        );
      } else {
        await this.commonHelper.copyToClipboard(JSON.stringify(commitList));
        if (outputDiv)
          outputDiv.textContent =
            "未配置 Gemini API Key，已仅获取原始 Commit 记录并复制到剪切板。";
        this.commonHelper.showMessage(
          "未配置Gemini API Key或提示词，已复制提交记录到剪切板",
          "success"
        );
      }
      this.commonHelper.setButtonLoading(buttonId, false);
    } else {
      this.commonHelper.showMessage(
        response?.message || "获取Commit失败，刷新页面后重试"
      );
      this.commonHelper.setButtonLoading(buttonId, false);
    }
  };
}
class PipelineService {
  constructor() {
    this.commonHelper = new CommonHelper();
    this.pipelineCommonConfig = {
      params: {
        APP_VERSION: "1.12.0",
        skip: "1",
      },
    };
    this.pipelineConfig = {
      cost: {
        gray: {
          branch: "uat",
          pipelineConfId: 4573,
        },
        uat: {
          branch: "stable-uat",
          pipelineConfId: 876,
        },
      },
      public: {
        gray: {
          branch: "uat",
          pipelineConfId: 4577,
        },
        uat: {
          branch: "stable-uat",
          pipelineConfId: 874,
        },
      },
      target: {
        gray: {
          branch: "uat",
          pipelineConfId: 4569,
        },
        uat: {
          branch: "stable-uat",
          pipelineConfId: 877,
        },
      },
      income: {
        gray: {
          branch: "uat",
          pipelineConfId: 4566,
        },
        uat: {
          branch: "stable-uat",
          pipelineConfId: 873,
        },
      },
    };
  }

  runPipeline = async (_, config) => {
    const [type, branch, buttonId] = config;
    this.commonHelper.setButtonLoading(buttonId, true);
    const baseParams = this.pipelineConfig[type][branch];
    const response = await chrome.runtime.sendMessage({
      action: "runPipeline",
      data: {
        baseParams: {
          ...baseParams,
          params: this.pipelineCommonConfig.params,
        },
      },
    });
    if (response && response.code === 0) {
      this.commonHelper.showMessage("运行流水线成功", "success");
      this.commonHelper.closeWindow();
    } else {
      this.commonHelper.showMessage("运行流水线失败");
    }
    this.commonHelper.setButtonLoading(buttonId, false);
  };
}
class DcsService {
  constructor() {
    this.commonHelper = new CommonHelper();
  }
  /**
   * 获取用户信息
   */
  fetchUserInfo = async ({ tab }) => {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: () => {
        if (
          typeof window.$udp !== "undefined" &&
          typeof window.$udp.getUser === "function"
        ) {
          return window.$udp.getUser();
        }
        return null;
      },
    });
    if (results?.[0]?.result) {
      const userInfo = results?.[0]?.result;
      const jsonStr = JSON.stringify(userInfo, null, 2);
      await this.commonHelper.copyToClipboard(jsonStr);
      this.commonHelper.showMessage("用户信息已复制到剪切板", "success");
      this.commonHelper.closeWindow();
    } else {
      this.commonHelper.showMessage("$udp对象不存在无法获取用户信息");
    }
  };
}
class UserInfoService {
  constructor() {
    this.commonHelper = new CommonHelper();
  }
  /**
   * 渲染用户信息
   */
  renderUserInfo = async () => {
    const { email, project, geminiKey, prompt } = await this.getUserInfo();
    const emailInput = document.getElementById("email-input");
    const projectInput = document.getElementById("project-input");
    const geminiKeyInput = document.getElementById("gemini-key-input");
    const promptInput = document.getElementById("prompt-input");
    if (emailInput && email) {
      emailInput.value = email;
    }
    if (projectInput && project) {
      projectInput.value = project;
    }
    if (geminiKeyInput && geminiKey) {
      geminiKeyInput.value = geminiKey;
    }
    if (promptInput && prompt) {
      promptInput.value = prompt;
    }
  };
  /**
   * 获取用户信息
   * @returns {Object}
   */
  getUserInfo = async () => {
    const result = await this.commonHelper.getLocalStorage("userInfo");
    const { email, project, geminiKey, prompt } = result || {};
    return { email, project, geminiKey, prompt };
  };
}
class GeminiService {
  constructor() {
    this.model = "gemini-2.5-flash";
    this.baseUrl = `https://gemini-api.getan.edu.kg/v1beta/models/${this.model}`;
  }
  /**
   * 调用 Gemini 生成周报，普通方式
   * @param {string} apiKey - Gemini API Key
   * @param {Array} commits - 提交记录列表
   * @returns {Promise<string>} - AI 生成的文本
   */
  generateReport = async (apiKey, commits, prompt) => {
    // 构建 Prompt
    const finalPrompt = `${prompt}\n${commits}`;
    const url = `${this.baseUrl}:generateContent`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: finalPrompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return generatedText || "AI 未返回有效内容";
  };
  /**
   * 调用 Gemini 生成周报 (流式)
   * @param {string} apiKey - Gemini API Key
   * @param {string} commits - 提交记录
   * @param {string} prompt - 提示词
   * @param {function} onUpdate - 回调函数，每收到一段文字调用一次 (text) => void
   * @param {function} onComplete - 完成时的回调 (fullText) => void
   * @param {function} onError - 出错时的回调 (error) => void
   */
  generateReportStream = async (
    apiKey,
    commits,
    prompt,
    onUpdate,
    onComplete,
    onError
  ) => {
    const finalPrompt = `${prompt}\n${commits}`;
    // 使用 streamGenerateContent 接口，并开启 SSE 模式 (alt=sse)
    const url = `${this.baseUrl}:streamGenerateContent?alt=sse`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API 请求失败: ${response.status} ${response.statusText}`
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // 解析 SSE 数据
      const lines = buffer.split("\n");
      // 保留最后一个可能不完整的行
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue; // 结束标记
          const data = JSON.parse(jsonStr);
          const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textChunk) {
            fullText += textChunk;
            if (onUpdate) onUpdate(fullText); // 实时更新 UI
          }
        }
      }
    }
    if (onComplete) onComplete(fullText);
  };
}
const coreController = new CoreController();
document.addEventListener("DOMContentLoaded", () => {
  coreController.init();
});
window.addEventListener("beforeunload", () => {
  coreController.removeEventListener();
});
