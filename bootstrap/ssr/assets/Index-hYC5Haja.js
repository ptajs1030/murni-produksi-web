import { ref, watch, getCurrentInstance, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Ds1QaqxF.js";
import _sfc_main$4 from "./SupplierFormModal-DT9HHZr3.js";
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
  props: ["suppliers", "filters"],
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
        router.get("/suppliers", params, {
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
      router.get("/suppliers", params, {
        preserveState: true,
        replace: true
      });
    };
    const getSortIcon = (field) => {
      if (currentSort.value !== field) return "fas fa-sort text-muted";
      return sortDirection.value === "asc" ? "fas fa-sort-up text-primary" : "fas fa-sort-down text-primary";
    };
    const isSortable = (field) => {
      const sortableFields = ["id", "supplier_code", "supplier_name", "created_at", "updated_at"];
      return sortableFields.includes(field);
    };
    const openAddSupplier = () => {
      modalRef.value.open();
    };
    const openEditSupplier = (supplier) => {
      modalRef.value.open(supplier);
    };
    const { proxy } = getCurrentInstance();
    const deleteSupplier = (id) => {
      proxy.$confirmDelete("/suppliers", id);
    };
    const clearFilters = () => {
      search.value = "";
      currentSort.value = "";
      router.get(
        "/suppliers",
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
      const url = route("suppliers.export") + (queryString ? "?" + queryString : "");
      window.location.href = url;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Suppliers" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Daftar Supplier" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card mb-3" data-v-298affcb${_scopeId}><div class="card-body" data-v-298affcb${_scopeId}><div class="row g-3 align-items-end" data-v-298affcb${_scopeId}><div class="col-md-4" data-v-298affcb${_scopeId}><label class="form-label" data-v-298affcb${_scopeId}>Pencarian</label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              placeholder: "Cari berdasarkan kode atau nama supplier..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-2" data-v-298affcb${_scopeId}>`);
            if (hasActiveFilters.value) {
              _push2(`<button class="btn btn-outline-secondary" data-v-298affcb${_scopeId}><i class="fas fa-times me-1" data-v-298affcb${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="col-md-6 text-end" data-v-298affcb${_scopeId}><button class="btn btn-primary" data-v-298affcb${_scopeId}><i class="fas fa-plus me-1" data-v-298affcb${_scopeId}></i> Tambah Supplier </button><button class="btn btn-success ms-2" data-v-298affcb${_scopeId}>Export Excel</button></div></div></div></div><div class="d-flex justify-content-between align-items-center mb-3" data-v-298affcb${_scopeId}><div class="text-muted" data-v-298affcb${_scopeId}> Menampilkan ${ssrInterpolate(__props.suppliers.from || 0)} - ${ssrInterpolate(__props.suppliers.to || 0)} dari ${ssrInterpolate(__props.suppliers.total || 0)} data </div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="text-muted" data-v-298affcb${_scopeId}><i class="fas fa-filter me-1" data-v-298affcb${_scopeId}></i> Filter aktif </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="card" data-v-298affcb${_scopeId}><div class="table-responsive" data-v-298affcb${_scopeId}><table class="table-hover mb-0 table" data-v-298affcb${_scopeId}><thead class="table-light" data-v-298affcb${_scopeId}><tr data-v-298affcb${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-298affcb${_scopeId}>#</th><th class="${ssrRenderClass({
              sortable: isSortable("supplier_code")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-298affcb${_scopeId}> Kode Supplier `);
            if (isSortable("supplier_code")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("supplier_code"), "ms-1"])}" data-v-298affcb${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({
              sortable: isSortable("supplier_name")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-298affcb${_scopeId}> Nama Supplier `);
            if (isSortable("supplier_name")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("supplier_name"), "ms-1"])}" data-v-298affcb${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({ sortable: isSortable("created_at") })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-298affcb${_scopeId}> Tanggal Dibuat `);
            if (isSortable("created_at")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("created_at"), "ms-1"])}" data-v-298affcb${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="text-center" style="${ssrRenderStyle({ "width": "120px" })}" data-v-298affcb${_scopeId}>Aksi</th></tr></thead><tbody data-v-298affcb${_scopeId}>`);
            if (__props.suppliers.data && __props.suppliers.data.length === 0) {
              _push2(`<tr data-v-298affcb${_scopeId}><td colspan="5" class="text-muted py-4 text-center" data-v-298affcb${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-298affcb${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-298affcb${_scopeId}>Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot;</div>`);
              } else {
                _push2(`<div data-v-298affcb${_scopeId}>Belum ada data supplier</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.suppliers.data, (supplier, index) => {
                _push2(`<tr data-v-298affcb${_scopeId}><td class="text-muted text-center" data-v-298affcb${_scopeId}>${ssrInterpolate(__props.suppliers.from + index)}</td><td data-v-298affcb${_scopeId}><span class="badge bg-secondary" data-v-298affcb${_scopeId}>${ssrInterpolate(supplier.supplier_code)}</span></td><td class="fw-medium" data-v-298affcb${_scopeId}>${ssrInterpolate(supplier.supplier_name)}</td><td class="text-muted" data-v-298affcb${_scopeId}>${ssrInterpolate(new Date(supplier.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }))}</td><td class="text-center" data-v-298affcb${_scopeId}><div class="btn-group btn-group-md" role="group" data-v-298affcb${_scopeId}><button class="btn btn-outline-warning" title="Edit Supplier" data-v-298affcb${_scopeId}><i class="fas fa-edit" data-v-298affcb${_scopeId}></i></button><button class="btn btn-outline-danger" title="Hapus Supplier" data-v-298affcb${_scopeId}><i class="fas fa-trash" data-v-298affcb${_scopeId}></i></button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-298affcb${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: __props.suppliers.links
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
                        placeholder: "Cari berdasarkan kode atau nama supplier..."
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
                        onClick: openAddSupplier
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Supplier ")
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
                createVNode("div", { class: "text-muted" }, " Menampilkan " + toDisplayString(__props.suppliers.from || 0) + " - " + toDisplayString(__props.suppliers.to || 0) + " dari " + toDisplayString(__props.suppliers.total || 0) + " data ", 1),
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
                            sortable: isSortable("supplier_code")
                          },
                          onClick: ($event) => isSortable("supplier_code") && handleSort("supplier_code"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Kode Supplier "),
                          isSortable("supplier_code") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("supplier_code"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: {
                            sortable: isSortable("supplier_name")
                          },
                          onClick: ($event) => isSortable("supplier_name") && handleSort("supplier_name"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Nama Supplier "),
                          isSortable("supplier_name") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("supplier_name"), "ms-1"]
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
                      __props.suppliers.data && __props.suppliers.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "5",
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, 'Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '"', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data supplier"))
                        ])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.suppliers.data, (supplier, index) => {
                        return openBlock(), createBlock("tr", {
                          key: supplier.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString(__props.suppliers.from + index), 1),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-secondary" }, toDisplayString(supplier.supplier_code), 1)
                          ]),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(supplier.supplier_name), 1),
                          createVNode("td", { class: "text-muted" }, toDisplayString(new Date(supplier.created_at).toLocaleDateString("id-ID", {
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
                                onClick: ($event) => openEditSupplier(supplier),
                                class: "btn btn-outline-warning",
                                title: "Edit Supplier"
                              }, [
                                createVNode("i", { class: "fas fa-edit" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deleteSupplier(supplier.id),
                                class: "btn btn-outline-danger",
                                title: "Hapus Supplier"
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
                  links: __props.suppliers.links
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MSuppliers/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-298affcb"]]);
export {
  Index as default
};
