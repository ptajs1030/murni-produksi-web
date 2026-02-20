import { ref, watch, unref, withCtx, createVNode, createBlock, createCommentVNode, withDirectives, vModelText, vModelSelect, openBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-epgf0EbD.js";
import { Head, router } from "@inertiajs/vue3";
import { debounce } from "lodash";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["transactions", "transactionTypes", "filters"],
  setup(__props) {
    var _a, _b, _c, _d, _e;
    const props = __props;
    const search = ref(((_a = props.filters) == null ? void 0 : _a.search) || "");
    const dateFrom = ref(((_b = props.filters) == null ? void 0 : _b.date_from) || "");
    const dateTo = ref(((_c = props.filters) == null ? void 0 : _c.date_to) || "");
    const productType = ref(((_d = props.filters) == null ? void 0 : _d.product_type) || "");
    const transactionTypeId = ref(((_e = props.filters) == null ? void 0 : _e.transaction_type_id) || "");
    const applyFilters = () => {
      router.get(
        route("stock-transactions.index"),
        {
          search: search.value,
          date_from: dateFrom.value,
          date_to: dateTo.value,
          product_type: productType.value,
          transaction_type_id: transactionTypeId.value
        },
        {
          preserveState: true,
          replace: true
        }
      );
    };
    watch(
      search,
      debounce(() => {
        applyFilters();
      }, 300)
    );
    watch([dateFrom, dateTo, productType, transactionTypeId], () => {
      applyFilters();
    });
    const getRowNumber = (index) => {
      const currentPage = props.transactions.current_page || 1;
      const perPage = props.transactions.per_page || 10;
      return (currentPage - 1) * perPage + index + 1;
    };
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const resetFilters = () => {
      search.value = "";
      dateFrom.value = "";
      dateTo.value = "";
      productType.value = "";
      transactionTypeId.value = "";
      router.get(
        route("stock-transactions.index"),
        {},
        { preserveState: true, replace: true }
      );
    };
    const getTypeBadge = (typeName) => {
      if (!typeName) return "bg-secondary";
      switch (typeName.toUpperCase()) {
        case "IN":
          return "bg-success";
        case "OUT":
          return "bg-danger";
        case "PRODUKSI":
          return "bg-info";
        case "REPACK":
          return "bg-warning";
        default:
          return "bg-secondary";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Riwayat Transaksi" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Riwayat Transaksi" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg" data-v-bdec1280${_scopeId}><div class="p-3 text-gray-900" data-v-bdec1280${_scopeId}><div class="mb-3" data-v-bdec1280${_scopeId}><div class="row g-2 align-items-end" data-v-bdec1280${_scopeId}><div class="col-md-4" data-v-bdec1280${_scopeId}><label class="form-label small text-muted mb-1" data-v-bdec1280${_scopeId}>Cari</label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "search",
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              class: "form-control",
              placeholder: "Nama produk atau notes..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-2" data-v-bdec1280${_scopeId}><label class="form-label small text-muted mb-1" data-v-bdec1280${_scopeId}>Dari Tanggal</label><input${ssrRenderAttr("value", dateFrom.value)} type="date" class="form-control" data-v-bdec1280${_scopeId}></div><div class="col-md-2" data-v-bdec1280${_scopeId}><label class="form-label small text-muted mb-1" data-v-bdec1280${_scopeId}>Sampai Tanggal</label><input${ssrRenderAttr("value", dateTo.value)} type="date" class="form-control" data-v-bdec1280${_scopeId}></div><div class="col-md-2" data-v-bdec1280${_scopeId}><label class="form-label small text-muted mb-1" data-v-bdec1280${_scopeId}>Tipe Produk</label><select class="form-select" data-v-bdec1280${_scopeId}><option value="" data-v-bdec1280${ssrIncludeBooleanAttr(Array.isArray(productType.value) ? ssrLooseContain(productType.value, "") : ssrLooseEqual(productType.value, "")) ? " selected" : ""}${_scopeId}>Semua</option><option value="Produk Bahan Baku" data-v-bdec1280${ssrIncludeBooleanAttr(Array.isArray(productType.value) ? ssrLooseContain(productType.value, "Produk Bahan Baku") : ssrLooseEqual(productType.value, "Produk Bahan Baku")) ? " selected" : ""}${_scopeId}> Bahan Baku </option><option value="Produk Jadi" data-v-bdec1280${ssrIncludeBooleanAttr(Array.isArray(productType.value) ? ssrLooseContain(productType.value, "Produk Jadi") : ssrLooseEqual(productType.value, "Produk Jadi")) ? " selected" : ""}${_scopeId}>Produk Jadi</option></select></div><div class="col-md-2" data-v-bdec1280${_scopeId}><label class="form-label small text-muted mb-1" data-v-bdec1280${_scopeId}>Tipe Transaksi</label><select class="form-select" data-v-bdec1280${_scopeId}><option value="" data-v-bdec1280${ssrIncludeBooleanAttr(Array.isArray(transactionTypeId.value) ? ssrLooseContain(transactionTypeId.value, "") : ssrLooseEqual(transactionTypeId.value, "")) ? " selected" : ""}${_scopeId}>Semua</option><!--[-->`);
            ssrRenderList(__props.transactionTypes, (t) => {
              _push2(`<option${ssrRenderAttr("value", t.id)} data-v-bdec1280${ssrIncludeBooleanAttr(Array.isArray(transactionTypeId.value) ? ssrLooseContain(transactionTypeId.value, t.id) : ssrLooseEqual(transactionTypeId.value, t.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(t.transaction_type_name)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="col-md-auto" data-v-bdec1280${_scopeId}><button class="btn btn-outline-secondary w-100" data-v-bdec1280${_scopeId}><i class="fas fa-undo me-1" data-v-bdec1280${_scopeId}></i> Reset </button></div></div></div>`);
            if (__props.transactions.data.length > 0) {
              _push2(`<div class="table-responsive" data-v-bdec1280${_scopeId}><table class="table-bordered table-striped table" data-v-bdec1280${_scopeId}><thead class="table-light" data-v-bdec1280${_scopeId}><tr data-v-bdec1280${_scopeId}><th style="${ssrRenderStyle({ "width": "60px" })}" data-v-bdec1280${_scopeId}>No.</th><th data-v-bdec1280${_scopeId}>Produk</th><th style="${ssrRenderStyle({ "width": "130px" })}" data-v-bdec1280${_scopeId}>Tipe Transaksi</th><th style="${ssrRenderStyle({ "width": "100px" })}" data-v-bdec1280${_scopeId}>Qty</th><th style="${ssrRenderStyle({ "width": "180px" })}" data-v-bdec1280${_scopeId}>Tanggal Transaksi</th><th data-v-bdec1280${_scopeId}>Notes</th><th style="${ssrRenderStyle({ "width": "150px" })}" data-v-bdec1280${_scopeId}>PIC</th></tr></thead><tbody data-v-bdec1280${_scopeId}><!--[-->`);
              ssrRenderList(__props.transactions.data, (txn, index) => {
                var _a2, _b2, _c2, _d2, _e2, _f;
                _push2(`<tr data-v-bdec1280${_scopeId}><td data-v-bdec1280${_scopeId}>${ssrInterpolate(getRowNumber(index))}</td><td data-v-bdec1280${_scopeId}>${ssrInterpolate(((_a2 = txn.product) == null ? void 0 : _a2.product_name) || "-")} <br data-v-bdec1280${_scopeId}><small class="text-muted" data-v-bdec1280${_scopeId}>${ssrInterpolate(((_b2 = txn.product) == null ? void 0 : _b2.product_type) || "")}</small></td><td class="text-center" data-v-bdec1280${_scopeId}><span class="${ssrRenderClass([
                  getTypeBadge(
                    (_c2 = txn.transaction_type) == null ? void 0 : _c2.transaction_type_name
                  ),
                  "badge"
                ])}" data-v-bdec1280${_scopeId}>${ssrInterpolate(((_d2 = txn.transaction_type) == null ? void 0 : _d2.transaction_type_name) || "-")}</span></td><td class="text-center" data-v-bdec1280${_scopeId}>`);
                if (txn.quantity > 0) {
                  _push2(`<span class="badge bg-success" data-v-bdec1280${_scopeId}>${ssrInterpolate(txn.quantity)}</span>`);
                } else {
                  _push2(`<span class="badge bg-danger" data-v-bdec1280${_scopeId}>${ssrInterpolate(txn.quantity)}</span>`);
                }
                _push2(`</td><td data-v-bdec1280${_scopeId}>${ssrInterpolate(formatDate(txn.transaction_date))}</td><td data-v-bdec1280${_scopeId}><small data-v-bdec1280${_scopeId}>${ssrInterpolate(txn.notes || "-")}</small></td><td data-v-bdec1280${_scopeId}>${ssrInterpolate(((_e2 = txn.created_by_user) == null ? void 0 : _e2.name) || ((_f = txn.created_by) == null ? void 0 : _f.name) || "-")}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.transactions.data.length === 0) {
              _push2(`<div class="py-4 text-center" data-v-bdec1280${_scopeId}><p class="text-muted" data-v-bdec1280${_scopeId}> Tidak ada riwayat transaksi ditemukan. </p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.transactions.links && __props.transactions.data.length > 0) {
              _push2(ssrRenderComponent(_sfc_main$3, {
                links: __props.transactions.links
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "overflow-hidden bg-white shadow-sm sm:rounded-lg" }, [
                createVNode("div", { class: "p-3 text-gray-900" }, [
                  createVNode("div", { class: "mb-3" }, [
                    createVNode("div", { class: "row g-2 align-items-end" }, [
                      createVNode("div", { class: "col-md-4" }, [
                        createVNode("label", { class: "form-label small text-muted mb-1" }, "Cari"),
                        createVNode(_sfc_main$2, {
                          id: "search",
                          modelValue: search.value,
                          "onUpdate:modelValue": ($event) => search.value = $event,
                          type: "text",
                          class: "form-control",
                          placeholder: "Nama produk atau notes..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "col-md-2" }, [
                        createVNode("label", { class: "form-label small text-muted mb-1" }, "Dari Tanggal"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => dateFrom.value = $event,
                          type: "date",
                          class: "form-control"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, dateFrom.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-2" }, [
                        createVNode("label", { class: "form-label small text-muted mb-1" }, "Sampai Tanggal"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => dateTo.value = $event,
                          type: "date",
                          class: "form-control"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, dateTo.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-2" }, [
                        createVNode("label", { class: "form-label small text-muted mb-1" }, "Tipe Produk"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => productType.value = $event,
                          class: "form-select"
                        }, [
                          createVNode("option", { value: "" }, "Semua"),
                          createVNode("option", { value: "Produk Bahan Baku" }, " Bahan Baku "),
                          createVNode("option", { value: "Produk Jadi" }, "Produk Jadi")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, productType.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-2" }, [
                        createVNode("label", { class: "form-label small text-muted mb-1" }, "Tipe Transaksi"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => transactionTypeId.value = $event,
                          class: "form-select"
                        }, [
                          createVNode("option", { value: "" }, "Semua"),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.transactionTypes, (t) => {
                            return openBlock(), createBlock("option", {
                              key: t.id,
                              value: t.id
                            }, toDisplayString(t.transaction_type_name), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, transactionTypeId.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-auto" }, [
                        createVNode("button", {
                          onClick: resetFilters,
                          class: "btn btn-outline-secondary w-100"
                        }, [
                          createVNode("i", { class: "fas fa-undo me-1" }),
                          createTextVNode(" Reset ")
                        ])
                      ])
                    ])
                  ]),
                  __props.transactions.data.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "table-responsive"
                  }, [
                    createVNode("table", { class: "table-bordered table-striped table" }, [
                      createVNode("thead", { class: "table-light" }, [
                        createVNode("tr", null, [
                          createVNode("th", { style: { "width": "60px" } }, "No."),
                          createVNode("th", null, "Produk"),
                          createVNode("th", { style: { "width": "130px" } }, "Tipe Transaksi"),
                          createVNode("th", { style: { "width": "100px" } }, "Qty"),
                          createVNode("th", { style: { "width": "180px" } }, "Tanggal Transaksi"),
                          createVNode("th", null, "Notes"),
                          createVNode("th", { style: { "width": "150px" } }, "PIC")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.transactions.data, (txn, index) => {
                          var _a2, _b2, _c2, _d2, _e2, _f;
                          return openBlock(), createBlock("tr", {
                            key: txn.id
                          }, [
                            createVNode("td", null, toDisplayString(getRowNumber(index)), 1),
                            createVNode("td", null, [
                              createTextVNode(toDisplayString(((_a2 = txn.product) == null ? void 0 : _a2.product_name) || "-") + " ", 1),
                              createVNode("br"),
                              createVNode("small", { class: "text-muted" }, toDisplayString(((_b2 = txn.product) == null ? void 0 : _b2.product_type) || ""), 1)
                            ]),
                            createVNode("td", { class: "text-center" }, [
                              createVNode("span", {
                                class: [
                                  "badge",
                                  getTypeBadge(
                                    (_c2 = txn.transaction_type) == null ? void 0 : _c2.transaction_type_name
                                  )
                                ]
                              }, toDisplayString(((_d2 = txn.transaction_type) == null ? void 0 : _d2.transaction_type_name) || "-"), 3)
                            ]),
                            createVNode("td", { class: "text-center" }, [
                              txn.quantity > 0 ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "badge bg-success"
                              }, toDisplayString(txn.quantity), 1)) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "badge bg-danger"
                              }, toDisplayString(txn.quantity), 1))
                            ]),
                            createVNode("td", null, toDisplayString(formatDate(txn.transaction_date)), 1),
                            createVNode("td", null, [
                              createVNode("small", null, toDisplayString(txn.notes || "-"), 1)
                            ]),
                            createVNode("td", null, toDisplayString(((_e2 = txn.created_by_user) == null ? void 0 : _e2.name) || ((_f = txn.created_by) == null ? void 0 : _f.name) || "-"), 1)
                          ]);
                        }), 128))
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  __props.transactions.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "py-4 text-center"
                  }, [
                    createVNode("p", { class: "text-muted" }, " Tidak ada riwayat transaksi ditemukan. ")
                  ])) : createCommentVNode("", true),
                  __props.transactions.links && __props.transactions.data.length > 0 ? (openBlock(), createBlock(_sfc_main$3, {
                    key: 2,
                    links: __props.transactions.links
                  }, null, 8, ["links"])) : createCommentVNode("", true)
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/StockTransaction/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bdec1280"]]);
export {
  Index as default
};
