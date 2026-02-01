import { ref, watch, getCurrentInstance, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-CJQU9ReZ.js";
import { router, Head } from "@inertiajs/vue3";
import { debounce } from "lodash";
import _sfc_main$4 from "./ProductLevelsFormModal-BcjuQ7Ot.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./InputError-C5ky-J1T.js";
import "./InputLabel-Dkex7vHI.js";
import "./Modal-DBd8rNSf.js";
import "./NumberInput-DiiebTlv.js";
import "./PrimaryButton-CIooT64n.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["productLevels", "filters"],
  setup(__props) {
    const props = __props;
    const modalRef = ref(null);
    const search = ref(props.filters.search || "");
    const currentSort = ref("");
    const sortDirection = ref("");
    const initializeSort = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sort = urlParams.get("sort");
      if (sort) {
        if (sort.startsWith("-")) {
          currentSort.value = sort.substring(1);
          sortDirection.value = "desc";
        } else {
          currentSort.value = sort;
          sortDirection.value = "asc";
        }
      }
    };
    initializeSort();
    watch(
      search,
      debounce((value) => {
        const params = {};
        if (value) params.search = value;
        const urlParams = new URLSearchParams(window.location.search);
        const existingSort = urlParams.get("sort");
        if (existingSort) params.sort = existingSort;
        router.get("/packaging-size-levels", params, {
          preserveState: true,
          replace: true
        });
      }, 300)
    );
    const handleSort = (field) => {
      let sortValue = field;
      if (currentSort.value === field) {
        if (sortDirection.value === "asc") {
          sortValue = `-${field}`;
          sortDirection.value = "desc";
        } else {
          sortDirection.value = "asc";
        }
      } else {
        currentSort.value = field;
        sortDirection.value = "asc";
      }
      const params = { sort: sortValue };
      if (search.value) params.search = search.value;
      router.get("/packaging-size-levels", params, {
        preserveState: true,
        replace: true
      });
    };
    const getSortIcon = (field) => {
      if (currentSort.value !== field) return "fas fa-sort text-muted";
      return sortDirection.value === "asc" ? "fas fa-sort-up text-primary" : "fas fa-sort-down text-primary";
    };
    const isSortable = (field) => {
      const sortableFields = ["id", "level_code", "level_description", "created_at", "updated_at"];
      return sortableFields.includes(field);
    };
    const openAddWarehouse = () => {
      modalRef.value.open();
    };
    const openEditWarehouse = (level) => {
      modalRef.value.open(level);
    };
    const { proxy } = getCurrentInstance();
    const deleteWarehouse = (id) => {
      proxy.$confirmDelete("/packaging-size-levels", id);
    };
    const clearFilters = () => {
      search.value = "";
      currentSort.value = "";
      router.get(
        "/packaging-size-levels",
        {},
        {
          preserveState: true,
          replace: true
        }
      );
    };
    const hasActiveFilters = computed(() => {
      return search.value || currentSort.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Product Level" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Daftar Product Level" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card mb-3" data-v-b5a6b977${_scopeId}><div class="card-body" data-v-b5a6b977${_scopeId}><div class="row g-3 align-items-end" data-v-b5a6b977${_scopeId}><div class="col-md-4" data-v-b5a6b977${_scopeId}><label class="form-label" data-v-b5a6b977${_scopeId}>Pencarian</label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              placeholder: "Cari berdasarkan nama product level..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-2" data-v-b5a6b977${_scopeId}>`);
            if (hasActiveFilters.value) {
              _push2(`<button class="btn btn-outline-secondary" data-v-b5a6b977${_scopeId}><i class="fas fa-times me-1" data-v-b5a6b977${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="col-md-6 text-end" data-v-b5a6b977${_scopeId}><button class="btn btn-primary" data-v-b5a6b977${_scopeId}><i class="fas fa-plus me-1" data-v-b5a6b977${_scopeId}></i> Tambah Product Level </button></div></div></div></div><div class="d-flex justify-content-between align-items-center mb-3" data-v-b5a6b977${_scopeId}><div class="text-muted" data-v-b5a6b977${_scopeId}> Menampilkan ${ssrInterpolate(__props.productLevels.from || 0)} - ${ssrInterpolate(__props.productLevels.to || 0)} dari ${ssrInterpolate(__props.productLevels.total || 0)} data </div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="text-muted" data-v-b5a6b977${_scopeId}><i class="fas fa-filter me-1" data-v-b5a6b977${_scopeId}></i> Filter aktif </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="card" data-v-b5a6b977${_scopeId}><div class="table-responsive" data-v-b5a6b977${_scopeId}><table class="table-hover mb-0 table" data-v-b5a6b977${_scopeId}><thead class="table-light" data-v-b5a6b977${_scopeId}><tr data-v-b5a6b977${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-b5a6b977${_scopeId}>#</th><th class="${ssrRenderClass({
              sortable: isSortable("level_code")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-b5a6b977${_scopeId}> Level Code `);
            if (isSortable("level_code")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("level_code"), "ms-1"])}" data-v-b5a6b977${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({
              sortable: isSortable("level_description")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-b5a6b977${_scopeId}> Description `);
            if (isSortable("level_description")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("level_description"), "ms-1"])}" data-v-b5a6b977${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({ sortable: isSortable("created_at") })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-b5a6b977${_scopeId}> Tanggal Dibuat `);
            if (isSortable("created_at")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("created_at"), "ms-1"])}" data-v-b5a6b977${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="text-center" style="${ssrRenderStyle({ "width": "120px" })}" data-v-b5a6b977${_scopeId}>Aksi</th></tr></thead><tbody data-v-b5a6b977${_scopeId}>`);
            if (__props.productLevels.data && __props.productLevels.data.length === 0) {
              _push2(`<tr data-v-b5a6b977${_scopeId}><td colspan="5" class="text-muted py-4 text-center" data-v-b5a6b977${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-b5a6b977${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-b5a6b977${_scopeId}>Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot;</div>`);
              } else {
                _push2(`<div data-v-b5a6b977${_scopeId}>Belum ada data product level</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.productLevels.data, (productLevel, index) => {
                _push2(`<tr data-v-b5a6b977${_scopeId}><td class="text-muted text-center" data-v-b5a6b977${_scopeId}>${ssrInterpolate(__props.productLevels.from + index)}</td><td class="fw-medium" data-v-b5a6b977${_scopeId}>${ssrInterpolate(productLevel.level_code)}</td><td class="fw-medium" data-v-b5a6b977${_scopeId}>${ssrInterpolate(productLevel.level_description)}</td><td class="text-muted" data-v-b5a6b977${_scopeId}>${ssrInterpolate(new Date(productLevel.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }))}</td><td class="text-center" data-v-b5a6b977${_scopeId}><div class="btn-group btn-group-md" role="group" data-v-b5a6b977${_scopeId}><button class="btn btn-outline-warning" title="Edit Product Level" data-v-b5a6b977${_scopeId}><i class="fas fa-edit" data-v-b5a6b977${_scopeId}></i></button><button class="btn btn-outline-danger" title="Hapus Product Level" data-v-b5a6b977${_scopeId}><i class="fas fa-trash" data-v-b5a6b977${_scopeId}></i></button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-b5a6b977${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: __props.productLevels.links
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "modalRef",
              ref: modalRef,
              onSaved: ($event) => unref(router).reload()
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "card mb-3" }, [
                createVNode("div", { class: "card-body" }, [
                  createVNode("div", { class: "row g-3 align-items-end" }, [
                    createVNode("div", { class: "col-md-4" }, [
                      createVNode("label", { class: "form-label" }, "Pencarian"),
                      createVNode(_sfc_main$2, {
                        modelValue: search.value,
                        "onUpdate:modelValue": ($event) => search.value = $event,
                        type: "text",
                        placeholder: "Cari berdasarkan nama product level..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "col-md-2" }, [
                      hasActiveFilters.value ? (openBlock(), createBlock("button", {
                        key: 0,
                        onClick: clearFilters,
                        class: "btn btn-outline-secondary"
                      }, [
                        createVNode("i", { class: "fas fa-times me-1" }),
                        createTextVNode(" Clear ")
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "col-md-6 text-end" }, [
                      createVNode("button", {
                        class: "btn btn-primary",
                        onClick: openAddWarehouse
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Product Level ")
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                createVNode("div", { class: "text-muted" }, " Menampilkan " + toDisplayString(__props.productLevels.from || 0) + " - " + toDisplayString(__props.productLevels.to || 0) + " dari " + toDisplayString(__props.productLevels.total || 0) + " data ", 1),
                hasActiveFilters.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-muted"
                }, [
                  createVNode("i", { class: "fas fa-filter me-1" }),
                  createTextVNode(" Filter aktif ")
                ])) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "card" }, [
                createVNode("div", { class: "table-responsive" }, [
                  createVNode("table", { class: "table-hover mb-0 table" }, [
                    createVNode("thead", { class: "table-light" }, [
                      createVNode("tr", null, [
                        createVNode("th", {
                          class: "text-center",
                          style: { "width": "60px" }
                        }, "#"),
                        createVNode("th", {
                          class: {
                            sortable: isSortable("level_code")
                          },
                          onClick: ($event) => isSortable("level_code") && handleSort("level_code"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Level Code "),
                          isSortable("level_code") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("level_code"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: {
                            sortable: isSortable("level_description")
                          },
                          onClick: ($event) => isSortable("level_description") && handleSort("level_description"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Description "),
                          isSortable("level_description") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("level_description"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: { sortable: isSortable("created_at") },
                          onClick: ($event) => isSortable("created_at") && handleSort("created_at"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Tanggal Dibuat "),
                          isSortable("created_at") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("created_at"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: "text-center",
                          style: { "width": "120px" }
                        }, "Aksi")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      __props.productLevels.data && __props.productLevels.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "5",
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, 'Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '"', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data product level"))
                        ])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.productLevels.data, (productLevel, index) => {
                        return openBlock(), createBlock("tr", {
                          key: productLevel.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString(__props.productLevels.from + index), 1),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(productLevel.level_code), 1),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(productLevel.level_description), 1),
                          createVNode("td", { class: "text-muted" }, toDisplayString(new Date(productLevel.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })), 1),
                          createVNode("td", { class: "text-center" }, [
                            createVNode("div", {
                              class: "btn-group btn-group-md",
                              role: "group"
                            }, [
                              createVNode("button", {
                                onClick: ($event) => openEditWarehouse(productLevel),
                                class: "btn btn-outline-warning",
                                title: "Edit Product Level"
                              }, [
                                createVNode("i", { class: "fas fa-edit" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deleteWarehouse(productLevel.id),
                                class: "btn btn-outline-danger",
                                title: "Hapus Product Level"
                              }, [
                                createVNode("i", { class: "fas fa-trash" })
                              ], 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128))
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-3" }, [
                createVNode(_sfc_main$3, {
                  links: __props.productLevels.links
                }, null, 8, ["links"])
              ]),
              createVNode(_sfc_main$4, {
                ref_key: "modalRef",
                ref: modalRef,
                onSaved: ($event) => unref(router).reload()
              }, null, 8, ["onSaved"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MProductLevels/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b5a6b977"]]);
export {
  Index as default
};
