class UtilsService {
  constructor() {
    this.ERROR_MESSAGE = "请求失败，检查参数或网络";
    this.SUCCESS_MESSAGE = "请求成功";
  }
  sendErrorResponse = (args) => {
    args.sendResponse({ code: 500, message: this.ERROR_MESSAGE, data: null });
  };
  sendSuccessResponse = (args, result = null) => {
    args.sendResponse({ code: 0, message: this.SUCCESS_MESSAGE, data: result });
  };
  customGitlabFetch = async (url, callback, args) => {
    try {
      const response = await fetch(url, {
        referrer: window.location.href,
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      });
      const resp = await response.json();
      const result = resp?.data ? resp?.data : resp || null;
      callback(args, result);
    } catch (error) {
      this.sendErrorResponse(args);
    }
  };
  createPullRequest = async (title) => {
    // 自动填写标题
    const input = document.querySelector(
      'input[autocomplete="off"][placeholder="标题"][maxlength="255"][class="el-input__inner"]'
    );
    if (input) {
      input.value = title;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    // 点击创建按钮
    setTimeout(() => {
      const createBtn = document.querySelector(
        "#pane-profile > form > button.el-button.el-button--osc.el-button--medium"
      );
      if (createBtn) {
        createBtn.click();
      }
    }, 1000);
  };
}
const utilsService = new UtilsService();
const handle = {
  getPullRequestList: (request, _, sendResponse) => {
    utilsService.customGitlabFetch(
      request.data.url,
      (args, result) => {
        let title = "合并";
        if (result.length === 1) {
          title = result[0].title;
        }
        utilsService.sendSuccessResponse(args, { title });
        utilsService.createPullRequest(title);
      },
      { sendResponse }
    );
  },
  getCommitList: (request, _, sendResponse) => {
    utilsService.customGitlabFetch(request.data.url, utilsService.sendSuccessResponse, { sendResponse });
  },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action } = request;
  handle[action] && handle[action](request, sender, sendResponse);
  return true;
});
