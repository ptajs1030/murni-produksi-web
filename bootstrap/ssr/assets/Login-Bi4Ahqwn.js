import { computed, mergeProps, useSSRContext, ref, withCtx, unref, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, withModifiers, withDirectives, vModelDynamic } from "vue";
import { ssrRenderAttrs, ssrLooseContain, ssrGetDynamicModelProps, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderDynamicModel, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { G as GuestLayout } from "./GuestLayout-BJGQxP2e.js";
import { useForm, usePage, Head, Link } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$1 = {
  __name: "Checkbox",
  __ssrInlineRender: true,
  props: {
    checked: {
      type: [Array, Boolean],
      required: true
    },
    value: {
      default: null
    }
  },
  emits: ["update:checked"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const proxyChecked = computed({
      get() {
        return props.checked;
      },
      set(val) {
        emit("update:checked", val);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
        type: "checkbox",
        value: __props.value,
        checked: Array.isArray(proxyChecked.value) ? ssrLooseContain(proxyChecked.value, __props.value) : proxyChecked.value,
        class: "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
      }, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, proxyChecked.value))))}>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Checkbox.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    canResetPassword: Boolean,
    status: String
  },
  setup(__props) {
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    const showPassword = ref(false);
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    const submit = () => {
      form.post(route("login"), {
        onFinish: () => form.reset("password")
      });
    };
    const page = usePage();
    const appLogo = computed(() => {
      var _a;
      return ((_a = page.props.appSettings) == null ? void 0 : _a.logo) || "/resources/img/logo.png";
    });
    const appName = computed(() => {
      var _a;
      return ((_a = page.props.appSettings) == null ? void 0 : _a.name) || "Laravel";
    });
    const appLoginImage = computed(() => {
      var _a;
      return ((_a = page.props.appSettings) == null ? void 0 : _a.img_login) || "/resources/img/lingkaran.png";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(GuestLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Log in" }, null, _parent2, _scopeId));
            _push2(`<div class="row g-0 min-vh-100"${_scopeId}><div class="col-6 d-flex align-items-center justify-content-center bg-light"${_scopeId}><div class="text-center"${_scopeId}><img${ssrRenderAttr("src", appLoginImage.value)} alt="Login Background Image" class="img-fluid mb-4" style="${ssrRenderStyle({ "max-width": "300px", "max-height": "300px", "object-fit": "contain" })}"${_scopeId}><h3 class="text-muted"${_scopeId}>${ssrInterpolate(appName.value)}</h3><p class="text-muted"${_scopeId}>Warehouse Management System</p></div></div><div class="col-6 d-flex align-items-center justify-content-center"${_scopeId}><div class="w-100" style="${ssrRenderStyle({ "max-width": "600px", "padding": "2rem" })}"${_scopeId}><div class="mb-4 text-center"${_scopeId}><img${ssrRenderAttr("src", appLogo.value)}${ssrRenderAttr("alt", appName.value + " Logo")} class="img-fluid mb-3" style="${ssrRenderStyle({ "max-width": "120px", "max-height": "120px", "object-fit": "contain" })}"${_scopeId}><h4 class="mb-1"${_scopeId}>Selamat Datang!</h4><p class="text-muted"${_scopeId}>Sign in to your account</p></div>`);
            if (__props.status) {
              _push2(`<div class="alert alert-success small mb-4"${_scopeId}>${ssrInterpolate(__props.status)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="needs-validation"${_scopeId}><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "email",
              value: "Email or Phone Number"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "email",
              type: "text",
              class: "form-control",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              required: "",
              autofocus: "",
              autocomplete: "username"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "invalid-feedback d-block",
              message: unref(form).errors.email
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "password",
              value: "Password"
            }, null, _parent2, _scopeId));
            _push2(`<div class="position-relative"${_scopeId}><input id="password"${ssrRenderAttr("type", showPassword.value ? "text" : "password")} class="form-control pe-5"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(form).password, null)} required autocomplete="current-password"${_scopeId}><span class="position-absolute top-50 translate-middle-y end-0 me-3" style="${ssrRenderStyle({ "cursor": "pointer" })}"${_scopeId}><i class="${ssrRenderClass(showPassword.value ? "fas fa-eye-slash" : "fas fa-eye")}"${_scopeId}></i></span></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "invalid-feedback d-block",
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="d-flex justify-content-start align-items-top mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              name: "remember",
              checked: unref(form).remember,
              "onUpdate:checked": ($event) => unref(form).remember = $event,
              id: "remember"
            }, null, _parent2, _scopeId));
            _push2(`<label class="form-check-label small" for="remember"${_scopeId}>Remember me</label></div><div class="d-flex justify-content-between align-items-center"${_scopeId}>`);
            if (__props.canResetPassword) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("password.request"),
                class: "text-decoration-none small"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Forgot your password? `);
                  } else {
                    return [
                      createTextVNode(" Forgot your password? ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(PrimaryButton, {
              class: ["btn btn-primary ms-2", { disabled: unref(form).processing }],
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Log in `);
                } else {
                  return [
                    createTextVNode(" Log in ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div></div></div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Log in" }),
              createVNode("div", { class: "row g-0 min-vh-100" }, [
                createVNode("div", { class: "col-6 d-flex align-items-center justify-content-center bg-light" }, [
                  createVNode("div", { class: "text-center" }, [
                    createVNode("img", {
                      src: appLoginImage.value,
                      alt: "Login Background Image",
                      class: "img-fluid mb-4",
                      style: { "max-width": "300px", "max-height": "300px", "object-fit": "contain" }
                    }, null, 8, ["src"]),
                    createVNode("h3", { class: "text-muted" }, toDisplayString(appName.value), 1),
                    createVNode("p", { class: "text-muted" }, "Warehouse Management System")
                  ])
                ]),
                createVNode("div", { class: "col-6 d-flex align-items-center justify-content-center" }, [
                  createVNode("div", {
                    class: "w-100",
                    style: { "max-width": "600px", "padding": "2rem" }
                  }, [
                    createVNode("div", { class: "mb-4 text-center" }, [
                      createVNode("img", {
                        src: appLogo.value,
                        alt: appName.value + " Logo",
                        class: "img-fluid mb-3",
                        style: { "max-width": "120px", "max-height": "120px", "object-fit": "contain" }
                      }, null, 8, ["src", "alt"]),
                      createVNode("h4", { class: "mb-1" }, "Selamat Datang!"),
                      createVNode("p", { class: "text-muted" }, "Sign in to your account")
                    ]),
                    __props.status ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "alert alert-success small mb-4"
                    }, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
                    createVNode("form", {
                      onSubmit: withModifiers(submit, ["prevent"]),
                      class: "needs-validation"
                    }, [
                      createVNode("div", { class: "mb-3" }, [
                        createVNode(_sfc_main$2, {
                          for: "email",
                          value: "Email or Phone Number"
                        }),
                        createVNode(_sfc_main$3, {
                          id: "email",
                          type: "text",
                          class: "form-control",
                          modelValue: unref(form).email,
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          required: "",
                          autofocus: "",
                          autocomplete: "username"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$4, {
                          class: "invalid-feedback d-block",
                          message: unref(form).errors.email
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode(_sfc_main$2, {
                          for: "password",
                          value: "Password"
                        }),
                        createVNode("div", { class: "position-relative" }, [
                          withDirectives(createVNode("input", {
                            id: "password",
                            type: showPassword.value ? "text" : "password",
                            class: "form-control pe-5",
                            "onUpdate:modelValue": ($event) => unref(form).password = $event,
                            required: "",
                            autocomplete: "current-password"
                          }, null, 8, ["type", "onUpdate:modelValue"]), [
                            [vModelDynamic, unref(form).password]
                          ]),
                          createVNode("span", {
                            class: "position-absolute top-50 translate-middle-y end-0 me-3",
                            style: { "cursor": "pointer" },
                            onClick: togglePasswordVisibility
                          }, [
                            createVNode("i", {
                              class: showPassword.value ? "fas fa-eye-slash" : "fas fa-eye"
                            }, null, 2)
                          ])
                        ]),
                        createVNode(_sfc_main$4, {
                          class: "invalid-feedback d-block",
                          message: unref(form).errors.password
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", { class: "d-flex justify-content-start align-items-top mb-3" }, [
                        createVNode(_sfc_main$1, {
                          name: "remember",
                          checked: unref(form).remember,
                          "onUpdate:checked": ($event) => unref(form).remember = $event,
                          id: "remember"
                        }, null, 8, ["checked", "onUpdate:checked"]),
                        createVNode("label", {
                          class: "form-check-label small",
                          for: "remember"
                        }, "Remember me")
                      ]),
                      createVNode("div", { class: "d-flex justify-content-between align-items-center" }, [
                        __props.canResetPassword ? (openBlock(), createBlock(unref(Link), {
                          key: 0,
                          href: _ctx.route("password.request"),
                          class: "text-decoration-none small"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Forgot your password? ")
                          ]),
                          _: 1
                        }, 8, ["href"])) : createCommentVNode("", true),
                        createVNode(PrimaryButton, {
                          class: ["btn btn-primary ms-2", { disabled: unref(form).processing }],
                          disabled: unref(form).processing
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Log in ")
                          ]),
                          _: 1
                        }, 8, ["class", "disabled"])
                      ])
                    ], 32)
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
