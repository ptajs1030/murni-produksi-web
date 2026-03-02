import { ref, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./InputError-C5ky-J1T.js";
import { useForm } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "UpdatePasswordForm",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    ref(null);
    const form = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><header class="mb-4"><h5 class="fw-semibold">Update Password</h5><p class="text-muted small mb-0"> Ensure your account is using a long, random password to stay secure. </p></header><form><div class="mb-3"><label for="current_password" class="form-label">Current Password</label><input id="current_password"${ssrRenderAttr("value", unref(form).current_password)} type="password" class="form-control" autocomplete="current-password">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        message: unref(form).errors.current_password,
        class: "mt-1"
      }, null, _parent));
      _push(`</div><div class="mb-3"><label for="password" class="form-label">New Password</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" class="form-control" autocomplete="new-password">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        message: unref(form).errors.password,
        class: "mt-1"
      }, null, _parent));
      _push(`</div><div class="mb-3"><label for="password_confirmation" class="form-label">Confirm Password</label><input id="password_confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" class="form-control" autocomplete="new-password">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        message: unref(form).errors.password_confirmation,
        class: "mt-1"
      }, null, _parent));
      _push(`</div><div class="d-flex align-items-center gap-3"><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}> Save </button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdatePasswordForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
