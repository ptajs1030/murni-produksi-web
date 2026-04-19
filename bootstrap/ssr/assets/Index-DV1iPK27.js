import { ref, watch, getCurrentInstance, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-BBZT1pjc.js";
import _sfc_main$4 from "./PackagingTypeFormModal-Dk2b_IXw.js";
import { router, useForm, Head } from "@inertiajs/vue3";
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
  props: ["packaging_types", "packagingLevels", "filters"],
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
        router.get("/packaging-types", params, {
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
      router.get("/packaging-types", params, {
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
        "packaging_type_code",
        "packaging_type_name",
        "created_at",
        "updated_at"
      ];
      return sortableFields.includes(field);
    };
    const openAddPackagingType = () => {
      modalRef.value.open();
    };
    const openEditPackagingType = (packaging_type) => {
      modalRef.value.open(packaging_type);
    };
    const { proxy } = getCurrentInstance();
    const deletePackagingType = (id) => {
      proxy.$confirmDelete("/packaging-types", id);
    };
    const clearFilters = () => {
      search.value = "";
      currentSort.value = "";
      router.get(
        "/packaging-types",
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
    const showImportModal = ref(false);
    const importForm = useForm({ file: null });
    const openImportModal = () => {
      showImportModal.value = true;
      importForm.reset();
      importForm.clearErrors();
    };
    const closeImportModal = () => {
      showImportModal.value = false;
      importForm.reset();
      importForm.clearErrors();
    };
    const handleFileChange = (e) => {
      importForm.file = e.target.files[0];
    };
    const submitImport = () => {
      importForm.post(route("packaging-types.import"), {
        forceFormData: true,
        onSuccess: () => closeImportModal()
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Tipe Kemasan" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Daftar Tipe Kemasan" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg" data-v-bfd8229d${_scopeId}><div class="p-3 text-gray-900" data-v-bfd8229d${_scopeId}><div class="d-flex justify-content-between align-items-center mb-3" data-v-bfd8229d${_scopeId}><div class="d-flex align-items-center gap-3" data-v-bfd8229d${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "search",
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              class: "form-control",
              placeholder: "Cari berdasarkan kode atau nama tipe kemasan...",
              style: { "width": "400px" }
            }, null, _parent2, _scopeId));
            if (hasActiveFilters.value) {
              _push2(`<button class="btn btn-outline-secondary" data-v-bfd8229d${_scopeId}><i class="fas fa-times me-1" data-v-bfd8229d${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="d-flex gap-2" data-v-bfd8229d${_scopeId}><button class="btn btn-outline-success" data-v-bfd8229d${_scopeId}><i class="fas fa-file-import me-1" data-v-bfd8229d${_scopeId}></i> Import </button><button class="btn btn-primary" data-v-bfd8229d${_scopeId}><i class="fas fa-plus me-1" data-v-bfd8229d${_scopeId}></i> Tambah Tipe Kemasan </button></div></div></div></div><div class="card" data-v-bfd8229d${_scopeId}><div class="table-responsive" data-v-bfd8229d${_scopeId}><table class="table-hover mb-0 table" data-v-bfd8229d${_scopeId}><thead class="table-light" data-v-bfd8229d${_scopeId}><tr data-v-bfd8229d${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-bfd8229d${_scopeId}>#</th><th class="${ssrRenderClass({
              sortable: isSortable("packaging_type_code")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-bfd8229d${_scopeId}> Kode Tipe Kemasan `);
            if (isSortable("packaging_type_code")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("packaging_type_code"), "ms-1"])}" data-v-bfd8229d${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="${ssrRenderClass({
              sortable: isSortable("packaging_type_name")
            })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-bfd8229d${_scopeId}> Nama Tipe Kemasan `);
            if (isSortable("packaging_type_name")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("packaging_type_name"), "ms-1"])}" data-v-bfd8229d${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th data-v-bfd8229d${_scopeId}>Level Kemasan</th><th class="${ssrRenderClass({ sortable: isSortable("created_at") })}" style="${ssrRenderStyle({ "cursor": "pointer" })}" data-v-bfd8229d${_scopeId}> Tanggal Dibuat `);
            if (isSortable("created_at")) {
              _push2(`<i class="${ssrRenderClass([getSortIcon("created_at"), "ms-1"])}" data-v-bfd8229d${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</th><th class="text-center" style="${ssrRenderStyle({ "width": "120px" })}" data-v-bfd8229d${_scopeId}> Aksi </th></tr></thead><tbody data-v-bfd8229d${_scopeId}>`);
            if (__props.packaging_types.data && __props.packaging_types.data.length === 0) {
              _push2(`<tr data-v-bfd8229d${_scopeId}><td colspan="6" class="text-muted py-4 text-center" data-v-bfd8229d${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-bfd8229d${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-bfd8229d${_scopeId}> Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot; </div>`);
              } else {
                _push2(`<div data-v-bfd8229d${_scopeId}>Belum ada data tipe kemasan</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.packaging_types.data, (packaging_type, index) => {
                var _a;
                _push2(`<tr data-v-bfd8229d${_scopeId}><td class="text-muted text-center" data-v-bfd8229d${_scopeId}>${ssrInterpolate(__props.packaging_types.from + index)}</td><td data-v-bfd8229d${_scopeId}><span class="badge bg-secondary" data-v-bfd8229d${_scopeId}>${ssrInterpolate(packaging_type.packaging_type_code)}</span></td><td class="fw-medium" data-v-bfd8229d${_scopeId}>${ssrInterpolate(packaging_type.packaging_type_name)}</td><td data-v-bfd8229d${_scopeId}><span class="badge bg-info" data-v-bfd8229d${_scopeId}>${ssrInterpolate(((_a = packaging_type.packaging_level) == null ? void 0 : _a.level_description) || "N/A")}</span></td><td class="text-muted" data-v-bfd8229d${_scopeId}>${ssrInterpolate(new Date(
                  packaging_type.created_at
                ).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }))}</td><td class="text-center" data-v-bfd8229d${_scopeId}><div class="btn-group btn-group-md" role="group" data-v-bfd8229d${_scopeId}><button class="btn btn-outline-warning" title="Edit Tipe Kemasan" data-v-bfd8229d${_scopeId}><i class="fas fa-edit" data-v-bfd8229d${_scopeId}></i></button><button class="btn btn-outline-danger" title="Hapus Tipe Kemasan" data-v-bfd8229d${_scopeId}><i class="fas fa-trash" data-v-bfd8229d${_scopeId}></i></button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-bfd8229d${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: __props.packaging_types.links
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "modalRef",
              ref: modalRef,
              packagingLevels: __props.packagingLevels,
              onSaved: ($event) => unref(router).reload()
            }, null, _parent2, _scopeId));
            if (showImportModal.value) {
              _push2(`<div class="modal-backdrop fade show" data-v-bfd8229d${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showImportModal.value) {
              _push2(`<div class="modal fade show d-block" tabindex="-1" data-v-bfd8229d${_scopeId}><div class="modal-dialog modal-dialog-centered" data-v-bfd8229d${_scopeId}><div class="modal-content" data-v-bfd8229d${_scopeId}><div class="modal-header" data-v-bfd8229d${_scopeId}><h5 class="modal-title" data-v-bfd8229d${_scopeId}><i class="fas fa-file-import me-2" data-v-bfd8229d${_scopeId}></i> Import Tipe Kemasan </h5><button type="button" class="btn-close" data-v-bfd8229d${_scopeId}></button></div><div class="modal-body" data-v-bfd8229d${_scopeId}><div class="alert alert-info mb-3" data-v-bfd8229d${_scopeId}><i class="fas fa-info-circle me-1" data-v-bfd8229d${_scopeId}></i> Download template terlebih dahulu, isi data sesuai format, lalu upload file yang sudah diisi. </div><div class="mb-3" data-v-bfd8229d${_scopeId}><a${ssrRenderAttr("href", _ctx.route("packaging-types.import-template"))} class="btn btn-outline-primary" data-v-bfd8229d${_scopeId}><i class="fas fa-download me-1" data-v-bfd8229d${_scopeId}></i> Download Template </a></div><div class="mb-3" data-v-bfd8229d${_scopeId}><label class="form-label fw-medium" data-v-bfd8229d${_scopeId}>File Excel</label><input type="file" class="${ssrRenderClass([{ "is-invalid": unref(importForm).errors.file }, "form-control"])}" accept=".xlsx,.xls" data-v-bfd8229d${_scopeId}>`);
              if (unref(importForm).errors.file) {
                _push2(`<div class="invalid-feedback" data-v-bfd8229d${_scopeId}>${ssrInterpolate(unref(importForm).errors.file)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="modal-footer" data-v-bfd8229d${_scopeId}><button type="button" class="btn btn-secondary" data-v-bfd8229d${_scopeId}>Batal</button><button type="button" class="btn btn-success"${ssrIncludeBooleanAttr(unref(importForm).processing || !unref(importForm).file) ? " disabled" : ""} data-v-bfd8229d${_scopeId}>`);
              if (unref(importForm).processing) {
                _push2(`<span class="spinner-border spinner-border-sm me-1" data-v-bfd8229d${_scopeId}></span>`);
              } else {
                _push2(`<i class="fas fa-upload me-1" data-v-bfd8229d${_scopeId}></i>`);
              }
              _push2(` Upload &amp; Import </button></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
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
                        placeholder: "Cari berdasarkan kode atau nama tipe kemasan...",
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
                    createVNode("div", { class: "d-flex gap-2" }, [
                      createVNode("button", {
                        class: "btn btn-outline-success",
                        onClick: openImportModal
                      }, [
                        createVNode("i", { class: "fas fa-file-import me-1" }),
                        createTextVNode(" Import ")
                      ]),
                      createVNode("button", {
                        class: "btn btn-primary",
                        onClick: openAddPackagingType
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Tipe Kemasan ")
                      ])
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
                            sortable: isSortable("packaging_type_code")
                          },
                          onClick: ($event) => isSortable("packaging_type_code") && handleSort("packaging_type_code"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Kode Tipe Kemasan "),
                          isSortable("packaging_type_code") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("packaging_type_code"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", {
                          class: {
                            sortable: isSortable("packaging_type_name")
                          },
                          onClick: ($event) => isSortable("packaging_type_name") && handleSort("packaging_type_name"),
                          style: { "cursor": "pointer" }
                        }, [
                          createTextVNode(" Nama Tipe Kemasan "),
                          isSortable("packaging_type_name") ? (openBlock(), createBlock("i", {
                            key: 0,
                            class: [getSortIcon("packaging_type_name"), "ms-1"]
                          }, null, 2)) : createCommentVNode("", true)
                        ], 10, ["onClick"]),
                        createVNode("th", null, "Level Kemasan"),
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
                      __props.packaging_types.data && __props.packaging_types.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "6",
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, ' Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '" ', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data tipe kemasan"))
                        ])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.packaging_types.data, (packaging_type, index) => {
                        var _a;
                        return openBlock(), createBlock("tr", {
                          key: packaging_type.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString(__props.packaging_types.from + index), 1),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-secondary" }, toDisplayString(packaging_type.packaging_type_code), 1)
                          ]),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(packaging_type.packaging_type_name), 1),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-info" }, toDisplayString(((_a = packaging_type.packaging_level) == null ? void 0 : _a.level_description) || "N/A"), 1)
                          ]),
                          createVNode("td", { class: "text-muted" }, toDisplayString(new Date(
                            packaging_type.created_at
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
                                onClick: ($event) => openEditPackagingType(
                                  packaging_type
                                ),
                                class: "btn btn-outline-warning",
                                title: "Edit Tipe Kemasan"
                              }, [
                                createVNode("i", { class: "fas fa-edit" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => deletePackagingType(
                                  packaging_type.id
                                ),
                                class: "btn btn-outline-danger",
                                title: "Hapus Tipe Kemasan"
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
                  links: __props.packaging_types.links
                }, null, 8, ["links"])
              ]),
              createVNode(_sfc_main$4, {
                ref_key: "modalRef",
                ref: modalRef,
                packagingLevels: __props.packagingLevels,
                onSaved: ($event) => unref(router).reload()
              }, null, 8, ["packagingLevels", "onSaved"]),
              showImportModal.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "modal-backdrop fade show",
                onClick: closeImportModal
              })) : createCommentVNode("", true),
              showImportModal.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "modal fade show d-block",
                tabindex: "-1"
              }, [
                createVNode("div", { class: "modal-dialog modal-dialog-centered" }, [
                  createVNode("div", { class: "modal-content" }, [
                    createVNode("div", { class: "modal-header" }, [
                      createVNode("h5", { class: "modal-title" }, [
                        createVNode("i", { class: "fas fa-file-import me-2" }),
                        createTextVNode(" Import Tipe Kemasan ")
                      ]),
                      createVNode("button", {
                        type: "button",
                        class: "btn-close",
                        onClick: closeImportModal
                      })
                    ]),
                    createVNode("div", { class: "modal-body" }, [
                      createVNode("div", { class: "alert alert-info mb-3" }, [
                        createVNode("i", { class: "fas fa-info-circle me-1" }),
                        createTextVNode(" Download template terlebih dahulu, isi data sesuai format, lalu upload file yang sudah diisi. ")
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("a", {
                          href: _ctx.route("packaging-types.import-template"),
                          class: "btn btn-outline-primary"
                        }, [
                          createVNode("i", { class: "fas fa-download me-1" }),
                          createTextVNode(" Download Template ")
                        ], 8, ["href"])
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("label", { class: "form-label fw-medium" }, "File Excel"),
                        createVNode("input", {
                          type: "file",
                          class: ["form-control", { "is-invalid": unref(importForm).errors.file }],
                          accept: ".xlsx,.xls",
                          onChange: handleFileChange
                        }, null, 34),
                        unref(importForm).errors.file ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "invalid-feedback"
                        }, toDisplayString(unref(importForm).errors.file), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "modal-footer" }, [
                      createVNode("button", {
                        type: "button",
                        class: "btn btn-secondary",
                        onClick: closeImportModal
                      }, "Batal"),
                      createVNode("button", {
                        type: "button",
                        class: "btn btn-success",
                        onClick: submitImport,
                        disabled: unref(importForm).processing || !unref(importForm).file
                      }, [
                        unref(importForm).processing ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "spinner-border spinner-border-sm me-1"
                        })) : (openBlock(), createBlock("i", {
                          key: 1,
                          class: "fas fa-upload me-1"
                        })),
                        createTextVNode(" Upload & Import ")
                      ], 8, ["disabled"])
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MPackagingTypes/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bfd8229d"]]);
export {
  Index as default
};
