import { ref, watch, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Ds1QaqxF.js";
import _sfc_main$4 from "./OutgoingProductModal-DSvVk92l.js";
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
  props: ["outgoing", "products", "outTypes", "filters"],
  setup(__props) {
    var _a;
    const props = __props;
    const modalRef = ref(null);
    const search = ref(((_a = props.filters) == null ? void 0 : _a.search) || "");
    watch(
      search,
      debounce((value) => {
        const params = {};
        if (value) params.search = value;
        router.get(route("outgoing-goods.index"), params, {
          preserveState: true,
          replace: true
        });
      }, 300)
    );
    const clearFilters = () => {
      search.value = "";
      router.get(route("outgoing-goods.index"), {}, {
        preserveState: true,
        replace: true
      });
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Barang Keluar" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Barang Keluar" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            _push2(`<div class="card mb-3" data-v-8580545e${_scopeId}><div class="card-body" data-v-8580545e${_scopeId}><div class="row g-3 align-items-end" data-v-8580545e${_scopeId}><div class="col-md-4" data-v-8580545e${_scopeId}><label class="form-label" data-v-8580545e${_scopeId}>Pencarian</label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              placeholder: "Cari berdasarkan nama produk..."
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-2" data-v-8580545e${_scopeId}>`);
            if (hasActiveFilters.value) {
              _push2(`<button type="button" class="btn btn-outline-secondary" data-v-8580545e${_scopeId}><i class="fas fa-times me-1" data-v-8580545e${_scopeId}></i> Clear </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="col-md-6 text-end" data-v-8580545e${_scopeId}><button type="button" class="btn btn-primary" data-v-8580545e${_scopeId}><i class="fas fa-plus me-1" data-v-8580545e${_scopeId}></i> Tambah Barang Keluar </button></div></div></div></div><div class="d-flex justify-content-between align-items-center mb-3" data-v-8580545e${_scopeId}><div class="text-muted" data-v-8580545e${_scopeId}> Menampilkan ${ssrInterpolate(((_a2 = __props.outgoing) == null ? void 0 : _a2.from) ?? 0)} - ${ssrInterpolate(((_b = __props.outgoing) == null ? void 0 : _b.to) ?? 0)} dari ${ssrInterpolate(((_c = __props.outgoing) == null ? void 0 : _c.total) ?? 0)} data </div>`);
            if (hasActiveFilters.value) {
              _push2(`<div class="text-muted" data-v-8580545e${_scopeId}><i class="fas fa-filter me-1" data-v-8580545e${_scopeId}></i> Filter aktif </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="card" data-v-8580545e${_scopeId}><div class="table-responsive" data-v-8580545e${_scopeId}><table class="table table-hover mb-0" data-v-8580545e${_scopeId}><thead class="table-light" data-v-8580545e${_scopeId}><tr data-v-8580545e${_scopeId}><th class="text-center" style="${ssrRenderStyle({ "width": "60px" })}" data-v-8580545e${_scopeId}>No</th><th data-v-8580545e${_scopeId}>Nama Produk</th><th class="text-center" style="${ssrRenderStyle({ "width": "120px" })}" data-v-8580545e${_scopeId}>Quantity</th><th style="${ssrRenderStyle({ "width": "140px" })}" data-v-8580545e${_scopeId}>Tipe Keluar</th><th style="${ssrRenderStyle({ "width": "180px" })}" data-v-8580545e${_scopeId}>Kapan Barang Keluar</th></tr></thead><tbody data-v-8580545e${_scopeId}>`);
            if (!((_e = (_d = __props.outgoing) == null ? void 0 : _d.data) == null ? void 0 : _e.length)) {
              _push2(`<tr data-v-8580545e${_scopeId}><td colspan="5" class="text-muted py-4 text-center" data-v-8580545e${_scopeId}><i class="fas fa-inbox fa-2x d-block mb-2" data-v-8580545e${_scopeId}></i>`);
              if (search.value) {
                _push2(`<div data-v-8580545e${_scopeId}> Tidak ada data yang sesuai dengan pencarian &quot;${ssrInterpolate(search.value)}&quot; </div>`);
              } else {
                _push2(`<div data-v-8580545e${_scopeId}>Belum ada data barang keluar</div>`);
              }
              _push2(`</td></tr>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(__props.outgoing.data, (row, index) => {
                var _a3, _b2;
                _push2(`<tr data-v-8580545e${_scopeId}><td class="text-muted text-center" data-v-8580545e${_scopeId}>${ssrInterpolate((__props.outgoing.from ?? 0) + index)}</td><td class="fw-medium" data-v-8580545e${_scopeId}>${ssrInterpolate(((_a3 = row.product) == null ? void 0 : _a3.product_name) ?? "-")}</td><td class="text-center" data-v-8580545e${_scopeId}>${ssrInterpolate(row.packaging_size_input)}</td><td data-v-8580545e${_scopeId}><span class="badge bg-secondary" data-v-8580545e${_scopeId}>${ssrInterpolate(((_b2 = row.out_type) == null ? void 0 : _b2.out_type_name) ?? "-")}</span></td><td class="text-muted" data-v-8580545e${_scopeId}>${ssrInterpolate(formatDate(row.created_at))}</td></tr>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</tbody></table></div></div><div class="mt-3" data-v-8580545e${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              links: ((_f = __props.outgoing) == null ? void 0 : _f.links) ?? []
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "modalRef",
              ref: modalRef,
              products: __props.products ?? [],
              "out-types": __props.outTypes ?? [],
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
                        createTextVNode(" Tambah Barang Keluar ")
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                createVNode("div", { class: "text-muted" }, " Menampilkan " + toDisplayString(((_g = __props.outgoing) == null ? void 0 : _g.from) ?? 0) + " - " + toDisplayString(((_h = __props.outgoing) == null ? void 0 : _h.to) ?? 0) + " dari " + toDisplayString(((_i = __props.outgoing) == null ? void 0 : _i.total) ?? 0) + " data ", 1),
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
                          style: { "width": "120px" }
                        }, "Quantity"),
                        createVNode("th", { style: { "width": "140px" } }, "Tipe Keluar"),
                        createVNode("th", { style: { "width": "180px" } }, "Kapan Barang Keluar")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      !((_k = (_j = __props.outgoing) == null ? void 0 : _j.data) == null ? void 0 : _k.length) ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "5",
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-2x d-block mb-2" }),
                          search.value ? (openBlock(), createBlock("div", { key: 0 }, ' Tidak ada data yang sesuai dengan pencarian "' + toDisplayString(search.value) + '" ', 1)) : (openBlock(), createBlock("div", { key: 1 }, "Belum ada data barang keluar"))
                        ])
                      ])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.outgoing.data, (row, index) => {
                        var _a3, _b2;
                        return openBlock(), createBlock("tr", {
                          key: row.id
                        }, [
                          createVNode("td", { class: "text-muted text-center" }, toDisplayString((__props.outgoing.from ?? 0) + index), 1),
                          createVNode("td", { class: "fw-medium" }, toDisplayString(((_a3 = row.product) == null ? void 0 : _a3.product_name) ?? "-"), 1),
                          createVNode("td", { class: "text-center" }, toDisplayString(row.packaging_size_input), 1),
                          createVNode("td", null, [
                            createVNode("span", { class: "badge bg-secondary" }, toDisplayString(((_b2 = row.out_type) == null ? void 0 : _b2.out_type_name) ?? "-"), 1)
                          ]),
                          createVNode("td", { class: "text-muted" }, toDisplayString(formatDate(row.created_at)), 1)
                        ]);
                      }), 128))
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-3" }, [
                createVNode(_sfc_main$3, {
                  links: ((_l = __props.outgoing) == null ? void 0 : _l.links) ?? []
                }, null, 8, ["links"])
              ]),
              createVNode(_sfc_main$4, {
                ref_key: "modalRef",
                ref: modalRef,
                products: __props.products ?? [],
                "out-types": __props.outTypes ?? [],
                onSaved: ($event) => unref(router).reload()
              }, null, 8, ["products", "out-types", "onSaved"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreOutgoingProduct/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8580545e"]]);
export {
  Index as default
};
