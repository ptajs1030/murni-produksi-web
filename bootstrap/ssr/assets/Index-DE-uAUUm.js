import { ref, unref, withCtx, createVNode, createTextVNode, withModifiers, withDirectives, createBlock, createCommentVNode, vModelText, openBlock, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-C4iQtLPH.js";
import { useForm, Head } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: ["settings"],
  setup(__props) {
    const props = __props;
    const form = useForm({
      app_name: props.settings.app_name || "",
      app_logo: null
    });
    const previewUrl = ref(props.settings.app_logo || null);
    const handleLogoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        form.app_logo = file;
        previewUrl.value = URL.createObjectURL(file);
      }
    };
    const removeLogo = () => {
      form.app_logo = null;
      previewUrl.value = null;
    };
    const submitForm = () => {
      form.post(route("settings.update"), {
        forceFormData: true,
        preserveScroll: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Settings" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Pengaturan Aplikasi" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="row"${_scopeId}><div class="col-lg-8"${_scopeId}><div class="card"${_scopeId}><div class="card-header"${_scopeId}><h5 class="mb-0"${_scopeId}><i class="fas fa-cog me-2"${_scopeId}></i> Pengaturan Aplikasi </h5></div><div class="card-body"${_scopeId}><form${_scopeId}><div class="mb-4"${_scopeId}><label for="app_name" class="form-label fw-medium"${_scopeId}> Nama Aplikasi </label><input id="app_name" type="text" class="${ssrRenderClass([{
              "is-invalid": unref(form).errors.app_name
            }, "form-control"])}"${ssrRenderAttr("value", unref(form).app_name)} placeholder="Masukkan nama aplikasi"${_scopeId}>`);
            if (unref(form).errors.app_name) {
              _push2(`<div class="invalid-feedback"${_scopeId}>${ssrInterpolate(unref(form).errors.app_name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="mb-4"${_scopeId}><label class="form-label fw-medium"${_scopeId}> Logo Aplikasi </label>`);
            if (previewUrl.value) {
              _push2(`<div class="mb-3"${_scopeId}><div class="border rounded p-3 d-inline-block bg-light"${_scopeId}><img${ssrRenderAttr("src", previewUrl.value)} alt="Logo Preview" class="img-fluid" style="${ssrRenderStyle({ "max-height": "120px", "max-width": "300px" })}"${_scopeId}></div><div class="mt-2"${_scopeId}><button type="button" class="btn btn-outline-danger btn-sm"${_scopeId}><i class="fas fa-trash me-1"${_scopeId}></i> Hapus Logo </button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<input type="file" class="${ssrRenderClass([{
              "is-invalid": unref(form).errors.app_logo
            }, "form-control"])}" accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"${_scopeId}><div class="form-text"${_scopeId}> Format: JPEG, PNG, GIF, SVG, WebP. Maksimal 2MB. </div>`);
            if (unref(form).errors.app_logo) {
              _push2(`<div class="invalid-feedback"${_scopeId}>${ssrInterpolate(unref(form).errors.app_logo)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="d-flex align-items-center gap-3"${_scopeId}><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span class="spinner-border spinner-border-sm me-1"${_scopeId}></span>`);
            } else {
              _push2(`<i class="fas fa-save me-1"${_scopeId}></i>`);
            }
            _push2(` Simpan Pengaturan </button>`);
            if (unref(form).recentlySuccessful) {
              _push2(`<span class="text-success small"${_scopeId}><i class="fas fa-check me-1"${_scopeId}></i> Tersimpan. </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></form></div></div></div><div class="col-lg-4"${_scopeId}><div class="card"${_scopeId}><div class="card-header"${_scopeId}><h6 class="mb-0"${_scopeId}><i class="fas fa-info-circle me-2"${_scopeId}></i> Informasi </h6></div><div class="card-body"${_scopeId}><p class="text-muted small mb-2"${_scopeId}><strong${_scopeId}>Nama Aplikasi:</strong> Ditampilkan di sidebar dan judul halaman. </p><p class="text-muted small mb-0"${_scopeId}><strong${_scopeId}>Logo:</strong> Ditampilkan di bagian atas sidebar. Gunakan gambar dengan rasio yang sesuai untuk hasil terbaik. </p></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "row" }, [
                createVNode("div", { class: "col-lg-8" }, [
                  createVNode("div", { class: "card" }, [
                    createVNode("div", { class: "card-header" }, [
                      createVNode("h5", { class: "mb-0" }, [
                        createVNode("i", { class: "fas fa-cog me-2" }),
                        createTextVNode(" Pengaturan Aplikasi ")
                      ])
                    ]),
                    createVNode("div", { class: "card-body" }, [
                      createVNode("form", {
                        onSubmit: withModifiers(submitForm, ["prevent"])
                      }, [
                        createVNode("div", { class: "mb-4" }, [
                          createVNode("label", {
                            for: "app_name",
                            class: "form-label fw-medium"
                          }, " Nama Aplikasi "),
                          withDirectives(createVNode("input", {
                            id: "app_name",
                            type: "text",
                            class: ["form-control", {
                              "is-invalid": unref(form).errors.app_name
                            }],
                            "onUpdate:modelValue": ($event) => unref(form).app_name = $event,
                            placeholder: "Masukkan nama aplikasi"
                          }, null, 10, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).app_name]
                          ]),
                          unref(form).errors.app_name ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "invalid-feedback"
                          }, toDisplayString(unref(form).errors.app_name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "mb-4" }, [
                          createVNode("label", { class: "form-label fw-medium" }, " Logo Aplikasi "),
                          previewUrl.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "mb-3"
                          }, [
                            createVNode("div", { class: "border rounded p-3 d-inline-block bg-light" }, [
                              createVNode("img", {
                                src: previewUrl.value,
                                alt: "Logo Preview",
                                class: "img-fluid",
                                style: { "max-height": "120px", "max-width": "300px" }
                              }, null, 8, ["src"])
                            ]),
                            createVNode("div", { class: "mt-2" }, [
                              createVNode("button", {
                                type: "button",
                                class: "btn btn-outline-danger btn-sm",
                                onClick: removeLogo
                              }, [
                                createVNode("i", { class: "fas fa-trash me-1" }),
                                createTextVNode(" Hapus Logo ")
                              ])
                            ])
                          ])) : createCommentVNode("", true),
                          createVNode("input", {
                            type: "file",
                            class: ["form-control", {
                              "is-invalid": unref(form).errors.app_logo
                            }],
                            accept: "image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp",
                            onChange: handleLogoChange
                          }, null, 34),
                          createVNode("div", { class: "form-text" }, " Format: JPEG, PNG, GIF, SVG, WebP. Maksimal 2MB. "),
                          unref(form).errors.app_logo ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "invalid-feedback"
                          }, toDisplayString(unref(form).errors.app_logo), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "d-flex align-items-center gap-3" }, [
                          createVNode("button", {
                            type: "submit",
                            class: "btn btn-primary",
                            disabled: unref(form).processing
                          }, [
                            unref(form).processing ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "spinner-border spinner-border-sm me-1"
                            })) : (openBlock(), createBlock("i", {
                              key: 1,
                              class: "fas fa-save me-1"
                            })),
                            createTextVNode(" Simpan Pengaturan ")
                          ], 8, ["disabled"]),
                          unref(form).recentlySuccessful ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-success small"
                          }, [
                            createVNode("i", { class: "fas fa-check me-1" }),
                            createTextVNode(" Tersimpan. ")
                          ])) : createCommentVNode("", true)
                        ])
                      ], 32)
                    ])
                  ])
                ]),
                createVNode("div", { class: "col-lg-4" }, [
                  createVNode("div", { class: "card" }, [
                    createVNode("div", { class: "card-header" }, [
                      createVNode("h6", { class: "mb-0" }, [
                        createVNode("i", { class: "fas fa-info-circle me-2" }),
                        createTextVNode(" Informasi ")
                      ])
                    ]),
                    createVNode("div", { class: "card-body" }, [
                      createVNode("p", { class: "text-muted small mb-2" }, [
                        createVNode("strong", null, "Nama Aplikasi:"),
                        createTextVNode(" Ditampilkan di sidebar dan judul halaman. ")
                      ]),
                      createVNode("p", { class: "text-muted small mb-0" }, [
                        createVNode("strong", null, "Logo:"),
                        createTextVNode(" Ditampilkan di bagian atas sidebar. Gunakan gambar dengan rasio yang sesuai untuk hasil terbaik. ")
                      ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Settings/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
