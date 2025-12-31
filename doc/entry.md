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
Ts = async function(e, t) {
  const branchMap = {
    "1": "dev",
    "2": "uat",
    "3": "stable-uat",
    "4": "stable"
  }
  if(Object.keys(branchMap).includes(e.name)){
    e.name = branchMap[e.name]
    e.per_page = 1000
    e.filter_hidden_branch = false
  }
  const res = await window.$http.get("".concat(Object(i["a"])(t), "/branches/names"), {
      params: e
  })
  if(Object.values(branchMap).includes(e.name)){
      let branch = res.data.data.branch
      res.data.data.branch = branch.filter(item=>item == e.name)
      res.data.meta.total_count = 1
      res.data.meta.
  }
  return Promise.resolve(res)
}
```

进一步优化

```js | pure
Ts = async function (e, t) {
  const branchMap = {
    1: "dev",
    2: "uat",
    3: "stable-uat",
    4: "stable",
  };
  if(Object.keys(branchMap).includes(e.name)){
    const res = {
      data: {
        data: {
          branch: [branchMap[e.name]],
        },
         meta: {
          current_page: 1,
          total_pages: 1,
          total_count: 1,
        },
      }
    };
    return Promise.resolve(res);
  }
  return window.$http.get("".concat(Object(i["a"])(t), "/branches/names"), {
    params: e,
  });
}
```
