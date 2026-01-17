class UtilsService {
  constructor() {
    this.ERROR_MESSAGE = "请求失败，检查参数或网络";
    this.SUCCESS_MESSAGE = "请求成功";
    this.gitlabDomain = "https://devops.cscec.com";
  }
  sendErrorResponse = (args) => {
    args.sendResponse({
      code: 500,
      message: args.message || this.ERROR_MESSAGE,
      data: null,
    });
  };
  sendSuccessResponse = (args, result = null) => {
    args.sendResponse({
      code: 0,
      message: args.message || this.SUCCESS_MESSAGE,
      data: result,
    });
  };
  customGitlabFetch = async (url, callback, args, method = "GET") => {
    try {
      const response = await fetch(url, {
        referrer: window.location.href,
        body: null,
        method,
        mode: "cors",
        credentials: "include",
      });
      const resp = await response.json();
      const result = resp?.data ? resp?.data : resp || null;
      callback(args, result);
    } catch (error) {
      if (args.sendResponse) {
        this.sendErrorResponse(args);
      } else {
        throw error;
      }
    }
  };
  customGitlabDelete = async (url, callback, args) => {
    await this.customGitlabFetch(url, callback, args, "DELETE");
  };
  commonFetch = async (url, options = {}) => {
    const { method, body, referrer, mode, credentials, headers } = options;
    const response = await fetch(url, {
      referrer: referrer || window.location.href,
      body: body || null,
      method: method || "GET",
      mode: mode || "cors",
      credentials: credentials || "include",
      headers: headers || {},
    });
    const resp = await response.json();
    const result = resp?.data ? resp?.data : resp || null;
    return result;
  };
  delay = (ms = 1500) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    const { project, target_branch, source_branch } = request.data;
    const url = `${utilsService.gitlabDomain}/api/code/api/osc/${project}/-/pull_requests/new?type=commits&target_branch=${target_branch}&check_branch=&source_branch=${source_branch}&page=1&per_page=2`;
    utilsService.customGitlabFetch(
      url,
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
  autoAcceptPullRequest: async (request, _, sendResponse) => {
    // 接受
    const acceptBtn = document.querySelector(
      "#spa-mount-point > div > div.code-app-layout > div > div > div:nth-child(1) > div.ent-resource-main.has-menu > div > div > div.pull-detail__info-wrapper > div.pull-detail__info > div.pull-detail__info__tools__actions > div.pull_detail_action_top > div > span:nth-child(1) > span > button"
    );
    if (acceptBtn) {
      acceptBtn.click();
    } else {
      utilsService.sendErrorResponse({
        sendResponse,
        message: "接受按钮不存在",
      });
      return true;
    }
    await utilsService.delay(800);
    // merge
    const mergeBtn = Array.from(document.querySelectorAll(".merge_list")).find(
      (el) => {
        const h4 = el.querySelector("h4");
        return h4 && h4.textContent.trim() === "Merge";
      }
    );
    if (mergeBtn) {
      mergeBtn.click();
    } else {
      utilsService.sendErrorResponse({
        sendResponse,
        message: "合并按钮不存在",
      });
      return true;
    }
    await utilsService.delay(800);
    // 确定
    const confirmBtn = document.querySelector(
      "body > div.el-dialog__wrapper > div > div.el-dialog__footer > span > button.el-button.el-button--osc.el-button--medium"
    );
    if (confirmBtn) {
      confirmBtn.click();
    } else {
      utilsService.sendErrorResponse({
        sendResponse,
        message: "确定按钮不存在",
      });
      return true;
    }
    utilsService.sendSuccessResponse({
      sendResponse,
      message: "接受Pull Request成功",
    });
  },
  getCommitList: (request, _, sendResponse) => {
    const { project, email, firstDay, lastDay, branch='uat' } = request.data;
    const url = `${utilsService.gitlabDomain}/api/code/api/osc/${project}/-/commits?commit_id=&keyword=&committer_name=${email}&author_name=&start_date=${firstDay}&end_date=${lastDay}&count=0&ref=heads%2F${branch}&path=&page=1&per_page=200&scope=include_refs`;
    utilsService.customGitlabFetch(url, utilsService.sendSuccessResponse, {
      sendResponse,
    });
  },
  getMyBranches: (request, _, sendResponse) => {
    const { project } = request.data;
    const url = `${utilsService.gitlabDomain}/api/code/api/osc/${project}/-/branches?filter=my&page=1&per_page=50`;
    utilsService.customGitlabFetch(url, utilsService.sendSuccessResponse, {
      sendResponse,
    });
  },
  clearBranches: async (request, _, sendResponse) => {
    const { branches = [], project } = request.data;
    if (branches.length === 0 || !project) {
      utilsService.sendErrorResponse({ sendResponse });
      return true;
    }
    try {
      for (const branch of branches) {
        const url = `${utilsService.gitlabDomain}/api/code/api/osc/${project}/-/branches/${branch}`;
        await utilsService.customGitlabDelete(url, () => {}, {
          sendResponse: null,
        });
      }
      utilsService.sendSuccessResponse({ sendResponse });
    } catch (error) {
      utilsService.sendErrorResponse({ sendResponse });
    }
  },
  // 运行pipeline
  runPipeline: async (request, _, sendResponse) => {
    try {
      const { baseParams } = request.data;
      const { branch, pipelineConfId, params } = baseParams;
      const referrer = `${utilsService.gitlabDomain}/osc/_ipipe/new-ipipe/pipelines/list?viewId=FAVORITE`;
      // 获取pipeline信息
      const piplineInfo = await utilsService.commonFetch(
        `${utilsService.gitlabDomain}/osc/_ipipe/ipipe/pipeline/rest/v4/pipelines/${pipelineConfId}?encryptParams=false`,
        { referrer }
      );
      const materialSourcePipelineId = piplineInfo?.watchers?.find(
        (watcher) => watcher.pipelineConfId === pipelineConfId
      )?.materialSourcePipelineId;
      if (!materialSourcePipelineId) {
        utilsService.sendErrorResponse({
          sendResponse,
          message: "获取pipeline信息失败",
        });
        return true;
      }
      // 获取commit列表
      const commitList = await utilsService.commonFetch(
        `${utilsService.gitlabDomain}/osc/_ipipe/ipipe/pipeline/rest/v1/pipeline-sources/branches/commits?branch=${branch}&materialSourcePipelineId=${materialSourcePipelineId}&_offset=0&_limit=1`,
        { referrer }
      );
      const commit = commitList[0];
      const materialId = commit?.materialId;
      if (!materialId) {
        utilsService.sendErrorResponse({
          sendResponse,
          message: "获取materialId失败",
        });
        return true;
      }
      // 运行pipeline
      const queryParams = {
        pipelineConfId,
        params,
        materialAndPipelineSourceRefs: [
          {
            materialId,
            materialSourcePipelineId,
            beJoinJobRun: true,
          },
        ],
      };
      const result = await utilsService.commonFetch(
        `${utilsService.gitlabDomain}/osc/_ipipe/ipipe/pipeline/rest/v4/pipeline-builds`,
        {
          referrer,
          method: "POST",
          body: JSON.stringify(queryParams),
          headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
            xly_enterprise: "osc",
            xly_project: "_ipipe",
          },
        }
      );
      if (("" + result)?.includes("true")) {
        utilsService.sendSuccessResponse({ sendResponse });
      } else {
        utilsService.sendErrorResponse({
          sendResponse,
          message: "运行pipeline失败",
        });
      }
    } catch (error) {
      utilsService.sendErrorResponse({
        sendResponse,
        message: "运行pipeline失败",
      });
    }
  },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action } = request;
  handle[action] && handle[action](request, sender, sendResponse);
  return true;
});
