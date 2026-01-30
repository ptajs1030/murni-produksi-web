import { getCurrentInstance, ref, computed, watch, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Ds1QaqxF.js";
import _sfc_main$4 from "./IncomingProductModal-Ws8bkq5n.js";
import { usePage, router, Head } from "@inertiajs/vue3";
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
  props: ["incoming", "products", "filters"],
  setup(__props) {
    var _a;
    const props = __props;
    const page = usePage();
    const { proxy } = getCurrentInstance();
    const modalRef = ref(null);
    const search = ref(((_a = props.filters) == null ? void 0 : _a.search) || "");
    const isOwner = computed(() => {
      var _a2, _b;
      return ((_b = (_a2 = page.props.auth) == null ? void 0 : _a2.user) == null ? void 0 : _b.role) === "owner";
    });
    watch(
      search,
      debounce((value) => {
        const params = {};
        if (value) params.search = value;
        router.get(route("incoming-goods.index"), params, {
          preserveState: true,
          replace: true
        });
      }, 300)
    );
    const formatCurrency = (amount) => {
      if (!amount) return "Rp 0";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    const statusBadgeClass = (status) => {
      switch (status) {
        case "PENDING":
          return "bg-warning text-dark";
        case "APPROVED":
          return "bg-success";
        case "REJECTED":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    };
    const clearFilters = () => {
      search.value = "";
      router.get(
        route("incoming-goods.index"),
        {},
        {
          preserveState: true,
          replace: true
        }
      );
    };
    const hasActiveFilters = computed(() => !!search.value);
    const openAddModal = () => {
      var _a2;
      (_a2 = modalRef.value) == null ? void 0 : _a2.open();
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const updateStatus = async (id, status, productName) => {
      const isApprove = status === "APPROVED";
      const actionText = isApprove ? "menyetujui" : "menolak";
      const actionTitle = isApprove ? "Setujui Barang?" : "Tolak Barang?";
      const result = await proxy.$swal.fire({
        title: actionTitle,
        html: `Apakah Anda yakin ingin <strong>${actionText}</strong> barang datang:<br><br><strong>${productName}</strong>?`,
        icon: isApprove ? "question" : "warning",
        showCancelButton: true,
        confirmButtonColor: isApprove ? "#28a745" : "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: isApprove ? '<i class="fas fa-check me-1"></i> Ya, Setujui' : '<i class="fas fa-times me-1"></i> Ya, Tolak',
        cancelButtonText: '<i class="fas fa-arrow-left me-1"></i> Batal',
        reverseButtons: true,
        focusCancel: true
      });
      if (result.isConfirmed) {
        router.patch(
          route("incoming-goods.update-status", id),
          { status },
          {
            preserveScroll: true
          }
        );
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Barang Datang" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Barang Datang" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            _push2(`<div class="card mb-3" data-v-ec6896ed${_scopeId}><div class="card-body" data-v-ec6896ed${_scopeId}><div class="row g-3 align-items-end" data-v-ec6896ed${_scopeId}><div class="col-md-4" data-v-ec6896ed${_scopeId}><label class="form-label" data-v-ec6896ed${_scopeId}>Pencarian</label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              placeholder: "Cari berdasarkan nama produk..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-2" data-v-ec6896ed${_scopeId}>`);
            if (hasActiveFilters.value) {
              _push2(`<button type="button" class="btn btn-outline-secondary" data-v-ec6896ed${_scopeId}><i class="fas fa-times me-1" data-v-ec6896ed${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="col-md-6 text-end" data-v-ec6896ed${_scopeId}><button type="button" class="btn btn-primary" data-v-ec6896ed${_scopeId}><i class="fas fa-plus me-1" data-v-ec6896ed${_scopeId}></i> Tambah Barang Datang </button></div></div></div></div><div class="d-flex justify-content-between align-items-center mb-3" data-v-ec6896ed${_scopeId}><div class="text-muted" data-v-ec6896ed${_scopeId}> Menampilkan ${ssrInterpolate(((_a2 = __props.incoming) == null ? void 0 : _a2.from) ?? 0)} - ${ssrInterpolate(((_b = __props.incoming) == null ? void 0 : _b.to) ?? 0)} dari ${ssrInterpolate(((_c = __props.incoming) == null ? void 0 : _c.total) ?? 0)} data </div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="text-muted" data-v-ec6896ed${_scopeId}><i class="fas fa-filter me-1" data-v-ec6896ed${_scopeId}></i> Filter aktif </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="card" data-v-ec6896ed${_scopeId}><div class="table-responsive" data-v-ec6896ed${_scopeId}><table class="table table-hover mb-0" data-v-ec6896ed${_scopeId}><thead class="table-light" data-v-ec6896ed${_scopeId}><tr data-v-ec6896ed${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-ec6896ed${_scopeId}>No</th><th data-v-ec6896ed${_scopeId}>Nama Produk</th><th class="text-center" style="${ssrRenderStyle({ "width": "100px" })}" data-v-ec6896ed${_scopeId}> Qty </th><th class="text-center" style="${ssrRenderStyle({ "width": "140px" })}" data-v-ec6896ed${_scopeId}> Harga </th><th style="${ssrRenderStyle({ "width": "160px" })}" data-v-ec6896ed${_scopeId}>Tanggal Masuk</th><th class="text-center" style="${ssrRenderStyle({ "width": "110px" })}" data-v-ec6896ed${_scopeId}> Status </th>`);
            if (isOwner.value) {
              _push2(`<th class="text-center" style="${ssrRenderStyle({ "width": "200px" })}" data-v-ec6896ed${_scopeId}> Aksi </th>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tr></thead><tbody data-v-ec6896ed${_scopeId}>`);
            if (!((_e = (_d = __props.incoming) == null ? void 0 : _d.data) == null ? void 0 : _e.length)) {
              _push2(`<tr data-v-ec6896ed${_scopeId}><td${ssrRenderAttr("colspan", isOwner.value ? 7 : 6)} class="text-muted py-4 text-center" data-v-ec6896ed${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-ec6896ed${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-ec6896ed${_scopeId}> Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot; </div>`);
              } else {
                _push2(`<div data-v-ec6896ed${_scopeId}>Belum ada data barang datang</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.incoming.data, (row, index) => {
                var _a3;
                _push2(`<tr data-v-ec6896ed${_scopeId}><td class="text-muted text-center" data-v-ec6896ed${_scopeId}>${ssrInterpolate((__props.incoming.from ?? 0) + index)}</td><td class="fw-medium" data-v-ec6896ed${_scopeId}>${ssrInterpolate(((_a3 = row.product) == null ? void 0 : _a3.product_name) ?? "-")}</td><td class="text-center" data-v-ec6896ed${_scopeId}><span class="badge bg-light text-dark border" data-v-ec6896ed${_scopeId}>${ssrInterpolate(row.packaging_size_input)}</span></td><td class="text-center" data-v-ec6896ed${_scopeId}>${ssrInterpolate(formatCurrency(row.price))}</td><td class="text-muted small" data-v-ec6896ed${_scopeId}>${ssrInterpolate(formatDate(row.created_at))}</td><td class="text-center" data-v-ec6896ed${_scopeId}><span class="${ssrRenderClass([statusBadgeClass(row.status), "badge"])}" data-v-ec6896ed${_scopeId}><i class="${ssrRenderClass([{
                  "fa-clock": row.status === "PENDING",
                  "fa-check-circle": row.status === "APPROVED",
                  "fa-times-circle": row.status === "REJECTED"
                }, "fas me-1"])}" data-v-ec6896ed${_scopeId}></i> ${ssrInterpolate(row.status)}</span></td>`);
                if (isOwner.value) {
                  _push2(`<td class="text-center" data-v-ec6896ed${_scopeId}>`);
                  if (row.status === "PENDING") {
                    _push2(`<div class="d-flex gap-1 justify-content-center" data-v-ec6896ed${_scopeId}><button type="button" class="btn btn-success btn-sm" data-v-ec6896ed${_scopeId}><i class="fas fa-check me-1" data-v-ec6896ed${_scopeId}></i> Setujui </button><button type="button" class="btn btn-outline-danger btn-sm" data-v-ec6896ed${_scopeId}><i class="fas fa-times me-1" data-v-ec6896ed${_scopeId}></i> Tolak </button></div>`);
                  } else {
                    _push2(`<span class="text-muted small" data-v-ec6896ed${_scopeId}><i class="fas fa-check-double me-1" data-v-ec6896ed${_scopeId}></i> Selesai </span>`);
                  }
                  _push2(`</td>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-ec6896ed${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: ((_f = __props.incoming) == null ? void 0 : _f.links) ?? []
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "modalRef",
              ref: modalRef,
              products: __props.products ?? [],
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
                        placeholder: "Cari berdasarkan nama produk..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "col-md-2" }, [
                      hasActiveFilters.value ? (openBlock(), createBlock("button", {
                        key: 0,
                        type: "button",
                        class: "btn btn-outline-secondary",
                        onClick: clearFilters
                      }, [
                        createVNode("i", { class: "fas fa-times me-1" }),
                        createTextVNode(" Clear ")
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "col-md-6 text-end" }, [
                      createVNode("button", {
                        type: "button",
                        class: "btn btn-primary",
                        onClick: openAddModal
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Barang Datang ")
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                createVNode("div", { class: "text-muted" }, " Menampilkan " + toDisplayString(((_g = __props.incoming) == null ? void 0 : _g.from) ?? 0) + " - " + toDisplayString(((_h = __props.incoming) == null ? void 0 : _h.to) ?? 0) + " dari " + toDisplayString(((_i = __props.incoming) == null ? void 0 : _i.total) ?? 0) + " data ", 1),
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
                  createVNode("table", { class: "table table-hover mb-0" }, [
                    createVNode("thead", { class: "table-light" }, [
                      createVNode("tr", null, [
                        createVNode("th", {
                          class: "text-center",
                          style: { "width": "60px" }
                        }, "No"),
                        createVNode("th", null, "Nama Produk"),
                        createVNode("th", {
                          class: "text-center",
                          style: { "width": "100px" }
                        }, " Qty "),
                        createVNode("th", {
                          class: "text-center",
                          style: { "width": "140px" }
                        }, " Harga "),
                        createVNode("th", { style: { "width": "160px" } }, "Tanggal Masuk"),
                        createVNode("th", {
                          class: "text-center",
                          style: { "width": "110px" }
                        }, " Status "),
                        isOwner.value ? (openBlock(), createBlock("th", {
                          key: 0,
                          class: "text-center",
                          style: { "width": "200px" }
                        }, " Aksi ")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("tbody", null, [
                      !((_k = (_j = __props.incoming) == null ? void 0 : _j.data) == null ? void 0 : _k.length) ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: isOwner.value ? 7 : 6,
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, ' Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '" ', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data barang datang"))
                        ], 8, ["colspan"])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.incoming.data, (row, index) => {
                        var _a3;
                        return openBlock(), createBlock("tr", {
                          key: row.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString((__props.incoming.from ?? 0) + index), 1),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(((_a3 = row.product) == null ? void 0 : _a3.product_name) ?? "-"), 1),
                          createVNode("td", { class: "text-center" }, [
                            createVNode("span", { class: "badge bg-light text-dark border" }, toDisplayString(row.packaging_size_input), 1)
                          ]),
                          createVNode("td", { class: "text-center" }, toDisplayString(formatCurrency(row.price)), 1),
                          createVNode("td", { class: "text-muted small" }, toDisplayString(formatDate(row.created_at)), 1),
                          createVNode("td", { class: "text-center" }, [
                            createVNode("span", {
                              class: ["badge", statusBadgeClass(row.status)]
                            }, [
                              createVNode("i", {
                                class: ["fas me-1", {
                                  "fa-clock": row.status === "PENDING",
                                  "fa-check-circle": row.status === "APPROVED",
                                  "fa-times-circle": row.status === "REJECTED"
                                }]
                              }, null, 2),
                              createTextVNode(" " + toDisplayString(row.status), 1)
                            ], 2)
                          ]),
                          isOwner.value ? (openBlock(), createBlock("td", {
                            key: 0,
                            class: "text-center"
                          }, [
                            row.status === "PENDING" ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "d-flex gap-1 justify-content-center"
                            }, [
                              createVNode("button", {
                                type: "button",
                                class: "btn btn-success btn-sm",
                                onClick: ($event) => {
                                  var _a4;
                                  return updateStatus(
                                    row.id,
                                    "APPROVED",
                                    (_a4 = row.product) == null ? void 0 : _a4.product_name
                                  );
                                }
                              }, [
                                createVNode("i", { class: "fas fa-check me-1" }),
                                createTextVNode(" Setujui ")
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: "btn btn-outline-danger btn-sm",
                                onClick: ($event) => {
                                  var _a4;
                                  return updateStatus(
                                    row.id,
                                    "REJECTED",
                                    (_a4 = row.product) == null ? void 0 : _a4.product_name
                                  );
                                }
                              }, [
                                createVNode("i", { class: "fas fa-times me-1" }),
                                createTextVNode(" Tolak ")
                              ], 8, ["onClick"])
                            ])) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-muted small"
                            }, [
                              createVNode("i", { class: "fas fa-check-double me-1" }),
                              createTextVNode(" Selesai ")
                            ]))
                          ])) : createCommentVNode("", true)
                        ]);
                      }), 128))
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-3" }, [
                createVNode(_sfc_main$3, {
                  links: ((_l = __props.incoming) == null ? void 0 : _l.links) ?? []
                }, null, 8, ["links"])
              ]),
              createVNode(_sfc_main$4, {
                ref_key: "modalRef",
                ref: modalRef,
                products: __props.products ?? [],
                onSaved: ($event) => unref(router).reload()
              }, null, 8, ["products", "onSaved"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreIncomingProduct/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ec6896ed"]]);
export {
  Index as default
};
