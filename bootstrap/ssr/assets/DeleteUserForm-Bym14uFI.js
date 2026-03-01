import { ref, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./InputError-C5ky-J1T.js";
import { useForm } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "DeleteUserForm",
  __ssrInlineRender: true,
  setup(__props) {
    const confirmingUserDeletion = ref(false);
    ref(null);
    const form = useForm({
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)} data-v-ba4b806d><header class="mb-4" data-v-ba4b806d><h5 class="fw-semibold" data-v-ba4b806d>Delete Account</h5><p class="text-muted small mb-0" data-v-ba4b806d> Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. </p></header><button class="btn btn-danger" data-v-ba4b806d> Delete Account </button>`);
      if (confirmingUserDeletion.value) {
        _push(`<div class="modal-backdrop fade show" data-v-ba4b806d></div>`);
      } else {
        _push(`<!---->`);
      }
      if (confirmingUserDeletion.value) {
        _push(`<div class="modal fade show d-block" tabindex="-1" data-v-ba4b806d><div class="modal-dialog modal-dialog-centered" data-v-ba4b806d><div class="modal-content" data-v-ba4b806d><div class="modal-header" data-v-ba4b806d><h5 class="modal-title" data-v-ba4b806d><i class="fas fa-exclamation-triangle me-2 text-danger" data-v-ba4b806d></i> Delete Account </h5><button type="button" class="btn-close" data-v-ba4b806d></button></div><div class="modal-body" data-v-ba4b806d><p data-v-ba4b806d> Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. </p><div class="mb-3" data-v-ba4b806d><label for="delete_password" class="form-label" data-v-ba4b806d>Password</label><input id="delete_password"${ssrRenderAttr("value", unref(form).password)} type="password" class="form-control" placeholder="Enter your password to confirm" data-v-ba4b806d>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          message: unref(form).errors.password,
          class: "mt-1"
        }, null, _parent));
        _push(`</div></div><div class="modal-footer" data-v-ba4b806d><button type="button" class="btn btn-secondary" data-v-ba4b806d> Cancel </button><button type="button" class="btn btn-danger"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-ba4b806d> Delete Account </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/DeleteUserForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DeleteUserForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ba4b806d"]]);
export {
  DeleteUserForm as default
};
