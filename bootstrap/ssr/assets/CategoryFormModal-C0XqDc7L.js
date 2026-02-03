import { ref, computed, watch, mergeProps, withCtx, unref, createBlock, openBlock, createVNode, createTextVNode, toDisplayString, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { useForm } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "CategoryFormModal",
  __ssrInlineRender: true,
  emits: ["saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const show = ref(false);
    const form = useForm({
      id: null,
      created_by: null,
      category_code: "",
      category_name: ""
    });
    const isEditing = computed(() => form.id !== null);
    watch(
      () => form.category_code,
      (newValue) => {
        if (newValue && newValue !== newValue.toUpperCase()) {
          form.category_code = newValue.toUpperCase();
        }
      }
    );
    const open = (category = null) => {
      if (category) {
        form.id = category.id;
        form.created_by = category.created_by;
        form.category_code = category.category_code;
        form.category_name = category.category_name;
      } else {
        form.reset();
      }
      show.value = true;
    };
    const close = () => {
      show.value = false;
      form.reset();
    };
    const handleCategoryCodeInput = (event) => {
      form.category_code = event.target.value.toUpperCase();
    };
    const submit = () => {
      form.category_code = form.category_code.toUpperCase();
      const options = {
        onSuccess: () => {
          close();
          emit("saved");
        }
      };
      if (form.id) {
        form.put(route("categories.update", form.id), options);
      } else {
        form.post(route("categories.store"), options);
      }
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
            _push2(`<form${_scopeId}><div class="modal-header"${_scopeId}><h5 class="modal-title"${_scopeId}>${ssrInterpolate(isEditing.value ? "Edit Category" : "Tambah Category")}</h5><button type="button" class="btn-close"${_scopeId}></button></div><div class="modal-body"${_scopeId}><div class="row"${_scopeId}><div class="col-12 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "category_code",
              value: "Kode Kategori"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "category_code",
              "model-value": unref(form).category_code,
              onInput: handleCategoryCodeInput,
              type: "text",
              class: "form-control",
              required: "",
              autofocus: "",
              style: { "text-transform": "uppercase" }
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.category_code,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="row"${_scopeId}><div class="col-12 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "category_name",
              value: "Nama Kategori"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "category_name",
              modelValue: unref(form).category_name,
              "onUpdate:modelValue": ($event) => unref(form).category_name = $event,
              type: "text",
              class: "form-control",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.category_name,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="modal-footer"${_scopeId}><button type="button" class="btn btn-secondary me-2"${_scopeId}>Batal</button>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              disabled: unref(form).processing,
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(form).processing) {
                    _push3(`<span${_scopeId2}><i class="fas fa-spinner fa-spin me-1"${_scopeId2}></i> Menyimpan... </span>`);
                  } else {
                    _push3(`<span${_scopeId2}><i class="fas fa-save me-1"${_scopeId2}></i> ${ssrInterpolate(isEditing.value ? "Update" : "Simpan")}</span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Menyimpan... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-save me-1" }),
                      createTextVNode(" " + toDisplayString(isEditing.value ? "Update" : "Simpan"), 1)
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
                  createVNode("h5", { class: "modal-title" }, toDisplayString(isEditing.value ? "Edit Category" : "Tambah Category"), 1),
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
                        for: "category_code",
                        value: "Kode Kategori"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "category_code",
                        "model-value": unref(form).category_code,
                        onInput: handleCategoryCodeInput,
                        type: "text",
                        class: "form-control",
                        required: "",
                        autofocus: "",
                        style: { "text-transform": "uppercase" }
                      }, null, 8, ["model-value"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.category_code,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-12 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "category_name",
                        value: "Nama Kategori"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "category_name",
                        modelValue: unref(form).category_name,
                        "onUpdate:modelValue": ($event) => unref(form).category_name = $event,
                        type: "text",
                        class: "form-control",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.category_name,
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
                  }, "Batal"),
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
                        createTextVNode(" " + toDisplayString(isEditing.value ? "Update" : "Simpan"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MCategories/CategoryFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
