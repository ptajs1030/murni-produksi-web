import { unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderStyle, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./InputError-C5ky-J1T.js";
import { usePage, useForm, Link } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "UpdateProfileInformationForm",
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
    const user = usePage().props.auth.user;
    const form = useForm({
      name: user.name,
      email: user.email
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><header class="mb-4"><h5 class="fw-semibold">Profile Information</h5><p class="text-muted small mb-0"> Update your account&#39;s profile information and email address. </p></header><form><div class="mb-3"><label for="name" class="form-label">Name</label><input id="name" type="text" class="form-control"${ssrRenderAttr("value", unref(form).name)} required autofocus autocomplete="name">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        class: "mt-1",
        message: unref(form).errors.name
      }, null, _parent));
      _push(`</div><div class="mb-3"><label for="email" class="form-label">Email</label><input id="email" type="email" class="form-control"${ssrRenderAttr("value", unref(form).email)} required autocomplete="username">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        class: "mt-1",
        message: unref(form).errors.email
      }, null, _parent));
      _push(`</div>`);
      if (__props.mustVerifyEmail && unref(user).email_verified_at === null) {
        _push(`<div class="mb-3"><p class="text-muted small"> Your email address is unverified. `);
        _push(ssrRenderComponent(unref(Link), {
          href: _ctx.route("verification.send"),
          method: "post",
          as: "button",
          class: "btn btn-link btn-sm p-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Click here to re-send the verification email. `);
            } else {
              return [
                createTextVNode(" Click here to re-send the verification email. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p><div class="text-success small fw-medium" style="${ssrRenderStyle(__props.status === "verification-link-sent" ? null : { display: "none" })}"> A new verification link has been sent to your email address. </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="d-flex align-items-center gap-3"><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}> Save </button>`);
      if (unref(form).recentlySuccessful) {
        _push(`<span class="text-success small"> Saved. </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
