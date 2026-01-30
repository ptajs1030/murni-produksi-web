import { ref, watch, getCurrentInstance, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Ds1QaqxF.js";
import { router, Head } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["recipes", "filters"],
  setup(__props) {
    const props = __props;
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
        router.get("/recipes", params, {
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
      router.get("/recipes", params, {
        preserveState: true,
        replace: true
      });
    };
    const getSortIcon = (field) => {
      if (currentSort.value !== field) return "fas fa-sort text-muted";
      return sortDirection.value === "asc" ? "fas fa-sort-up text-primary" : "fas fa-sort-down text-primary";
    };
    const isSortable = (field) => {
      const sortableFields = [
        "id",
        "product_name"
      ];
      return sortableFields.includes(field);
    };
    const openAddRecipe = () => {
      router.visit(route("recipes.create"));
    };
    const openEditRecipe = (recipe) => {
      router.visit(route("recipes.edit", recipe.id));
    };
    const { proxy } = getCurrentInstance();
    const deleteRecipe = (id) => {
      proxy.$confirmDelete("/recipes", id);
    };
    const clearFilters = () => {
      search.value = "";
      currentSort.value = "";
      router.get(
        "/recipes",
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
      _push(ssrRenderComponent(unref(Head), { title: "Resep" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Daftar Resep" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card mb-3" data-v-3c01dc88${_scopeId}><div class="card-body" data-v-3c01dc88${_scopeId}><div class="row g-3 align-items-end" data-v-3c01dc88${_scopeId}><div class="col-md-4" data-v-3c01dc88${_scopeId}><label class="form-label" data-v-3c01dc88${_scopeId}>Pencarian</label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              placeholder: "Cari berdasarkan nama produk..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-2" data-v-3c01dc88${_scopeId}>`);
            if (hasActiveFilters.value) {
              _push2(`<button class="btn btn-outline-secondary" data-v-3c01dc88${_scopeId}><i class="fas fa-times me-1" data-v-3c01dc88${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="col-md-6 text-end" data-v-3c01dc88${_scopeId}><button class="btn btn-primary" data-v-3c01dc88${_scopeId}><i class="fas fa-plus me-1" data-v-3c01dc88${_scopeId}></i> Tambah Resep </button></div></div></div></div><div class="d-flex justify-content-between align-items-center mb-3" data-v-3c01dc88${_scopeId}><div class="text-muted" data-v-3c01dc88${_scopeId}> Menampilkan ${ssrInterpolate(__props.recipes.from || 0)} - ${ssrInterpolate(__props.recipes.to || 0)} dari ${ssrInterpolate(__props.recipes.total || 0)} data </div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="text-muted" data-v-3c01dc88${_scopeId}><i class="fas fa-filter me-1" data-v-3c01dc88${_scopeId}></i> Filter aktif </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="card" data-v-3c01dc88${_scopeId}><div class="table-responsive" data-v-3c01dc88${_scopeId}><table class="table-hover mb-0 table" data-v-3c01dc88${_scopeId}><thead class="table-light" data-v-3c01dc88${_scopeId}><tr data-v-3c01dc88${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-3c01dc88${_scopeId}>#</th><th class="${ssrRenderClass({
              sortable: isSortable("product_name")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-3c01dc88${_scopeId}> Nama Produk `);
            if (isSortable("product_name")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("product_name"), "ms-1"])}" data-v-3c01dc88${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="text-center" style="${ssrRenderStyle({ "width": "140px" })}" data-v-3c01dc88${_scopeId}>Aksi</th></tr></thead><tbody data-v-3c01dc88${_scopeId}>`);
            if (__props.recipes.data && __props.recipes.data.length === 0) {
              _push2(`<tr data-v-3c01dc88${_scopeId}><td colspan="5" class="text-muted py-4 text-center" data-v-3c01dc88${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-3c01dc88${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-3c01dc88${_scopeId}>Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot;</div>`);
              } else {
                _push2(`<div data-v-3c01dc88${_scopeId}>Belum ada data resep</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.recipes.data, (recipe, index) => {
                var _a;
                _push2(`<tr data-v-3c01dc88${_scopeId}><td class="text-muted text-center" data-v-3c01dc88${_scopeId}>${ssrInterpolate(__props.recipes.from + index)}</td><td class="fw-medium" data-v-3c01dc88${_scopeId}>${ssrInterpolate((_a = recipe.product) == null ? void 0 : _a.product_name)}</td><td class="text-center" data-v-3c01dc88${_scopeId}><div class="btn-group btn-group-sm" role="group" data-v-3c01dc88${_scopeId}><button class="btn btn-outline-warning" title="Edit Resep" data-v-3c01dc88${_scopeId}><i class="fas fa-edit" data-v-3c01dc88${_scopeId}></i></button><button class="btn btn-outline-danger" title="Hapus Resep" data-v-3c01dc88${_scopeId}><i class="fas fa-trash" data-v-3c01dc88${_scopeId}></i></button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-3c01dc88${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: __props.recipes.links
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
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
                        placeholder: "Cari berdasarkan nama produk..."
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
                        onClick: openAddRecipe
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Resep ")
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                createVNode("div", { class: "text-muted" }, " Menampilkan " + toDisplayString(__props.recipes.from || 0) + " - " + toDisplayString(__props.recipes.to || 0) + " dari " + toDisplayString(__props.recipes.total || 0) + " data ", 1),
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
                            sortable: isSortable("product_name")
                          },
                          onClick: ($event) => isSortable("product_name") && handleSort("product_name"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Nama Produk "),
                          isSortable("product_name") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("product_name"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: "text-center",
                          style: { "width": "140px" }
                        }, "Aksi")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      __props.recipes.data && __props.recipes.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "5",
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, 'Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '"', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data resep"))
                        ])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.recipes.data, (recipe, index) => {
                        var _a;
                        return openBlock(), createBlock("tr", {
                          key: recipe.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString(__props.recipes.from + index), 1),
                          createVNode("td", { class: "fw-medium" }, toDisplayString((_a = recipe.product) == null ? void 0 : _a.product_name), 1),
                          createVNode("td", { class: "text-center" }, [
                            createVNode("div", {
                              class: "btn-group btn-group-sm",
                              role: "group"
                            }, [
                              createVNode("button", {
                                onClick: ($event) => openEditRecipe(recipe),
                                class: "btn btn-outline-warning",
                                title: "Edit Resep"
                              }, [
                                createVNode("i", { class: "fas fa-edit" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deleteRecipe(recipe.id),
                                class: "btn btn-outline-danger",
                                title: "Hapus Resep"
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
                  links: __props.recipes.links
                }, null, 8, ["links"])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreRecipe/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c01dc88"]]);
export {
  Index as default
};
