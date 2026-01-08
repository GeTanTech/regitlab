function hashId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 2147483647 || 1;
}

function getUrlReplacements() {
  const raw = {
    js: [
      {
        remoteUrl: "https://devops.cscec.com/assets/gitee/code/js/app-8b356e9c830ae78ba3eb-entry.js",
        localPath: "replacement/js/app-8b356e9c830ae78ba3eb-entry.js",
        id: "app-8b356e9c830ae78ba3eb-entry.js",
      },
      {
        remoteUrl: "https://devops.cscec.com/assets/new-ipipe/static/static/js/main.5ece8d7d22.js",
        localPath: "replacement/js/main.5ece8d7d22.js",
        id: "main.5ece8d7d22.js",
      },
    ],
    css: [],
    json: [
      {
        remoteUrl: "https://devops.cscec.com/osc/_ipipe/ipipe/pipeline/rest/v1/pipeline-sources/branches?pattern=dev&*",
        localPath: "replacement/json/dev.json",
        id: "dev.json",
      },
      {
        remoteUrl: "https://devops.cscec.com/osc/_ipipe/ipipe/pipeline/rest/v1/pipeline-sources/branches?pattern=uat&*",
        localPath: "replacement/json/uat.json",
        id: "uat.json",
      },
      {
        remoteUrl: "https://devops.cscec.com/osc/_ipipe/ipipe/pipeline/rest/v1/pipeline-sources/branches?pattern=stable-uat&*",
        localPath: "replacement/json/stable-uat.json",
        id: "stable-uat.json",
      },
      {
        remoteUrl: "https://devops.cscec.com/osc/_ipipe/ipipe/pipeline/rest/v1/pipeline-sources/branches?pattern=stable&*",
        localPath: "replacement/json/stable.json",
        id: "stable.json",
      },
    ],
  };
  
  return {
    js: raw.js.map(r => ({ ...r, id: hashId(r.id) })),
    css: raw.css.map(r => ({ ...r, id: hashId(r.id) })),
    json: raw.json.map(r => ({ ...r, id: hashId(r.id) })),
  };
}

self.getUrlReplacements = getUrlReplacements;
