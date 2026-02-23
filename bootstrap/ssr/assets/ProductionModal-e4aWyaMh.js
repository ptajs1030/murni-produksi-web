import { getCurrentInstance, ref, watch, computed, mergeProps, withCtx, unref, createBlock, openBlock, createVNode, createTextVNode, withModifiers, createCommentVNode, withDirectives, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$4 } from "./TextInput-BEWjE_Xr.js";
import { f as formatNumberWithCommas } from "./numberFormatter-CCRAY31y.js";
import { useForm } from "@inertiajs/vue3";
import axios from "axios";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ProductionModal",
  __ssrInlineRender: true,
  props: {
    recipes: { type: Array, default: () => [] }
  },
  emits: ["saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { proxy } = getCurrentInstance();
    const show = ref(false);
    const selectedRecipe = ref(null);
    const ingredientsPreview = ref([]);
    const isChecked = ref(false);
    const isLoading = ref(false);
    const form = useForm({
      recipe_id: "",
      quantity: ""
    });
    watch(
      () => [form.recipe_id, form.quantity],
      () => {
        isChecked.value = false;
        ingredientsPreview.value = [];
      }
    );
    const getSelectedRecipe = computed(() => {
      if (!form.recipe_id) return null;
      return props.recipes.find((r) => r.id === parseInt(form.recipe_id));
    });
    const open = () => {
      form.reset();
      selectedRecipe.value = null;
      ingredientsPreview.value = [];
      isChecked.value = false;
      show.value = true;
    };
    const close = () => {
      show.value = false;
      form.reset();
      selectedRecipe.value = null;
      ingredientsPreview.value = [];
      isChecked.value = false;
    };
    const checkIngredients = async () => {
      if (!form.recipe_id || !form.quantity || form.quantity <= 0) {
        proxy.$swal.fire({
          title: "Error!",
          text: "Pilih resep dan masukkan jumlah yang valid",
          icon: "error",
          confirmButtonText: "OK"
        });
        return;
      }
      isLoading.value = true;
      try {
        const response = await axios.get("/production/ingredients", {
          params: { id: form.recipe_id }
        });
        const recipe = response.data;
        if (recipe && recipe.ingredients) {
          const quantity = parseFloat(form.quantity) || 0;
          ingredientsPreview.value = recipe.ingredients.map((ing) => {
            var _a, _b, _c;
            return {
              product_name: ((_a = ing.product) == null ? void 0 : _a.product_name) || "Unknown",
              quantity_per_unit: ing.quantity,
              quantity_needed: ing.quantity * quantity,
              product_id: ing.product_id,
              unit: ((_c = (_b = ing.product) == null ? void 0 : _b.packaging_size) == null ? void 0 : _c.packaging_size_code) || "Pcs",
              stock_available: ing.stock_available ?? 0,
              stock_insufficient: (ing.stock_available ?? 0) < ing.quantity * quantity
            };
          });
          isChecked.value = true;
        }
      } catch (error) {
        proxy.$swal.fire({
          title: "Error!",
          text: "Gagal mengambil data ingredients",
          icon: "error",
          confirmButtonText: "OK"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const submit = () => {
      var _a, _b;
      if (!isChecked.value) {
        proxy.$swal.fire({
          title: "Error!",
          text: "Silakan cek ingredients terlebih dahulu",
          icon: "error",
          confirmButtonText: "OK"
        });
        return;
      }
      const recipeName = ((_b = (_a = getSelectedRecipe.value) == null ? void 0 : _a.product) == null ? void 0 : _b.product_name) || "Produk";
      proxy.$swal.fire({
        title: "Konfirmasi Produksi",
        html: `
                <p>Apakah Anda yakin ingin melakukan produksi?</p>
                <p><strong>Produk:</strong> ${recipeName}</p>
                <p><strong>Jumlah:</strong> ${formatNumberWithCommas(form.quantity)}</p>
            `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Produksi",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {
          form.post("/production", {
            onSuccess: () => {
              proxy.$swal.fire({
                title: "Berhasil!",
                text: "Produksi berhasil dilakukan",
                icon: "success",
                timer: 2e3,
                showConfirmButton: false
              });
              close();
              emit("saved");
            },
            onError: (errors) => {
              let errorMessage = "Gagal melakukan produksi";
              if (errors.error) {
                errorMessage = errors.error;
              }
              proxy.$swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK"
              });
            },
            preserveScroll: true
          });
        }
      });
    };
    const hasStockWarning = computed(
      () => ingredientsPreview.value.some((i) => i.stock_insufficient)
    );
    __expose({ open, close });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        show: show.value,
        onClose: close,
        maxWidth: "xl"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form data-v-62400fc4${_scopeId}><div class="modal-header" data-v-62400fc4${_scopeId}><h5 class="modal-title" data-v-62400fc4${_scopeId}>Menu Produksi</h5><button type="button" class="btn-close" data-v-62400fc4${_scopeId}></button></div><div class="modal-body" style="${ssrRenderStyle({ "max-height": "70vh", "overflow-y": "auto" })}" data-v-62400fc4${_scopeId}><div class="row" data-v-62400fc4${_scopeId}><div class="col-md-5" data-v-62400fc4${_scopeId}><div class="card mb-3" data-v-62400fc4${_scopeId}><div class="card-header bg-primary text-white" data-v-62400fc4${_scopeId}><strong data-v-62400fc4${_scopeId}>Pilih Produk Master</strong></div><div class="card-body" data-v-62400fc4${_scopeId}><div class="mb-3" data-v-62400fc4${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "recipe-select",
              value: "Resep"
            }, null, _parent2, _scopeId));
            _push2(`<select id="recipe-select" class="form-select" required data-v-62400fc4${_scopeId}><option value="" data-v-62400fc4${ssrIncludeBooleanAttr(Array.isArray(unref(form).recipe_id) ? ssrLooseContain(unref(form).recipe_id, "") : ssrLooseEqual(unref(form).recipe_id, "")) ? " selected" : ""}${_scopeId}> -- Pilih Resep -- </option><!--[-->`);
            ssrRenderList(__props.recipes, (recipe) => {
              var _a;
              _push2(`<option${ssrRenderAttr("value", recipe.id)} data-v-62400fc4${ssrIncludeBooleanAttr(Array.isArray(unref(form).recipe_id) ? ssrLooseContain(unref(form).recipe_id, recipe.id) : ssrLooseEqual(unref(form).recipe_id, recipe.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(((_a = recipe.product) == null ? void 0 : _a.product_name) || `Resep #${recipe.id}`)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              message: unref(form).errors.recipe_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3" data-v-62400fc4${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "quantity",
              value: "Jumlah"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "quantity",
              modelValue: unref(form).quantity,
              "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
              type: "number",
              class: "form-control",
              min: "1",
              step: "1",
              placeholder: "Masukkan jumlah",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              message: unref(form).errors.quantity,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="d-grid gap-2" data-v-62400fc4${_scopeId}><button type="button" class="btn btn-warning"${ssrIncludeBooleanAttr(
              isLoading.value || !unref(form).recipe_id || !unref(form).quantity
            ) ? " disabled" : ""} data-v-62400fc4${_scopeId}>`);
            if (isLoading.value) {
              _push2(`<span data-v-62400fc4${_scopeId}><i class="fas fa-spinner fa-spin me-1" data-v-62400fc4${_scopeId}></i> Memuat... </span>`);
            } else {
              _push2(`<span data-v-62400fc4${_scopeId}><i class="fas fa-search me-1" data-v-62400fc4${_scopeId}></i> Cek </span>`);
            }
            _push2(`</button></div></div></div></div><div class="col-md-7" data-v-62400fc4${_scopeId}><div class="card h-100" data-v-62400fc4${_scopeId}><div class="card-header bg-success text-white" data-v-62400fc4${_scopeId}><strong data-v-62400fc4${_scopeId}>Resep/Racikan</strong><small class="d-block" data-v-62400fc4${_scopeId}> Preview produk yang terpakai (otomatis terisi ketika pencet tombol cek) </small></div><div class="card-body" data-v-62400fc4${_scopeId}>`);
            if (ingredientsPreview.value.length === 0) {
              _push2(`<div class="text-center text-muted py-4" data-v-62400fc4${_scopeId}><i class="fas fa-info-circle fa-2x mb-2" data-v-62400fc4${_scopeId}></i><p data-v-62400fc4${_scopeId}> Pilih resep dan jumlah, lalu klik &quot;Cek&quot; untuk melihat ingredients yang diperlukan. </p></div>`);
            } else {
              _push2(`<div data-v-62400fc4${_scopeId}><!--[-->`);
              ssrRenderList(ingredientsPreview.value, (ingredient, index) => {
                _push2(`<div class="row mb-3 align-items-center" data-v-62400fc4${_scopeId}><div class="col-md-6" data-v-62400fc4${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, { value: "Produk" }, null, _parent2, _scopeId));
                _push2(`<div class="form-control bg-light" data-v-62400fc4${_scopeId}>${ssrInterpolate(ingredient.product_name)}</div></div><div class="col-md-4" data-v-62400fc4${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, { value: "Jumlah" }, null, _parent2, _scopeId));
                _push2(`<div class="form-control bg-light" data-v-62400fc4${_scopeId}>${ssrInterpolate(unref(formatNumberWithCommas)(
                  ingredient.quantity_needed
                ))} ${ssrInterpolate(ingredient.unit)}</div></div>`);
                if (ingredient.stock_insufficient) {
                  _push2(`<div class="col-12 mt-1" data-v-62400fc4${_scopeId}><small class="text-danger" data-v-62400fc4${_scopeId}><i class="fas fa-exclamation-triangle me-1" data-v-62400fc4${_scopeId}></i> Stock tidak cukup (tersedia: ${ssrInterpolate(unref(formatNumberWithCommas)(
                    ingredient.stock_available
                  ))} ${ssrInterpolate(ingredient.unit)}) </small></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div></div>`);
            if (isChecked.value) {
              _push2(`<div class="alert alert-info mt-3" role="alert" data-v-62400fc4${_scopeId}><i class="fas fa-info-circle me-2" data-v-62400fc4${_scopeId}></i><strong data-v-62400fc4${_scopeId}>Info:</strong> Produksi ini akan menambah stok produk master dan akan mengurangi stok dari produk resepnya. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="modal-footer" data-v-62400fc4${_scopeId}><button type="button" class="btn btn-secondary me-2" data-v-62400fc4${_scopeId}> Batal </button>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              disabled: unref(form).processing || !isChecked.value || hasStockWarning.value,
              class: "btn btn-success"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(form).processing) {
                    _push3(`<span data-v-62400fc4${_scopeId2}><i class="fas fa-spinner fa-spin me-1" data-v-62400fc4${_scopeId2}></i> Memproses... </span>`);
                  } else {
                    _push3(`<span data-v-62400fc4${_scopeId2}><i class="fas fa-check me-1" data-v-62400fc4${_scopeId2}></i> Submit </span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Memproses... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-check me-1" }),
                      createTextVNode(" Submit ")
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
                  createVNode("h5", { class: "modal-title" }, "Menu Produksi"),
                  createVNode("button", {
                    type: "button",
                    class: "btn-close",
                    onClick: close
                  })
                ]),
                createVNode("div", {
                  class: "modal-body",
                  style: { "max-height": "70vh", "overflow-y": "auto" }
                }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-md-5" }, [
                      createVNode("div", { class: "card mb-3" }, [
                        createVNode("div", { class: "card-header bg-primary text-white" }, [
                          createVNode("strong", null, "Pilih Produk Master")
                        ]),
                        createVNode("div", { class: "card-body" }, [
                          createVNode("div", { class: "mb-3" }, [
                            createVNode(_sfc_main$2, {
                              for: "recipe-select",
                              value: "Resep"
                            }),
                            withDirectives(createVNode("select", {
                              id: "recipe-select",
                              "onUpdate:modelValue": ($event) => unref(form).recipe_id = $event,
                              class: "form-select",
                              required: ""
                            }, [
                              createVNode("option", { value: "" }, " -- Pilih Resep -- "),
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.recipes, (recipe) => {
                                var _a;
                                return openBlock(), createBlock("option", {
                                  key: recipe.id,
                                  value: recipe.id
                                }, toDisplayString(((_a = recipe.product) == null ? void 0 : _a.product_name) || `Resep #${recipe.id}`), 9, ["value"]);
                              }), 128))
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, unref(form).recipe_id]
                            ]),
                            createVNode(_sfc_main$3, {
                              message: unref(form).errors.recipe_id,
                              class: "text-danger mt-1"
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", { class: "mb-3" }, [
                            createVNode(_sfc_main$2, {
                              for: "quantity",
                              value: "Jumlah"
                            }),
                            createVNode(_sfc_main$4, {
                              id: "quantity",
                              modelValue: unref(form).quantity,
                              "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
                              type: "number",
                              class: "form-control",
                              min: "1",
                              step: "1",
                              placeholder: "Masukkan jumlah",
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_sfc_main$3, {
                              message: unref(form).errors.quantity,
                              class: "text-danger mt-1"
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", { class: "d-grid gap-2" }, [
                            createVNode("button", {
                              type: "button",
                              class: "btn btn-warning",
                              onClick: checkIngredients,
                              disabled: isLoading.value || !unref(form).recipe_id || !unref(form).quantity
                            }, [
                              isLoading.value ? (openBlock(), createBlock("span", { key: 0 }, [
                                createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                                createTextVNode(" Memuat... ")
                              ])) : (openBlock(), createBlock("span", { key: 1 }, [
                                createVNode("i", { class: "fas fa-search me-1" }),
                                createTextVNode(" Cek ")
                              ]))
                            ], 8, ["disabled"])
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "col-md-7" }, [
                      createVNode("div", { class: "card h-100" }, [
                        createVNode("div", { class: "card-header bg-success text-white" }, [
                          createVNode("strong", null, "Resep/Racikan"),
                          createVNode("small", { class: "d-block" }, " Preview produk yang terpakai (otomatis terisi ketika pencet tombol cek) ")
                        ]),
                        createVNode("div", { class: "card-body" }, [
                          ingredientsPreview.value.length === 0 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-center text-muted py-4"
                          }, [
                            createVNode("i", { class: "fas fa-info-circle fa-2x mb-2" }),
                            createVNode("p", null, ' Pilih resep dan jumlah, lalu klik "Cek" untuk melihat ingredients yang diperlukan. ')
                          ])) : (openBlock(), createBlock("div", { key: 1 }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(ingredientsPreview.value, (ingredient, index) => {
                              return openBlock(), createBlock("div", {
                                key: index,
                                class: "row mb-3 align-items-center"
                              }, [
                                createVNode("div", { class: "col-md-6" }, [
                                  createVNode(_sfc_main$2, { value: "Produk" }),
                                  createVNode("div", { class: "form-control bg-light" }, toDisplayString(ingredient.product_name), 1)
                                ]),
                                createVNode("div", { class: "col-md-4" }, [
                                  createVNode(_sfc_main$2, { value: "Jumlah" }),
                                  createVNode("div", { class: "form-control bg-light" }, toDisplayString(unref(formatNumberWithCommas)(
                                    ingredient.quantity_needed
                                  )) + " " + toDisplayString(ingredient.unit), 1)
                                ]),
                                ingredient.stock_insufficient ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "col-12 mt-1"
                                }, [
                                  createVNode("small", { class: "text-danger" }, [
                                    createVNode("i", { class: "fas fa-exclamation-triangle me-1" }),
                                    createTextVNode(" Stock tidak cukup (tersedia: " + toDisplayString(unref(formatNumberWithCommas)(
                                      ingredient.stock_available
                                    )) + " " + toDisplayString(ingredient.unit) + ") ", 1)
                                  ])
                                ])) : createCommentVNode("", true)
                              ]);
                            }), 128))
                          ]))
                        ])
                      ])
                    ])
                  ]),
                  isChecked.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "alert alert-info mt-3",
                    role: "alert"
                  }, [
                    createVNode("i", { class: "fas fa-info-circle me-2" }),
                    createVNode("strong", null, "Info:"),
                    createTextVNode(" Produksi ini akan menambah stok produk master dan akan mengurangi stok dari produk resepnya. ")
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "modal-footer" }, [
                  createVNode("button", {
                    type: "button",
                    class: "btn btn-secondary me-2",
                    onClick: close
                  }, " Batal "),
                  createVNode(PrimaryButton, {
                    disabled: unref(form).processing || !isChecked.value || hasStockWarning.value,
                    class: "btn btn-success"
                  }, {
                    default: withCtx(() => [
                      unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                        createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                        createTextVNode(" Memproses... ")
                      ])) : (openBlock(), createBlock("span", { key: 1 }, [
                        createVNode("i", { class: "fas fa-check me-1" }),
                        createTextVNode(" Submit ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Production/ProductionModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductionModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-62400fc4"]]);
export {
  ProductionModal as default
};
