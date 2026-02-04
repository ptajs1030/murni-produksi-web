import { ref, unref, withCtx, createBlock, openBlock, createVNode, createTextVNode, withModifiers, withDirectives, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-Be2dic9H.js";
import _sfc_main$4 from "./IngredientModal-CPVP5ipK.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./TextInput-BEWjE_Xr.js";
import "./Modal-DBd8rNSf.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    products: Array
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      product_id: "",
      ingredients: []
    });
    const showIngredientModal = ref(false);
    const addIngredient = ({ product_id, quantity }) => {
      const product = props.products.find((p) => p.id === product_id);
      if (!product) return;
      const exists = form.ingredients.some((i) => i.product_id === product.id);
      if (exists) {
        alert("Bahan sudah ditambahkan");
        return;
      }
      form.ingredients.push({
        product_id: product.id,
        product_name: product.product_name,
        quantity
      });
      showIngredientModal.value = false;
    };
    const removeIngredient = (index) => {
      form.ingredients.splice(index, 1);
    };
    const submit = () => {
      form.post(route("recipes.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Tambah Resep" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Tambah Resep" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex flex-wrap align-items-center justify-content-between gap-2"${_scopeId}><h2 class="mb-0 h5 text-dark fw-bold"${_scopeId}>Tambah Resep</h2>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("recipes.index"),
              class: "btn btn-sm btn-outline-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="fas fa-arrow-left me-1"${_scopeId2}></i> Kembali `);
                } else {
                  return [
                    createVNode("i", { class: "fas fa-arrow-left me-1" }),
                    createTextVNode(" Kembali ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex flex-wrap align-items-center justify-content-between gap-2" }, [
                createVNode("h2", { class: "mb-0 h5 text-dark fw-bold" }, "Tambah Resep"),
                createVNode(unref(Link), {
                  href: _ctx.route("recipes.index"),
                  class: "btn btn-sm btn-outline-secondary"
                }, {
                  default: withCtx(() => [
                    createVNode("i", { class: "fas fa-arrow-left me-1" }),
                    createTextVNode(" Kembali ")
                  ]),
                  _: 1
                }, 8, ["href"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card border-0 shadow-sm"${_scopeId}><div class="card-body p-4"${_scopeId}><form${_scopeId}><div class="mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_id",
              value: "Produk Hasil"
            }, null, _parent2, _scopeId));
            _push2(`<select id="product_id" class="form-select"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_id) ? ssrLooseContain(unref(form).product_id, "") : ssrLooseEqual(unref(form).product_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Produk --</option><!--[-->`);
            ssrRenderList(__props.products, (product) => {
              _push2(`<option${ssrRenderAttr("value", product.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_id) ? ssrLooseContain(unref(form).product_id, product.id) : ssrLooseEqual(unref(form).product_id, product.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(product.product_name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: "mt-1",
              message: unref(form).errors.product_id
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, { value: "Bahan-bahan" }, null, _parent2, _scopeId));
            _push2(`<div class="d-flex flex-wrap gap-2 align-items-center mb-2"${_scopeId}><button type="button" class="btn btn-outline-primary btn-sm"${_scopeId}><i class="fas fa-plus me-1"${_scopeId}></i> Tambah Bahan </button></div>`);
            if (unref(form).ingredients.length) {
              _push2(`<ul class="list-group list-group-flush rounded"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).ingredients, (ingredient, index) => {
                _push2(`<li class="list-group-item d-flex justify-content-between align-items-center"${_scopeId}><div${_scopeId}><strong${_scopeId}>${ssrInterpolate(ingredient.product_name)}</strong><div class="text-muted small"${_scopeId}> Qty: ${ssrInterpolate(ingredient.quantity)}</div></div><button type="button" class="btn btn-sm btn-outline-danger"${_scopeId}><i class="fas fa-trash"${_scopeId}></i></button></li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<div class="text-muted fst-italic py-3"${_scopeId}> Belum ada bahan ditambahkan. </div>`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              class: "mt-1",
              message: unref(form).errors.ingredients
            }, null, _parent2, _scopeId));
            _push2(`</div><hr class="my-4"${_scopeId}><div class="d-flex flex-wrap gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              disabled: unref(form).processing,
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(form).processing) {
                    _push3(`<span${_scopeId2}><i class="fas fa-spinner fa-spin me-1"${_scopeId2}></i> Menyimpan... </span>`);
                  } else {
                    _push3(`<span${_scopeId2}><i class="fas fa-save me-1"${_scopeId2}></i> Simpan Resep </span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Menyimpan... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-save me-1" }),
                      createTextVNode(" Simpan Resep ")
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("recipes.index"),
              class: "btn btn-outline-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="fas fa-times me-1"${_scopeId2}></i> Batal `);
                } else {
                  return [
                    createVNode("i", { class: "fas fa-times me-1" }),
                    createTextVNode(" Batal ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              show: showIngredientModal.value,
              products: __props.products,
              onClose: ($event) => showIngredientModal.value = false,
              onSubmit: addIngredient
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "card border-0 shadow-sm" }, [
                createVNode("div", { class: "card-body p-4" }, [
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "mb-4" }, [
                      createVNode(_sfc_main$2, {
                        for: "product_id",
                        value: "Produk Hasil"
                      }),
                      withDirectives(createVNode("select", {
                        id: "product_id",
                        "onUpdate:modelValue": ($event) => unref(form).product_id = $event,
                        class: "form-select"
                      }, [
                        createVNode("option", { value: "" }, "-- Pilih Produk --"),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.products, (product) => {
                          return openBlock(), createBlock("option", {
                            key: product.id,
                            value: product.id
                          }, toDisplayString(product.product_name), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).product_id]
                      ]),
                      createVNode(_sfc_main$3, {
                        class: "mt-1",
                        message: unref(form).errors.product_id
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode(_sfc_main$2, { value: "Bahan-bahan" }),
                      createVNode("div", { class: "d-flex flex-wrap gap-2 align-items-center mb-2" }, [
                        createVNode("button", {
                          type: "button",
                          class: "btn btn-outline-primary btn-sm",
                          onClick: ($event) => showIngredientModal.value = true
                        }, [
                          createVNode("i", { class: "fas fa-plus me-1" }),
                          createTextVNode(" Tambah Bahan ")
                        ], 8, ["onClick"])
                      ]),
                      unref(form).ingredients.length ? (openBlock(), createBlock("ul", {
                        key: 0,
                        class: "list-group list-group-flush rounded"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(form).ingredients, (ingredient, index) => {
                          return openBlock(), createBlock("li", {
                            key: ingredient.product_id,
                            class: "list-group-item d-flex justify-content-between align-items-center"
                          }, [
                            createVNode("div", null, [
                              createVNode("strong", null, toDisplayString(ingredient.product_name), 1),
                              createVNode("div", { class: "text-muted small" }, " Qty: " + toDisplayString(ingredient.quantity), 1)
                            ]),
                            createVNode("button", {
                              type: "button",
                              class: "btn btn-sm btn-outline-danger",
                              onClick: ($event) => removeIngredient(index)
                            }, [
                              createVNode("i", { class: "fas fa-trash" })
                            ], 8, ["onClick"])
                          ]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-muted fst-italic py-3"
                      }, " Belum ada bahan ditambahkan. ")),
                      createVNode(_sfc_main$3, {
                        class: "mt-1",
                        message: unref(form).errors.ingredients
                      }, null, 8, ["message"])
                    ]),
                    createVNode("hr", { class: "my-4" }),
                    createVNode("div", { class: "d-flex flex-wrap gap-2" }, [
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
                            createTextVNode(" Simpan Resep ")
                          ]))
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(unref(Link), {
                        href: _ctx.route("recipes.index"),
                        class: "btn btn-outline-secondary"
                      }, {
                        default: withCtx(() => [
                          createVNode("i", { class: "fas fa-times me-1" }),
                          createTextVNode(" Batal ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ], 32)
                ])
              ]),
              createVNode(_sfc_main$4, {
                show: showIngredientModal.value,
                products: __props.products,
                onClose: ($event) => showIngredientModal.value = false,
                onSubmit: addIngredient
              }, null, 8, ["show", "products", "onClose"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreRecipe/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
