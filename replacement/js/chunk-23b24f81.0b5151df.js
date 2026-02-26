(window["webpackJsonpgitee"] = window["webpackJsonpgitee"] || []).push([["chunk-23b24f81"], {
    "019a": function(t, e, i) {},
    "0e0b": function(t, e, i) {
        "use strict";
        i("daef")
    },
    "0f50": function(t, e, i) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("CommonLabel", {
                attrs: {
                    label: {
                        name: t.text
                    },
                    bgcolor: "#FFAB00"
                }
            })
        }
          , n = []
          , a = i("8f24")
          , o = {
            components: {
                CommonLabel: a["a"]
            },
            props: {
                text: {
                    type: String,
                    default: ""
                }
            }
        }
          , r = o
          , c = i("2877")
          , l = Object(c["a"])(r, s, n, !1, null, null, null);
        e["a"] = l.exports
    },
    "11a7": function(t, e, i) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", [t._t("title"), i("ul", {
                staticClass: "build_records"
            }, [t.data.length || t.loading ? t._e() : i("li", {
                staticClass: "loading-text mt-1"
            }, [t._v(t._s(t.$t("empty")))]), t._l(t.data, (function(e) {
                return i("li", {
                    key: e.id,
                    staticClass: "build_records_item"
                }, [i("ElTooltip", {
                    staticClass: "left",
                    attrs: {
                        "show-overflow-tooltip": "",
                        placement: "top",
                        content: "#" + e.job_number + " " + e.job_title
                    }
                }, [i("span", {
                    staticClass: "left_detail"
                }, [i("i", {
                    class: t.statusIcon(e.status)
                }), i("span", {
                    staticClass: "job_number"
                }, [t._v("#" + t._s(e.job_number))]), i("span", [t._v(t._s(e.job_title))])])]), i("a", {
                    attrs: {
                        href: e.url,
                        target: "_blank"
                    }
                }, [t._v(t._s(t.$t("pulls.detail")))])], 1)
            }
            )), t.hasMore && !t.loading ? i("li", {
                staticClass: "loading-text load-more mt-1",
                on: {
                    click: function() {
                        return t.$emit("loadMore")
                    }
                }
            }, [t._v(t._s(t.$t("load_more")) + "...")]) : t._e(), t.loading ? i("li", {
                staticClass: "loading-text mt-1"
            }, [t._v(" " + t._s(t.$t("loading")) + " "), i("i", {
                staticClass: "el-icon-loading"
            })]) : t._e()], 2)], 2)
        }
          , n = []
          , a = i("5a50")
          , o = {
            props: {
                data: {
                    type: Array,
                    default: function() {
                        return []
                    }
                },
                loading: {
                    type: Boolean,
                    default: !1
                },
                hasMore: {
                    type: Boolean,
                    default: !1
                }
            },
            methods: {
                statusIcon: function(t) {
                    return Object(a["s"])()[t]
                },
                getList: function() {
                    this.$emit("getList")
                }
            }
        }
          , r = o
          , c = (i("fe1f"),
        i("2877"))
          , l = Object(c["a"])(r, s, n, !1, null, "3df9a66c", null);
        e["a"] = l.exports
    },
    "1d00": function(t, e, i) {},
    2051: function(t, e, i) {
        "use strict";
        var s = i("ade3")
          , n = i("5530")
          , a = (i("99af"),
        i("4de4"),
        i("caad"),
        i("d81d"),
        i("13d5"),
        i("b64b"),
        i("d3b7"),
        i("2532"),
        i("159b"),
        i("270c"))
          , o = i("365c");
        e["a"] = {
            data: function() {
                return {
                    checkedColumns: [],
                    columnList: []
                }
            },
            methods: {
                finallyColumns: function(t, e, i, s) {
                    var n = Object(a["a"])(t, e, "prop").filter((function(t) {
                        return !Object.hasOwnProperty.call(t, "permission") || t.permission
                    }
                    ));
                    if (!i)
                        return n;
                    var o = this.storeConfig[i]
                      , r = {
                        columnsVisible: n.filter((function(t) {
                            if (Object.hasOwnProperty.call(t, "visible"))
                                return t.visible;
                            var e = s + (t.custom_prop || t.prop);
                            return !Object.hasOwnProperty.call(o, e) || o[s + (t.custom_prop || t.prop)]
                        }
                        )),
                        columnsDefault: n.filter((function(t) {
                            return t.prop
                        }
                        ))
                    };
                    return this.columnListVisible(r),
                    r
                },
                handleCheckedColumn: function(t, e) {
                    var i = this
                      , a = this.storeConfig[t]
                      , r = Object.keys(a).reduce((function(t, s) {
                        return t[s] = i.checkedColumns.map((function(t) {
                            return "".concat(e).concat(t.custom_prop || t.prop)
                        }
                        )).includes(s),
                        t
                    }
                    ), {})
                      , c = Object(n["a"])(Object(n["a"])({}, this.storeConfig), {}, Object(s["a"])({}, t, r));
                    Object(o["d"])({
                        config: c
                    }).then((function(t) {
                        var e = t.data;
                        i.$store.commit("userConfig/setUserConfig", e)
                    }
                    ))
                },
                columnListVisible: function(t) {
                    var e = t.columnsVisible
                      , i = t.columnsDefault;
                    this.columnList = i.filter((function(t) {
                        return t.label
                    }
                    )).map((function(t) {
                        return Object(n["a"])(Object(n["a"])({}, t), {}, {
                            value: t.label,
                            name: t.label
                        })
                    }
                    )),
                    this.checkedColumns = e.map((function(t) {
                        return Object(n["a"])(Object(n["a"])({}, t), {}, {
                            value: t.label,
                            name: t.label
                        })
                    }
                    ))
                },
                loadPluginData: function(t, e, i) {
                    t.forEach((function(t) {
                        t.getData && Promise.resolve(t.getData(e)).then((function(e) {
                            i(t, e)
                        }
                        ))
                    }
                    ))
                }
            }
        }
    },
    "2eaa": function(t, e, i) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return t.type ? i("ElPopover", {
                staticClass: "ml-1",
                attrs: {
                    width: "250",
                    trigger: "hover",
                    disabled: "Verified" !== t.type || !t.id,
                    "popper-class": "gpg_popover"
                }
            }, [i("div", [i("div", [i("i", {
                staticClass: "iconfont-new iconcheck-circle-fill icon-check"
            }), t._v(t._s(t.$t("gpg.commit_verified")))]), i("div", {
                staticClass: "mt-1"
            }, [t._v("GPG Key ID: " + t._s(t.id))])]), i("span", {
                class: ["gpg_verify", "cursor-pointer", t.type],
                attrs: {
                    slot: "reference"
                },
                slot: "reference"
            }, [t._v(t._s(t.type))])]) : t._e()
        }
          , n = []
          , a = {
            name: "GpgVerifyPopover",
            props: {
                type: {
                    type: String,
                    default: ""
                },
                id: {
                    type: String,
                    default: ""
                }
            }
        }
          , o = a
          , r = (i("9486"),
        i("baa2"),
        i("2877"))
          , c = Object(r["a"])(o, s, n, !1, null, "3681f9af", null);
        e["a"] = c.exports
    },
    "40e1": function(t, e, i) {
        "use strict";
        i("c03b")
    },
    "5bd9": function(t, e, i) {},
    "65d2": function(t, e, i) {},
    "66c9": function(t, e, i) {},
    "66eb": function(t, e, i) {
        "use strict";
        i("019a")
    },
    "6a0b": function(t, e, i) {
        "use strict";
        i("5bd9")
    },
    "74fb": function(t, e, i) {
        "use strict";
        i("65d2")
    },
    "770e": function(t, e, i) {},
    "779b": function(t, e, i) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("CommonList", {
                ref: "commonList",
                staticClass: "commitList",
                attrs: {
                    "item-size": 47,
                    "table-data": t.commitsList,
                    columns: t.columns.columnsVisible,
                    loading: t.commitsLoading,
                    "load-more": t.loadMore,
                    "has-more": t.hasMore,
                    "is-bulk-select-mode": t.isBulkSelectMode,
                    "selected-data": t.selectedData,
                    "row-selectable": t.rowSelectable,
                    "reserve-selection": ""
                },
                on: {
                    "selection-change": t.handleSelectionChange
                },
                scopedSlots: t._u([{
                    key: "header",
                    fn: function() {
                        return [t._t("header")]
                    },
                    proxy: !0
                }, {
                    key: "left",
                    fn: function() {
                        return [t._t("left")]
                    },
                    proxy: !0
                }], null, !0)
            })
        }
          , n = []
          , a = i("c7eb")
          , o = i("1da1")
          , r = i("5530")
          , c = (i("4de4"),
        i("7db0"),
        i("c740"),
        i("caad"),
        i("a15b"),
        i("d81d"),
        i("14d9"),
        i("d3b7"),
        i("159b"),
        i("63ea"))
          , l = i.n(c)
          , m = i("64aa")
          , u = i("93d3")
          , p = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("ElTooltip", {
                attrs: {
                    content: t.content,
                    placement: "top"
                }
            }, [i("div", {
                staticClass: "users"
            }, [i("div", {
                staticClass: "users_avatar"
            }, t._l(t.users, (function(t) {
                return i("Avatar", {
                    key: t.email,
                    class: t.class || "",
                    attrs: {
                        url: t.image_path,
                        name: t.display_name,
                        title: t.display_name,
                        size: 24
                    }
                })
            }
            )), 1), i("div", {
                staticClass: "committer_name"
            }, [t._v(t._s(t.users[0] && t.users[0].display_name))])])])
        }
          , d = []
          , h = (i("99af"),
        i("b0c0"),
        i("b1e2"))
          , f = {
            name: "CommitsColumnCommiter",
            mixins: [h["a"]],
            computed: {
                users: function() {
                    if (!this.rowData)
                        return [];
                    var t = Object(r["a"])(Object(r["a"])({}, this.rowData[this.storeConfig.committer_author_exchange ? "author" : "committer"]), {}, {
                        class: "user_pre"
                    })
                      , e = Object(r["a"])(Object(r["a"])({}, this.rowData[this.storeConfig.committer_author_exchange ? "committer" : "author"]), {}, {
                        class: "user_next"
                    });
                    return this.rowData.author.email === this.rowData.committer.email ? [t] : [t, e]
                },
                content: function() {
                    return this.rowData ? "".concat(this.$t("pulls.author"), ": ").concat(this.rowData.author.name, ", ").concat(this.$t("pulls.committer"), ": ").concat(this.rowData.committer.name) : ""
                }
            }
        }
          , _ = f
          , b = (i("6a0b"),
        i("2877"))
          , v = Object(b["a"])(_, p, d, !1, null, "68232060", null)
          , g = v.exports
          , C = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", [i("MaybeRouterLink", {
                staticClass: "commit-short-id",
                attrs: {
                    route: t.route,
                    target: t.target
                }
            }, [i("span", [t._v(t._s(t.rowData.short_id))])]), i("a", {
                staticClass: "copyUrl",
                attrs: {
                    title: t.$t("copy") + " CommitId"
                },
                on: {
                    click: function(t) {
                        t.stopPropagation()
                    }
                }
            }, [i("Clipboard", {
                attrs: {
                    text: t.rowData.id
                }
            })], 1)], 1)
        }
          , y = []
          , w = i("3f98")
          , j = i("37e9")
          , $ = {
            name: "CommitsColumnId",
            components: {
                Clipboard: w["a"],
                MaybeRouterLink: j["a"]
            },
            mixins: [h["a"]],
            props: {
                col: {
                    type: Object,
                    default: function() {}
                }
            },
            computed: {
                pull: function() {
                    return this.$store.getters["pull/getPullInfo"]
                },
                route: function() {
                    return {
                        to: {
                            name: "project#commit",
                            params: {
                                id: this.rowData.id
                            }
                        },
                        project: {
                            full_path: "pullCommits" === this.col.type ? this.pull.source_project_full_path : this.projectStore.full_path
                        }
                    }
                },
                target: function() {
                    return "commits" === this.col.type ? "_self" : "_blank"
                }
            }
        }
          , O = $
          , E = (i("e757"),
        i("66eb"),
        Object(b["a"])(O, C, y, !1, null, "44e21246", null))
          , L = E.exports
          , D = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                staticClass: "commit-message-wrap"
            }, [t.rowData.merge_commit ? i("CommonLabel", {
                attrs: {
                    label: {
                        name: t.$t("commit.merge_nodes")
                    },
                    bgcolor: "#4B8BFF",
                    "disable-transitions": ""
                }
            }) : t._e(), t.conflictLabelEnabled ? i("ElPopover", {
                ref: "popover",
                attrs: {
                    "popper-class": "parents-short-ids-popover",
                    trigger: "hover",
                    disabled: !t.rowData.merge_commit
                }
            }, [i("div", t._l(t.parentsShortIds, (function(e, s) {
                return i("RouterLink", {
                    key: e,
                    staticClass: "d-block",
                    attrs: {
                        to: {
                            name: "project#commit",
                            params: {
                                id: t.rowData.parents[s]
                            }
                        }
                    }
                }, [t._v(" " + t._s(e) + " ")])
            }
            )), 1), i("ConflictLabel", {
                attrs: {
                    slot: "reference",
                    text: t.conflictedText
                },
                slot: "reference"
            })], 1) : t._e(), i("CommitLink", {
                attrs: {
                    commit: t.rowData,
                    readonly: "",
                    "show-overflow-tooltip": !1
                }
            }), i("GpgVerifyPopover", {
                staticClass: "gpg",
                attrs: {
                    id: t.rowData.gpg_key_id,
                    type: t.rowData.verify_status
                }
            })], 1)
        }
          , S = []
          , k = (i("fb6a"),
        i("8f24"))
          , M = i("0f50")
          , x = i("2028")
          , T = i("2eaa")
          , P = {
            name: "CommitsColumnMessage",
            components: {
                CommonLabel: k["a"],
                ConflictLabel: M["a"],
                GpgVerifyPopover: T["a"]
            },
            mixins: [h["a"]],
            props: {
                col: {
                    type: Object,
                    default: function() {}
                }
            },
            computed: {
                conflictLabelEnabled: function() {
                    return ["commits", "pullCommits"].includes(this.col.type) && this.rowData.is_resolved_conflict_commit && Object(x["a"])()
                },
                parentsShortIds: function() {
                    var t;
                    return (null === (t = this.rowData.parents) || void 0 === t ? void 0 : t.map((function(t) {
                        return t.slice(0, 7)
                    }
                    ))) || []
                },
                conflictedText: function() {
                    var t = this.rowData
                      , e = t.merge_commit
                      , i = t.is_resolved_conflict_commit;
                    return e && i ? this.$t("commit.resolved_conflicts") : this.$t("commit.conflict_version")
                }
            },
            watch: {
                $route: function() {
                    this.$refs.popover && this.$refs.popover.doClose()
                }
            },
            methods: {
                toCommitDetail: function(t) {
                    this.$router.push({
                        name: "project#commit",
                        params: {
                            id: this.rowData.parents[t]
                        }
                    })
                }
            }
        }
          , I = P
          , A = (i("d63e"),
        i("c1dc"),
        Object(b["a"])(I, D, S, !1, null, "6c5c1136", null))
          , U = A.exports
          , N = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("ElTooltip", {
                attrs: {
                    placement: "bottom",
                    "show-overflow-tooltip": ""
                }
            }, [i("div", {
                staticClass: "commit-description",
                attrs: {
                    slot: "content"
                },
                domProps: {
                    innerHTML: t._s(t.convertCommitDescription)
                },
                slot: "content"
            }), i("div", {
                staticClass: "truncate",
                domProps: {
                    innerHTML: t._s(t.convertCommitDescription)
                }
            })])
        }
          , B = []
          , H = (i("a4d3"),
        i("e01a"),
        i("067e"))
          , V = {
            name: "CommitsColumnDescription",
            mixins: [h["a"]],
            computed: {
                convertCommitDescription: function() {
                    return Object(H["a"])(this.rowData, this.rowData.description)
                }
            }
        }
          , R = V
          , G = (i("40e1"),
        Object(b["a"])(R, N, B, !1, null, "ad65641e", null))
          , F = G.exports
          , J = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("ScanView", {
                attrs: {
                    parent: t._self,
                    "scan-detail": t.rowData.scan,
                    "scan-params": {
                        current_branch: t.rowData.ref,
                        commit_sha: t.rowData.id
                    },
                    simple: "",
                    retry: "",
                    "can-start-scan": !1
                }
            })
        }
          , z = []
          , K = i("f403")
          , W = {
            name: "CommitsColumnScan",
            components: {
                ScanView: K["a"]
            },
            mixins: [h["a"]]
        }
          , q = W
          , Y = Object(b["a"])(q, J, z, !1, null, null, null)
          , Q = Y.exports
          , X = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("CommitCheckStatus", {
                attrs: {
                    status: t.rowData.check_status
                }
            })
        }
          , Z = []
          , tt = i("db1e")
          , et = {
            name: "CommitsColumnCheckStatus",
            components: {
                CommitCheckStatus: tt["a"]
            },
            mixins: [h["a"]]
        }
          , it = et
          , st = Object(b["a"])(it, X, Z, !1, null, null, null)
          , nt = st.exports
          , at = i("91d3")
          , ot = i("2051")
          , rt = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("ElPopover", {
                attrs: {
                    trigger: "hover",
                    "popper-class": "build_status_wrap"
                }
            }, [i("BuildRecordsCommon", {
                attrs: {
                    data: t.data
                }
            }, [i("div", {
                staticClass: "header",
                attrs: {
                    slot: "title"
                },
                slot: "title"
            }, [i("div", {
                staticClass: "title"
            }, [t._v(t._s(t.$t("commit.pipeline_finished")))]), i("div", {
                staticClass: "detail"
            }, [t._v(t._s(t.allCount))])])]), i("i", {
                staticClass: "status_icon",
                class: t.statusIcon,
                attrs: {
                    slot: "reference"
                },
                slot: "reference"
            })], 1)
        }
          , ct = []
          , lt = i("11a7")
          , mt = i("5a50")
          , ut = {
            name: "CommitsColumnBuildStatus",
            components: {
                BuildRecordsCommon: lt["a"]
            },
            mixins: [h["a"]],
            computed: {
                data: function() {
                    var t, e;
                    return (null === (t = this.rowData) || void 0 === t || null === (e = t.third_party_pipeline) || void 0 === e ? void 0 : e.job_list) || []
                },
                allCount: function() {
                    if (!this.rowData.third_party_pipeline)
                        return "";
                    var t = this.rowData.third_party_pipeline
                      , e = t.success_num
                      , i = t.running_num
                      , s = t.failure_num
                      , n = t.aborted_num
                      , a = t.waiting_num
                      , o = t.unstable_num;
                    return this.$t("commit.build_status_count", {
                        success: e,
                        running: i,
                        failure: s,
                        aborted: n,
                        waiting: a,
                        unstable: o
                    })
                },
                statusIcon: function() {
                    var t, e, i;
                    return this.rowData.third_party_pipeline ? Object(mt["s"])()[null === (t = this.rowData) || void 0 === t || null === (e = t.third_party_pipeline) || void 0 === e || null === (i = e.job_list[0]) || void 0 === i ? void 0 : i.status] : ""
                }
            }
        }
          , pt = ut
          , dt = (i("74fb"),
        Object(b["a"])(pt, rt, ct, !1, null, null, null))
          , ht = dt.exports
          , ft = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("span", {
                staticClass: "header"
            }, [t._v(" " + t._s(t.col.label) + " "), i("ElTooltip", {
                attrs: {
                    placement: "top",
                    content: t.$t("commit.exchange_committer_author")
                }
            }, [i("i", {
                staticClass: "iconfont-new icon-swap cursor-pointer fs-12",
                on: {
                    click: t.handleExchange
                }
            })])], 1)
        }
          , _t = []
          , bt = i("365c")
          , vt = {
            name: "CommitsColumnHeaderCommiter",
            props: {
                col: {
                    type: Object,
                    default: function() {
                        return {}
                    }
                }
            },
            methods: {
                handleExchange: function() {
                    var t = this
                      , e = Object(r["a"])(Object(r["a"])({}, this.storeConfig), {}, {
                        committer_author_exchange: !this.storeConfig.committer_author_exchange
                    });
                    Object(bt["d"])({
                        config: e
                    }).then((function(e) {
                        var i = e.data;
                        t.$store.commit("userConfig/setUserConfig", i)
                    }
                    ))
                }
            }
        }
          , gt = vt
          , Ct = Object(b["a"])(gt, ft, _t, !1, null, null, null)
          , yt = Ct.exports;
        function wt(t) {
            return t.map((function(t) {
                return Object(r["a"])(Object(r["a"])({}, t), {}, {
                    hash: t.id,
                    date: t.created_at,
                    heads: t.branches,
                    remotes: [],
                    stash: {
                        selector: ""
                    }
                })
            }
            ))
        }
        var jt = {
            name: "CommitsList",
            components: {
                CommonList: at["a"]
            },
            mixins: [m["a"], ot["a"]],
            props: {
                type: {
                    type: String,
                    default: ""
                },
                commitsUrl: {
                    type: String,
                    default: ""
                },
                params: {
                    type: Object
                },
                refname: {
                    type: String,
                    default: ""
                },
                isBulkSelectMode: {
                    type: Boolean,
                    default: !1
                },
                rowSelectable: {
                    type: Function
                },
                cherryCommitIds: {
                    type: Array,
                    default: function() {
                        return []
                    }
                }
            },
            data: function() {
                return {
                    commitsLoading: !1,
                    commits: [],
                    commitsList: [],
                    page: 1,
                    per_page: 20,
                    isScrollLoading: !1,
                    commitsCount: 0,
                    selectedData: []
                }
            },
            computed: {
                tableName: function() {
                    switch (this.type) {
                    case "cherryPickCommits":
                        return "CP_COMMIT";
                    case "compareCommits":
                        return "COMPARE_COMMIT";
                    case "commits":
                        return "COMMIT";
                    default:
                        return "PR_COMMIT"
                    }
                },
                hasMore: function() {
                    return this.commitsList.length < this.commitsCount
                },
                columns: function() {
                    var t = this
                      , e = this.$createElement
                      , i = [{
                        label: this.$t_startcase("pulls.user_info"),
                        headerComponent: yt,
                        component: g,
                        width: "140",
                        prop: "committer",
                        disabled: !0,
                        visible: !0
                    }, {
                        label: this.$t_startcase("pulls.commit_id"),
                        component: L,
                        width: "140",
                        prop: "short_id",
                        disabled: !0,
                        visible: !0,
                        type: this.type
                    }, {
                        label: this.$t_startcase("pulls.commit_message"),
                        component: U,
                        minWidth: "150",
                        prop: "message",
                        disabled: !0,
                        visible: !0,
                        type: this.type
                    }, {
                        label: this.$t_startcase("pulls.extended_information"),
                        component: F,
                        minWidth: "150",
                        prop: "description",
                        type: this.type
                    }, {
                        label: this.$t_startcase("cherry_pick.merge_status"),
                        prop: "target_branch_merged",
                        formatter: function(i) {
                            return i.target_branch_merged ? e(k["a"], {
                                attrs: {
                                    label: {
                                        name: t.$t("pulls.state.merged")
                                    },
                                    bgcolor: "#00875a"
                                }
                            }) : null
                        },
                        width: "120",
                        visible: !0,
                        permission: "cherryPickCommits" === this.type
                    }, {
                        label: this.$t_startcase("pulls.commit_check_status"),
                        component: nt,
                        width: "160",
                        prop: "check_status",
                        permission: this.commitKanbanEnabled
                    }, {
                        label: this.$t_startcase("pulls.scan"),
                        component: Q,
                        width: "120",
                        prop: "scan",
                        permission: this.projectStore.iscan_enabled && !this.projectArchivedEnabled
                    }, {
                        label: this.$t_startcase("pulls.build_status"),
                        component: ht,
                        width: "120",
                        prop: "jenkins",
                        align: "center",
                        permission: ("commits" === this.type || "pullCommits" === this.type) && this.FEATURE_TOGGLES.jenkins_enabled
                    }, {
                        label: this.$t_startcase("pulls.create_date"),
                        width: "200",
                        prop: "date",
                        permission: !0,
                        formatter: function(i) {
                            return e("el-tooltip", {
                                attrs: {
                                    placement: "bottom"
                                }
                            }, [e("div", {
                                slot: "content"
                            }, [t.$t("pulls.create_date"), ":", Object(u["p"])(i.date, "yyyy-MM-dd hh:mm:ss"), e("br"), t.$t("pulls.commit_date"), ":", Object(u["p"])(i.updated_at, "yyyy-MM-dd hh:mm:ss")]), e("div", [Object(u["p"])(i.date, "yyyy-MM-dd hh:mm:ss")])])
                        }
                    }];
                    return this.finallyColumns(this.SCHEMA.TABLE[this.tableName].COLUMNS, i, "commit_list_config", "show_commit_")
                },
                visible: function() {
                    return this.$parent.active
                }
            },
            watch: {
                visible: function(t) {
                    !this.commits.length && t && this.loadCommits()
                },
                "$parent.active": function() {
                    this.$refs.commonList.getCommitsContentHeight()
                },
                params: function(t, e) {
                    l()(t, e) || this.resetData()
                }
            },
            created: function() {
                this.registerEventHubListener(this.EVENT_HUB_NAME.RELOAD_COMMITS_LIST, this.reloadCommitsList),
                this.registerEventHubListener(this.EVENT_HUB_NAME.SCAN_UPDATE_PULL_COMMITLIST, this.onScanUpdate),
                this.registerEventHubListener(this.EVENT_HUB_NAME.UPDATE_COMMITREFS, this.onUpdateCommitRefs),
                window.eventHub.$emit(this.EVENT_HUB_NAME.COLUM_LIST, this.columns)
            },
            methods: {
                reloadCommitsList: function() {
                    this.commits.length && (this.page = 1,
                    this.commits = [],
                    this.commitsList = [],
                    this.visible && this.loadCommits())
                },
                onUpdateCommitRefs: function(t, e) {
                    this.$set(this.commitsList, t, Object.assign(this.commitsList[t], e))
                },
                onScanUpdate: function(t) {
                    var e = this.scanDetails.findIndex((function(e) {
                        return e.source_commit_id === t.newScan.source_commit_id
                    }
                    ));
                    e > -1 && this.$set(this.scanDetails, e, t.newScan)
                },
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
                                var s, n, o, r, c;
                                return Object(a["a"])().wrap((function(t) {
                                    while (1)
                                        switch (t.prev = t.next) {
                                        case 0:
                                            s = i.data,
                                            e.$emit("getListNoData", s),
                                            e.$emit("changeTotalCount", s.meta.total_count),
                                            s.data.forEach((function(t) {
                                                t.iscan = {
                                                    analysis_status: "READY"
                                                },
                                                t.ref = e.refname
                                            }
                                            )),
                                            n = wt(s.data || []),
                                            e.commits = n,
                                            e.commitsCount = s.meta.total_count,
                                            o = e.commits.map((function(t) {
                                                return t.id
                                            }
                                            )),
                                            e.projectStore.iscan_enabled && o.length > 0 && !e.projectArchivedEnabled && e.loadScan({
                                                commit_ids: o
                                            }),
                                            e.loadPluginData(e.SCHEMA.TABLE[e.tableName].COLUMNS, n, (function(t, i) {
                                                e.commitsList.filter((function(e) {
                                                    return !e[t.prop]
                                                }
                                                )).forEach((function(s) {
                                                    var n = i.find((function(t) {
                                                        return s.id === t.commit_id
                                                    }
                                                    ));
                                                    e.$set(s, t.prop, n)
                                                }
                                                ))
                                            }
                                            )),
                                            e.FEATURE_TOGGLES.jenkins_enabled && (r = {
                                                relation_id: n.map((function(t) {
                                                    return t.id
                                                }
                                                )).join(",")
                                            },
                                            e.api.commits.getJenkinsListDetails(r).then((function(t) {
                                                var i = t.data;
                                                e.commitsList.filter((function(t) {
                                                    return !t.third_party_pipeline
                                                }
                                                )).forEach((function(t) {
                                                    var s, n = null === (s = i.data) || void 0 === s ? void 0 : s.find((function(e) {
                                                        return t.id === e.commit_id
                                                    }
                                                    ));
                                                    e.$set(t, "third_party_pipeline", n)
                                                }
                                                ))
                                            }
                                            ))),
                                            "pullCommits" === e.type ? (c = e.commits.filter((function(t) {
                                                return ["pending", null].includes(t.check_status)
                                            }
                                            )),
                                            window.eventHub.$emit(e.EVENT_HUB_NAME.HAS_PENDING_COMMITS, !!c.length)) : "pending" === e.type ? e.$emit("update:pendingCommitsCount", s.meta.total_count) : "cherryPickCommits" === e.type && e.$emit("update:commitsCount", s.meta.total_count),
                                            e.commitsLoading = !1,
                                            e.commits.forEach((function(t) {
                                                e.commitsList.push(t)
                                            }
                                            )),
                                            e.isScrollLoading = !1,
                                            e.$emit("afterGetList", s);
											if(is_cherry_pick_page && window?.__EXTENSION_REGITLAB_CONFIG?.autoCheckRowCount && Number(window?.__EXTENSION_REGITLAB_CONFIG?.autoCheckRowCount) > 0) {
												const filteredList = e.commitsList.filter((item) => {
													return !item.merge_commit && !item.target_branch_merged && item.display_email === window?.__EXTENSION_REGITLAB_CONFIG?.email;
												});
												// 只对前N行设置勾选状态
												const rowsToCheck = filteredList.slice(0, Number(window?.__EXTENSION_REGITLAB_CONFIG?.autoCheckRowCount));
												rowsToCheck.forEach((item) => {
													item.$v_checked = true;
												});
												const filterCommitListId = rowsToCheck.map((function (t) {
													return t.id;
												}));
												
												e.$emit("update:cherryCommitIds", filterCommitListId);
												e.$emit("selection-change", filterCommitListId);
											}
											case 16:
                                        case "end":
                                            return t.stop()
                                        }
                                }
                                ), t)
                            }
                            )));
                            return function(e) {
                                return t.apply(this, arguments)
                            }
                        }(), (function(t) {
                            e.$emit("getListError", t)
                        }
                        )).finally((function() {
                            e.commitsLoading = !1
                        }
                        ))
                    }
                },
                loadMore: function() {
                    !this.commitsLoading && this.hasMore && (this.isScrollLoading = !0,
                    this.page += 1,
                    this.loadCommits())
                },
                loadScan: function() {
                    var t = this
                      , e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    this.api.scan.getScanDetails(e).then((function(e) {
                        t.commitsList.filter((function(t) {
                            return !t.scan
                        }
                        )).forEach((function(i) {
                            var s = e.data.data.find((function(t) {
                                return i.id === t.source_commit_id
                            }
                            ));
                            t.$set(i, "scan", s)
                        }
                        ))
                    }
                    ))
                },
                resetData: function() {
                    this.commits = [],
                    this.commitsList = [],
                    this.page = 1,
                    this.per_page = 20
                },
                handleSelectionChange: function(t) {
                    if (this.selectedData = t,
                    this.selectedData.length) {
                        var e = this.selectedData.map((function(t) {
                            return t.id
                        }
                        ));
                        this.$emit("update:cherryCommitIds", e)
                    } else
                        this.$emit("update:cherryCommitIds", []);
                    this.$emit("selection-change", t)
                },
                cancelSelect: function() {
                    this.selectedData = []
                }
            }
        }
          , $t = jt
          , Ot = Object(b["a"])($t, s, n, !1, null, null, null);
        e["a"] = Ot.exports
    },
    "87e6": function(t, e, i) {},
    9486: function(t, e, i) {
        "use strict";
        i("1d00")
    },
    b1e2: function(t, e, i) {
        "use strict";
        e["a"] = {
            props: {
                rowData: Object
            }
        }
    },
    baa2: function(t, e, i) {
        "use strict";
        i("770e")
    },
    c03b: function(t, e, i) {},
    c1dc: function(t, e, i) {
        "use strict";
        i("87e6")
    },
    c34d: function(t, e, i) {},
    d1bf: function(t, e, i) {},
    d63e: function(t, e, i) {
        "use strict";
        i("d1bf")
    },
    daef: function(t, e, i) {},
    db1e: function(t, e, i) {
        "use strict";
        var s = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("span", {
                staticClass: "check_default",
                class: [t.status ? "check_" + t.status : "check_pending"]
            }, [t._v(" " + t._s(t.statusText) + " ")])
        }
          , n = []
          , a = {
            name: "CommitCheckStatus",
            props: {
                status: {
                    type: String,
                    default: ""
                }
            },
            data: function() {
                return {}
            },
            computed: {
                statusText: function() {
                    var t = {
                        pending: this.$t("commit.not_viewed"),
                        approved: this.$t("commit.view_passed"),
                        rejected: this.$t("commit.reviewed_needs_improvement"),
                        system_approved: this.$t("commit.system_inspection_required")
                    };
                    return t[this.status] || this.$t("commit.not_viewed")
                }
            }
        }
          , o = a
          , r = (i("0e0b"),
        i("2877"))
          , c = Object(r["a"])(o, s, n, !1, null, "0ca233be", null);
        e["a"] = c.exports
    },
    e757: function(t, e, i) {
        "use strict";
        i("66c9")
    },
    fe1f: function(t, e, i) {
        "use strict";
        i("c34d")
    }
}]);
