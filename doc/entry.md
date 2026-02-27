## 数字确定分支【app-8b356e9c830ae78ba3eb-entry.js】

替换前的内容

```js | pure
Ts = function (e, t) {
  return window.$http.get("".concat(Object(i["a"])(t), "/branches/names"), {
    params: e,
  });
};
```

替换后的内容

```js | pure
Ts = async function (e, t) {
  const branchMap = {1: "dev", 2: "uat", 3: "stable-uat", 4: "stable"};
  if (Object.keys(branchMap).includes(e.name)) {
    const res = {
      data: {
        data: {branch: [branchMap[e.name]]},
        meta: {current_page: 1, total_pages: 1, total_count: 1}
      }
    };
    return Promise.resolve(res);
  }
  
  return window.$http.get("".concat(Object(i["a"])(t), "/branches/names"), {params: e});
}
```

## 流水线查询分支接口增加环境类型参数【main.5ece8d7d22.js】

替换前的内容

``` js | pure
o = e => {
  let {materialSourcePipelineId: t, sourceType: n, certificateId: o, keyword: c, limit: d, offset: u=0} = e;
  const p = (0,
  l.Eq)({
      query: c,
      materialSourcePipelineId: t,
      _offset: u,
      _limit: d
  })
  , h = s.getCacheKey("__getMany", p);
  let m;
  return m = s.has(h) ? Promise.resolve(s.get(h)) : (0,
  i.A_)(r.VP, p).then((e => (s.set(h, e.data),
  e.data))),
  m.then((e => ({
      request: {
          params: {
              materialSourcePipelineId: t
          },
          query: (0,
          a.Z)(( (e, t) => t.startsWith("_")), p),
          meta: {
              offset: u,
              limit: d
          }
      },
      response: e
  })))
```

替换后的内容

```js | pure
o = e => {
  let {materialSourcePipelineId: t, sourceType: n, certificateId: o, keyword: c, limit: d, offset: u=0, pattern} = e;
  const p = (0,
  l.Eq)({
      query: c,
      materialSourcePipelineId: t,
      _offset: u,
      _limit: d
  })
  , h = s.getCacheKey("__getMany", p);
  let m;
  return m = s.has(h) ? Promise.resolve(s.get(h)) : (0,
  i.A_)(r.VP, {pattern,...p}).then((e => (s.set(h, e.data),
  e.data))),
  m.then((e => ({
      request: {
          params: {
              materialSourcePipelineId: t
          },
          query: (0,
          a.Z)(( (e, t) => t.startsWith("_")), p),
          meta: {
              offset: u,
              limit: d
          }
      },
      response: e
  })))
```

## 仅展示自己的提交、过滤已合并节点记录【chunk-23b24f81.0b5151df.js】

替换前的内容

```js | pure
loadCommits: function(t) {
  var e = this;
  if (!this.commitsLoading) {
    t && (this.commitsList = []),
    this.commitsLoading = !0;
    var i = Object(r["a"])(Object(r["a"])({}, this.params), {}, {
        page: this.page,
        per_page: this.per_page
    });
    "pending" === this.type && (i.no_check = !0),
    this.$http.get(this.commitsUrl, {
        params: i,
        noCancel: ["pending", "pullCommits"].includes(this.type),
        messageType: "warning"
    })
    // ...
  }
}
```
替换后的内容

```js | pure
loadCommits: function(t) {
  var e = this;
  if (!this.commitsLoading) {
    t && (this.commitsList = []),
    this.commitsLoading = !0;
    var is_cherry_pick_page = window?.location?.href?.includes('cherry_pick')
    // 自动点击【选择commit】按钮
    if (is_cherry_pick_page && document.querySelector('button[data-v-61b9d150]')) {
      document.querySelector('button[data-v-61b9d150]').click();
    }
    let params_extend = {}
    // 根据条件来控制是否仅显示自己的提交
    if(is_cherry_pick_page && window?.__EXTENSION_REGITLAB_CONFIG?.onlyMyself && window?.__EXTENSION_REGITLAB_CONFIG?.email) {
      params_extend['committer_name'] = window?.__EXTENSION_REGITLAB_CONFIG?.email;
      this.per_page = 100
    }
    if (is_cherry_pick_page && window?.__EXTENSION_REGITLAB_CONFIG?.filterMergeCommit) {
      this.per_page = 100
    }
    var i = Object(r["a"])(Object(r["a"])({}, this.params), {}, {
        page: this.page,
        per_page: this.per_page,
        ...params_extend
    });
    "pending" === this.type && (i.no_check = !0),
    this.$http.get(this.commitsUrl, {
        params: i,
        noCancel: ["pending", "pullCommits"].includes(this.type),
        messageType: "warning"
    }).then(function() {
      var t = Object(o["a"])(Object(a["a"])().mark((function t(i) {
        if (i.data && Array.isArray(i.data.data)) {
          if (is_cherry_pick_page && window?.__EXTENSION_REGITLAB_CONFIG?.filterMergeCommit) {
            i.data.data = i.data.data.filter((item) => {
              // 过滤已合并，和合并节点
              return !item.merge_commit && !item.target_branch_merged;
            })
          }
        }
        //...
    // ...
  })
}
```
