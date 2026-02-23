import { ref, watch, unref, withCtx, createVNode, createBlock, createCommentVNode, createTextVNode, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-epgf0EbD.js";
import { router, Head } from "@inertiajs/vue3";
import { debounce } from "lodash";
import ProductionModal from "./ProductionModal-e4aWyaMh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./InputError-C5ky-J1T.js";
import "./InputLabel-Dkex7vHI.js";
import "./Modal-DBd8rNSf.js";
import "./PrimaryButton-CIooT64n.js";
import "./numberFormatter-CCRAY31y.js";
import "axios";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["products", "recipes", "filters"],
  setup(__props) {
    var _a;
    const props = __props;
    const search = ref(((_a = props.filters) == null ? void 0 : _a.search) || "");
    const productionModal = ref(null);
    watch(
      search,
      debounce((value) => {
        router.get(
          "/production",
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
      const perPage = props.products.per_page || 10;
      return (currentPage - 1) * perPage + index + 1;
    };
    const formatDescription = (description) => {
      if (!description) return "-";
      if (Array.isArray(description)) {
        return description.join(", ");
      }
      return description;
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
    const openProductionModal = () => {
      var _a2;
      (_a2 = productionModal.value) == null ? void 0 : _a2.open();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Produksi" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Produksi" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg" data-v-f388d17f${_scopeId}><div class="p-3 text-gray-900" data-v-f388d17f${_scopeId}><div class="d-flex justify-content-between align-items-center mb-3" data-v-f388d17f${_scopeId}><div class="d-flex align-items-center gap-3" data-v-f388d17f${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "search",
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              class: "form-control",
              placeholder: "Cari nama produk atau PIC...",
              style: { "width": "350px" }
            }, null, _parent2, _scopeId));
            _push2(`</div><button class="btn btn-primary" data-v-f388d17f${_scopeId}><i class="fas fa-plus me-1" data-v-f388d17f${_scopeId}></i> Produksi </button></div>`);
            if (__props.products.data.length > 0) {
              _push2(`<div class="table-responsive" data-v-f388d17f${_scopeId}><table class="table-bordered table-striped table" data-v-f388d17f${_scopeId}><thead class="table-light" data-v-f388d17f${_scopeId}><tr data-v-f388d17f${_scopeId}><th style="${ssrRenderStyle({ "width": "60px" })}" data-v-f388d17f${_scopeId}>No.</th><th data-v-f388d17f${_scopeId}>Nama Produk</th><th data-v-f388d17f${_scopeId}>Batch</th><th data-v-f388d17f${_scopeId}>Deskripsi (Bahan Baku)</th><th style="${ssrRenderStyle({ "width": "120px" })}" data-v-f388d17f${_scopeId}>Qty</th><th style="${ssrRenderStyle({ "width": "150px" })}" data-v-f388d17f${_scopeId}>PIC</th><th style="${ssrRenderStyle({ "width": "180px" })}" data-v-f388d17f${_scopeId}>Tanggal</th></tr></thead><tbody data-v-f388d17f${_scopeId}><!--[-->`);
              ssrRenderList(__props.products.data, (log, index) => {
                var _a2, _b;
                _push2(`<tr data-v-f388d17f${_scopeId}><td data-v-f388d17f${_scopeId}>${ssrInterpolate(getRowNumber(index))}</td><td data-v-f388d17f${_scopeId}>${ssrInterpolate(((_a2 = log.product) == null ? void 0 : _a2.product_name) || "-")}</td><td class="text-center" data-v-f388d17f${_scopeId}>${ssrInterpolate(log.batch || "-")}</td><td data-v-f388d17f${_scopeId}><small class="text-muted" data-v-f388d17f${_scopeId}>${ssrInterpolate(formatDescription(log.description))}</small></td><td class="text-center" data-v-f388d17f${_scopeId}><span class="badge bg-info" data-v-f388d17f${_scopeId}>${ssrInterpolate(log.quantity)}</span></td><td data-v-f388d17f${_scopeId}>${ssrInterpolate(((_b = log.created_by) == null ? void 0 : _b.name) || "-")}</td><td data-v-f388d17f${_scopeId}>${ssrInterpolate(formatDate(log.created_at))}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.products.data.length === 0) {
              _push2(`<div class="py-4 text-center" data-v-f388d17f${_scopeId}><p class="text-muted" data-v-f388d17f${_scopeId}>Tidak ada log produksi ditemukan.</p></div>`);
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
            _push2(ssrRenderComponent(ProductionModal, {
              ref_key: "productionModal",
              ref: productionModal,
              recipes: __props.recipes
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
                        placeholder: "Cari nama produk atau PIC...",
                        style: { "width": "350px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("button", {
                      onClick: openProductionModal,
                      class: "btn btn-primary"
                    }, [
                      createVNode("i", { class: "fas fa-plus me-1" }),
                      createTextVNode(" Produksi ")
                    ])
                  ]),
                  __props.products.data.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "table-responsive"
                  }, [
                    createVNode("table", { class: "table-bordered table-striped table" }, [
                      createVNode("thead", { class: "table-light" }, [
                        createVNode("tr", null, [
                          createVNode("th", { style: { "width": "60px" } }, "No."),
                          createVNode("th", null, "Nama Produk"),
                          createVNode("th", null, "Batch"),
                          createVNode("th", null, "Deskripsi (Bahan Baku)"),
                          createVNode("th", { style: { "width": "120px" } }, "Qty"),
                          createVNode("th", { style: { "width": "150px" } }, "PIC"),
                          createVNode("th", { style: { "width": "180px" } }, "Tanggal")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.products.data, (log, index) => {
                          var _a2, _b;
                          return openBlock(), createBlock("tr", {
                            key: log.id
                          }, [
                            createVNode("td", null, toDisplayString(getRowNumber(index)), 1),
                            createVNode("td", null, toDisplayString(((_a2 = log.product) == null ? void 0 : _a2.product_name) || "-"), 1),
                            createVNode("td", { class: "text-center" }, toDisplayString(log.batch || "-"), 1),
                            createVNode("td", null, [
                              createVNode("small", { class: "text-muted" }, toDisplayString(formatDescription(log.description)), 1)
                            ]),
                            createVNode("td", { class: "text-center" }, [
                              createVNode("span", { class: "badge bg-info" }, toDisplayString(log.quantity), 1)
                            ]),
                            createVNode("td", null, toDisplayString(((_b = log.created_by) == null ? void 0 : _b.name) || "-"), 1),
                            createVNode("td", null, toDisplayString(formatDate(log.created_at)), 1)
                          ]);
                        }), 128))
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  __props.products.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "py-4 text-center"
                  }, [
                    createVNode("p", { class: "text-muted" }, "Tidak ada log produksi ditemukan.")
                  ])) : createCommentVNode("", true),
                  __props.products.links && __props.products.data.length > 0 ? (openBlock(), createBlock(_sfc_main$3, {
                    key: 2,
                    links: __props.products.links
                  }, null, 8, ["links"])) : createCommentVNode("", true)
                ])
              ]),
              createVNode(ProductionModal, {
                ref_key: "productionModal",
                ref: productionModal,
                recipes: __props.recipes
              }, null, 8, ["recipes"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Production/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f388d17f"]]);
export {
  Index as default
};
