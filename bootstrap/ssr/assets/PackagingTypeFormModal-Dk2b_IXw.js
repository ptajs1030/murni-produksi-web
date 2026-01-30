import { ref, computed, watch, mergeProps, withCtx, unref, createBlock, openBlock, createVNode, createTextVNode, toDisplayString, withModifiers, withDirectives, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { useForm } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "PackagingTypeFormModal",
  __ssrInlineRender: true,
  props: ["packagingLevels"],
  emits: ["saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const show = ref(false);
    const form = useForm({
      id: null,
      created_by: null,
      packaging_type_code: "",
      packaging_type_name: "",
      packaging_level_id: ""
    });
    const isEditing = computed(() => form.id !== null);
    watch(
      () => form.packaging_type_code,
      (newValue) => {
        if (newValue && newValue !== newValue.toUpperCase()) {
          form.packaging_type_code = newValue.toUpperCase();
        }
      }
    );
    const open = (packaging_type = null) => {
      if (packaging_type) {
        form.id = packaging_type.id;
        form.created_by = packaging_type.created_by;
        form.packaging_type_code = packaging_type.packaging_type_code;
        form.packaging_type_name = packaging_type.packaging_type_name;
        form.packaging_level_id = packaging_type.packaging_level_id;
      } else {
        form.reset();
      }
      show.value = true;
    };
    const close = () => {
      show.value = false;
      form.reset();
    };
    const handlePackagingTypeCodeInput = (event) => {
      form.packaging_type_code = event.target.value.toUpperCase();
    };
    const submit = () => {
      form.packaging_type_code = form.packaging_type_code.toUpperCase();
      const options = {
        onSuccess: () => {
          close();
          emit("saved");
        }
      };
      if (form.id) {
        form.put(route("packaging-types.update", form.id), options);
      } else {
        form.post(route("packaging-types.store"), options);
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
            _push2(`<form${_scopeId}><div class="modal-header"${_scopeId}><h5 class="modal-title"${_scopeId}>${ssrInterpolate(isEditing.value ? "Edit Tipe Kemasan" : "Tambah Tipe Kemasan")}</h5><button type="button" class="btn-close"${_scopeId}></button></div><div class="modal-body"${_scopeId}><div class="row"${_scopeId}><div class="col-12 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "packaging_type_code",
              value: "Kode Tipe Kemasan"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "packaging_type_code",
              "model-value": unref(form).packaging_type_code,
              onInput: handlePackagingTypeCodeInput,
              type: "text",
              class: "form-control",
              required: "",
              autofocus: "",
              style: { "text-transform": "uppercase" }
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.packaging_type_code,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="row"${_scopeId}><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "packaging_type_name",
              value: "Nama Tipe Kemasan"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "packaging_type_name",
              modelValue: unref(form).packaging_type_name,
              "onUpdate:modelValue": ($event) => unref(form).packaging_type_name = $event,
              type: "text",
              class: "form-control",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.packaging_type_name,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "packaging_level_id",
              value: "Level Kemasan"
            }, null, _parent2, _scopeId));
            _push2(`<select id="packaging_level_id" class="form-select" required${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).packaging_level_id) ? ssrLooseContain(unref(form).packaging_level_id, "") : ssrLooseEqual(unref(form).packaging_level_id, "")) ? " selected" : ""}${_scopeId}>Pilih Level Kemasan</option><!--[-->`);
            ssrRenderList(__props.packagingLevels, (level) => {
              _push2(`<option${ssrRenderAttr("value", level.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).packaging_level_id) ? ssrLooseContain(unref(form).packaging_level_id, level.id) : ssrLooseEqual(unref(form).packaging_level_id, level.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(level.level_description)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.packaging_level_id,
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
                  createVNode("h5", { class: "modal-title" }, toDisplayString(isEditing.value ? "Edit Tipe Kemasan" : "Tambah Tipe Kemasan"), 1),
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
                        for: "packaging_type_code",
                        value: "Kode Tipe Kemasan"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "packaging_type_code",
                        "model-value": unref(form).packaging_type_code,
                        onInput: handlePackagingTypeCodeInput,
                        type: "text",
                        class: "form-control",
                        required: "",
                        autofocus: "",
                        style: { "text-transform": "uppercase" }
                      }, null, 8, ["model-value"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.packaging_type_code,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "packaging_type_name",
                        value: "Nama Tipe Kemasan"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "packaging_type_name",
                        modelValue: unref(form).packaging_type_name,
                        "onUpdate:modelValue": ($event) => unref(form).packaging_type_name = $event,
                        type: "text",
                        class: "form-control",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.packaging_type_name,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "packaging_level_id",
                        value: "Level Kemasan"
                      }),
                      withDirectives(createVNode("select", {
                        id: "packaging_level_id",
                        "onUpdate:modelValue": ($event) => unref(form).packaging_level_id = $event,
                        class: "form-select",
                        required: ""
                      }, [
                        createVNode("option", { value: "" }, "Pilih Level Kemasan"),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.packagingLevels, (level) => {
                          return openBlock(), createBlock("option", {
                            key: level.id,
                            value: level.id
                          }, toDisplayString(level.level_description), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).packaging_level_id]
                      ]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.packaging_level_id,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MPackagingTypes/PackagingTypeFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
