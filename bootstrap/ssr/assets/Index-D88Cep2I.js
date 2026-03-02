import { ref, unref, withCtx, createVNode, createBlock, createCommentVNode, withDirectives, vModelText, createTextVNode, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-C4iQtLPH.js";
import { Head, Link, router } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["stockOpnames", "filters"],
  setup(__props) {
    const props = __props;
    const startDate = ref(props.filters.date_from || "");
    const endDate = ref(props.filters.date_to || "");
    const handleDateFilter = () => {
      const params = {};
      if (startDate.value) params.date_from = startDate.value;
      if (endDate.value) params.date_to = endDate.value;
      router.get("/stock-opnames", params, {
        preserveState: true,
        replace: true
      });
    };
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("id-ID");
    };
    const getRowNumber = (index) => {
      const currentPage = props.stockOpnames.current_page || 1;
      const perPage = props.stockOpnames.per_page || 10;
      return (currentPage - 1) * perPage + index + 1;
    };
    const createStockOpname = () => {
      router.post("/stock-opnames");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Stock Opnames" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Stock Opnames" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="text-xl font-semibold leading-tight text-gray-800" data-v-4ccd8efb${_scopeId}> Stock Opnames </h2>`);
          } else {
            return [
              createVNode("h2", { class: "text-xl font-semibold leading-tight text-gray-800" }, " Stock Opnames ")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg" data-v-4ccd8efb${_scopeId}><div class="p-3 text-gray-900" data-v-4ccd8efb${_scopeId}><div class="d-flex justify-content-between align-items-center mb-3" data-v-4ccd8efb${_scopeId}><div class="d-flex align-items-center gap-3" data-v-4ccd8efb${_scopeId}><input${ssrRenderAttr("value", startDate.value)} type="date" class="form-control" style="${ssrRenderStyle({ "width": "150px" })}" data-v-4ccd8efb${_scopeId}><input${ssrRenderAttr("value", endDate.value)} type="date" class="form-control" style="${ssrRenderStyle({ "width": "150px" })}" data-v-4ccd8efb${_scopeId}></div><button class="btn btn-primary" data-v-4ccd8efb${_scopeId}><i class="fas fa-plus me-1" data-v-4ccd8efb${_scopeId}></i> Buat Stock Opname </button></div><div class="table-responsive" data-v-4ccd8efb${_scopeId}><table class="table-bordered table-striped table" data-v-4ccd8efb${_scopeId}><thead class="table-light" data-v-4ccd8efb${_scopeId}><tr data-v-4ccd8efb${_scopeId}><th data-v-4ccd8efb${_scopeId}>No.</th><th data-v-4ccd8efb${_scopeId}>Date</th><th data-v-4ccd8efb${_scopeId}>Total Request</th><th data-v-4ccd8efb${_scopeId}>Products Count</th><th data-v-4ccd8efb${_scopeId}>Actions</th></tr></thead><tbody data-v-4ccd8efb${_scopeId}><!--[-->`);
            ssrRenderList(__props.stockOpnames.data, (stockOpname, index) => {
              var _a;
              _push2(`<tr data-v-4ccd8efb${_scopeId}><td data-v-4ccd8efb${_scopeId}>${ssrInterpolate(getRowNumber(index))}</td><td data-v-4ccd8efb${_scopeId}>${ssrInterpolate(formatDate(stockOpname.date_request))}</td><td data-v-4ccd8efb${_scopeId}>${ssrInterpolate(stockOpname.total_request || "-")}</td><td data-v-4ccd8efb${_scopeId}><span class="badge bg-info" data-v-4ccd8efb${_scopeId}>${ssrInterpolate(((_a = stockOpname.stock_opname_products) == null ? void 0 : _a.length) || 0)} items </span></td><td data-v-4ccd8efb${_scopeId}><div class="btn-group" data-v-4ccd8efb${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/stock-opnames/${stockOpname.id}/products`,
                class: "btn btn-outline-info btn-md",
                title: "View Details"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<i class="fas fa-eye" data-v-4ccd8efb${_scopeId2}></i>`);
                  } else {
                    return [
                      createVNode("i", { class: "fas fa-eye" })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
            if (__props.stockOpnames.data.length === 0) {
              _push2(`<div class="py-4 text-center" data-v-4ccd8efb${_scopeId}><p class="text-muted" data-v-4ccd8efb${_scopeId}>No stock opnames found.</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.stockOpnames.links && __props.stockOpnames.data.length > 0) {
              _push2(ssrRenderComponent(_sfc_main$2, {
                links: __props.stockOpnames.links
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "overflow-hidden bg-white shadow-sm sm:rounded-lg" }, [
                createVNode("div", { class: "p-3 text-gray-900" }, [
                  createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                    createVNode("div", { class: "d-flex align-items-center gap-3" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => startDate.value = $event,
                        type: "date",
                        onChange: handleDateFilter,
                        class: "form-control",
                        style: { "width": "150px" }
                      }, null, 40, ["onUpdate:modelValue"]), [
                        [vModelText, startDate.value]
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => endDate.value = $event,
                        type: "date",
                        onChange: handleDateFilter,
                        class: "form-control",
                        style: { "width": "150px" }
                      }, null, 40, ["onUpdate:modelValue"]), [
                        [vModelText, endDate.value]
                      ])
                    ]),
                    createVNode("button", {
                      onClick: createStockOpname,
                      class: "btn btn-primary"
                    }, [
                      createVNode("i", { class: "fas fa-plus me-1" }),
                      createTextVNode(" Buat Stock Opname ")
                    ])
                  ]),
                  createVNode("div", { class: "table-responsive" }, [
                    createVNode("table", { class: "table-bordered table-striped table" }, [
                      createVNode("thead", { class: "table-light" }, [
                        createVNode("tr", null, [
                          createVNode("th", null, "No."),
                          createVNode("th", null, "Date"),
                          createVNode("th", null, "Total Request"),
                          createVNode("th", null, "Products Count"),
                          createVNode("th", null, "Actions")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.stockOpnames.data, (stockOpname, index) => {
                          var _a;
                          return openBlock(), createBlock("tr", {
                            key: stockOpname.id
                          }, [
                            createVNode("td", null, toDisplayString(getRowNumber(index)), 1),
                            createVNode("td", null, toDisplayString(formatDate(stockOpname.date_request)), 1),
                            createVNode("td", null, toDisplayString(stockOpname.total_request || "-"), 1),
                            createVNode("td", null, [
                              createVNode("span", { class: "badge bg-info" }, toDisplayString(((_a = stockOpname.stock_opname_products) == null ? void 0 : _a.length) || 0) + " items ", 1)
                            ]),
                            createVNode("td", null, [
                              createVNode("div", { class: "btn-group" }, [
                                createVNode(unref(Link), {
                                  href: `/stock-opnames/${stockOpname.id}/products`,
                                  class: "btn btn-outline-info btn-md",
                                  title: "View Details"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("i", { class: "fas fa-eye" })
                                  ]),
                                  _: 1
                                }, 8, ["href"])
                              ])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]),
                  __props.stockOpnames.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "py-4 text-center"
                  }, [
                    createVNode("p", { class: "text-muted" }, "No stock opnames found.")
                  ])) : createCommentVNode("", true),
                  __props.stockOpnames.links && __props.stockOpnames.data.length > 0 ? (openBlock(), createBlock(_sfc_main$2, {
                    key: 1,
                    links: __props.stockOpnames.links
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreStockOpname/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4ccd8efb"]]);
export {
  Index as default
};
