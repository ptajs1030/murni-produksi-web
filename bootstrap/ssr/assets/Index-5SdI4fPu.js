import { ref, getCurrentInstance, computed, watch, unref, withCtx, createVNode, createTextVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$2 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-BBZT1pjc.js";
import { f as formatNumberWithCommas } from "./numberFormatter-CCRAY31y.js";
import { usePage, router, Head, Link } from "@inertiajs/vue3";
import { debounce } from "lodash";
import _sfc_main$4 from "./StockOpnameProductModal-BfMZLbnh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
import "./InputError-C5ky-J1T.js";
import "./InputLabel-Dkex7vHI.js";
import "./Modal-DBd8rNSf.js";
import "./PrimaryButton-CIooT64n.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: [
    "stockOpname",
    "stockOpnameProducts",
    "availableProducts",
    "filters"
  ],
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search || "");
    const { proxy } = getCurrentInstance();
    const page = usePage();
    const productModal = ref(null);
    const isOwner = computed(() => {
      var _a, _b;
      return ((_b = (_a = page.props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.role) === "owner";
    });
    const isSubmitted = computed(() => {
      var _a;
      return ((_a = props.stockOpname) == null ? void 0 : _a.is_submitted) === true;
    });
    watch(
      search,
      debounce((value) => {
        router.get(
          `/stock-opnames/${props.stockOpname.id}/products`,
          { search: value },
          {
            preserveState: true,
            replace: true
          }
        );
      }, 300)
    );
    const getRowNumber = (index) => {
      const currentPage = props.stockOpnameProducts.current_page || 1;
      const perPage = props.stockOpnameProducts.per_page || 10;
      return (currentPage - 1) * perPage + index + 1;
    };
    const hasStockDiscrepancy = (product) => {
      var _a;
      const systemStock = ((_a = product.stock) == null ? void 0 : _a.packaging_size_input) || 0;
      const realQuantity = product.real_quantity || 0;
      return systemStock !== realQuantity;
    };
    const getStockDifference = (product) => {
      var _a;
      const systemStock = ((_a = product.stock) == null ? void 0 : _a.packaging_size_input) || 0;
      const realQuantity = product.real_quantity || 0;
      return realQuantity - systemStock;
    };
    const openAddModal = () => {
      var _a;
      (_a = productModal.value) == null ? void 0 : _a.open();
    };
    const deleteProduct = (product) => {
      var _a;
      proxy.$swal.fire({
        title: "Hapus Product?",
        text: `Apakah Anda yakin ingin menghapus ${((_a = product.product) == null ? void 0 : _a.product_name) || "product ini"} dari stock opname?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {
          router.delete(
            `/stock-opnames/${props.stockOpname.id}/products/${product.product_id}`,
            {
              onSuccess: () => {
                proxy.$swal.fire({
                  title: "Berhasil!",
                  text: "Product berhasil dihapus dari stock opname",
                  icon: "success",
                  timer: 2e3,
                  showConfirmButton: false
                });
              },
              onError: (errors) => {
                proxy.$swal.fire({
                  title: "Error!",
                  text: errors.error || "Gagal menghapus product",
                  icon: "error",
                  confirmButtonText: "OK"
                });
              }
            }
          );
        }
      });
    };
    const submitStockOpname = () => {
      proxy.$swal.fire({
        title: "Submit Stock Opname?",
        html: `
                <p>Apakah Anda yakin ingin submit stock opname ini?</p>
                <p class="text-danger mt-2"><strong>Perhatian:</strong> Setelah submit, Anda tidak dapat menambah, mengedit, atau menghapus product dari stock opname ini.</p>
            `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Submit",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {
          router.post(
            `/stock-opnames/${props.stockOpname.id}/submit`,
            {},
            {
              onSuccess: () => {
                proxy.$swal.fire({
                  title: "Berhasil!",
                  text: "Stock opname berhasil disubmit",
                  icon: "success",
                  timer: 2e3,
                  showConfirmButton: false
                });
              },
              onError: (errors) => {
                proxy.$swal.fire({
                  title: "Error!",
                  text: errors.error || "Gagal submit stock opname",
                  icon: "error",
                  confirmButtonText: "OK"
                });
              }
            }
          );
        }
      });
    };
    const ownerAction = (product, action) => {
      const actionText = action === "update_stock" ? "Update Stock ke System" : "Abaikan Perbedaan";
      const confirmText = action === "update_stock" ? "Stock di system akan diupdate sesuai input admin. Apakah Anda yakin?" : "Perbedaan stock akan diabaikan. Apakah Anda yakin?";
      proxy.$swal.fire({
        title: actionText,
        text: confirmText,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: action === "update_stock" ? "#28a745" : "#ffc107",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Lanjutkan",
        cancelButtonText: "Batal"
      }).then((result) => {
        if (result.isConfirmed) {
          router.put(
            `/stock-opnames/${props.stockOpname.id}/products/${product.product_id}/owner-action`,
            { action },
            {
              onSuccess: () => {
                proxy.$swal.fire({
                  title: "Berhasil!",
                  text: action === "update_stock" ? "Stock berhasil diupdate sesuai input admin" : "Perbedaan stock berhasil diabaikan",
                  icon: "success",
                  timer: 2e3,
                  showConfirmButton: false
                });
              },
              onError: (errors) => {
                proxy.$swal.fire({
                  title: "Error!",
                  text: errors.error || "Gagal memproses aksi",
                  icon: "error",
                  confirmButtonText: "OK"
                });
              }
            }
          );
        }
      });
    };
    const getStatusBadge = (status) => {
      switch (status) {
        case "APPROVED":
          return { class: "badge bg-success", text: "Approved" };
        case "REJECTED":
          return { class: "badge bg-secondary", text: "Diabaikan" };
        case "PENDING":
        default:
          return { class: "badge bg-warning text-dark", text: "Pending" };
      }
    };
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("id-ID");
    };
    const truncateText = (text, maxLength = 50) => {
      if (!text) return "-";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };
    const showFullNote = (title, note) => {
      proxy.$swal.fire({
        title,
        text: note,
        icon: "info",
        confirmButtonText: "Close"
      });
    };
    const exportExcel = () => {
      const params = {};
      if (search.value) {
        params.search = search.value;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const existingSort = urlParams.get("sort");
      if (existingSort) {
        params.sort = existingSort;
      }
      const queryString = new URLSearchParams(params).toString();
      window.location.href = route("stock-opnames.products.export", props.stockOpname.id) + (queryString ? "?" + queryString : "");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Stock Opname Products" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Stock Opname Products" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg" data-v-4ef2a283${_scopeId}><div class="p-3 text-gray-900" data-v-4ef2a283${_scopeId}><div class="${ssrRenderClass([isSubmitted.value ? "alert-success" : "alert-info", "alert mb-3"])}" data-v-4ef2a283${_scopeId}><div class="d-flex justify-content-between align-items-center" data-v-4ef2a283${_scopeId}><div data-v-4ef2a283${_scopeId}><strong data-v-4ef2a283${_scopeId}>Stock Opname:</strong> #${ssrInterpolate(__props.stockOpname.id)} | <strong data-v-4ef2a283${_scopeId}>Tanggal:</strong> ${ssrInterpolate(formatDate(__props.stockOpname.date_request))} | <strong data-v-4ef2a283${_scopeId}>Status:</strong><span class="${ssrRenderClass(
              isSubmitted.value ? "badge bg-success" : "badge bg-warning text-dark"
            )}" data-v-4ef2a283${_scopeId}>${ssrInterpolate(isSubmitted.value ? "Submitted" : "Draft")}</span></div></div></div><div class="d-flex justify-content-between align-items-center mb-3" data-v-4ef2a283${_scopeId}><div class="d-flex align-items-center gap-3" data-v-4ef2a283${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "search",
              modelValue: search.value,
              "onUpdate:modelValue": ($event) => search.value = $event,
              type: "text",
              class: "form-control",
              placeholder: "Search products...",
              style: { "width": "300px" }
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="d-flex gap-2" data-v-4ef2a283${_scopeId}>`);
            if (!isSubmitted.value) {
              _push2(`<button class="btn btn-primary" data-v-4ef2a283${_scopeId}><i class="fas fa-plus me-1" data-v-4ef2a283${_scopeId}></i> Tambah Product </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button class="btn btn-success" data-v-4ef2a283${_scopeId}><i class="fas fa-file-excel me-2" data-v-4ef2a283${_scopeId}></i> Export Excel </button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/stock-opnames`,
              class: "btn btn-outline-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="fas fa-arrow-left me-2" data-v-4ef2a283${_scopeId2}></i> Back to Stock Opnames `);
                } else {
                  return [
                    createVNode("i", { class: "fas fa-arrow-left me-2" }),
                    createTextVNode(" Back to Stock Opnames ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (__props.stockOpnameProducts.data.length > 0) {
              _push2(`<div class="table-responsive" data-v-4ef2a283${_scopeId}><table class="table-bordered table-striped table" data-v-4ef2a283${_scopeId}><thead class="table-light" data-v-4ef2a283${_scopeId}><tr data-v-4ef2a283${_scopeId}><th data-v-4ef2a283${_scopeId}>No.</th><th data-v-4ef2a283${_scopeId}>Product SKU</th><th data-v-4ef2a283${_scopeId}>Product Name</th>`);
              if (isOwner.value) {
                _push2(`<th data-v-4ef2a283${_scopeId}>Stock System</th>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<th data-v-4ef2a283${_scopeId}>Real Quantity</th><th data-v-4ef2a283${_scopeId}>Expired Quantity</th>`);
              if (isOwner.value) {
                _push2(`<th data-v-4ef2a283${_scopeId}>Selisih</th>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<th data-v-4ef2a283${_scopeId}>Status</th><th data-v-4ef2a283${_scopeId}>Description</th><th data-v-4ef2a283${_scopeId}>Actions</th></tr></thead><tbody data-v-4ef2a283${_scopeId}><!--[-->`);
              ssrRenderList(__props.stockOpnameProducts.data, (product, index) => {
                var _a, _b, _c;
                _push2(`<tr class="${ssrRenderClass({
                  "table-warning": hasStockDiscrepancy(product) && isSubmitted.value && product.status === "PENDING"
                })}" data-v-4ef2a283${_scopeId}><td data-v-4ef2a283${_scopeId}>${ssrInterpolate(getRowNumber(index))}</td><td data-v-4ef2a283${_scopeId}>${ssrInterpolate(((_a = product.product) == null ? void 0 : _a.product_unit_sku) || "-")}</td><td data-v-4ef2a283${_scopeId}>${ssrInterpolate(((_b = product.product) == null ? void 0 : _b.product_name) || "-")}</td>`);
                if (isOwner.value) {
                  _push2(`<td data-v-4ef2a283${_scopeId}>${ssrInterpolate(unref(formatNumberWithCommas)(
                    ((_c = product.stock) == null ? void 0 : _c.packaging_size_input) || 0
                  ))}</td>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<td data-v-4ef2a283${_scopeId}>${ssrInterpolate(unref(formatNumberWithCommas)(
                  product.real_quantity || 0
                ))}</td><td data-v-4ef2a283${_scopeId}>${ssrInterpolate(unref(formatNumberWithCommas)(
                  product.expired_quantity || 0
                ))}</td>`);
                if (isOwner.value) {
                  _push2(`<td data-v-4ef2a283${_scopeId}><span class="${ssrRenderClass(
                    getStockDifference(product) === 0 ? "text-success" : "text-danger fw-bold"
                  )}" data-v-4ef2a283${_scopeId}>${ssrInterpolate(getStockDifference(product) > 0 ? "+" : "")}${ssrInterpolate(unref(formatNumberWithCommas)(
                    getStockDifference(product)
                  ))}</span></td>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<td data-v-4ef2a283${_scopeId}><span class="${ssrRenderClass(
                  getStatusBadge(product.status).class
                )}" data-v-4ef2a283${_scopeId}>${ssrInterpolate(getStatusBadge(product.status).text)}</span></td><td data-v-4ef2a283${_scopeId}>`);
                if (product.description) {
                  _push2(`<span class="text-truncate cursor-pointer" style="${ssrRenderStyle({ "cursor": "pointer" })}"${ssrRenderAttr("title", product.description)} data-v-4ef2a283${_scopeId}>${ssrInterpolate(truncateText(product.description))}</span>`);
                } else {
                  _push2(`<span class="text-muted" data-v-4ef2a283${_scopeId}>-</span>`);
                }
                _push2(`</td><td data-v-4ef2a283${_scopeId}>`);
                if (!isSubmitted.value) {
                  _push2(`<div class="btn-group btn-group-sm" data-v-4ef2a283${_scopeId}><button class="btn btn-outline-danger btn-sm" title="Hapus Product" data-v-4ef2a283${_scopeId}><i class="fas fa-trash" data-v-4ef2a283${_scopeId}></i></button></div>`);
                } else if (isOwner.value && hasStockDiscrepancy(product) && product.status === "PENDING") {
                  _push2(`<div class="btn-group btn-group-sm" data-v-4ef2a283${_scopeId}><button class="btn btn-success btn-sm" title="Update Stock ke System" data-v-4ef2a283${_scopeId}><i class="fas fa-sync-alt me-1" data-v-4ef2a283${_scopeId}></i> Update </button><button class="btn btn-warning btn-sm" title="Abaikan Perbedaan" data-v-4ef2a283${_scopeId}><i class="fas fa-times me-1" data-v-4ef2a283${_scopeId}></i> Abaikan </button></div>`);
                } else {
                  _push2(`<span class="text-muted" data-v-4ef2a283${_scopeId}>-</span>`);
                }
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.stockOpnameProducts.data.length === 0) {
              _push2(`<div class="py-4 text-center" data-v-4ef2a283${_scopeId}><p class="text-muted" data-v-4ef2a283${_scopeId}>No stock opname products found.</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.stockOpnameProducts.links && __props.stockOpnameProducts.data.length > 0) {
              _push2(ssrRenderComponent(_sfc_main$3, {
                links: __props.stockOpnameProducts.links
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!isSubmitted.value && __props.stockOpnameProducts.data.length > 0) {
              _push2(`<div class="mt-4 text-center" data-v-4ef2a283${_scopeId}><button class="btn btn-lg btn-success" data-v-4ef2a283${_scopeId}><i class="fas fa-lock me-2" data-v-4ef2a283${_scopeId}></i> Submit Stock Opname </button><p class="text-muted mt-2" data-v-4ef2a283${_scopeId}><small data-v-4ef2a283${_scopeId}>Setelah submit, Anda tidak dapat menambah atau menghapus product.</small></p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              ref_key: "productModal",
              ref: productModal,
              "stock-opname-id": __props.stockOpname.id,
              products: __props.availableProducts
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "overflow-hidden bg-white shadow-sm sm:rounded-lg" }, [
                createVNode("div", { class: "p-3 text-gray-900" }, [
                  createVNode("div", {
                    class: ["alert mb-3", isSubmitted.value ? "alert-success" : "alert-info"]
                  }, [
                    createVNode("div", { class: "d-flex justify-content-between align-items-center" }, [
                      createVNode("div", null, [
                        createVNode("strong", null, "Stock Opname:"),
                        createTextVNode(" #" + toDisplayString(__props.stockOpname.id) + " | ", 1),
                        createVNode("strong", null, "Tanggal:"),
                        createTextVNode(" " + toDisplayString(formatDate(__props.stockOpname.date_request)) + " | ", 1),
                        createVNode("strong", null, "Status:"),
                        createVNode("span", {
                          class: isSubmitted.value ? "badge bg-success" : "badge bg-warning text-dark"
                        }, toDisplayString(isSubmitted.value ? "Submitted" : "Draft"), 3)
                      ])
                    ])
                  ], 2),
                  createVNode("div", { class: "d-flex justify-content-between align-items-center mb-3" }, [
                    createVNode("div", { class: "d-flex align-items-center gap-3" }, [
                      createVNode(_sfc_main$2, {
                        id: "search",
                        modelValue: search.value,
                        "onUpdate:modelValue": ($event) => search.value = $event,
                        type: "text",
                        class: "form-control",
                        placeholder: "Search products...",
                        style: { "width": "300px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "d-flex gap-2" }, [
                      !isSubmitted.value ? (openBlock(), createBlock("button", {
                        key: 0,
                        onClick: openAddModal,
                        class: "btn btn-primary"
                      }, [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(" Tambah Product ")
                      ])) : createCommentVNode("", true),
                      createVNode("button", {
                        onClick: exportExcel,
                        class: "btn btn-success"
                      }, [
                        createVNode("i", { class: "fas fa-file-excel me-2" }),
                        createTextVNode(" Export Excel ")
                      ]),
                      createVNode(unref(Link), {
                        href: `/stock-opnames`,
                        class: "btn btn-outline-secondary"
                      }, {
                        default: withCtx(() => [
                          createVNode("i", { class: "fas fa-arrow-left me-2" }),
                          createTextVNode(" Back to Stock Opnames ")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  __props.stockOpnameProducts.data.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "table-responsive"
                  }, [
                    createVNode("table", { class: "table-bordered table-striped table" }, [
                      createVNode("thead", { class: "table-light" }, [
                        createVNode("tr", null, [
                          createVNode("th", null, "No."),
                          createVNode("th", null, "Product SKU"),
                          createVNode("th", null, "Product Name"),
                          isOwner.value ? (openBlock(), createBlock("th", { key: 0 }, "Stock System")) : createCommentVNode("", true),
                          createVNode("th", null, "Real Quantity"),
                          createVNode("th", null, "Expired Quantity"),
                          isOwner.value ? (openBlock(), createBlock("th", { key: 1 }, "Selisih")) : createCommentVNode("", true),
                          createVNode("th", null, "Status"),
                          createVNode("th", null, "Description"),
                          createVNode("th", null, "Actions")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.stockOpnameProducts.data, (product, index) => {
                          var _a, _b, _c;
                          return openBlock(), createBlock("tr", {
                            key: `${product.stock_opname_id}-${product.product_id}`,
                            class: {
                              "table-warning": hasStockDiscrepancy(product) && isSubmitted.value && product.status === "PENDING"
                            }
                          }, [
                            createVNode("td", null, toDisplayString(getRowNumber(index)), 1),
                            createVNode("td", null, toDisplayString(((_a = product.product) == null ? void 0 : _a.product_unit_sku) || "-"), 1),
                            createVNode("td", null, toDisplayString(((_b = product.product) == null ? void 0 : _b.product_name) || "-"), 1),
                            isOwner.value ? (openBlock(), createBlock("td", { key: 0 }, toDisplayString(unref(formatNumberWithCommas)(
                              ((_c = product.stock) == null ? void 0 : _c.packaging_size_input) || 0
                            )), 1)) : createCommentVNode("", true),
                            createVNode("td", null, toDisplayString(unref(formatNumberWithCommas)(
                              product.real_quantity || 0
                            )), 1),
                            createVNode("td", null, toDisplayString(unref(formatNumberWithCommas)(
                              product.expired_quantity || 0
                            )), 1),
                            isOwner.value ? (openBlock(), createBlock("td", { key: 1 }, [
                              createVNode("span", {
                                class: getStockDifference(product) === 0 ? "text-success" : "text-danger fw-bold"
                              }, toDisplayString(getStockDifference(product) > 0 ? "+" : "") + toDisplayString(unref(formatNumberWithCommas)(
                                getStockDifference(product)
                              )), 3)
                            ])) : createCommentVNode("", true),
                            createVNode("td", null, [
                              createVNode("span", {
                                class: getStatusBadge(product.status).class
                              }, toDisplayString(getStatusBadge(product.status).text), 3)
                            ]),
                            createVNode("td", null, [
                              product.description ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-truncate cursor-pointer",
                                style: { "cursor": "pointer" },
                                onClick: ($event) => showFullNote(
                                  "Deskripsi",
                                  product.description
                                ),
                                title: product.description
                              }, toDisplayString(truncateText(product.description)), 9, ["onClick", "title"])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-muted"
                              }, "-"))
                            ]),
                            createVNode("td", null, [
                              !isSubmitted.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "btn-group btn-group-sm"
                              }, [
                                createVNode("button", {
                                  onClick: ($event) => deleteProduct(product),
                                  class: "btn btn-outline-danger btn-sm",
                                  title: "Hapus Product"
                                }, [
                                  createVNode("i", { class: "fas fa-trash" })
                                ], 8, ["onClick"])
                              ])) : isOwner.value && hasStockDiscrepancy(product) && product.status === "PENDING" ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "btn-group btn-group-sm"
                              }, [
                                createVNode("button", {
                                  onClick: ($event) => ownerAction(
                                    product,
                                    "update_stock"
                                  ),
                                  class: "btn btn-success btn-sm",
                                  title: "Update Stock ke System"
                                }, [
                                  createVNode("i", { class: "fas fa-sync-alt me-1" }),
                                  createTextVNode(" Update ")
                                ], 8, ["onClick"]),
                                createVNode("button", {
                                  onClick: ($event) => ownerAction(product, "ignore"),
                                  class: "btn btn-warning btn-sm",
                                  title: "Abaikan Perbedaan"
                                }, [
                                  createVNode("i", { class: "fas fa-times me-1" }),
                                  createTextVNode(" Abaikan ")
                                ], 8, ["onClick"])
                              ])) : (openBlock(), createBlock("span", {
                                key: 2,
                                class: "text-muted"
                              }, "-"))
                            ])
                          ], 2);
                        }), 128))
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  __props.stockOpnameProducts.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "py-4 text-center"
                  }, [
                    createVNode("p", { class: "text-muted" }, "No stock opname products found.")
                  ])) : createCommentVNode("", true),
                  __props.stockOpnameProducts.links && __props.stockOpnameProducts.data.length > 0 ? (openBlock(), createBlock(_sfc_main$3, {
                    key: 2,
                    links: __props.stockOpnameProducts.links
                  }, null, 8, ["links"])) : createCommentVNode("", true),
                  !isSubmitted.value && __props.stockOpnameProducts.data.length > 0 ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "mt-4 text-center"
                  }, [
                    createVNode("button", {
                      onClick: submitStockOpname,
                      class: "btn btn-lg btn-success"
                    }, [
                      createVNode("i", { class: "fas fa-lock me-2" }),
                      createTextVNode(" Submit Stock Opname ")
                    ]),
                    createVNode("p", { class: "text-muted mt-2" }, [
                      createVNode("small", null, "Setelah submit, Anda tidak dapat menambah atau menghapus product.")
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ]),
              createVNode(_sfc_main$4, {
                ref_key: "productModal",
                ref: productModal,
                "stock-opname-id": __props.stockOpname.id,
                products: __props.availableProducts
              }, null, 8, ["stock-opname-id", "products"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreStockOpnameProducts/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4ef2a283"]]);
export {
  Index as default
};
