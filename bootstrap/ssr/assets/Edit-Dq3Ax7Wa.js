import { ref, unref, withCtx, createBlock, openBlock, createVNode, createTextVNode, withModifiers, withDirectives, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-CJQU9ReZ.js";
import _sfc_main$4 from "./IngredientModal-CPVP5ipK.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./TextInput-BEWjE_Xr.js";
import "./Modal-DBd8rNSf.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    recipe: Object,
    products: Array
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      product_id: props.recipe.product_id,
      ingredients: [...props.recipe.ingredients]
    });
    const showIngredientModal = ref(false);
    const isEditIngredient = ref(false);
    const editIndex = ref(null);
    const editingIngredient = ref(null);
    const openAddModal = () => {
      isEditIngredient.value = false;
      editIndex.value = null;
      editingIngredient.value = null;
      showIngredientModal.value = true;
    };
    const openEditModal = (ingredient, index) => {
      isEditIngredient.value = true;
      editIndex.value = index;
      editingIngredient.value = { ...ingredient };
      showIngredientModal.value = true;
    };
    const saveIngredient = ({ product_id, quantity }) => {
      const product = props.products.find((p) => p.id === product_id);
      if (!product) return;
      if (isEditIngredient.value) {
        form.ingredients[editIndex.value] = {
          product_id: product.id,
          product_name: product.product_name,
          quantity
        };
      } else {
        const exists = form.ingredients.some((i) => i.product_id === product.id);
        if (exists) {
          alert("Bahan sudah ada");
          return;
        }
        form.ingredients.push({
          product_id: product.id,
          product_name: product.product_name,
          quantity
        });
      }
      showIngredientModal.value = false;
    };
    const removeIngredient = (index) => {
      form.ingredients.splice(index, 1);
    };
    const submit = () => {
      form.put(route("recipes.update", props.recipe.id));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Edit Resep" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Edit Resep" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex flex-wrap align-items-center justify-content-between gap-2"${_scopeId}><h2 class="mb-0 h5 text-dark fw-bold"${_scopeId}>Edit Resep</h2>`);
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
                createVNode("h2", { class: "mb-0 h5 text-dark fw-bold" }, "Edit Resep"),
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
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="card border-0 shadow-sm"${_scopeId}><div class="card-body p-4"${_scopeId}><form${_scopeId}><div class="mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_id",
              value: "Produk Hasil"
            }, null, _parent2, _scopeId));
            _push2(`<select id="product_id" class="form-select"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_id) ? ssrLooseContain(unref(form).product_id, "") : ssrLooseEqual(unref(form).product_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Produk --</option><!--[-->`);
            ssrRenderList(__props.products, (p) => {
              _push2(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_id) ? ssrLooseContain(unref(form).product_id, p.id) : ssrLooseEqual(unref(form).product_id, p.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(p.product_name)}</option>`);
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
                _push2(`<li class="list-group-item d-flex justify-content-between align-items-center"${_scopeId}><div${_scopeId}><strong${_scopeId}>${ssrInterpolate(ingredient.product_name)}</strong><div class="text-muted small"${_scopeId}> Qty: ${ssrInterpolate(ingredient.quantity)}</div></div><div class="btn-group btn-group-sm"${_scopeId}><button type="button" class="btn btn-outline-warning" title="Edit"${_scopeId}><i class="fas fa-edit"${_scopeId}></i></button><button type="button" class="btn btn-outline-danger" title="Hapus"${_scopeId}><i class="fas fa-trash"${_scopeId}></i></button></div></li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<div class="text-muted fst-italic py-3"${_scopeId}> Belum ada bahan. </div>`);
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
                    _push3(`<span${_scopeId2}><i class="fas fa-save me-1"${_scopeId2}></i> Update Resep </span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Menyimpan... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-save me-1" }),
                      createTextVNode(" Update Resep ")
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
              "initial-product-id": ((_a = editingIngredient.value) == null ? void 0 : _a.product_id) ?? "",
              "initial-quantity": ((_b = editingIngredient.value) == null ? void 0 : _b.quantity) ?? "",
              "is-edit": isEditIngredient.value,
              onClose: ($event) => showIngredientModal.value = false,
              onSubmit: saveIngredient
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
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.products, (p) => {
                          return openBlock(), createBlock("option", {
                            key: p.id,
                            value: p.id
                          }, toDisplayString(p.product_name), 9, ["value"]);
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
                          onClick: openAddModal
                        }, [
                          createVNode("i", { class: "fas fa-plus me-1" }),
                          createTextVNode(" Tambah Bahan ")
                        ])
                      ]),
                      unref(form).ingredients.length ? (openBlock(), createBlock("ul", {
                        key: 0,
                        class: "list-group list-group-flush rounded"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(form).ingredients, (ingredient, index) => {
                          return openBlock(), createBlock("li", {
                            key: `${ingredient.product_id}-${index}`,
                            class: "list-group-item d-flex justify-content-between align-items-center"
                          }, [
                            createVNode("div", null, [
                              createVNode("strong", null, toDisplayString(ingredient.product_name), 1),
                              createVNode("div", { class: "text-muted small" }, " Qty: " + toDisplayString(ingredient.quantity), 1)
                            ]),
                            createVNode("div", { class: "btn-group btn-group-sm" }, [
                              createVNode("button", {
                                type: "button",
                                class: "btn btn-outline-warning",
                                title: "Edit",
                                onClick: ($event) => openEditModal(ingredient, index)
                              }, [
                                createVNode("i", { class: "fas fa-edit" })
                              ], 8, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: "btn btn-outline-danger",
                                title: "Hapus",
                                onClick: ($event) => removeIngredient(index)
                              }, [
                                createVNode("i", { class: "fas fa-trash" })
                              ], 8, ["onClick"])
                            ])
                          ]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-muted fst-italic py-3"
                      }, " Belum ada bahan. ")),
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
                            createTextVNode(" Update Resep ")
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
                "initial-product-id": ((_c = editingIngredient.value) == null ? void 0 : _c.product_id) ?? "",
                "initial-quantity": ((_d = editingIngredient.value) == null ? void 0 : _d.quantity) ?? "",
                "is-edit": isEditIngredient.value,
                onClose: ($event) => showIngredientModal.value = false,
                onSubmit: saveIngredient
              }, null, 8, ["show", "products", "initial-product-id", "initial-quantity", "is-edit", "onClose"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreRecipe/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
