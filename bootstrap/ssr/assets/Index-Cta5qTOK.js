import { ref, watch, getCurrentInstance, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderClass, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-BBZT1pjc.js";
import _sfc_main$4 from "./PackagingSizeFormModal-nHAwdQAe.js";
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
  props: [
    "packagingSizes",
    "packagingSizeTypes",
    "packagingSizeLevels",
    "filters"
  ],
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
        router.get("/packaging-sizes", params, {
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
      router.get("/packaging-sizes", params, {
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
        "packaging_size_code",
        "packaging_size_name",
        "created_at",
        "updated_at"
      ];
      return sortableFields.includes(field);
    };
    const openAddPackagingSize = () => {
      modalRef.value.open();
    };
    const openEditPackagingSize = (packagingSize) => {
      modalRef.value.open(packagingSize);
    };
    const { proxy } = getCurrentInstance();
    const deletePackagingSize = (id) => {
      proxy.$confirmDelete("/packaging-sizes", id);
    };
    const clearFilters = () => {
      search.value = "";
      currentSort.value = "";
      router.get(
        "/packaging-sizes",
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
      _push(ssrRenderComponent(unref(Head), { title: "Ukuran Kemasan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Daftar Ukuran Kemasan" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg" data-v-5089f76a${_scopeId}><div class="p-3 text-gray-900" data-v-5089f76a${_scopeId}><div class="d-flex justify-content-between align-items-center mb-3" data-v-5089f76a${_scopeId}><div class="d-flex align-items-center gap-3" data-v-5089f76a${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "search",
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              class: "form-control",
              placeholder: "Cari berdasarkan kode atau nama ukuran kemasan...",
              style: { "width": "400px" }
            }, null, _parent2, _scopeId));
            if (hasActiveFilters.value) {
              _push2(`<button class="btn btn-outline-secondary" data-v-5089f76a${_scopeId}><i class="fas fa-times me-1" data-v-5089f76a${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button class="btn btn-primary" data-v-5089f76a${_scopeId}><i class="fas fa-plus me-1" data-v-5089f76a${_scopeId}></i> Tambah Ukuran Kemasan </button></div></div></div><div class="card" data-v-5089f76a${_scopeId}><div class="table-responsive" data-v-5089f76a${_scopeId}><table class="table-hover mb-0 table" data-v-5089f76a${_scopeId}><thead class="table-light" data-v-5089f76a${_scopeId}><tr data-v-5089f76a${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-5089f76a${_scopeId}>#</th><th class="${ssrRenderClass({
              sortable: isSortable("packaging_size_code")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-5089f76a${_scopeId}> Kode Ukuran Kemasan `);
            if (isSortable("packaging_size_code")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("packaging_size_code"), "ms-1"])}" data-v-5089f76a${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({
              sortable: isSortable("packaging_size_name")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-5089f76a${_scopeId}> Nama Ukuran Kemasan `);
            if (isSortable("packaging_size_name")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("packaging_size_name"), "ms-1"])}" data-v-5089f76a${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({
              sortable: isSortable("packaging_size_name")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-5089f76a${_scopeId}> Conversion Kemasan `);
            if (isSortable("unit_conversion_value")) {
              _push2(`<i class="${ssrRenderClass([
                getSortIcon("unit_conversion_value"),
                "ms-1"
              ])}" data-v-5089f76a${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th data-v-5089f76a${_scopeId}>Tipe Ukuran</th><th data-v-5089f76a${_scopeId}>Level Ukuran</th><th class="${ssrRenderClass({ sortable: isSortable("created_at") })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-5089f76a${_scopeId}> Tanggal Dibuat `);
            if (isSortable("created_at")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("created_at"), "ms-1"])}" data-v-5089f76a${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="text-center" style="${ssrRenderStyle({ "width": "120px" })}" data-v-5089f76a${_scopeId}> Aksi </th></tr></thead><tbody data-v-5089f76a${_scopeId}>`);
            if (__props.packagingSizes.data && __props.packagingSizes.data.length === 0) {
              _push2(`<tr data-v-5089f76a${_scopeId}><td colspan="7" class="text-muted py-4 text-center" data-v-5089f76a${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-5089f76a${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-5089f76a${_scopeId}> Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot; </div>`);
              } else {
                _push2(`<div data-v-5089f76a${_scopeId}>Belum ada data ukuran kemasan</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.packagingSizes.data, (packagingSize, index) => {
                var _a, _b;
                _push2(`<tr data-v-5089f76a${_scopeId}><td class="text-muted text-center" data-v-5089f76a${_scopeId}>${ssrInterpolate(__props.packagingSizes.from + index)}</td><td data-v-5089f76a${_scopeId}><span class="badge bg-secondary" data-v-5089f76a${_scopeId}>${ssrInterpolate(packagingSize.packaging_size_code)}</span></td><td class="fw-medium" data-v-5089f76a${_scopeId}>${ssrInterpolate(packagingSize.packaging_size_name)}</td><td class="text-center" data-v-5089f76a${_scopeId}><span class="badge bg-info text-dark" data-v-5089f76a${_scopeId}>${ssrInterpolate(packagingSize.unit_conversion_value ?? "N/A")}</span></td><td data-v-5089f76a${_scopeId}><span class="badge bg-info text-dark" data-v-5089f76a${_scopeId}>${ssrInterpolate(((_a = packagingSize.size_type) == null ? void 0 : _a.type_description) || "N/A")}</span></td><td data-v-5089f76a${_scopeId}><span class="badge bg-success" data-v-5089f76a${_scopeId}>${ssrInterpolate(((_b = packagingSize.size_level) == null ? void 0 : _b.level_description) || "N/A")}</span></td><td class="text-muted" data-v-5089f76a${_scopeId}>${ssrInterpolate(new Date(
                  packagingSize.created_at
                ).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }))}</td><td class="text-center" data-v-5089f76a${_scopeId}><div class="btn-group btn-group-md" role="group" data-v-5089f76a${_scopeId}><button class="btn btn-outline-warning" title="Edit Ukuran Kemasan" data-v-5089f76a${_scopeId}><i class="fas fa-edit" data-v-5089f76a${_scopeId}></i></button><button class="btn btn-outline-danger" title="Hapus Ukuran Kemasan" data-v-5089f76a${_scopeId}><i class="fas fa-trash" data-v-5089f76a${_scopeId}></i></button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-5089f76a${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: __props.packagingSizes.links
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "modalRef",
              ref: modalRef,
              packagingSizeTypes: __props.packagingSizeTypes,
              packagingSizeLevels: __props.packagingSizeLevels,
              onSaved: ($event) => unref(router).reload()
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "overflow-hidden bg-white shadow-sm sm:rounded-lg" }, [
                createVNode("div", { class: "p-3 text-gray-900" }, [
                  createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                    createVNode("div", { class: "d-flex align-items-center gap-3" }, [
                      createVNode(_sfc_main$2, {
                        id: "search",
                        modelValue: search.value,
                        "onUpdate:modelValue": ($event) => search.value = $event,
                        type: "text",
                        class: "form-control",
                        placeholder: "Cari berdasarkan kode atau nama ukuran kemasan...",
                        style: { "width": "400px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      hasActiveFilters.value ? (openBlock(), createBlock("button", {
                        key: 0,
                        onClick: clearFilters,
                        class: "btn btn-outline-secondary"
                      }, [
                        createVNode("i", { class: "fas fa-times me-1" }),
                        createTextVNode(" Clear ")
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("button", {
                      class: "btn btn-primary",
                      onClick: openAddPackagingSize
                    }, [
                      createVNode("i", { class: "fas fa-plus me-1" }),
                      createTextVNode(" Tambah Ukuran Kemasan ")
                    ])
                  ])
                ])
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
                            sortable: isSortable("packaging_size_code")
                          },
                          onClick: ($event) => isSortable("packaging_size_code") && handleSort("packaging_size_code"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Kode Ukuran Kemasan "),
                          isSortable("packaging_size_code") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("packaging_size_code"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: {
                            sortable: isSortable("packaging_size_name")
                          },
                          onClick: ($event) => isSortable("packaging_size_name") && handleSort("packaging_size_name"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Nama Ukuran Kemasan "),
                          isSortable("packaging_size_name") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("packaging_size_name"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: {
                            sortable: isSortable("packaging_size_name")
                          },
                          onClick: ($event) => isSortable("packaging_size_name") && handleSort("packaging_size_name"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Conversion Kemasan "),
                          isSortable("unit_conversion_value") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [
                              getSortIcon("unit_conversion_value"),
                              "ms-1"
                            ]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", null, "Tipe Ukuran"),
                        createVNode("th", null, "Level Ukuran"),
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
                        }, " Aksi ")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      __props.packagingSizes.data && __props.packagingSizes.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "7",
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, ' Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '" ', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data ukuran kemasan"))
                        ])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.packagingSizes.data, (packagingSize, index) => {
                        var _a, _b;
                        return openBlock(), createBlock("tr", {
                          key: packagingSize.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString(__props.packagingSizes.from + index), 1),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-secondary" }, toDisplayString(packagingSize.packaging_size_code), 1)
                          ]),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(packagingSize.packaging_size_name), 1),
                          createVNode("td", { class: "text-center" }, [
                            createVNode("span", { class: "badge bg-info text-dark" }, toDisplayString(packagingSize.unit_conversion_value ?? "N/A"), 1)
                          ]),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-info text-dark" }, toDisplayString(((_a = packagingSize.size_type) == null ? void 0 : _a.type_description) || "N/A"), 1)
                          ]),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-success" }, toDisplayString(((_b = packagingSize.size_level) == null ? void 0 : _b.level_description) || "N/A"), 1)
                          ]),
                          createVNode("td", { class: "text-muted" }, toDisplayString(new Date(
                            packagingSize.created_at
                          ).toLocaleDateString("id-ID", {
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
                                onClick: ($event) => openEditPackagingSize(packagingSize),
                                class: "btn btn-outline-warning",
                                title: "Edit Ukuran Kemasan"
                              }, [
                                createVNode("i", { class: "fas fa-edit" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deletePackagingSize(
                                  packagingSize.id
                                ),
                                class: "btn btn-outline-danger",
                                title: "Hapus Ukuran Kemasan"
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
                  links: __props.packagingSizes.links
                }, null, 8, ["links"])
              ]),
              createVNode(_sfc_main$4, {
                ref_key: "modalRef",
                ref: modalRef,
                packagingSizeTypes: __props.packagingSizeTypes,
                packagingSizeLevels: __props.packagingSizeLevels,
                onSaved: ($event) => unref(router).reload()
              }, null, 8, ["packagingSizeTypes", "packagingSizeLevels", "onSaved"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MPackagingSizes/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5089f76a"]]);
export {
  Index as default
};
