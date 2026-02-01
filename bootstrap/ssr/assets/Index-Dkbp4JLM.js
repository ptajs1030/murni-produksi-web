import { ref, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, createTextVNode, withDirectives, vModelText, withKeys, openBlock, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./Pagination-C8u96SgA.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-CJQU9ReZ.js";
import { Head, router } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: [
    "products",
    "filters",
    "categories",
    "suppliers",
    "statistics",
    "defaultDateRange"
  ],
  setup(__props) {
    const props = __props;
    const search = ref(props.filters.search || "");
    const categoryFilter = ref(props.filters.category_id || "");
    const supplierFilter = ref(props.filters.supplier_id || "");
    const dateFrom = ref(props.filters.date_from || "");
    const dateTo = ref(props.filters.date_to || "");
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    const formatPrice = (price) => {
      if (!price) return "Rp 0";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };
    const formatQuantity = (quantity) => {
      if (!quantity) return "0";
      return Number(quantity).toLocaleString("id-ID");
    };
    const getDaysExpired = (expiredDate) => {
      if (!expiredDate) return null;
      const today = /* @__PURE__ */ new Date();
      const expiry = new Date(expiredDate);
      const diffTime = today - expiry;
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      return diffDays;
    };
    const getExpiryStatusClass = (expiredDate) => {
      const days = getDaysExpired(expiredDate);
      if (days <= 0) return "danger";
      if (days <= 7) return "warning";
      return "secondary";
    };
    const getExpiryStatusText = (expiredDate) => {
      const days = getDaysExpired(expiredDate);
      if (days <= 0) return "Expired hari ini";
      if (days === 1) return "Expired kemarin";
      return `Expired ${days} hari lalu`;
    };
    const getTotalStock = (stocks) => {
      if (!stocks || !stocks.length) return 0;
      return stocks.reduce(
        (total, stock) => total + parseFloat(stock.packaging_size_input || 0),
        0
      );
    };
    const searchData = () => {
      router.get(
        route("product-expired.index"),
        {
          search: search.value,
          category_id: categoryFilter.value,
          supplier_id: supplierFilter.value,
          date_from: dateFrom.value,
          date_to: dateTo.value
        },
        {
          preserveState: true,
          preserveScroll: true
        }
      );
    };
    const resetFilters = () => {
      search.value = "";
      categoryFilter.value = "";
      supplierFilter.value = "";
      dateFrom.value = "";
      dateTo.value = "";
      searchData();
    };
    const setDefaultDateRange = () => {
      if (props.defaultDateRange) {
        dateFrom.value = props.defaultDateRange.from;
        dateTo.value = props.defaultDateRange.to;
        searchData();
      }
    };
    const totalRecords = computed(() => {
      return props.products.total || 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Product Expired" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex justify-content-between align-items-center" data-v-32a5da48${_scopeId}><div data-v-32a5da48${_scopeId}><h2 class="text-xl font-semibold leading-tight text-gray-800" data-v-32a5da48${_scopeId}> Product Expired </h2><p class="text-muted" data-v-32a5da48${_scopeId}> Monitoring produk yang sudah expired </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex justify-content-between align-items-center" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "text-xl font-semibold leading-tight text-gray-800" }, " Product Expired "),
                  createVNode("p", { class: "text-muted" }, " Monitoring produk yang sudah expired ")
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-3 text-gray-900" data-v-32a5da48${_scopeId}><div class="row mb-4" data-v-32a5da48${_scopeId}><div class="col-md-4" data-v-32a5da48${_scopeId}><div class="card bg-primary text-white" data-v-32a5da48${_scopeId}><div class="card-body" data-v-32a5da48${_scopeId}><div class="d-flex justify-content-between align-items-center" data-v-32a5da48${_scopeId}><div data-v-32a5da48${_scopeId}><h5 class="card-title mb-0" data-v-32a5da48${_scopeId}> Total Filtered </h5><h2 class="mb-0" data-v-32a5da48${_scopeId}>${ssrInterpolate(__props.statistics.total_filtered)}</h2></div><i class="fas fa-filter fa-2x" data-v-32a5da48${_scopeId}></i></div></div></div></div><div class="col-md-4" data-v-32a5da48${_scopeId}><div class="card bg-danger text-white" data-v-32a5da48${_scopeId}><div class="card-body" data-v-32a5da48${_scopeId}><div class="d-flex justify-content-between align-items-center" data-v-32a5da48${_scopeId}><div data-v-32a5da48${_scopeId}><h5 class="card-title mb-0" data-v-32a5da48${_scopeId}> Sudah Expired </h5><h2 class="mb-0" data-v-32a5da48${_scopeId}>${ssrInterpolate(__props.statistics.expired_already)}</h2></div><i class="fas fa-exclamation-triangle fa-2x" data-v-32a5da48${_scopeId}></i></div></div></div></div><div class="col-md-4" data-v-32a5da48${_scopeId}><div class="card bg-warning text-white" data-v-32a5da48${_scopeId}><div class="card-body" data-v-32a5da48${_scopeId}><div class="d-flex justify-content-between align-items-center" data-v-32a5da48${_scopeId}><div data-v-32a5da48${_scopeId}><h5 class="card-title mb-0" data-v-32a5da48${_scopeId}> Akan Expired (30 Hari) </h5><h2 class="mb-0" data-v-32a5da48${_scopeId}>${ssrInterpolate(__props.statistics.expiring_soon)}</h2></div><i class="fas fa-calendar-times fa-2x" data-v-32a5da48${_scopeId}></i></div></div></div></div></div><div class="card mb-4" data-v-32a5da48${_scopeId}><div class="card-body" data-v-32a5da48${_scopeId}><div class="row g-3 mb-3" data-v-32a5da48${_scopeId}><div class="col-12" data-v-32a5da48${_scopeId}><h6 class="mb-2" data-v-32a5da48${_scopeId}>Filter Tanggal Expired</h6><div class="alert alert-info py-2" data-v-32a5da48${_scopeId}><small data-v-32a5da48${_scopeId}><i class="fas fa-info-circle me-1" data-v-32a5da48${_scopeId}></i> Default: Produk yang expired dari H+10 hari sampai H-2 bulan dari hari ini </small></div></div><div class="col-md-3" data-v-32a5da48${_scopeId}><label class="form-label" data-v-32a5da48${_scopeId}>Dari Tanggal</label><input type="date" class="form-control"${ssrRenderAttr("value", dateFrom.value)} placeholder="Dari tanggal" data-v-32a5da48${_scopeId}></div><div class="col-md-3" data-v-32a5da48${_scopeId}><label class="form-label" data-v-32a5da48${_scopeId}>Sampai Tanggal</label><input type="date" class="form-control"${ssrRenderAttr("value", dateTo.value)} placeholder="Sampai tanggal" data-v-32a5da48${_scopeId}></div><div class="col-md-6 d-flex align-items-end" data-v-32a5da48${_scopeId}><div class="btn-group" data-v-32a5da48${_scopeId}><button class="btn btn-outline-primary btn-sm" data-v-32a5da48${_scopeId}><i class="fas fa-calendar-alt" data-v-32a5da48${_scopeId}></i> Set Default Range </button></div></div></div><hr class="my-3" data-v-32a5da48${_scopeId}><div class="row g-3" data-v-32a5da48${_scopeId}><div class="col-md-3" data-v-32a5da48${_scopeId}><label class="form-label" data-v-32a5da48${_scopeId}>Search</label><input type="text" class="form-control"${ssrRenderAttr("value", search.value)} placeholder="Cari produk, SKU, brand..." data-v-32a5da48${_scopeId}></div><div class="col-md-2" data-v-32a5da48${_scopeId}><label class="form-label" data-v-32a5da48${_scopeId}>Category</label><select class="form-select" data-v-32a5da48${_scopeId}><option value="" data-v-32a5da48${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, "") : ssrLooseEqual(categoryFilter.value, "")) ? " selected" : ""}${_scopeId}>Semua Category</option><!--[-->`);
            ssrRenderList(__props.categories, (category) => {
              _push2(`<option${ssrRenderAttr("value", category.id)} data-v-32a5da48${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, category.id) : ssrLooseEqual(categoryFilter.value, category.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(category.category_name)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="col-md-2" data-v-32a5da48${_scopeId}><label class="form-label" data-v-32a5da48${_scopeId}>Supplier</label><select class="form-select" data-v-32a5da48${_scopeId}><option value="" data-v-32a5da48${ssrIncludeBooleanAttr(Array.isArray(supplierFilter.value) ? ssrLooseContain(supplierFilter.value, "") : ssrLooseEqual(supplierFilter.value, "")) ? " selected" : ""}${_scopeId}>Semua Supplier</option><!--[-->`);
            ssrRenderList(__props.suppliers, (supplier) => {
              _push2(`<option${ssrRenderAttr("value", supplier.id)} data-v-32a5da48${ssrIncludeBooleanAttr(Array.isArray(supplierFilter.value) ? ssrLooseContain(supplierFilter.value, supplier.id) : ssrLooseEqual(supplierFilter.value, supplier.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(supplier.supplier_name)}</option>`);
            });
            _push2(`<!--]--></select></div><div class="col-md-3 d-flex align-items-end" data-v-32a5da48${_scopeId}><div class="btn-group w-100" data-v-32a5da48${_scopeId}><button class="btn btn-primary btn-sm" data-v-32a5da48${_scopeId}><i class="fas fa-search" data-v-32a5da48${_scopeId}></i> Search </button><button class="btn btn-secondary btn-sm" data-v-32a5da48${_scopeId}><i class="fas fa-undo" data-v-32a5da48${_scopeId}></i> Reset </button></div></div></div></div></div><div class="row mb-4" data-v-32a5da48${_scopeId}><div class="col-12" data-v-32a5da48${_scopeId}><div class="alert alert-primary" data-v-32a5da48${_scopeId}><i class="fas fa-filter me-2" data-v-32a5da48${_scopeId}></i> Menampilkan <strong data-v-32a5da48${_scopeId}>${ssrInterpolate(__props.products.data.length)}</strong> dari <strong data-v-32a5da48${_scopeId}>${ssrInterpolate(totalRecords.value)}</strong> produk berdasarkan filter tanggal expired `);
            if (dateFrom.value || dateTo.value) {
              _push2(`<span class="ms-2" data-v-32a5da48${_scopeId}>`);
              if (dateFrom.value && dateTo.value) {
                _push2(`<span data-v-32a5da48${_scopeId}> (Dari ${ssrInterpolate(formatDate(dateFrom.value))} sampai ${ssrInterpolate(formatDate(dateTo.value))}) </span>`);
              } else if (dateFrom.value) {
                _push2(`<span data-v-32a5da48${_scopeId}>(Sampai dengan ${ssrInterpolate(formatDate(dateFrom.value))})</span>`);
              } else if (dateTo.value) {
                _push2(`<span data-v-32a5da48${_scopeId}>(Mulai dari ${ssrInterpolate(formatDate(dateTo.value))})</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</span>`);
            } else {
              _push2(`<span class="ms-2" data-v-32a5da48${_scopeId}>(Default: H+10 hari sampai H-2 bulan)</span>`);
            }
            _push2(`</div></div></div><div class="card" data-v-32a5da48${_scopeId}><div class="card-body" data-v-32a5da48${_scopeId}><div class="table-responsive" data-v-32a5da48${_scopeId}><table class="table-striped table-hover table" data-v-32a5da48${_scopeId}><thead class="table-light" data-v-32a5da48${_scopeId}><tr data-v-32a5da48${_scopeId}><th data-v-32a5da48${_scopeId}>Produk</th><th data-v-32a5da48${_scopeId}>SKU</th><th data-v-32a5da48${_scopeId}>Brand</th><th data-v-32a5da48${_scopeId}>Category</th><th data-v-32a5da48${_scopeId}>Supplier</th><th class="text-center" data-v-32a5da48${_scopeId}>Stock</th><th class="text-center" data-v-32a5da48${_scopeId}>Harga</th><th class="text-center" data-v-32a5da48${_scopeId}>Expired Date</th><th class="text-center" data-v-32a5da48${_scopeId}>Status</th></tr></thead><tbody data-v-32a5da48${_scopeId}><!--[-->`);
            ssrRenderList(__props.products.data, (product) => {
              var _a, _b, _c, _d, _e, _f;
              _push2(`<tr data-v-32a5da48${_scopeId}><td data-v-32a5da48${_scopeId}><div class="fw-medium text-primary" data-v-32a5da48${_scopeId}>${ssrInterpolate(product.product_name)}</div>`);
              if (product.description) {
                _push2(`<small class="text-muted" data-v-32a5da48${_scopeId}>${ssrInterpolate(product.description)}</small>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td data-v-32a5da48${_scopeId}><code class="text-dark" data-v-32a5da48${_scopeId}>${ssrInterpolate(product.product_unit_sku)}</code></td><td data-v-32a5da48${_scopeId}><span class="badge bg-secondary" data-v-32a5da48${_scopeId}>${ssrInterpolate(product.brand_name || "-")}</span>`);
              if (product.property_item) {
                _push2(`<div class="mt-1" data-v-32a5da48${_scopeId}><small class="text-muted" data-v-32a5da48${_scopeId}>${ssrInterpolate((_a = product.property_item) == null ? void 0 : _a.property_name)}</small></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td data-v-32a5da48${_scopeId}><span class="badge bg-info" data-v-32a5da48${_scopeId}>${ssrInterpolate(((_b = product.category) == null ? void 0 : _b.category_name) || "-")}</span>`);
              if (product.packaging_size || product.packaging_type) {
                _push2(`<div class="mt-1" data-v-32a5da48${_scopeId}><small class="text-muted" data-v-32a5da48${_scopeId}>${ssrInterpolate((_c = product.packaging_size) == null ? void 0 : _c.packaging_size_name)} ${ssrInterpolate((_d = product.packaging_type) == null ? void 0 : _d.packaging_type_name)}</small></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td data-v-32a5da48${_scopeId}><span class="badge bg-success" data-v-32a5da48${_scopeId}>${ssrInterpolate(((_e = product.supplier) == null ? void 0 : _e.supplier_name) || "-")}</span>`);
              if (product.repack_status) {
                _push2(`<div class="mt-1" data-v-32a5da48${_scopeId}><small class="text-muted" data-v-32a5da48${_scopeId}>${ssrInterpolate((_f = product.repack_status) == null ? void 0 : _f.repack_name)}</small></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td class="text-center" data-v-32a5da48${_scopeId}><strong data-v-32a5da48${_scopeId}>${ssrInterpolate(formatQuantity(
                getTotalStock(product.stocks)
              ))}</strong></td><td class="text-center" data-v-32a5da48${_scopeId}><strong data-v-32a5da48${_scopeId}>${ssrInterpolate(formatPrice(
                product.product_unit_price
              ))}</strong></td><td class="text-center" data-v-32a5da48${_scopeId}><div class="fw-medium" data-v-32a5da48${_scopeId}>${ssrInterpolate(formatDate(product.expired_date))}</div></td><td class="text-center" data-v-32a5da48${_scopeId}><span class="${ssrRenderClass([`badge bg-${getExpiryStatusClass(product.expired_date)}`, "fs-6"])}" data-v-32a5da48${_scopeId}>${ssrInterpolate(getExpiryStatusText(
                product.expired_date
              ))}</span></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.products.data.length === 0) {
              _push2(`<tr data-v-32a5da48${_scopeId}><td colspan="9" class="py-4 text-center" data-v-32a5da48${_scopeId}><div class="text-muted" data-v-32a5da48${_scopeId}><i class="fas fa-check-circle fa-3x text-success mb-3" data-v-32a5da48${_scopeId}></i><p data-v-32a5da48${_scopeId}>Tidak ada produk yang expired</p><small data-v-32a5da48${_scopeId}>Semua produk masih dalam kondisi baik</small></div></td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div></div></div>`);
            if (__props.products.data.length > 0) {
              _push2(`<div class="mt-4" data-v-32a5da48${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                links: __props.products.links
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "p-3 text-gray-900" }, [
                createVNode("div", { class: "row mb-4" }, [
                  createVNode("div", { class: "col-md-4" }, [
                    createVNode("div", { class: "card bg-primary text-white" }, [
                      createVNode("div", { class: "card-body" }, [
                        createVNode("div", { class: "d-flex justify-content-between align-items-center" }, [
                          createVNode("div", null, [
                            createVNode("h5", { class: "card-title mb-0" }, " Total Filtered "),
                            createVNode("h2", { class: "mb-0" }, toDisplayString(__props.statistics.total_filtered), 1)
                          ]),
                          createVNode("i", { class: "fas fa-filter fa-2x" })
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "col-md-4" }, [
                    createVNode("div", { class: "card bg-danger text-white" }, [
                      createVNode("div", { class: "card-body" }, [
                        createVNode("div", { class: "d-flex justify-content-between align-items-center" }, [
                          createVNode("div", null, [
                            createVNode("h5", { class: "card-title mb-0" }, " Sudah Expired "),
                            createVNode("h2", { class: "mb-0" }, toDisplayString(__props.statistics.expired_already), 1)
                          ]),
                          createVNode("i", { class: "fas fa-exclamation-triangle fa-2x" })
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "col-md-4" }, [
                    createVNode("div", { class: "card bg-warning text-white" }, [
                      createVNode("div", { class: "card-body" }, [
                        createVNode("div", { class: "d-flex justify-content-between align-items-center" }, [
                          createVNode("div", null, [
                            createVNode("h5", { class: "card-title mb-0" }, " Akan Expired (30 Hari) "),
                            createVNode("h2", { class: "mb-0" }, toDisplayString(__props.statistics.expiring_soon), 1)
                          ]),
                          createVNode("i", { class: "fas fa-calendar-times fa-2x" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "card mb-4" }, [
                  createVNode("div", { class: "card-body" }, [
                    createVNode("div", { class: "row g-3 mb-3" }, [
                      createVNode("div", { class: "col-12" }, [
                        createVNode("h6", { class: "mb-2" }, "Filter Tanggal Expired"),
                        createVNode("div", { class: "alert alert-info py-2" }, [
                          createVNode("small", null, [
                            createVNode("i", { class: "fas fa-info-circle me-1" }),
                            createTextVNode(" Default: Produk yang expired dari H+10 hari sampai H-2 bulan dari hari ini ")
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "col-md-3" }, [
                        createVNode("label", { class: "form-label" }, "Dari Tanggal"),
                        withDirectives(createVNode("input", {
                          type: "date",
                          class: "form-control",
                          "onUpdate:modelValue": ($event) => dateFrom.value = $event,
                          placeholder: "Dari tanggal"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, dateFrom.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-3" }, [
                        createVNode("label", { class: "form-label" }, "Sampai Tanggal"),
                        withDirectives(createVNode("input", {
                          type: "date",
                          class: "form-control",
                          "onUpdate:modelValue": ($event) => dateTo.value = $event,
                          placeholder: "Sampai tanggal"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, dateTo.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-6 d-flex align-items-end" }, [
                        createVNode("div", { class: "btn-group" }, [
                          createVNode("button", {
                            class: "btn btn-outline-primary btn-sm",
                            onClick: setDefaultDateRange
                          }, [
                            createVNode("i", { class: "fas fa-calendar-alt" }),
                            createTextVNode(" Set Default Range ")
                          ])
                        ])
                      ])
                    ]),
                    createVNode("hr", { class: "my-3" }),
                    createVNode("div", { class: "row g-3" }, [
                      createVNode("div", { class: "col-md-3" }, [
                        createVNode("label", { class: "form-label" }, "Search"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          class: "form-control",
                          "onUpdate:modelValue": ($event) => search.value = $event,
                          onKeyup: withKeys(searchData, ["enter"]),
                          placeholder: "Cari produk, SKU, brand..."
                        }, null, 40, ["onUpdate:modelValue"]), [
                          [vModelText, search.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-2" }, [
                        createVNode("label", { class: "form-label" }, "Category"),
                        withDirectives(createVNode("select", {
                          class: "form-select",
                          "onUpdate:modelValue": ($event) => categoryFilter.value = $event
                        }, [
                          createVNode("option", { value: "" }, "Semua Category"),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (category) => {
                            return openBlock(), createBlock("option", {
                              key: category.id,
                              value: category.id
                            }, toDisplayString(category.category_name), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, categoryFilter.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-2" }, [
                        createVNode("label", { class: "form-label" }, "Supplier"),
                        withDirectives(createVNode("select", {
                          class: "form-select",
                          "onUpdate:modelValue": ($event) => supplierFilter.value = $event
                        }, [
                          createVNode("option", { value: "" }, "Semua Supplier"),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.suppliers, (supplier) => {
                            return openBlock(), createBlock("option", {
                              key: supplier.id,
                              value: supplier.id
                            }, toDisplayString(supplier.supplier_name), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, supplierFilter.value]
                        ])
                      ]),
                      createVNode("div", { class: "col-md-3 d-flex align-items-end" }, [
                        createVNode("div", { class: "btn-group w-100" }, [
                          createVNode("button", {
                            class: "btn btn-primary btn-sm",
                            onClick: searchData
                          }, [
                            createVNode("i", { class: "fas fa-search" }),
                            createTextVNode(" Search ")
                          ]),
                          createVNode("button", {
                            class: "btn btn-secondary btn-sm",
                            onClick: resetFilters
                          }, [
                            createVNode("i", { class: "fas fa-undo" }),
                            createTextVNode(" Reset ")
                          ])
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "row mb-4" }, [
                  createVNode("div", { class: "col-12" }, [
                    createVNode("div", { class: "alert alert-primary" }, [
                      createVNode("i", { class: "fas fa-filter me-2" }),
                      createTextVNode(" Menampilkan "),
                      createVNode("strong", null, toDisplayString(__props.products.data.length), 1),
                      createTextVNode(" dari "),
                      createVNode("strong", null, toDisplayString(totalRecords.value), 1),
                      createTextVNode(" produk berdasarkan filter tanggal expired "),
                      dateFrom.value || dateTo.value ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "ms-2"
                      }, [
                        dateFrom.value && dateTo.value ? (openBlock(), createBlock("span", { key: 0 }, " (Dari " + toDisplayString(formatDate(dateFrom.value)) + " sampai " + toDisplayString(formatDate(dateTo.value)) + ") ", 1)) : dateFrom.value ? (openBlock(), createBlock("span", { key: 1 }, "(Sampai dengan " + toDisplayString(formatDate(dateFrom.value)) + ")", 1)) : dateTo.value ? (openBlock(), createBlock("span", { key: 2 }, "(Mulai dari " + toDisplayString(formatDate(dateTo.value)) + ")", 1)) : createCommentVNode("", true)
                      ])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "ms-2"
                      }, "(Default: H+10 hari sampai H-2 bulan)"))
                    ])
                  ])
                ]),
                createVNode("div", { class: "card" }, [
                  createVNode("div", { class: "card-body" }, [
                    createVNode("div", { class: "table-responsive" }, [
                      createVNode("table", { class: "table-striped table-hover table" }, [
                        createVNode("thead", { class: "table-light" }, [
                          createVNode("tr", null, [
                            createVNode("th", null, "Produk"),
                            createVNode("th", null, "SKU"),
                            createVNode("th", null, "Brand"),
                            createVNode("th", null, "Category"),
                            createVNode("th", null, "Supplier"),
                            createVNode("th", { class: "text-center" }, "Stock"),
                            createVNode("th", { class: "text-center" }, "Harga"),
                            createVNode("th", { class: "text-center" }, "Expired Date"),
                            createVNode("th", { class: "text-center" }, "Status")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.products.data, (product) => {
                            var _a, _b, _c, _d, _e, _f;
                            return openBlock(), createBlock("tr", {
                              key: product.id
                            }, [
                              createVNode("td", null, [
                                createVNode("div", { class: "fw-medium text-primary" }, toDisplayString(product.product_name), 1),
                                product.description ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "text-muted"
                                }, toDisplayString(product.description), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("td", null, [
                                createVNode("code", { class: "text-dark" }, toDisplayString(product.product_unit_sku), 1)
                              ]),
                              createVNode("td", null, [
                                createVNode("span", { class: "badge bg-secondary" }, toDisplayString(product.brand_name || "-"), 1),
                                product.property_item ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-1"
                                }, [
                                  createVNode("small", { class: "text-muted" }, toDisplayString((_a = product.property_item) == null ? void 0 : _a.property_name), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              createVNode("td", null, [
                                createVNode("span", { class: "badge bg-info" }, toDisplayString(((_b = product.category) == null ? void 0 : _b.category_name) || "-"), 1),
                                product.packaging_size || product.packaging_type ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-1"
                                }, [
                                  createVNode("small", { class: "text-muted" }, toDisplayString((_c = product.packaging_size) == null ? void 0 : _c.packaging_size_name) + " " + toDisplayString((_d = product.packaging_type) == null ? void 0 : _d.packaging_type_name), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              createVNode("td", null, [
                                createVNode("span", { class: "badge bg-success" }, toDisplayString(((_e = product.supplier) == null ? void 0 : _e.supplier_name) || "-"), 1),
                                product.repack_status ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-1"
                                }, [
                                  createVNode("small", { class: "text-muted" }, toDisplayString((_f = product.repack_status) == null ? void 0 : _f.repack_name), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              createVNode("td", { class: "text-center" }, [
                                createVNode("strong", null, toDisplayString(formatQuantity(
                                  getTotalStock(product.stocks)
                                )), 1)
                              ]),
                              createVNode("td", { class: "text-center" }, [
                                createVNode("strong", null, toDisplayString(formatPrice(
                                  product.product_unit_price
                                )), 1)
                              ]),
                              createVNode("td", { class: "text-center" }, [
                                createVNode("div", { class: "fw-medium" }, toDisplayString(formatDate(product.expired_date)), 1)
                              ]),
                              createVNode("td", { class: "text-center" }, [
                                createVNode("span", {
                                  class: [`badge bg-${getExpiryStatusClass(product.expired_date)}`, "fs-6"]
                                }, toDisplayString(getExpiryStatusText(
                                  product.expired_date
                                )), 3)
                              ])
                            ]);
                          }), 128)),
                          __props.products.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                            createVNode("td", {
                              colspan: "9",
                              class: "py-4 text-center"
                            }, [
                              createVNode("div", { class: "text-muted" }, [
                                createVNode("i", { class: "fas fa-check-circle fa-3x text-success mb-3" }),
                                createVNode("p", null, "Tidak ada produk yang expired"),
                                createVNode("small", null, "Semua produk masih dalam kondisi baik")
                              ])
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ]),
                __props.products.data.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-4"
                }, [
                  createVNode(_sfc_main$2, {
                    links: __props.products.links
                  }, null, 8, ["links"])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ProductExpired/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-32a5da48"]]);
export {
  Index as default
};
