class CoreController {
  constructor() {
    this.commonHelper = new CommonHelper();
  }
  init = () => {
    this.addEventListener();
  };
  addEventListener = () => {
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
      const url = tab.url;
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
const coreController = new CoreController();
document.addEventListener("DOMContentLoaded", () => {
  coreController.init();
});
