import { getCurrentInstance, ref, computed, watch, mergeProps, withCtx, unref, createBlock, openBlock, createVNode, createTextVNode, withModifiers, toDisplayString, createCommentVNode, Fragment, renderList, withDirectives, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { f as formatNumberWithCommas } from "./numberFormatter-CCRAY31y.js";
import { useForm } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "RepackModal",
  __ssrInlineRender: true,
  props: {
    repackProducts: { type: Array, default: () => [] }
  },
  emits: ["saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { proxy } = getCurrentInstance();
    const show = ref(false);
    const sourceProduct = ref(null);
    const form = useForm({
      source_product_id: "",
      source_quantity: "",
      target_products: []
    });
    const sourceStock = computed(() => {
      var _a, _b;
      if (!((_a = sourceProduct.value) == null ? void 0 : _a.stocks) || sourceProduct.value.stocks.length === 0)
        return 0;
      return ((_b = sourceProduct.value.stocks[0]) == null ? void 0 : _b.packaging_size_input) || 0;
    });
    watch(
      () => show.value,
      (visible) => {
        if (!visible) {
          form.reset();
          sourceProduct.value = null;
        }
      }
    );
    const open = (product) => {
      form.reset();
      sourceProduct.value = product;
      form.source_product_id = product.id;
      form.target_products = [];
      show.value = true;
    };
    const close = () => {
      show.value = false;
      form.reset();
      sourceProduct.value = null;
    };
    const addTargetProduct = () => {
      form.target_products.push({
        product_id: "",
        quantity: ""
      });
    };
    const removeTargetProduct = (index) => {
      form.target_products.splice(index, 1);
    };
    const getAvailableProducts = (currentIndex) => {
      const selectedIds = form.target_products.filter((_, idx) => idx !== currentIndex).map((p) => p.product_id).filter((id) => id);
      return props.repackProducts.filter((p) => !selectedIds.includes(p.id));
    };
    const submit = () => {
      var _a;
      if (form.target_products.length === 0) {
        proxy.$swal.fire({
          title: "Error!",
          text: "Tambahkan minimal 1 produk hasil repack",
          icon: "error",
          confirmButtonText: "OK"
        });
        return;
      }
      const invalidProducts = form.target_products.filter(
        (p) => !p.product_id || !p.quantity || p.quantity <= 0
      );
      if (invalidProducts.length > 0) {
        proxy.$swal.fire({
          title: "Error!",
          text: "Semua produk hasil repack harus memiliki produk dan jumlah yang valid",
          icon: "error",
          confirmButtonText: "OK"
        });
        return;
      }
      proxy.$swal.fire({
        title: "Konfirmasi Repack",
        html: `
                <p>Apakah Anda yakin ingin melakukan repack?</p>
                <p><strong>Produk sumber:</strong> ${(_a = sourceProduct.value) == null ? void 0 : _a.product_name}</p>
                <p><strong>Jumlah:</strong> ${formatNumberWithCommas(form.source_quantity)}</p>
            `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Repack",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {
          form.post("/repack", {
            onSuccess: () => {
              proxy.$swal.fire({
                title: "Berhasil!",
                text: "Repack berhasil dilakukan",
                icon: "success",
                timer: 2e3,
                showConfirmButton: false
              });
              close();
              emit("saved");
            },
            onError: (errors) => {
              let errorMessage = "Gagal melakukan repack";
              if (errors.error) {
                errorMessage = errors.error;
              } else if (errors.source_quantity) {
                errorMessage = errors.source_quantity;
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
    __expose({ open, close });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        show: show.value,
        onClose: close,
        maxWidth: "xl"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<form data-v-42c1b432${_scopeId}><div class="modal-header" data-v-42c1b432${_scopeId}><h5 class="modal-title" data-v-42c1b432${_scopeId}>Repack Produk</h5><button type="button" class="btn-close" data-v-42c1b432${_scopeId}></button></div><div class="modal-body" data-v-42c1b432${_scopeId}><div class="card mb-4" data-v-42c1b432${_scopeId}><div class="card-header bg-primary text-white" data-v-42c1b432${_scopeId}><strong data-v-42c1b432${_scopeId}>Produk Sumber (Bahan Baku)</strong></div><div class="card-body" data-v-42c1b432${_scopeId}><div class="row" data-v-42c1b432${_scopeId}><div class="col-md-6" data-v-42c1b432${_scopeId}><p class="mb-1" data-v-42c1b432${_scopeId}><strong data-v-42c1b432${_scopeId}>SKU:</strong> ${ssrInterpolate(((_a = sourceProduct.value) == null ? void 0 : _a.product_unit_sku) || "-")}</p><p class="mb-1" data-v-42c1b432${_scopeId}><strong data-v-42c1b432${_scopeId}>Nama:</strong> ${ssrInterpolate(((_b = sourceProduct.value) == null ? void 0 : _b.product_name) || "-")}</p><p class="mb-0" data-v-42c1b432${_scopeId}><strong data-v-42c1b432${_scopeId}>Stock Tersedia:</strong><span class="badge bg-info" data-v-42c1b432${_scopeId}>${ssrInterpolate(unref(formatNumberWithCommas)(sourceStock.value))}</span></p></div><div class="col-md-6" data-v-42c1b432${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "source-quantity",
              value: "Jumlah yang akan di-Repack"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "source-quantity",
              modelValue: unref(form).source_quantity,
              "onUpdate:modelValue": ($event) => unref(form).source_quantity = $event,
              type: "number",
              class: "form-control",
              min: "1",
              max: sourceStock.value,
              step: "1",
              placeholder: "Masukkan jumlah",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.source_quantity,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div></div><div class="card" data-v-42c1b432${_scopeId}><div class="card-header bg-success text-white d-flex justify-content-between align-items-center" data-v-42c1b432${_scopeId}><strong data-v-42c1b432${_scopeId}>Produk Hasil Repack</strong><button type="button" class="btn btn-light btn-sm" data-v-42c1b432${_scopeId}><i class="fas fa-plus me-1" data-v-42c1b432${_scopeId}></i> Tambah Produk </button></div><div class="card-body" data-v-42c1b432${_scopeId}>`);
            if (unref(form).target_products.length === 0) {
              _push2(`<div class="text-center text-muted py-3" data-v-42c1b432${_scopeId}><p data-v-42c1b432${_scopeId}>Belum ada produk hasil repack.</p><button type="button" class="btn btn-outline-success" data-v-42c1b432${_scopeId}><i class="fas fa-plus me-1" data-v-42c1b432${_scopeId}></i> Tambah Produk Repack </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(unref(form).target_products, (target, index) => {
              _push2(`<div class="row mb-3 align-items-end" data-v-42c1b432${_scopeId}><div class="col-md-6" data-v-42c1b432${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                for: `target-product-${index}`,
                value: "Pilih Produk"
              }, null, _parent2, _scopeId));
              _push2(`<select${ssrRenderAttr("id", `target-product-${index}`)} class="form-select" required data-v-42c1b432${_scopeId}><option value="" data-v-42c1b432${ssrIncludeBooleanAttr(Array.isArray(target.product_id) ? ssrLooseContain(target.product_id, "") : ssrLooseEqual(target.product_id, "")) ? " selected" : ""}${_scopeId}>-- Pilih Produk --</option><!--[-->`);
              ssrRenderList(getAvailableProducts(index), (p) => {
                _push2(`<option${ssrRenderAttr("value", p.id)} data-v-42c1b432${ssrIncludeBooleanAttr(Array.isArray(target.product_id) ? ssrLooseContain(target.product_id, p.id) : ssrLooseEqual(target.product_id, p.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(p.product_unit_sku)} - ${ssrInterpolate(p.product_name)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="col-md-4" data-v-42c1b432${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                for: `target-quantity-${index}`,
                value: "Jumlah"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$3, {
                id: `target-quantity-${index}`,
                modelValue: target.quantity,
                "onUpdate:modelValue": ($event) => target.quantity = $event,
                type: "number",
                class: "form-control",
                min: "1",
                step: "1",
                placeholder: "Jumlah",
                required: ""
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="col-md-2" data-v-42c1b432${_scopeId}><button type="button" class="btn btn-outline-danger" title="Hapus" data-v-42c1b432${_scopeId}><i class="fas fa-trash" data-v-42c1b432${_scopeId}></i></button></div></div>`);
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.target_products,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="modal-footer" data-v-42c1b432${_scopeId}><button type="button" class="btn btn-secondary me-2" data-v-42c1b432${_scopeId}> Batal </button>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              disabled: unref(form).processing || unref(form).target_products.length === 0,
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(form).processing) {
                    _push3(`<span data-v-42c1b432${_scopeId2}><i class="fas fa-spinner fa-spin me-1" data-v-42c1b432${_scopeId2}></i> Memproses... </span>`);
                  } else {
                    _push3(`<span data-v-42c1b432${_scopeId2}><i class="fas fa-box-open me-1" data-v-42c1b432${_scopeId2}></i> Proses Repack </span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Memproses... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-box-open me-1" }),
                      createTextVNode(" Proses Repack ")
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
                  createVNode("h5", { class: "modal-title" }, "Repack Produk"),
                  createVNode("button", {
                    type: "button",
                    class: "btn-close",
                    onClick: close
                  })
                ]),
                createVNode("div", { class: "modal-body" }, [
                  createVNode("div", { class: "card mb-4" }, [
                    createVNode("div", { class: "card-header bg-primary text-white" }, [
                      createVNode("strong", null, "Produk Sumber (Bahan Baku)")
                    ]),
                    createVNode("div", { class: "card-body" }, [
                      createVNode("div", { class: "row" }, [
                        createVNode("div", { class: "col-md-6" }, [
                          createVNode("p", { class: "mb-1" }, [
                            createVNode("strong", null, "SKU:"),
                            createTextVNode(" " + toDisplayString(((_c = sourceProduct.value) == null ? void 0 : _c.product_unit_sku) || "-"), 1)
                          ]),
                          createVNode("p", { class: "mb-1" }, [
                            createVNode("strong", null, "Nama:"),
                            createTextVNode(" " + toDisplayString(((_d = sourceProduct.value) == null ? void 0 : _d.product_name) || "-"), 1)
                          ]),
                          createVNode("p", { class: "mb-0" }, [
                            createVNode("strong", null, "Stock Tersedia:"),
                            createVNode("span", { class: "badge bg-info" }, toDisplayString(unref(formatNumberWithCommas)(sourceStock.value)), 1)
                          ])
                        ]),
                        createVNode("div", { class: "col-md-6" }, [
                          createVNode(_sfc_main$2, {
                            for: "source-quantity",
                            value: "Jumlah yang akan di-Repack"
                          }),
                          createVNode(_sfc_main$3, {
                            id: "source-quantity",
                            modelValue: unref(form).source_quantity,
                            "onUpdate:modelValue": ($event) => unref(form).source_quantity = $event,
                            type: "number",
                            class: "form-control",
                            min: "1",
                            max: sourceStock.value,
                            step: "1",
                            placeholder: "Masukkan jumlah",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "max"]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.source_quantity,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "card" }, [
                    createVNode("div", { class: "card-header bg-success text-white d-flex justify-content-between align-items-center" }, [
                      createVNode("strong", null, "Produk Hasil Repack"),
                      createVNode("button", {
                        type: "button",
                        class: "btn btn-light btn-sm",
                        onClick: addTargetProduct
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Produk ")
                      ])
                    ]),
                    createVNode("div", { class: "card-body" }, [
                      unref(form).target_products.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-center text-muted py-3"
                      }, [
                        createVNode("p", null, "Belum ada produk hasil repack."),
                        createVNode("button", {
                          type: "button",
                          class: "btn btn-outline-success",
                          onClick: addTargetProduct
                        }, [
                          createVNode("i", { class: "fas fa-plus me-1" }),
                          createTextVNode(" Tambah Produk Repack ")
                        ])
                      ])) : createCommentVNode("", true),
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(form).target_products, (target, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: "row mb-3 align-items-end"
                        }, [
                          createVNode("div", { class: "col-md-6" }, [
                            createVNode(_sfc_main$2, {
                              for: `target-product-${index}`,
                              value: "Pilih Produk"
                            }, null, 8, ["for"]),
                            withDirectives(createVNode("select", {
                              id: `target-product-${index}`,
                              "onUpdate:modelValue": ($event) => target.product_id = $event,
                              class: "form-select",
                              required: ""
                            }, [
                              createVNode("option", { value: "" }, "-- Pilih Produk --"),
                              (openBlock(true), createBlock(Fragment, null, renderList(getAvailableProducts(index), (p) => {
                                return openBlock(), createBlock("option", {
                                  key: p.id,
                                  value: p.id
                                }, toDisplayString(p.product_unit_sku) + " - " + toDisplayString(p.product_name), 9, ["value"]);
                              }), 128))
                            ], 8, ["id", "onUpdate:modelValue"]), [
                              [vModelSelect, target.product_id]
                            ])
                          ]),
                          createVNode("div", { class: "col-md-4" }, [
                            createVNode(_sfc_main$2, {
                              for: `target-quantity-${index}`,
                              value: "Jumlah"
                            }, null, 8, ["for"]),
                            createVNode(_sfc_main$3, {
                              id: `target-quantity-${index}`,
                              modelValue: target.quantity,
                              "onUpdate:modelValue": ($event) => target.quantity = $event,
                              type: "number",
                              class: "form-control",
                              min: "1",
                              step: "1",
                              placeholder: "Jumlah",
                              required: ""
                            }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "col-md-2" }, [
                            createVNode("button", {
                              type: "button",
                              class: "btn btn-outline-danger",
                              onClick: ($event) => removeTargetProduct(index),
                              title: "Hapus"
                            }, [
                              createVNode("i", { class: "fas fa-trash" })
                            ], 8, ["onClick"])
                          ])
                        ]);
                      }), 128)),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.target_products,
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
                    disabled: unref(form).processing || unref(form).target_products.length === 0,
                    class: "btn btn-primary"
                  }, {
                    default: withCtx(() => [
                      unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                        createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                        createTextVNode(" Memproses... ")
                      ])) : (openBlock(), createBlock("span", { key: 1 }, [
                        createVNode("i", { class: "fas fa-box-open me-1" }),
                        createTextVNode(" Proses Repack ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Repack/RepackModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RepackModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-42c1b432"]]);
export {
  RepackModal as default
};
