import { ref, watch, mergeProps, withCtx, unref, createBlock, openBlock, createVNode, createTextVNode, withModifiers, withDirectives, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$4 } from "./TextInput-BEWjE_Xr.js";
import { useForm } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "IncomingProductModal",
  __ssrInlineRender: true,
  props: {
    products: { type: Array, default: () => [] }
  },
  emits: ["saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const show = ref(false);
    const form = useForm({
      product_id: "",
      stock: "",
      price: "",
      note: ""
    });
    watch(
      () => show.value,
      (visible) => {
        if (visible) form.reset();
      }
    );
    const open = () => {
      form.reset();
      show.value = true;
    };
    const close = () => {
      show.value = false;
      form.reset();
    };
    const submit = () => {
      form.post(route("incoming-goods.store"), {
        onSuccess: () => {
          close();
          emit("saved");
        },
        preserveScroll: true
      });
    };
    __expose({ open, close });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        show: show.value,
        onClose: close,
        maxWidth: "lg"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form${_scopeId}><div class="modal-header"${_scopeId}><h5 class="modal-title"${_scopeId}>Tambah Barang Datang</h5><button type="button" class="btn-close"${_scopeId}></button></div><div class="modal-body"${_scopeId}><div class="row"${_scopeId}><div class="col-12 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "incoming-product",
              value: "Nama Produk"
            }, null, _parent2, _scopeId));
            _push2(`<select id="incoming-product" class="form-select" required${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_id) ? ssrLooseContain(unref(form).product_id, "") : ssrLooseEqual(unref(form).product_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Produk --</option><!--[-->`);
            ssrRenderList(__props.products, (p) => {
              _push2(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_id) ? ssrLooseContain(unref(form).product_id, p.id) : ssrLooseEqual(unref(form).product_id, p.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(p.product_name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              message: unref(form).errors.product_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="row"${_scopeId}><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "incoming-stock",
              value: "Quantity"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "incoming-stock",
              modelValue: unref(form).stock,
              "onUpdate:modelValue": ($event) => unref(form).stock = $event,
              type: "number",
              class: "form-control",
              min: "1",
              step: "1",
              placeholder: "Masukkan jumlah",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              message: unref(form).errors.stock,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "incoming-price",
              value: "Harga"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "incoming-price",
              modelValue: unref(form).price,
              "onUpdate:modelValue": ($event) => unref(form).price = $event,
              type: "number",
              class: "form-control",
              min: "0",
              step: "1",
              placeholder: "Masukkan harga"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              message: unref(form).errors.price,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="row"${_scopeId}><div class="col-12 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "incoming-note",
              value: "Catatan"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "incoming-note",
              modelValue: unref(form).note,
              "onUpdate:modelValue": ($event) => unref(form).note = $event,
              type: "text",
              class: "form-control",
              placeholder: "Masukkan catatan"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              message: unref(form).errors.note,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="modal-footer"${_scopeId}><button type="button" class="btn btn-secondary me-2"${_scopeId}> Batal </button>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              disabled: unref(form).processing,
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(form).processing) {
                    _push3(`<span${_scopeId2}><i class="fas fa-spinner fa-spin me-1"${_scopeId2}></i> Menyimpan... </span>`);
                  } else {
                    _push3(`<span${_scopeId2}><i class="fas fa-save me-1"${_scopeId2}></i> Simpan </span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Menyimpan... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-save me-1" }),
                      createTextVNode(" Simpan ")
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", { class: "modal-header" }, [
                  createVNode("h5", { class: "modal-title" }, "Tambah Barang Datang"),
                  createVNode("button", {
                    type: "button",
                    class: "btn-close",
                    onClick: close
                  })
                ]),
                createVNode("div", { class: "modal-body" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-12 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "incoming-product",
                        value: "Nama Produk"
                      }),
                      withDirectives(createVNode("select", {
                        id: "incoming-product",
                        "onUpdate:modelValue": ($event) => unref(form).product_id = $event,
                        class: "form-select",
                        required: ""
                      }, [
                        createVNode("option", { value: "" }, "-- Pilih Produk --"),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.products, (p) => {
                          return openBlock(), createBlock("option", {
                            key: p.id,
                            value: p.id
                          }, toDisplayString(p.product_name), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).product_id]
                      ]),
                      createVNode(_sfc_main$3, {
                        message: unref(form).errors.product_id,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "incoming-stock",
                        value: "Quantity"
                      }),
                      createVNode(_sfc_main$4, {
                        id: "incoming-stock",
                        modelValue: unref(form).stock,
                        "onUpdate:modelValue": ($event) => unref(form).stock = $event,
                        type: "number",
                        class: "form-control",
                        min: "1",
                        step: "1",
                        placeholder: "Masukkan jumlah",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$3, {
                        message: unref(form).errors.stock,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "incoming-price",
                        value: "Harga"
                      }),
                      createVNode(_sfc_main$4, {
                        id: "incoming-price",
                        modelValue: unref(form).price,
                        "onUpdate:modelValue": ($event) => unref(form).price = $event,
                        type: "number",
                        class: "form-control",
                        min: "0",
                        step: "1",
                        placeholder: "Masukkan harga"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$3, {
                        message: unref(form).errors.price,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-12 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "incoming-note",
                        value: "Catatan"
                      }),
                      createVNode(_sfc_main$4, {
                        id: "incoming-note",
                        modelValue: unref(form).note,
                        "onUpdate:modelValue": ($event) => unref(form).note = $event,
                        type: "text",
                        class: "form-control",
                        placeholder: "Masukkan catatan"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$3, {
                        message: unref(form).errors.note,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ])
                  ])
                ]),
                createVNode("div", { class: "modal-footer" }, [
                  createVNode("button", {
                    type: "button",
                    class: "btn btn-secondary me-2",
                    onClick: close
                  }, " Batal "),
                  createVNode(PrimaryButton, {
                    disabled: unref(form).processing,
                    class: "btn btn-primary"
                  }, {
                    default: withCtx(() => [
                      unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                        createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                        createTextVNode(" Menyimpan... ")
                      ])) : (openBlock(), createBlock("span", { key: 1 }, [
                        createVNode("i", { class: "fas fa-save me-1" }),
                        createTextVNode(" Simpan ")
                      ]))
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreIncomingProduct/IncomingProductModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
