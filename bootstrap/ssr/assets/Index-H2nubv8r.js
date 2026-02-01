import { ref, watch, getCurrentInstance, unref, withCtx, createVNode, createTextVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-CJQU9ReZ.js";
import _sfc_main$2 from "./UserFormModal-Cm7CeQj7.js";
import { router, Head } from "@inertiajs/vue3";
import { debounce } from "lodash";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./InputError-C5ky-J1T.js";
import "./InputLabel-Dkex7vHI.js";
import "./Modal-DBd8rNSf.js";
import "./PrimaryButton-CIooT64n.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["users", "filters"],
  setup(__props) {
    const props = __props;
    const modalRef = ref(null);
    const search = ref(props.filters.search || "");
    watch(
      search,
      debounce((value) => {
        const params = {};
        if (value) params.search = value;
        const urlParams = new URLSearchParams(window.location.search);
        const existingSort = urlParams.get("sort");
        if (existingSort) params.sort = existingSort;
        router.get("/users", params, {
          preserveState: true,
          replace: true
        });
      }, 300)
    );
    const refreshPage = () => {
      console.log("Page refreshed");
    };
    const openAddUser = () => {
      modalRef.value.open();
    };
    const openEditUser = (user) => {
      modalRef.value.open(user);
    };
    const { proxy } = getCurrentInstance();
    const deleteUser = (id) => {
      proxy.$confirmDelete("/users", id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "User" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Daftar User" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, {
              ref_key: "modalRef",
              ref: modalRef,
              roles: _ctx.roles,
              onSaved: refreshPage
            }, null, _parent2, _scopeId));
            _push2(`<div class="d-flex justify-content-between mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              class: "form-control w-25",
              placeholder: "Search..."
            }, null, _parent2, _scopeId));
            _push2(`<button class="btn btn-primary btn-md"${_scopeId}><i class="fas fa-plus me-1"${_scopeId}></i> Tambah User </button></div><div class="table-responsive p-0"${_scopeId}><table class="table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>No</th><th${_scopeId}>Nama</th><th${_scopeId}>Email</th><th${_scopeId}>Role</th><th${_scopeId}>Aksi</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.users.data, (user, index) => {
              _push2(`<tr${_scopeId}><td class="w-2"${_scopeId}>${ssrInterpolate(__props.users.from + index)}</td><td${_scopeId}>${ssrInterpolate(user.name)}</td><td${_scopeId}>${ssrInterpolate(user.email)}</td><td class="align-middle text-sm"${_scopeId}><span class="badge bg-gradient-primary"${_scopeId}>${ssrInterpolate(user.role)}</span></td><td class="align-middle"${_scopeId}><div class="btn-group" role="group"${_scopeId}><button class="btn btn-outline-warning btn-md" title="Edit User"${_scopeId}><i class="fas fa-edit"${_scopeId}></i></button><button class="btn btn-outline-danger btn-md" title="Hapus User"${_scopeId}><i class="fas fa-trash"${_scopeId}></i></button></div></td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              links: __props.users.links
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, {
                ref_key: "modalRef",
                ref: modalRef,
                roles: _ctx.roles,
                onSaved: refreshPage
              }, null, 8, ["roles"]),
              createVNode("div", { class: "d-flex justify-content-between mb-3" }, [
                createVNode(_sfc_main$3, {
                  modelValue: search.value,
                  "onUpdate:modelValue": ($event) => search.value = $event,
                  type: "text",
                  class: "form-control w-25",
                  placeholder: "Search..."
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("button", {
                  class: "btn btn-primary btn-md",
                  onClick: openAddUser
                }, [
                  createVNode("i", { class: "fas fa-plus me-1" }),
                  createTextVNode(" Tambah User ")
                ])
              ]),
              createVNode("div", { class: "table-responsive p-0" }, [
                createVNode("table", { class: "table" }, [
                  createVNode("thead", null, [
                    createVNode("tr", null, [
                      createVNode("th", null, "No"),
                      createVNode("th", null, "Nama"),
                      createVNode("th", null, "Email"),
                      createVNode("th", null, "Role"),
                      createVNode("th", null, "Aksi")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.users.data, (user, index) => {
                      return openBlock(), createBlock("tr", {
                        key: user.id
                      }, [
                        createVNode("td", { class: "w-2" }, toDisplayString(__props.users.from + index), 1),
                        createVNode("td", null, toDisplayString(user.name), 1),
                        createVNode("td", null, toDisplayString(user.email), 1),
                        createVNode("td", { class: "align-middle text-sm" }, [
                          createVNode("span", { class: "badge bg-gradient-primary" }, toDisplayString(user.role), 1)
                        ]),
                        createVNode("td", { class: "align-middle" }, [
                          createVNode("div", {
                            class: "btn-group",
                            role: "group"
                          }, [
                            createVNode("button", {
                              onClick: ($event) => openEditUser(user),
                              class: "btn btn-outline-warning btn-md",
                              title: "Edit User"
                            }, [
                              createVNode("i", { class: "fas fa-edit" })
                            ], 8, ["onClick"]),
                            createVNode("button", {
                              onClick: ($event) => deleteUser(user.id),
                              class: "btn btn-outline-danger btn-md",
                              title: "Hapus User"
                            }, [
                              createVNode("i", { class: "fas fa-trash" })
                            ], 8, ["onClick"])
                          ])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ]),
              createVNode(_sfc_main$4, {
                links: __props.users.links
              }, null, 8, ["links"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Users/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
