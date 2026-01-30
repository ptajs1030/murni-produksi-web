import { ref, watch, getCurrentInstance, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Ds1QaqxF.js";
import _sfc_main$4 from "./CategoryFormModal-C0XqDc7L.js";
import { router, Head } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./InputError-C5ky-J1T.js";
import "./InputLabel-Dkex7vHI.js";
import "./Modal-DBd8rNSf.js";
import "./PrimaryButton-CIooT64n.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["categories", "filters"],
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
        router.get("/categories", params, {
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
      router.get("/categories", params, {
        preserveState: true,
        replace: true
      });
    };
    const getSortIcon = (field) => {
      if (currentSort.value !== field) return "fas fa-sort text-muted";
      return sortDirection.value === "asc" ? "fas fa-sort-up text-primary" : "fas fa-sort-down text-primary";
    };
    const isSortable = (field) => {
      const sortableFields = ["id", "category_code", "category_name", "created_at", "updated_at"];
      return sortableFields.includes(field);
    };
    const openAddCategory = () => {
      modalRef.value.open();
    };
    const openEditCategory = (category) => {
      modalRef.value.open(category);
    };
    const { proxy } = getCurrentInstance();
    const deleteCategory = (id) => {
      proxy.$confirmDelete("/categories", id);
    };
    const clearFilters = () => {
      search.value = "";
      currentSort.value = "";
      router.get(
        "/categories",
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
    const exportExcel = () => {
      const params = {};
      if (search.value) {
        params.search = search.value;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const existingSort = urlParams.get("sort");
      if (existingSort) {
        params.sort = existingSort;
      }
      const queryString = new URLSearchParams(params).toString();
      window.location.href = route("categories.export") + (queryString ? "?" + queryString : "");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Categories" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Daftar Kategori" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card mb-3" data-v-5219c33d${_scopeId}><div class="card-body" data-v-5219c33d${_scopeId}><div class="row g-3 align-items-end" data-v-5219c33d${_scopeId}><div class="col-md-4" data-v-5219c33d${_scopeId}><label class="form-label" data-v-5219c33d${_scopeId}>Pencarian</label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              placeholder: "Cari berdasarkan kode atau nama kategori..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-2" data-v-5219c33d${_scopeId}>`);
            if (hasActiveFilters.value) {
              _push2(`<button class="btn btn-outline-secondary" data-v-5219c33d${_scopeId}><i class="fas fa-times me-1" data-v-5219c33d${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="col-md-6 text-end" data-v-5219c33d${_scopeId}><button class="btn btn-primary" data-v-5219c33d${_scopeId}><i class="fas fa-plus me-1" data-v-5219c33d${_scopeId}></i> Tambah Kategori </button><button class="btn btn-success ms-2" data-v-5219c33d${_scopeId}>Export Excel</button></div></div></div></div><div class="d-flex justify-content-between align-items-center mb-3" data-v-5219c33d${_scopeId}><div class="text-muted" data-v-5219c33d${_scopeId}> Menampilkan ${ssrInterpolate(__props.categories.from || 0)} - ${ssrInterpolate(__props.categories.to || 0)} dari ${ssrInterpolate(__props.categories.total || 0)} data </div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="text-muted" data-v-5219c33d${_scopeId}><i class="fas fa-filter me-1" data-v-5219c33d${_scopeId}></i> Filter aktif </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="card" data-v-5219c33d${_scopeId}><div class="table-responsive" data-v-5219c33d${_scopeId}><table class="table-hover mb-0 table" data-v-5219c33d${_scopeId}><thead class="table-light" data-v-5219c33d${_scopeId}><tr data-v-5219c33d${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-5219c33d${_scopeId}>#</th><th class="${ssrRenderClass({
              sortable: isSortable("category_code")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-5219c33d${_scopeId}> Kode Kategori `);
            if (isSortable("category_code")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("category_code"), "ms-1"])}" data-v-5219c33d${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({
              sortable: isSortable("category_name")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-5219c33d${_scopeId}> Nama Kategori `);
            if (isSortable("category_name")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("category_name"), "ms-1"])}" data-v-5219c33d${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({ sortable: isSortable("created_at") })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-5219c33d${_scopeId}> Tanggal Dibuat `);
            if (isSortable("created_at")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("created_at"), "ms-1"])}" data-v-5219c33d${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="text-center" style="${ssrRenderStyle({ "width": "120px" })}" data-v-5219c33d${_scopeId}>Aksi</th></tr></thead><tbody data-v-5219c33d${_scopeId}>`);
            if (__props.categories.data && __props.categories.data.length === 0) {
              _push2(`<tr data-v-5219c33d${_scopeId}><td colspan="5" class="text-muted py-4 text-center" data-v-5219c33d${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-5219c33d${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-5219c33d${_scopeId}>Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot;</div>`);
              } else {
                _push2(`<div data-v-5219c33d${_scopeId}>Belum ada data kategori</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.categories.data, (category, index) => {
                _push2(`<tr data-v-5219c33d${_scopeId}><td class="text-muted text-center" data-v-5219c33d${_scopeId}>${ssrInterpolate(__props.categories.from + index)}</td><td data-v-5219c33d${_scopeId}><span class="badge bg-secondary" data-v-5219c33d${_scopeId}>${ssrInterpolate(category.category_code)}</span></td><td class="fw-medium" data-v-5219c33d${_scopeId}>${ssrInterpolate(category.category_name)}</td><td class="text-muted" data-v-5219c33d${_scopeId}>${ssrInterpolate(new Date(category.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }))}</td><td class="text-center" data-v-5219c33d${_scopeId}><div class="btn-group btn-group-md" role="group" data-v-5219c33d${_scopeId}><button class="btn btn-outline-warning" title="Edit Kategori" data-v-5219c33d${_scopeId}><i class="fas fa-edit" data-v-5219c33d${_scopeId}></i></button><button class="btn btn-outline-danger" title="Hapus Kategori" data-v-5219c33d${_scopeId}><i class="fas fa-trash" data-v-5219c33d${_scopeId}></i></button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-5219c33d${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: __props.categories.links
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
                        placeholder: "Cari berdasarkan kode atau nama kategori..."
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
                        onClick: openAddCategory
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Kategori ")
                      ]),
                      createVNode("button", {
                        class: "btn btn-success ms-2",
                        onClick: exportExcel
                      }, "Export Excel")
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                createVNode("div", { class: "text-muted" }, " Menampilkan " + toDisplayString(__props.categories.from || 0) + " - " + toDisplayString(__props.categories.to || 0) + " dari " + toDisplayString(__props.categories.total || 0) + " data ", 1),
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
                            sortable: isSortable("category_code")
                          },
                          onClick: ($event) => isSortable("category_code") && handleSort("category_code"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Kode Kategori "),
                          isSortable("category_code") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("category_code"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: {
                            sortable: isSortable("category_name")
                          },
                          onClick: ($event) => isSortable("category_name") && handleSort("category_name"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Nama Kategori "),
                          isSortable("category_name") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("category_name"), "ms-1"]
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
                      __props.categories.data && __props.categories.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "5",
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, 'Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '"', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data kategori"))
                        ])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.categories.data, (category, index) => {
                        return openBlock(), createBlock("tr", {
                          key: category.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString(__props.categories.from + index), 1),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-secondary" }, toDisplayString(category.category_code), 1)
                          ]),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(category.category_name), 1),
                          createVNode("td", { class: "text-muted" }, toDisplayString(new Date(category.created_at).toLocaleDateString("id-ID", {
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
                                onClick: ($event) => openEditCategory(category),
                                class: "btn btn-outline-warning",
                                title: "Edit Kategori"
                              }, [
                                createVNode("i", { class: "fas fa-edit" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deleteCategory(category.id),
                                class: "btn btn-outline-danger",
                                title: "Hapus Kategori"
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
                  links: __props.categories.links
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MCategories/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5219c33d"]]);
export {
  Index as default
};
