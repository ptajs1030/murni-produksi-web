import { unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-BBZT1pjc.js";
import DeleteUserForm from "./DeleteUserForm-Bym14uFI.js";
import _sfc_main$3 from "./UpdatePasswordForm-ktLlEQoA.js";
import _sfc_main$2 from "./UpdateProfileInformationForm-E-fnLYny.js";
import { Head } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./InputError-C5ky-J1T.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Profile" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Profile" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="row"${_scopeId}><div class="col-lg-8"${_scopeId}><div class="card mb-4"${_scopeId}><div class="card-body"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              "must-verify-email": __props.mustVerifyEmail,
              status: __props.status
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="card mb-4"${_scopeId}><div class="card-body"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, null, null, _parent2, _scopeId));
            _push2(`</div></div><div class="card mb-4"${_scopeId}><div class="card-body"${_scopeId}>`);
            _push2(ssrRenderComponent(DeleteUserForm, null, null, _parent2, _scopeId));
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "row" }, [
                createVNode("div", { class: "col-lg-8" }, [
                  createVNode("div", { class: "card mb-4" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode(_sfc_main$2, {
                        "must-verify-email": __props.mustVerifyEmail,
                        status: __props.status
                      }, null, 8, ["must-verify-email", "status"])
                    ])
                  ]),
                  createVNode("div", { class: "card mb-4" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode(_sfc_main$3)
                    ])
                  ]),
                  createVNode("div", { class: "card mb-4" }, [
                    createVNode("div", { class: "card-body" }, [
                      createVNode(DeleteUserForm)
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
