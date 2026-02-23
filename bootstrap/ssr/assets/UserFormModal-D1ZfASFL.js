import { mergeProps, useSSRContext, ref, computed, withCtx, unref, createBlock, openBlock, createVNode, createTextVNode, toDisplayString, withModifiers } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$5 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$3 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$2 } from "./Modal-DBd8rNSf.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { _ as _sfc_main$4 } from "./TextInput-BEWjE_Xr.js";
import { useForm } from "@inertiajs/vue3";
const _sfc_main$1 = {
  __name: "RoleSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    roles: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: "Pilih role..."
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<select${ssrRenderAttrs(mergeProps({
        disabled: __props.disabled,
        class: "form-select",
        value: __props.modelValue
      }, _attrs))} data-v-72f368a8><option disabled value="" data-v-72f368a8>${ssrInterpolate(__props.placeholder)}</option><!--[-->`);
      ssrRenderList(__props.roles, (role) => {
        _push(`<option${ssrRenderAttr("value", role)} data-v-72f368a8>${ssrInterpolate(role)}</option>`);
      });
      _push(`<!--]--></select>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/RoleSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RoleSelect = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-72f368a8"]]);
const _sfc_main = {
  __name: "UserFormModal",
  __ssrInlineRender: true,
  props: {
    roles: Array
  },
  emits: ["saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const showModal = ref(false);
    const form = useForm({
      id: null,
      // ✅ Tambahkan id
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: ""
    });
    const isEditing = computed(() => form.id !== null);
    function open(user = null) {
      showModal.value = true;
      if (user) {
        form.id = user.id;
        form.name = user.name;
        form.email = user.email;
        form.password = "";
        form.password_confirmation = "";
        form.role = user.role;
      } else {
        form.reset();
      }
    }
    function close() {
      showModal.value = false;
      form.clearErrors();
    }
    function submit() {
      if (isEditing.value) {
        form.put(route("users.update", form.id), {
          onSuccess: () => {
            emit("saved");
            close();
          }
        });
      } else {
        form.post(route("users.store"), {
          onSuccess: () => {
            emit("saved");
            close();
          }
        });
      }
    }
    __expose({ open, close });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$2, mergeProps({
        show: showModal.value,
        onClose: close,
        maxWidth: "lg"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form${_scopeId}><div class="modal-header bg-light border-bottom"${_scopeId}><h5 class="modal-title fw-semibold"${_scopeId}><i class="fas fa-user me-2 text-primary"${_scopeId}></i> ${ssrInterpolate(isEditing.value ? "Edit User" : "Tambah User")}</h5><button type="button" class="btn-close"${_scopeId}></button></div><div class="modal-body"${_scopeId}><div class="row"${_scopeId}><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              for: "name",
              value: "Nama Lengkap"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "name",
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              type: "text",
              class: "form-control",
              required: "",
              autofocus: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.name,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              for: "email",
              value: "Email"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "email",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              type: "email",
              class: "form-control",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.email,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              for: "role",
              value: "Role"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(RoleSelect, {
              modelValue: unref(form).role,
              "onUpdate:modelValue": ($event) => unref(form).role = $event,
              roles: ["admin", "operator"],
              placeholder: "Pilih role"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.role_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              for: "password",
              value: isEditing.value ? "Password (opsional)" : "Password"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              type: "password",
              class: "form-control",
              required: !isEditing.value
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.password,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              for: "password_confirmation",
              value: "Konfirmasi Password"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "password_confirmation",
              modelValue: unref(form).password_confirmation,
              "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
              type: "password",
              class: "form-control",
              required: !isEditing.value
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.password_confirmation,
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
                createVNode("div", { class: "modal-header bg-light border-bottom" }, [
                  createVNode("h5", { class: "modal-title fw-semibold" }, [
                    createVNode("i", { class: "fas fa-user me-2 text-primary" }),
                    createTextVNode(" " + toDisplayString(isEditing.value ? "Edit User" : "Tambah User"), 1)
                  ]),
                  createVNode("button", {
                    type: "button",
                    class: "btn-close",
                    onClick: close
                  })
                ]),
                createVNode("div", { class: "modal-body" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$3, {
                        for: "name",
                        value: "Nama Lengkap"
                      }),
                      createVNode(_sfc_main$4, {
                        id: "name",
                        modelValue: unref(form).name,
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        type: "text",
                        class: "form-control",
                        required: "",
                        autofocus: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$5, {
                        message: unref(form).errors.name,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$3, {
                        for: "email",
                        value: "Email"
                      }),
                      createVNode(_sfc_main$4, {
                        id: "email",
                        modelValue: unref(form).email,
                        "onUpdate:modelValue": ($event) => unref(form).email = $event,
                        type: "email",
                        class: "form-control",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$5, {
                        message: unref(form).errors.email,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$3, {
                        for: "role",
                        value: "Role"
                      }),
                      createVNode(RoleSelect, {
                        modelValue: unref(form).role,
                        "onUpdate:modelValue": ($event) => unref(form).role = $event,
                        roles: ["admin", "operator"],
                        placeholder: "Pilih role"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$5, {
                        message: unref(form).errors.role_id,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$3, {
                        for: "password",
                        value: isEditing.value ? "Password (opsional)" : "Password"
                      }, null, 8, ["value"]),
                      createVNode(_sfc_main$4, {
                        id: "password",
                        modelValue: unref(form).password,
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        type: "password",
                        class: "form-control",
                        required: !isEditing.value
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "required"]),
                      createVNode(_sfc_main$5, {
                        message: unref(form).errors.password,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$3, {
                        for: "password_confirmation",
                        value: "Konfirmasi Password"
                      }),
                      createVNode(_sfc_main$4, {
                        id: "password_confirmation",
                        modelValue: unref(form).password_confirmation,
                        "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
                        type: "password",
                        class: "form-control",
                        required: !isEditing.value
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "required"]),
                      createVNode(_sfc_main$5, {
                        message: unref(form).errors.password_confirmation,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Users/UserFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
