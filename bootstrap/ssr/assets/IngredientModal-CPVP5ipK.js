import { ref, watch, mergeProps, withCtx, createVNode, toDisplayString, withDirectives, createBlock, openBlock, Fragment, renderList, vModelSelect, createCommentVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
const _sfc_main = {
  __name: "IngredientModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean, default: false },
    products: { type: Array, default: () => [] },
    initialProductId: { type: [String, Number], default: "" },
    initialQuantity: { type: [String, Number], default: "" },
    isEdit: { type: Boolean, default: false }
  },
  emits: ["close", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const productId = ref("");
    const quantity = ref("");
    watch(
      () => props.show,
      (visible) => {
        if (visible) {
          productId.value = props.initialProductId ? String(props.initialProductId) : "";
          quantity.value = props.initialQuantity ? String(props.initialQuantity) : "";
        }
      }
    );
    const canSubmit = () => !!productId.value && !!quantity.value;
    const handleSubmit = () => {
      if (!canSubmit()) return;
      emit("submit", {
        product_id: productId.value,
        quantity: quantity.value
      });
    };
    const handleClose = () => emit("close");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        show: __props.show,
        maxWidth: "md",
        onClose: handleClose
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-header border-0 pb-0"${_scopeId}><h5 class="modal-title fw-semibold"${_scopeId}>${ssrInterpolate(__props.isEdit ? "Edit Bahan" : "Tambah Bahan")}</h5><button type="button" class="btn-close" aria-label="Tutup"${_scopeId}></button></div><div class="modal-body pt-2"${_scopeId}><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "ingredient-modal-product",
              value: "Produk"
            }, null, _parent2, _scopeId));
            _push2(`<select id="ingredient-modal-product" class="form-select"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(productId.value) ? ssrLooseContain(productId.value, "") : ssrLooseEqual(productId.value, "")) ? " selected" : ""}${_scopeId}>-- Pilih Produk --</option><!--[-->`);
            ssrRenderList(__props.products, (p) => {
              _push2(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(productId.value) ? ssrLooseContain(productId.value, p.id) : ssrLooseEqual(productId.value, p.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(p.product_name)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="mb-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "ingredient-modal-qty",
              value: "Jumlah (Quantity)"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "ingredient-modal-qty",
              type: "number",
              step: "0.01",
              min: "0",
              modelValue: quantity.value,
              "onUpdate:modelValue": ($event) => quantity.value = $event,
              placeholder: "Masukkan jumlah"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="modal-footer border-0 pt-0"${_scopeId}><button type="button" class="btn btn-outline-secondary"${_scopeId}> Batal </button><button type="button" class="btn btn-primary"${ssrIncludeBooleanAttr(!canSubmit()) ? " disabled" : ""}${_scopeId}>`);
            if (!__props.isEdit) {
              _push2(`<i class="fas fa-plus me-1"${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(__props.isEdit ? "Simpan" : "Tambah")}</button></div>`);
          } else {
            return [
              createVNode("div", { class: "modal-header border-0 pb-0" }, [
                createVNode("h5", { class: "modal-title fw-semibold" }, toDisplayString(__props.isEdit ? "Edit Bahan" : "Tambah Bahan"), 1),
                createVNode("button", {
                  type: "button",
                  class: "btn-close",
                  "aria-label": "Tutup",
                  onClick: handleClose
                })
              ]),
              createVNode("div", { class: "modal-body pt-2" }, [
                createVNode("div", { class: "mb-3" }, [
                  createVNode(_sfc_main$2, {
                    for: "ingredient-modal-product",
                    value: "Produk"
                  }),
                  withDirectives(createVNode("select", {
                    id: "ingredient-modal-product",
                    "onUpdate:modelValue": ($event) => productId.value = $event,
                    class: "form-select"
                  }, [
                    createVNode("option", { value: "" }, "-- Pilih Produk --"),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.products, (p) => {
                      return openBlock(), createBlock("option", {
                        key: p.id,
                        value: p.id
                      }, toDisplayString(p.product_name), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, productId.value]
                  ])
                ]),
                createVNode("div", { class: "mb-0" }, [
                  createVNode(_sfc_main$2, {
                    for: "ingredient-modal-qty",
                    value: "Jumlah (Quantity)"
                  }),
                  createVNode(_sfc_main$3, {
                    id: "ingredient-modal-qty",
                    type: "number",
                    step: "0.01",
                    min: "0",
                    modelValue: quantity.value,
                    "onUpdate:modelValue": ($event) => quantity.value = $event,
                    placeholder: "Masukkan jumlah"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ]),
              createVNode("div", { class: "modal-footer border-0 pt-0" }, [
                createVNode("button", {
                  type: "button",
                  class: "btn btn-outline-secondary",
                  onClick: handleClose
                }, " Batal "),
                createVNode("button", {
                  type: "button",
                  class: "btn btn-primary",
                  disabled: !canSubmit(),
                  onClick: handleSubmit
                }, [
                  !__props.isEdit ? (openBlock(), createBlock("i", {
                    key: 0,
                    class: "fas fa-plus me-1"
                  })) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(__props.isEdit ? "Simpan" : "Tambah"), 1)
                ], 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreRecipe/IngredientModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
