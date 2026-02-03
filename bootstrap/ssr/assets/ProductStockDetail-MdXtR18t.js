import { ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
import { f as formatNumberWithCommas } from "./numberFormatter-CCRAY31y.js";
import axios from "axios";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ProductStockDetail",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const show = ref(false);
    const loading = ref(false);
    const productData = ref(null);
    const stockDetails = ref([]);
    const isLoading = computed(() => loading.value);
    const hasStockData = computed(
      () => stockDetails.value && stockDetails.value.length > 0
    );
    const open = async (productId) => {
      if (!productId) return;
      show.value = true;
      loading.value = true;
      try {
        const response = await axios.get(
          `/products/${productId}/stock-details`
        );
        productData.value = response.data.product;
        stockDetails.value = response.data.stock_details;
      } catch (error) {
        console.error("Error fetching stock details:", error);
      } finally {
        loading.value = false;
      }
    };
    const close = () => {
      show.value = false;
      productData.value = null;
      stockDetails.value = [];
      emit("close");
    };
    const formatCurrency = (amount) => {
      if (!amount) return "Rp 0";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    const getStockStatus = (stock) => {
      if (!stock.track_stock)
        return { class: "text-muted", text: "Tidak Dipantau" };
      if (stock.stock_alert) return { class: "text-danger", text: "Stok Rendah" };
      if (stock.real_quantity_smallest_unit > 0)
        return { class: "text-success", text: "Tersedia" };
      return { class: "text-warning", text: "Kosong" };
    };
    __expose({ open, close });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        show: show.value,
        closeable: true,
        maxWidth: "xl",
        onClose: close
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-header" data-v-027d114f${_scopeId}><h5 class="modal-title" data-v-027d114f${_scopeId}><i class="fas fa-boxes me-2" data-v-027d114f${_scopeId}></i> Detail Stock </h5><button type="button" class="btn-close" data-v-027d114f${_scopeId}></button></div><div class="modal-body" style="${ssrRenderStyle({ "max-height": "70vh", "overflow-y": "auto" })}" data-v-027d114f${_scopeId}>`);
            if (isLoading.value) {
              _push2(`<div class="py-5 text-center" data-v-027d114f${_scopeId}><div class="spinner-border text-primary me-2" role="status" data-v-027d114f${_scopeId}><span class="visually-hidden" data-v-027d114f${_scopeId}>Loading...</span></div><div class="text-muted" data-v-027d114f${_scopeId}>Memuat detail stock...</div></div>`);
            } else if (productData.value) {
              _push2(`<div class="mb-4" data-v-027d114f${_scopeId}><div class="card bg-light border-0" data-v-027d114f${_scopeId}><div class="card-body" data-v-027d114f${_scopeId}><h6 class="card-title mb-3" data-v-027d114f${_scopeId}><i class="fas fa-cube text-primary me-2" data-v-027d114f${_scopeId}></i> Informasi Produk </h6><div class="row" data-v-027d114f${_scopeId}><div class="col-md-6" data-v-027d114f${_scopeId}><dl class="row mb-0" data-v-027d114f${_scopeId}><dt class="col-sm-4" data-v-027d114f${_scopeId}>Kode:</dt><dd class="col-sm-8" data-v-027d114f${_scopeId}><span class="badge bg-secondary" data-v-027d114f${_scopeId}>${ssrInterpolate(productData.value.product_code)}</span></dd><dt class="col-sm-4" data-v-027d114f${_scopeId}>Nama:</dt><dd class="col-sm-8 fw-medium" data-v-027d114f${_scopeId}>${ssrInterpolate(productData.value.product_name)}</dd></dl></div><div class="col-md-6" data-v-027d114f${_scopeId}><dl class="row mb-0" data-v-027d114f${_scopeId}><dt class="col-sm-5" data-v-027d114f${_scopeId}>Packaging Size:</dt><dd class="col-sm-7" data-v-027d114f${_scopeId}><span class="badge bg-info" data-v-027d114f${_scopeId}>${ssrInterpolate(productData.value.packaging_size || "-")}</span></dd><dt class="col-sm-5" data-v-027d114f${_scopeId}>Packaging Type:</dt><dd class="col-sm-7" data-v-027d114f${_scopeId}><span class="badge bg-success" data-v-027d114f${_scopeId}>${ssrInterpolate(productData.value.packaging_type || "-")}</span></dd></dl></div></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!isLoading.value) {
              _push2(`<div data-v-027d114f${_scopeId}><h6 class="mb-3" data-v-027d114f${_scopeId}><i class="fas fa-warehouse text-success me-2" data-v-027d114f${_scopeId}></i> Stock Product </h6>`);
              if (!hasStockData.value) {
                _push2(`<div class="alert alert-info text-center" data-v-027d114f${_scopeId}><i class="fas fa-info-circle me-2" data-v-027d114f${_scopeId}></i> Tidak ada data stock untuk produk ini </div>`);
              } else {
                _push2(`<div class="table-responsive" data-v-027d114f${_scopeId}><table class="table-hover table" data-v-027d114f${_scopeId}><thead class="table-light" data-v-027d114f${_scopeId}><tr data-v-027d114f${_scopeId}><th style="${ssrRenderStyle({ "width": "60px" })}" data-v-027d114f${_scopeId}>#</th><th class="text-center" data-v-027d114f${_scopeId}>Stock Utama</th><th class="text-center" data-v-027d114f${_scopeId}>Cost</th><th class="text-center" data-v-027d114f${_scopeId}>Status</th></tr></thead><tbody data-v-027d114f${_scopeId}><!--[-->`);
                ssrRenderList(stockDetails.value, (item, index) => {
                  _push2(`<tr data-v-027d114f${_scopeId}><td class="text-muted" data-v-027d114f${_scopeId}>${ssrInterpolate(index + 1)}</td><td class="text-center" data-v-027d114f${_scopeId}><span class="badge bg-primary fs-6" data-v-027d114f${_scopeId}>${ssrInterpolate(unref(formatNumberWithCommas)(
                    item.stock.packaging_size_input
                  ))}</span></td><td class="text-center" data-v-027d114f${_scopeId}>`);
                  if (item.stock.cost_amount) {
                    _push2(`<span class="fw-medium" data-v-027d114f${_scopeId}>${ssrInterpolate(formatCurrency(
                      item.stock.cost_amount
                    ))}</span>`);
                  } else {
                    _push2(`<span class="text-muted" data-v-027d114f${_scopeId}>-</span>`);
                  }
                  _push2(`</td><td class="text-center" data-v-027d114f${_scopeId}><span class="${ssrRenderClass(
                    getStockStatus(item.stock).class
                  )}" data-v-027d114f${_scopeId}><i class="fas fa-circle me-1" style="${ssrRenderStyle({ "font-size": "0.5rem" })}" data-v-027d114f${_scopeId}></i> ${ssrInterpolate(getStockStatus(item.stock).text)}</span>`);
                  if (item.stock.track_alert) {
                    _push2(`<div class="mt-1" data-v-027d114f${_scopeId}><i class="fas fa-bell text-warning" title="Alert aktif" data-v-027d114f${_scopeId}></i></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="modal-footer" data-v-027d114f${_scopeId}><button type="button" class="btn btn-secondary" data-v-027d114f${_scopeId}><i class="fas fa-times me-1" data-v-027d114f${_scopeId}></i> Tutup </button></div>`);
          } else {
            return [
              createVNode("div", { class: "modal-header" }, [
                createVNode("h5", { class: "modal-title" }, [
                  createVNode("i", { class: "fas fa-boxes me-2" }),
                  createTextVNode(" Detail Stock ")
                ]),
                createVNode("button", {
                  type: "button",
                  class: "btn-close",
                  onClick: close
                })
              ]),
              createVNode("div", {
                class: "modal-body",
                style: { "max-height": "70vh", "overflow-y": "auto" }
              }, [
                isLoading.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "py-5 text-center"
                }, [
                  createVNode("div", {
                    class: "spinner-border text-primary me-2",
                    role: "status"
                  }, [
                    createVNode("span", { class: "visually-hidden" }, "Loading...")
                  ]),
                  createVNode("div", { class: "text-muted" }, "Memuat detail stock...")
                ])) : productData.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mb-4"
                }, [
                  createVNode("div", { class: "card bg-light border-0" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode("h6", { class: "card-title mb-3" }, [
                        createVNode("i", { class: "fas fa-cube text-primary me-2" }),
                        createTextVNode(" Informasi Produk ")
                      ]),
                      createVNode("div", { class: "row" }, [
                        createVNode("div", { class: "col-md-6" }, [
                          createVNode("dl", { class: "row mb-0" }, [
                            createVNode("dt", { class: "col-sm-4" }, "Kode:"),
                            createVNode("dd", { class: "col-sm-8" }, [
                              createVNode("span", { class: "badge bg-secondary" }, toDisplayString(productData.value.product_code), 1)
                            ]),
                            createVNode("dt", { class: "col-sm-4" }, "Nama:"),
                            createVNode("dd", { class: "col-sm-8 fw-medium" }, toDisplayString(productData.value.product_name), 1)
                          ])
                        ]),
                        createVNode("div", { class: "col-md-6" }, [
                          createVNode("dl", { class: "row mb-0" }, [
                            createVNode("dt", { class: "col-sm-5" }, "Packaging Size:"),
                            createVNode("dd", { class: "col-sm-7" }, [
                              createVNode("span", { class: "badge bg-info" }, toDisplayString(productData.value.packaging_size || "-"), 1)
                            ]),
                            createVNode("dt", { class: "col-sm-5" }, "Packaging Type:"),
                            createVNode("dd", { class: "col-sm-7" }, [
                              createVNode("span", { class: "badge bg-success" }, toDisplayString(productData.value.packaging_type || "-"), 1)
                            ])
                          ])
                        ])
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                !isLoading.value ? (openBlock(), createBlock("div", { key: 2 }, [
                  createVNode("h6", { class: "mb-3" }, [
                    createVNode("i", { class: "fas fa-warehouse text-success me-2" }),
                    createTextVNode(" Stock Product ")
                  ]),
                  !hasStockData.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "alert alert-info text-center"
                  }, [
                    createVNode("i", { class: "fas fa-info-circle me-2" }),
                    createTextVNode(" Tidak ada data stock untuk produk ini ")
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "table-responsive"
                  }, [
                    createVNode("table", { class: "table-hover table" }, [
                      createVNode("thead", { class: "table-light" }, [
                        createVNode("tr", null, [
                          createVNode("th", { style: { "width": "60px" } }, "#"),
                          createVNode("th", { class: "text-center" }, "Stock Utama"),
                          createVNode("th", { class: "text-center" }, "Cost"),
                          createVNode("th", { class: "text-center" }, "Status")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(stockDetails.value, (item, index) => {
                          return openBlock(), createBlock("tr", null, [
                            createVNode("td", { class: "text-muted" }, toDisplayString(index + 1), 1),
                            createVNode("td", { class: "text-center" }, [
                              createVNode("span", { class: "badge bg-primary fs-6" }, toDisplayString(unref(formatNumberWithCommas)(
                                item.stock.packaging_size_input
                              )), 1)
                            ]),
                            createVNode("td", { class: "text-center" }, [
                              item.stock.cost_amount ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "fw-medium"
                              }, toDisplayString(formatCurrency(
                                item.stock.cost_amount
                              )), 1)) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-muted"
                              }, "-"))
                            ]),
                            createVNode("td", { class: "text-center" }, [
                              createVNode("span", {
                                class: getStockStatus(item.stock).class
                              }, [
                                createVNode("i", {
                                  class: "fas fa-circle me-1",
                                  style: { "font-size": "0.5rem" }
                                }),
                                createTextVNode(" " + toDisplayString(getStockStatus(item.stock).text), 1)
                              ], 2),
                              item.stock.track_alert ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-1"
                              }, [
                                createVNode("i", {
                                  class: "fas fa-bell text-warning",
                                  title: "Alert aktif"
                                })
                              ])) : createCommentVNode("", true)
                            ])
                          ]);
                        }), 256))
                      ])
                    ])
                  ]))
                ])) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "modal-footer" }, [
                createVNode("button", {
                  type: "button",
                  class: "btn btn-secondary",
                  onClick: close
                }, [
                  createVNode("i", { class: "fas fa-times me-1" }),
                  createTextVNode(" Tutup ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreProducts/ProductStockDetail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductStockDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-027d114f"]]);
export {
  ProductStockDetail as default
};
