class CoreController {
  constructor() {
    this.userInfoService = new UserInfoService();
    this.urlButtonManager = new UrlButtonManager();
    this.dcsService = new DcsService();
    this.gitlabService = new GitlabService();
    this.commonHelper = new CommonHelper();
  }
  init = () => {
    this.urlButtonManager.loadUrlButtons();
    this.userInfoService.renderUserInfo();
    this.addEventListener();
  };
  addEventListener = () => {
    // 获取用户信息按钮
    const getUserBtn = document.getElementById("get-user-btn");
    if (getUserBtn) {
      getUserBtn.addEventListener("click", this.dcsService.fetchUserInfo);
    }
    // 获取上周日报按钮
    const getLastWeekCommitListBtn = document.getElementById(
      "get-last-week-commit-list-btn"
    );
    if (getLastWeekCommitListBtn) {
      getLastWeekCommitListBtn.addEventListener(
        "click",
        this.gitlabService.fetchLastWeekCommits
      );
    }
    // 获取本周日报按钮
    const getCurrentWeekCommitListBtn = document.getElementById(
      "get-current-week-commit-list-btn"
    );
    if (getCurrentWeekCommitListBtn) {
      getCurrentWeekCommitListBtn.addEventListener(
        "click",
        this.gitlabService.fetchCurrentWeekCommits
      );
    }
    // 添加跳转按钮
    const addMenuButton = document.getElementById("add-menu-button");
    if (addMenuButton) {
      addMenuButton.addEventListener(
        "click",
        this.urlButtonManager.addUrlButton
      );
    }
    // 监听 email 和 project 输入变化
    const emailInput = document.getElementById("email-input");
    const projectInput = document.getElementById("project-input");
    if (emailInput) {
      emailInput.addEventListener("input", () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "email",
          emailInput.value.trim()
        );
      });
    }
    if (projectInput) {
      projectInput.addEventListener("input", () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "project",
          projectInput.value.trim()
        );
      });
    }
    // 监听gemini-key-input和prompt-input输入变化
    const geminiKeyInput = document.getElementById("gemini-key-input");
    const promptInput = document.getElementById("prompt-input");
    if (geminiKeyInput) {
      geminiKeyInput.addEventListener("input", () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "geminiKey",
          geminiKeyInput.value.trim()
        );
      });
    }
    if (promptInput) {
      promptInput.addEventListener("input", () => {
        this.commonHelper.updateLocalStorage(
          "userInfo",
          "prompt",
          promptInput.value.trim()
        );
      });
    }
    // 创建Pull Request按钮
    const autoPullTitleBtn = document.getElementById("auto-pull-title-btn");
    if (autoPullTitleBtn) {
      autoPullTitleBtn.addEventListener(
        "click",
        this.gitlabService.autoCreatePullRequest
      );
    }
    // 设置页面开关按钮
    const settingsIcon = document.getElementById("settings-icon");
    const settingsPanel = document.getElementById("settings-panel");
    const settingsCloseBtn = document.getElementById("settings-close-btn");
    if (settingsIcon && settingsPanel) {
      settingsIcon.addEventListener("click", () => {
        settingsPanel.classList.remove("hide");
        settingsPanel.classList.add("show");
      });
    }
    if (settingsCloseBtn && settingsPanel) {
      settingsCloseBtn.addEventListener("click", () => {
        settingsPanel.classList.remove("show");
        settingsPanel.classList.add("hide");
      });
    }
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
    try {
      const url = tab.url || "";
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
    } catch (error) {
      this.showMessage("重新刷新页面后重试");
      return {
        tab,
        isInWhiteList: false,
      };
    }
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
        const deleteBadge = isDefault
          ? ""
          : `<span class="delete-badge" data-index="${index}"></span>`;
        return `
        <div class="url-button-item ${isDefault ? "default" : ""}">
          <button class="url-btn btn-teal" data-url="${item.url}">${
          item.btn
        }</button>
          ${deleteBadge}
        </div>
      `;
      })
      .join("");

    container.querySelectorAll(".url-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.updateTabUrl(e.target.getAttribute("data-url"));
      });
    });

    container.querySelectorAll(".delete-badge").forEach((badge) => {
      badge.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute("data-index"));
        this.deleteUrlButton(index);
      });
    });
  };
  /**
   * 跳转URL
   * @param {string} url - 要跳转的URL
   */
  updateTabUrl = async (url) => {
    const tab = await this.commonHelper.getCurrentTab();
    if (!tab) return;
    await chrome.tabs.update(tab.id, { url: url });
    this.commonHelper.closeWindow();
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
   * 自动填写标题并创建Pull Request
   */
  autoCreatePullRequest = async () => {
    try {
      const { isInWhiteList, tab } = await this.commonHelper.validateDomain([
        "devops",
      ]);
      if (!isInWhiteList) return;
      const { email, project } = await this.userInfoService.getUserInfo();
      if (!email || !project) {
        this.commonHelper.showMessage("请先配置邮箱和项目");
        return;
      }
      if (
        !tab.url?.includes(
          `https://devops.cscec.com/osc/_source/osc/${project}/-/pull_requests/new?source_branch`
        )
      ) {
        this.commonHelper.showMessage("当前页面不是创建Pull Request页面");
        return;
      }

      const params = this.commonHelper.parseUrlParams(tab.url);
      const finalUrl = `https://devops.cscec.com/api/code/api/osc/${project}/-/pull_requests/new?type=commits&target_branch=${params.target_branch}&check_branch=&source_branch=${params.source_branch}&page=1&per_page=2`;
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            action: "getPullRequestList",
            data: { url: finalUrl },
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            resolve(response);
          }
        );
      });
      if (response && response.code === 0 && response.data?.title) {
        await this.commonHelper.copyToClipboard(response.data.title);
        this.commonHelper.showMessage(response.data.title, "success");
        this.commonHelper.closeWindow();
      } else {
        this.commonHelper.showMessage("获取Title失败");
      }
    } catch (error) {
      this.commonHelper.showMessage("执行异常: 刷新页面后重试");
    }
  };
  /**
   * 获取上周的commit列表
   */
  fetchLastWeekCommits = async () => {
    const { firstDay, lastDay } = this.commonHelper.getPreviousWeekRange();
    this.fetchCommits(firstDay, lastDay, "get-last-week-commit-list-btn");
  };
  /**
   * 获取本周的commit列表
   */
  fetchCurrentWeekCommits = async () => {
    const { firstDay, lastDay } = this.commonHelper.getCurrentWeekRange();
    this.fetchCommits(firstDay, lastDay, "get-current-week-commit-list-btn");
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
   * 获取指定日期范围的commit列表
   */
  fetchCommits = async (firstDay, lastDay, buttonId) => {
    const btn = document.getElementById(buttonId);
    if (btn && !btn.getAttribute("data-original-text")) {
      btn.setAttribute("data-original-text", btn.textContent);
    }
    this.setButtonLoading(buttonId, true);
    try {
      const { isInWhiteList } = await this.commonHelper.validateDomain([
        "devops",
      ]);
      if (!isInWhiteList) {
        this.setButtonLoading(buttonId, false);
        return;
      }

      const { email, project } = await this.userInfoService.getUserInfo();
      if (!email || !project) {
        this.commonHelper.showMessage("请先配置邮箱和项目");
        this.setButtonLoading(buttonId, false);
        return;
      }
      const url = `https://devops.cscec.com/api/code/api/osc/${project}/-/commits?commit_id=&keyword=&committer_name=${email}&author_name=&start_date=${firstDay}&end_date=${lastDay}&count=0&ref=heads%2Fuat&path=&page=1&per_page=200&scope=include_refs`;

      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            action: "getCommitList",
            data: { url },
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            resolve(response);
          }
        );
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
          this.setButtonLoading(buttonId, false);
          return;
        }
        const { geminiKey, prompt } = await this.userInfoService.getUserInfo();
        if(geminiKey && prompt) {
          await this.commonHelper.copyToClipboard(JSON.stringify(commitList));
          this.commonHelper.showMessage(
            "获取日报成功，开始AI生成日报",
            "success"
          );
          const report = await this.geminiService.generateReport(geminiKey, JSON.stringify(commitList), prompt);
          await this.commonHelper.copyToClipboard(report);
          this.commonHelper.showMessage("AI日报已生成并复制到剪切板", "success");
        }else {
          await this.commonHelper.copyToClipboard(JSON.stringify(commitList));
          this.commonHelper.showMessage(
            "未配置Gemini API Key或提示词，已复制提交记录到剪切板",
            "success"
          );
        }
        this.setButtonLoading(buttonId, false);
        this.commonHelper.closeWindow();
      } else {
        this.commonHelper.showMessage(
          response?.message || "获取Commit失败，刷新页面后重试"
        );
        this.setButtonLoading(buttonId, false);
      }
    } catch (error) {
      this.commonHelper.showMessage("执行异常: 刷新页面后重试");
      this.setButtonLoading(buttonId, false);
    }
  };
}
class DcsService {
  constructor() {
    this.commonHelper = new CommonHelper();
  }
  /**
   * 获取用户信息
   */
  fetchUserInfo = async () => {
    try {
      const { isInWhiteList, tab } = await this.commonHelper.validateDomain([
        "gray",
      ]);
      if (!isInWhiteList) return;
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
    } catch (error) {
      this.commonHelper.showMessage("执行异常: 刷新页面后重试");
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
    try {
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
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("AI 生成失败: " + error.message);
    }
  };
}
const coreController = new CoreController();
document.addEventListener("DOMContentLoaded", () => {
  coreController.init();
});
