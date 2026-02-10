import { ref, watch, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Be2dic9H.js";
import { f as formatNumberWithCommas } from "./numberFormatter-CCRAY31y.js";
import { router, Head } from "@inertiajs/vue3";
import { debounce } from "lodash";
import RepackModal from "./RepackModal-Cu6OFkHa.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./InputError-C5ky-J1T.js";
import "./InputLabel-Dkex7vHI.js";
import "./Modal-DBd8rNSf.js";
import "./PrimaryButton-CIooT64n.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["products", "repackProducts", "filters"],
  setup(__props) {
    var _a;
    const props = __props;
    const search = ref(((_a = props.filters) == null ? void 0 : _a.search) || "");
    const repackModal = ref(null);
    watch(
      search,
      debounce((value) => {
        router.get(
          "/repack",
          { search: value },
          {
            preserveState: true,
            replace: true
          }
        );
      }, 300)
    );
    const getRowNumber = (index) => {
      const currentPage = props.products.current_page || 1;
      const perPage = props.products.per_page || 15;
      return (currentPage - 1) * perPage + index + 1;
    };
    const getStock = (product) => {
      var _a2;
      if (!product.stocks || product.stocks.length === 0) return 0;
      return ((_a2 = product.stocks[0]) == null ? void 0 : _a2.packaging_size_input) || 0;
    };
    const openRepackModal = (product) => {
      var _a2;
      (_a2 = repackModal.value) == null ? void 0 : _a2.open(product);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Repack" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Repack Produk" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg" data-v-78d8aeee${_scopeId}><div class="p-3 text-gray-900" data-v-78d8aeee${_scopeId}><div class="d-flex justify-content-between align-items-center mb-3" data-v-78d8aeee${_scopeId}><div class="d-flex align-items-center gap-3" data-v-78d8aeee${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "search",
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              class: "form-control",
              placeholder: "Cari SKU atau nama produk...",
              style: { "width": "350px" }
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (__props.products.data.length > 0) {
              _push2(`<div class="table-responsive" data-v-78d8aeee${_scopeId}><table class="table-bordered table-striped table" data-v-78d8aeee${_scopeId}><thead class="table-light" data-v-78d8aeee${_scopeId}><tr data-v-78d8aeee${_scopeId}><th data-v-78d8aeee${_scopeId}>No.</th><th data-v-78d8aeee${_scopeId}>SKU</th><th data-v-78d8aeee${_scopeId}>Nama Produk</th><th data-v-78d8aeee${_scopeId}>Stock</th><th data-v-78d8aeee${_scopeId}>Actions</th></tr></thead><tbody data-v-78d8aeee${_scopeId}><!--[-->`);
              ssrRenderList(__props.products.data, (product, index) => {
                _push2(`<tr data-v-78d8aeee${_scopeId}><td data-v-78d8aeee${_scopeId}>${ssrInterpolate(getRowNumber(index))}</td><td data-v-78d8aeee${_scopeId}>${ssrInterpolate(product.product_unit_sku)}</td><td data-v-78d8aeee${_scopeId}>${ssrInterpolate(product.product_name)}</td><td data-v-78d8aeee${_scopeId}>${ssrInterpolate(unref(formatNumberWithCommas)(
                  getStock(product)
                ))}</td><td data-v-78d8aeee${_scopeId}><button class="btn btn-primary btn-sm"${ssrIncludeBooleanAttr(getStock(product) <= 0) ? " disabled" : ""} title="Repack" data-v-78d8aeee${_scopeId}><i class="fas fa-box-open me-1" data-v-78d8aeee${_scopeId}></i> Repack </button></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.products.data.length === 0) {
              _push2(`<div class="py-4 text-center" data-v-78d8aeee${_scopeId}><p class="text-muted" data-v-78d8aeee${_scopeId}>Tidak ada produk ditemukan.</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.products.links && __props.products.data.length > 0) {
              _push2(ssrRenderComponent(_sfc_main$3, {
                links: __props.products.links
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(RepackModal, {
              ref_key: "repackModal",
              ref: repackModal,
              "repack-products": __props.repackProducts
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
                        placeholder: "Cari SKU atau nama produk...",
                        style: { "width": "350px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ]),
                  __props.products.data.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "table-responsive"
                  }, [
                    createVNode("table", { class: "table-bordered table-striped table" }, [
                      createVNode("thead", { class: "table-light" }, [
                        createVNode("tr", null, [
                          createVNode("th", null, "No."),
                          createVNode("th", null, "SKU"),
                          createVNode("th", null, "Nama Produk"),
                          createVNode("th", null, "Stock"),
                          createVNode("th", null, "Actions")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.products.data, (product, index) => {
                          return openBlock(), createBlock("tr", {
                            key: product.id
                          }, [
                            createVNode("td", null, toDisplayString(getRowNumber(index)), 1),
                            createVNode("td", null, toDisplayString(product.product_unit_sku), 1),
                            createVNode("td", null, toDisplayString(product.product_name), 1),
                            createVNode("td", null, toDisplayString(unref(formatNumberWithCommas)(
                              getStock(product)
                            )), 1),
                            createVNode("td", null, [
                              createVNode("button", {
                                onClick: ($event) => openRepackModal(product),
                                class: "btn btn-primary btn-sm",
                                disabled: getStock(product) <= 0,
                                title: "Repack"
                              }, [
                                createVNode("i", { class: "fas fa-box-open me-1" }),
                                createTextVNode(" Repack ")
                              ], 8, ["onClick", "disabled"])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  __props.products.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "py-4 text-center"
                  }, [
                    createVNode("p", { class: "text-muted" }, "Tidak ada produk ditemukan.")
                  ])) : createCommentVNode("", true),
                  __props.products.links && __props.products.data.length > 0 ? (openBlock(), createBlock(_sfc_main$3, {
                    key: 2,
                    links: __props.products.links
                  }, null, 8, ["links"])) : createCommentVNode("", true)
                ])
              ]),
              createVNode(RepackModal, {
                ref_key: "repackModal",
                ref: repackModal,
                "repack-products": __props.repackProducts
              }, null, 8, ["repack-products"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Repack/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-78d8aeee"]]);
export {
  Index as default
};
