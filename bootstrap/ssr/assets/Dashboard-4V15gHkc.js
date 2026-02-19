import { unref, withCtx, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-epgf0EbD.js";
import { Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: ["stats", "recentProducts"],
  setup(__props) {
    const formatNumber = (number) => {
      return new Intl.NumberFormat("id-ID").format(number);
    };
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("id-ID");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Dashboard" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="row mb-4" data-v-2ba45765${_scopeId}><div class="col-xl-3 col-md-6 mb-4" data-v-2ba45765${_scopeId}><div class="card border-left-primary h-100 py-2 shadow" data-v-2ba45765${_scopeId}><div class="card-body" data-v-2ba45765${_scopeId}><div class="row no-gutters align-items-center" data-v-2ba45765${_scopeId}><div class="col mr-2" data-v-2ba45765${_scopeId}><div class="font-weight-bold text-primary text-uppercase mb-1 text-xs" data-v-2ba45765${_scopeId}> Total Products </div><div class="h5 font-weight-bold mb-0 text-gray-800" data-v-2ba45765${_scopeId}>${ssrInterpolate(formatNumber(__props.stats.totalProducts))}</div></div><div class="col-auto" data-v-2ba45765${_scopeId}><i class="fas fa-boxes fa-2x text-gray-300" data-v-2ba45765${_scopeId}></i></div></div></div></div></div><div class="col-xl-3 col-md-6 mb-4" data-v-2ba45765${_scopeId}><div class="card border-left-danger h-100 py-2 shadow" data-v-2ba45765${_scopeId}><div class="card-body" data-v-2ba45765${_scopeId}><div class="row no-gutters align-items-center" data-v-2ba45765${_scopeId}><div class="col mr-2" data-v-2ba45765${_scopeId}><div class="font-weight-bold text-danger text-uppercase mb-1 text-xs" data-v-2ba45765${_scopeId}> Expired Products </div><div class="h5 font-weight-bold mb-0 text-gray-800" data-v-2ba45765${_scopeId}>${ssrInterpolate(formatNumber(__props.stats.totalExpiredProducts))}</div></div><div class="col-auto" data-v-2ba45765${_scopeId}><i class="fas fa-exclamation-triangle fa-2x text-gray-300" data-v-2ba45765${_scopeId}></i></div></div></div></div></div><div class="col-xl-3 col-md-6 mb-4" data-v-2ba45765${_scopeId}><div class="card border-left-success h-100 py-2 shadow" data-v-2ba45765${_scopeId}><div class="card-body" data-v-2ba45765${_scopeId}><div class="row no-gutters align-items-center" data-v-2ba45765${_scopeId}><div class="col mr-2" data-v-2ba45765${_scopeId}><div class="font-weight-bold text-success text-uppercase mb-1 text-xs" data-v-2ba45765${_scopeId}>Total Sales</div><div class="h5 font-weight-bold mb-0 text-gray-800" data-v-2ba45765${_scopeId}>${ssrInterpolate(formatNumber(__props.stats.totalSales))}</div></div><div class="col-auto" data-v-2ba45765${_scopeId}><i class="fas fa-shopping-cart fa-2x text-gray-300" data-v-2ba45765${_scopeId}></i></div></div></div></div></div><div class="col-xl-3 col-md-6 mb-4" data-v-2ba45765${_scopeId}><div class="card border-left-info h-100 py-2 shadow" data-v-2ba45765${_scopeId}><div class="card-body" data-v-2ba45765${_scopeId}><div class="row no-gutters align-items-center" data-v-2ba45765${_scopeId}><div class="col mr-2" data-v-2ba45765${_scopeId}><div class="font-weight-bold text-info text-uppercase mb-1 text-xs" data-v-2ba45765${_scopeId}> Total Purchases </div><div class="h5 font-weight-bold mb-0 text-gray-800" data-v-2ba45765${_scopeId}>${ssrInterpolate(formatNumber(__props.stats.totalPurchases))}</div></div><div class="col-auto" data-v-2ba45765${_scopeId}><i class="fas fa-truck fa-2x text-gray-300" data-v-2ba45765${_scopeId}></i></div></div></div></div></div></div><div class="row mb-4" data-v-2ba45765${_scopeId}><div class="col-xl-6 col-md-6 mb-4" data-v-2ba45765${_scopeId}><div class="card border-left-warning h-100 py-2 shadow" data-v-2ba45765${_scopeId}><div class="card-body" data-v-2ba45765${_scopeId}><div class="row no-gutters align-items-center" data-v-2ba45765${_scopeId}><div class="col mr-2" data-v-2ba45765${_scopeId}><div class="font-weight-bold text-warning text-uppercase mb-1 text-xs" data-v-2ba45765${_scopeId}> Low Stock Products (≤10) </div><div class="h5 font-weight-bold mb-0 text-gray-800" data-v-2ba45765${_scopeId}>${ssrInterpolate(formatNumber(__props.stats.lowStockProducts))}</div></div><div class="col-auto" data-v-2ba45765${_scopeId}><i class="fas fa-exclamation fa-2x text-gray-300" data-v-2ba45765${_scopeId}></i></div></div></div></div></div><div class="col-xl-6 col-md-6 mb-4" data-v-2ba45765${_scopeId}><div class="card h-100 shadow" data-v-2ba45765${_scopeId}><div class="card-header py-3" data-v-2ba45765${_scopeId}><h6 class="font-weight-bold text-primary m-0" data-v-2ba45765${_scopeId}>Recent Products</h6></div><div class="card-body" data-v-2ba45765${_scopeId}>`);
            if (__props.recentProducts && __props.recentProducts.length > 0) {
              _push2(`<div data-v-2ba45765${_scopeId}><!--[-->`);
              ssrRenderList(__props.recentProducts, (product) => {
                _push2(`<div class="mb-2" data-v-2ba45765${_scopeId}><div class="d-flex justify-content-between align-items-center" data-v-2ba45765${_scopeId}><span class="font-weight-bold text-sm" data-v-2ba45765${_scopeId}>${ssrInterpolate(product.product_name)}</span><small class="text-muted" data-v-2ba45765${_scopeId}>${ssrInterpolate(formatDate(product.created_at))}</small></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-muted text-center" data-v-2ba45765${_scopeId}>No recent products found</div>`);
            }
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "row mb-4" }, [
                createVNode("div", { class: "col-xl-3 col-md-6 mb-4" }, [
                  createVNode("div", { class: "card border-left-primary h-100 py-2 shadow" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode("div", { class: "row no-gutters align-items-center" }, [
                        createVNode("div", { class: "col mr-2" }, [
                          createVNode("div", { class: "font-weight-bold text-primary text-uppercase mb-1 text-xs" }, " Total Products "),
                          createVNode("div", { class: "h5 font-weight-bold mb-0 text-gray-800" }, toDisplayString(formatNumber(__props.stats.totalProducts)), 1)
                        ]),
                        createVNode("div", { class: "col-auto" }, [
                          createVNode("i", { class: "fas fa-boxes fa-2x text-gray-300" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "col-xl-3 col-md-6 mb-4" }, [
                  createVNode("div", { class: "card border-left-danger h-100 py-2 shadow" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode("div", { class: "row no-gutters align-items-center" }, [
                        createVNode("div", { class: "col mr-2" }, [
                          createVNode("div", { class: "font-weight-bold text-danger text-uppercase mb-1 text-xs" }, " Expired Products "),
                          createVNode("div", { class: "h5 font-weight-bold mb-0 text-gray-800" }, toDisplayString(formatNumber(__props.stats.totalExpiredProducts)), 1)
                        ]),
                        createVNode("div", { class: "col-auto" }, [
                          createVNode("i", { class: "fas fa-exclamation-triangle fa-2x text-gray-300" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "col-xl-3 col-md-6 mb-4" }, [
                  createVNode("div", { class: "card border-left-success h-100 py-2 shadow" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode("div", { class: "row no-gutters align-items-center" }, [
                        createVNode("div", { class: "col mr-2" }, [
                          createVNode("div", { class: "font-weight-bold text-success text-uppercase mb-1 text-xs" }, "Total Sales"),
                          createVNode("div", { class: "h5 font-weight-bold mb-0 text-gray-800" }, toDisplayString(formatNumber(__props.stats.totalSales)), 1)
                        ]),
                        createVNode("div", { class: "col-auto" }, [
                          createVNode("i", { class: "fas fa-shopping-cart fa-2x text-gray-300" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "col-xl-3 col-md-6 mb-4" }, [
                  createVNode("div", { class: "card border-left-info h-100 py-2 shadow" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode("div", { class: "row no-gutters align-items-center" }, [
                        createVNode("div", { class: "col mr-2" }, [
                          createVNode("div", { class: "font-weight-bold text-info text-uppercase mb-1 text-xs" }, " Total Purchases "),
                          createVNode("div", { class: "h5 font-weight-bold mb-0 text-gray-800" }, toDisplayString(formatNumber(__props.stats.totalPurchases)), 1)
                        ]),
                        createVNode("div", { class: "col-auto" }, [
                          createVNode("i", { class: "fas fa-truck fa-2x text-gray-300" })
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "row mb-4" }, [
                createVNode("div", { class: "col-xl-6 col-md-6 mb-4" }, [
                  createVNode("div", { class: "card border-left-warning h-100 py-2 shadow" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode("div", { class: "row no-gutters align-items-center" }, [
                        createVNode("div", { class: "col mr-2" }, [
                          createVNode("div", { class: "font-weight-bold text-warning text-uppercase mb-1 text-xs" }, " Low Stock Products (≤10) "),
                          createVNode("div", { class: "h5 font-weight-bold mb-0 text-gray-800" }, toDisplayString(formatNumber(__props.stats.lowStockProducts)), 1)
                        ]),
                        createVNode("div", { class: "col-auto" }, [
                          createVNode("i", { class: "fas fa-exclamation fa-2x text-gray-300" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "col-xl-6 col-md-6 mb-4" }, [
                  createVNode("div", { class: "card h-100 shadow" }, [
                    createVNode("div", { class: "card-header py-3" }, [
                      createVNode("h6", { class: "font-weight-bold text-primary m-0" }, "Recent Products")
                    ]),
                    createVNode("div", { class: "card-body" }, [
                      __props.recentProducts && __props.recentProducts.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.recentProducts, (product) => {
                          return openBlock(), createBlock("div", {
                            key: product.id,
                            class: "mb-2"
                          }, [
                            createVNode("div", { class: "d-flex justify-content-between align-items-center" }, [
                              createVNode("span", { class: "font-weight-bold text-sm" }, toDisplayString(product.product_name), 1),
                              createVNode("small", { class: "text-muted" }, toDisplayString(formatDate(product.created_at)), 1)
                            ])
                          ]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-muted text-center"
                      }, "No recent products found"))
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2ba45765"]]);
export {
  Dashboard as default
};
