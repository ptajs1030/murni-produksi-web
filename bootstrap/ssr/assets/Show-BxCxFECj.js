import { getCurrentInstance, ref, unref, withCtx, createVNode, createBlock, createCommentVNode, createTextVNode, openBlock, toDisplayString, Fragment, renderList, withDirectives, vModelSelect, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-C4iQtLPH.js";
import { Head, router } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const parseRupiahToNumber = (rupiahString) => {
  if (!rupiahString) return 0;
  const cleanString = rupiahString.toString().replace(/Rp\s?/g, "").replace(/\./g, "").replace(/,/g, ".");
  const number = parseFloat(cleanString);
  return isNaN(number) ? 0 : number;
};
const formatRupiahInput = (value) => {
  if (!value) return "";
  const numericValue = value.toString().replace(/[^\d,]/g, "");
  const number = parseFloat(numericValue.replace(",", "."));
  if (isNaN(number)) return "";
  return number.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};
const isValidCurrencyAmount = (value) => {
  if (!value && value !== 0) return false;
  const number = typeof value === "string" ? parseRupiahToNumber(value) : value;
  return !isNaN(number) && number > 0;
};
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: ["productIncome", "incomeProduct", "poProductDetails", "statusOptions"],
  setup(__props) {
    const props = __props;
    const { proxy } = getCurrentInstance();
    const showPOList = ref(!!props.poProductDetails);
    const isLoading = ref(false);
    const inputQuantities = ref({});
    const remainingStock = ref(props.incomeProduct.stock || 0);
    const statusSelections = ref({});
    const qtyApprovedInputs = ref({});
    const qtyShortageInputs = ref({});
    const qtyOverInputs = ref({});
    const changedRows = ref(/* @__PURE__ */ new Set());
    const originalData = ref({});
    const priceInput = ref(props.incomeProduct.price || 0);
    const priceInputFormatted = ref(formatRupiahInput(props.incomeProduct.price || 0));
    const originalPrice = ref(props.incomeProduct.price || 0);
    const priceChanged = ref(false);
    const priceError = ref("");
    if (props.poProductDetails) {
      let totalAllocated = 0;
      props.poProductDetails.forEach((detail) => {
        const key = `${detail.product_request_id}-${detail.product_id}`;
        const quantity = detail.stock || 0;
        inputQuantities.value[key] = quantity;
        totalAllocated += quantity;
        statusSelections.value[key] = detail.status_id || null;
        qtyApprovedInputs.value[key] = detail.qty_approved || 0;
        qtyShortageInputs.value[key] = detail.qty_shortage || 0;
        qtyOverInputs.value[key] = detail.qty_over || 0;
        originalData.value[key] = {
          income_id: props.productIncome.id,
          status_id: detail.status_id || null,
          qty_approved: detail.qty_approved || 0,
          qty_shortage: detail.qty_shortage || 0,
          qty_over: detail.qty_over || 0,
          qty_input: quantity
        };
      });
      let remaining = (props.incomeProduct.stock || 0) - totalAllocated;
      if (remaining > 0 && props.poProductDetails.length > 0) {
        const lastDetail = props.poProductDetails[props.poProductDetails.length - 1];
        const lastKey = `${lastDetail.product_request_id}-${lastDetail.product_id}`;
        inputQuantities.value[lastKey] = (inputQuantities.value[lastKey] || 0) + remaining;
        remaining = 0;
      }
      remainingStock.value = remaining;
    }
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    const getStatusBadgeClass = (status) => {
      var _a;
      if (!status) return "badge bg-secondary";
      const statusName = (_a = status.status_name) == null ? void 0 : _a.toLowerCase();
      if (statusName == null ? void 0 : statusName.includes("active")) return "badge bg-success";
      if (statusName == null ? void 0 : statusName.includes("inactive")) return "badge bg-danger";
      if (statusName == null ? void 0 : statusName.includes("pending")) return "badge bg-warning";
      return "badge bg-secondary";
    };
    const updateQuantity = (key, newValue, oldValue) => {
      const numericValue = parseInt(newValue) || 0;
      const numericOldValue = parseInt(oldValue) || 0;
      const difference = numericValue - numericOldValue;
      remainingStock.value = remainingStock.value - difference;
      inputQuantities.value[key] = numericValue;
      trackRowChange(key);
    };
    const trackRowChange = (key) => {
      const current = {
        status_id: statusSelections.value[key],
        qty_approved: qtyApprovedInputs.value[key] || 0,
        qty_shortage: qtyShortageInputs.value[key] || 0,
        qty_over: qtyOverInputs.value[key] || 0,
        qty_input: inputQuantities.value[key] || 0
      };
      const original = originalData.value[key];
      const hasChanged = current.status_id !== original.status_id || current.qty_approved !== original.qty_approved || current.qty_shortage !== original.qty_shortage || current.qty_over !== original.qty_over || current.qty_input !== original.qty_input;
      if (hasChanged) {
        changedRows.value.add(key);
      } else {
        changedRows.value.delete(key);
      }
    };
    const getChangedData = () => {
      const changedData = [];
      changedRows.value.forEach((key) => {
        const [product_request_id, product_id] = key.split("-");
        changedData.push({
          product_request_id: parseInt(product_request_id),
          product_id: parseInt(product_id),
          income_id: props.productIncome.id,
          status_id: statusSelections.value[key],
          qty_approved: qtyApprovedInputs.value[key] || 0,
          qty_shortage: qtyShortageInputs.value[key] || 0,
          qty_over: qtyOverInputs.value[key] || 0,
          qty_input: inputQuantities.value[key] || 0
        });
      });
      return changedData;
    };
    const saveChanges = () => {
      if (!isValidCurrencyAmount(priceInput.value)) {
        priceError.value = "Harga harus diisi dan lebih dari 0";
        proxy.$swal.fire({
          icon: "error",
          title: "Validasi Error",
          text: "Harga harus diisi dan lebih dari 0"
        });
        return;
      }
      priceError.value = "";
      const changedData = getChangedData();
      if (changedData.length === 0 && !priceChanged.value) {
        proxy.$swal.fire({
          icon: "info",
          title: "Tidak ada perubahan",
          text: "Tidak ada perubahan untuk disimpan"
        });
        return;
      }
      isLoading.value = true;
      const dataToSend = {
        data: changedData
      };
      if (priceChanged.value) {
        dataToSend.price_data = {
          product_income_id: props.productIncome.id,
          product_id: props.incomeProduct.product_id,
          warehouse_id: props.productIncome.warehouse_id,
          price: parseFloat(priceInput.value || 0)
        };
      }
      router.post("/product-incomes/update-product-request-data", dataToSend, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          var _a;
          if ((_a = page.props.flash) == null ? void 0 : _a.success) ;
          changedRows.value.clear();
          changedData.forEach((item) => {
            const key = `${item.product_request_id}-${item.product_id}`;
            originalData.value[key] = {
              income_id: props.productIncome.id,
              status_id: item.status_id,
              qty_approved: item.qty_approved,
              qty_shortage: item.qty_shortage,
              qty_over: item.qty_over,
              qty_input: item.qty_input
            };
          });
          if (priceChanged.value) {
            originalPrice.value = priceInput.value;
            priceChanged.value = false;
          }
          isLoading.value = false;
        },
        onError: (errors) => {
          console.error("Validation errors:", errors);
          let errorMessage = "Terjadi kesalahan validasi:\n";
          Object.keys(errors).forEach((key) => {
            errorMessage += `- ${errors[key]}
`;
          });
          isLoading.value = false;
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const scanPO = () => {
      if (!isValidCurrencyAmount(priceInput.value)) {
        priceError.value = "Harga harus diisi dan lebih dari 0";
        return;
      }
      priceError.value = "";
      isLoading.value = true;
      router.visit(
        `/product-incomes/${props.productIncome.id}/products/${props.incomeProduct.product_id}?scan_po=1&status_id=10`,
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: () => {
            showPOList.value = true;
            isLoading.value = false;
            if (props.poProductDetails) {
              let totalAllocated = 0;
              props.poProductDetails.forEach((detail) => {
                const key = `${detail.product_request_id}-${detail.product_id}`;
                const quantity = detail.stock || 0;
                inputQuantities.value[key] = quantity;
                totalAllocated += quantity;
                statusSelections.value[key] = detail.status_id || null;
                qtyApprovedInputs.value[key] = detail.qty_approved || 0;
                qtyShortageInputs.value[key] = detail.qty_shortage || 0;
                qtyOverInputs.value[key] = detail.qty_over || 0;
                originalData.value[key] = {
                  status_id: detail.status_id || null,
                  qty_approved: detail.qty_approved || 0,
                  qty_shortage: detail.qty_shortage || 0,
                  qty_over: detail.qty_over || 0,
                  qty_input: quantity
                };
              });
              let remaining = (props.incomeProduct.stock || 0) - totalAllocated;
              if (remaining > 0 && props.poProductDetails.length > 0) {
                const lastDetail = props.poProductDetails[props.poProductDetails.length - 1];
                const lastKey = `${lastDetail.product_request_id}-${lastDetail.product_id}`;
                inputQuantities.value[lastKey] = (inputQuantities.value[lastKey] || 0) + remaining;
                remaining = 0;
              }
              remainingStock.value = remaining;
            } else {
              remainingStock.value = props.incomeProduct.stock || 0;
            }
          },
          onError: () => {
            isLoading.value = false;
          }
        }
      );
    };
    const goBack = () => {
      router.visit("/product-incomes/" + props.productIncome.id + "/products");
    };
    const handlePriceInput = (event) => {
      const inputValue = event.target.value;
      const numericValue = parseRupiahToNumber(inputValue);
      priceInput.value = numericValue;
      priceInputFormatted.value = formatRupiahInput(inputValue);
      trackPriceChange();
    };
    const trackPriceChange = () => {
      priceChanged.value = parseFloat(priceInput.value || 0) !== parseFloat(originalPrice.value || 0);
      if (priceError.value) {
        priceError.value = "";
      }
    };
    const autoFillQuantities = () => {
      if (!props.poProductDetails || props.poProductDetails.length === 0) {
        return;
      }
      props.poProductDetails.forEach((detail) => {
        const key = `${detail.product_request_id}-${detail.product_id}`;
        const inputQty = inputQuantities.value[key] || 0;
        const orderedQty = detail.stock || 0;
        if (inputQty >= orderedQty) {
          qtyApprovedInputs.value[key] = orderedQty;
          qtyShortageInputs.value[key] = 0;
          qtyOverInputs.value[key] = inputQty - orderedQty;
        } else {
          qtyApprovedInputs.value[key] = inputQty;
          qtyShortageInputs.value[key] = orderedQty - inputQty;
          qtyOverInputs.value[key] = 0;
        }
        trackRowChange(key);
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `Product Detail - ${(_a = __props.incomeProduct.products) == null ? void 0 : _a.product_name}`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Product Detail" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b;
          if (_push2) {
            _push2(`<div data-v-fc426f3c${_scopeId}><h2 class="text-xl font-semibold leading-tight text-gray-800" data-v-fc426f3c${_scopeId}>Product Income Detail</h2><p class="text-muted" data-v-fc426f3c${_scopeId}>${ssrInterpolate((_a2 = __props.incomeProduct.products) == null ? void 0 : _a2.product_name)} - ${ssrInterpolate(formatDate(__props.productIncome.date_sending))}</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "text-xl font-semibold leading-tight text-gray-800" }, "Product Income Detail"),
                createVNode("p", { class: "text-muted" }, toDisplayString((_b = __props.incomeProduct.products) == null ? void 0 : _b.product_name) + " - " + toDisplayString(formatDate(__props.productIncome.date_sending)), 1)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<div class="p-3 text-gray-900" data-v-fc426f3c${_scopeId}><div class="d-flex justify-content-end mb-3" data-v-fc426f3c${_scopeId}><button class="btn btn-outline-secondary" data-v-fc426f3c${_scopeId}><i class="fas fa-arrow-left me-2" data-v-fc426f3c${_scopeId}></i> Kembali </button></div><div class="row mb-4" data-v-fc426f3c${_scopeId}><div class="col-12" data-v-fc426f3c${_scopeId}><div class="card" data-v-fc426f3c${_scopeId}><div class="card-body" data-v-fc426f3c${_scopeId}><div class="d-flex justify-content-between align-items-center mb-4" data-v-fc426f3c${_scopeId}><h5 class="card-title mb-0" data-v-fc426f3c${_scopeId}><i class="fas fa-box me-2" data-v-fc426f3c${_scopeId}></i> Detail Barang </h5>`);
            if (__props.incomeProduct.status) {
              _push2(`<div data-v-fc426f3c${_scopeId}><span class="${ssrRenderClass(getStatusBadgeClass(__props.incomeProduct.status))}" data-v-fc426f3c${_scopeId}>`);
              if ((_a2 = __props.incomeProduct.status.status_name) == null ? void 0 : _a2.toLowerCase().includes("lengkap")) {
                _push2(`<i class="fas fa-check-circle me-1" data-v-fc426f3c${_scopeId}></i>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(__props.incomeProduct.status.status_name)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="mb-3" data-v-fc426f3c${_scopeId}><label class="form-label fw-semibold" data-v-fc426f3c${_scopeId}>Nama Produk:</label><p class="fw-bold fs-5 text-primary mb-0" data-v-fc426f3c${_scopeId}>${ssrInterpolate(((_b = __props.incomeProduct.products) == null ? void 0 : _b.product_name) || "-")}</p></div><div class="mb-3" data-v-fc426f3c${_scopeId}><label class="form-label fw-semibold" data-v-fc426f3c${_scopeId}>SKU:</label><p class="mb-0" data-v-fc426f3c${_scopeId}><code class="fs-6" data-v-fc426f3c${_scopeId}>${ssrInterpolate(((_c = __props.incomeProduct.products) == null ? void 0 : _c.product_unit_sku) || "-")}</code></p></div><div class="mb-3" data-v-fc426f3c${_scopeId}><label class="form-label fw-semibold" data-v-fc426f3c${_scopeId}>Jumlah Total:</label><p class="mb-0" data-v-fc426f3c${_scopeId}><span class="badge bg-primary fs-6" data-v-fc426f3c${_scopeId}>${ssrInterpolate(__props.incomeProduct.stock || 0)}</span></p></div><div class="mb-3" data-v-fc426f3c${_scopeId}><label class="form-label fw-semibold" data-v-fc426f3c${_scopeId}>Sisa Stock:</label><p class="mb-0" data-v-fc426f3c${_scopeId}><span class="${ssrRenderClass([remainingStock.value >= 0 ? "bg-success" : "bg-danger", "badge fs-6"])}" data-v-fc426f3c${_scopeId}>${ssrInterpolate(remainingStock.value)}</span></p></div><div class="mb-4" data-v-fc426f3c${_scopeId}><label for="price" class="form-label fw-semibold" data-v-fc426f3c${_scopeId}>Harga:</label><div class="${ssrRenderClass([{ "has-validation": priceError.value }, "input-group"])}" data-v-fc426f3c${_scopeId}><span class="input-group-text" data-v-fc426f3c${_scopeId}>Rp</span><input type="text" id="price" class="${ssrRenderClass([{ "is-invalid": priceError.value }, "form-control"])}"${ssrRenderAttr("value", priceInputFormatted.value)} placeholder="0"${ssrIncludeBooleanAttr(
              __props.poProductDetails && __props.poProductDetails.every((detail) => detail.status_id === 12)
            ) ? " readonly" : ""} data-v-fc426f3c${_scopeId}>`);
            if (priceError.value) {
              _push2(`<div class="invalid-feedback" data-v-fc426f3c${_scopeId}>${ssrInterpolate(priceError.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="d-flex gap-2" data-v-fc426f3c${_scopeId}><button class="btn btn-outline-warning"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-fc426f3c${_scopeId}><i class="${ssrRenderClass([{ "fa-spin": isLoading.value }, "fas fa-recycle me-2"])}" data-v-fc426f3c${_scopeId}></i> ${ssrInterpolate(isLoading.value ? "Scanning..." : "Scaning PO")}</button>`);
            if (showPOList.value && __props.poProductDetails && __props.poProductDetails.length > 0) {
              _push2(`<button class="btn btn-outline-success"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} title="Otomatis mengisi kolom sudah diterima, kurang, dan qty over" data-v-fc426f3c${_scopeId}><i class="fas fa-magic me-2" data-v-fc426f3c${_scopeId}></i> Auto Fill </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div></div>`);
            if (showPOList.value) {
              _push2(`<div class="row mt-4" data-v-fc426f3c${_scopeId}><div class="col-12" data-v-fc426f3c${_scopeId}><div class="card" data-v-fc426f3c${_scopeId}><div class="card-body" data-v-fc426f3c${_scopeId}><h5 class="card-title mb-4" data-v-fc426f3c${_scopeId}><i class="fas fa-clipboard-list me-2" data-v-fc426f3c${_scopeId}></i> Detail Barang PO (SKU: ${ssrInterpolate(((_d = __props.incomeProduct.products) == null ? void 0 : _d.product_unit_sku) || "-")}) </h5>`);
              if (!__props.poProductDetails || __props.poProductDetails.length === 0) {
                _push2(`<div class="text-muted py-4 text-center" data-v-fc426f3c${_scopeId}><i class="fas fa-inbox fa-3x mb-3" data-v-fc426f3c${_scopeId}></i><p data-v-fc426f3c${_scopeId}>Tidak ada PO untuk SKU ${ssrInterpolate(((_e = __props.incomeProduct.products) == null ? void 0 : _e.product_unit_sku) || "ini")}</p></div>`);
              } else {
                _push2(`<div class="table-responsive" data-v-fc426f3c${_scopeId}><table class="table-striped table-hover table" data-v-fc426f3c${_scopeId}><thead class="table-light" data-v-fc426f3c${_scopeId}><tr data-v-fc426f3c${_scopeId}><th data-v-fc426f3c${_scopeId}>No Tiket</th><th data-v-fc426f3c${_scopeId}>Nama Barang</th><th data-v-fc426f3c${_scopeId}>Status</th><th class="text-center" data-v-fc426f3c${_scopeId}>Jumlah Pesanan</th><th class="text-center" data-v-fc426f3c${_scopeId}>Sudah Diterima</th><th class="text-center" data-v-fc426f3c${_scopeId}>Kurang</th><th class="text-center" data-v-fc426f3c${_scopeId}>Qty Over</th><th class="text-center" data-v-fc426f3c${_scopeId}>Input Jumlah</th></tr></thead><tbody data-v-fc426f3c${_scopeId}><!--[-->`);
                ssrRenderList(__props.poProductDetails, (detail) => {
                  var _a3, _b2;
                  _push2(`<tr data-v-fc426f3c${_scopeId}><td data-v-fc426f3c${_scopeId}><strong data-v-fc426f3c${_scopeId}>${ssrInterpolate(((_a3 = detail.product_request) == null ? void 0 : _a3.no_tiket) || "-")}</strong></td><td data-v-fc426f3c${_scopeId}><span class="text-primary fw-medium" data-v-fc426f3c${_scopeId}>${ssrInterpolate(((_b2 = detail.product) == null ? void 0 : _b2.product_name) || "-")}</span></td><td class="text-center" data-v-fc426f3c${_scopeId}><select class="form-control form-control-sm" style="${ssrRenderStyle({ "width": "120px", "margin": "0 auto" })}"${ssrIncludeBooleanAttr(detail.status_id === 12) ? " disabled" : ""} data-v-fc426f3c${_scopeId}><option${ssrRenderAttr("value", null)} data-v-fc426f3c${ssrIncludeBooleanAttr(Array.isArray(
                    statusSelections.value[`${detail.product_request_id}-${detail.product_id}`]
                  ) ? ssrLooseContain(
                    statusSelections.value[`${detail.product_request_id}-${detail.product_id}`],
                    null
                  ) : ssrLooseEqual(
                    statusSelections.value[`${detail.product_request_id}-${detail.product_id}`],
                    null
                  )) ? " selected" : ""}${_scopeId}>- Pilih Status -</option><!--[-->`);
                  ssrRenderList(__props.statusOptions, (status) => {
                    _push2(`<option${ssrRenderAttr("value", status.id)} data-v-fc426f3c${ssrIncludeBooleanAttr(Array.isArray(
                      statusSelections.value[`${detail.product_request_id}-${detail.product_id}`]
                    ) ? ssrLooseContain(
                      statusSelections.value[`${detail.product_request_id}-${detail.product_id}`],
                      status.id
                    ) : ssrLooseEqual(
                      statusSelections.value[`${detail.product_request_id}-${detail.product_id}`],
                      status.id
                    )) ? " selected" : ""}${_scopeId}>${ssrInterpolate(status.status_name)}</option>`);
                  });
                  _push2(`<!--]--></select></td><td class="text-center" data-v-fc426f3c${_scopeId}><span class="badge bg-info" data-v-fc426f3c${_scopeId}>${ssrInterpolate(detail.stock || 0)}</span></td><td class="text-center" data-v-fc426f3c${_scopeId}><input type="number" class="form-control form-control-sm no-spinner" style="${ssrRenderStyle({ "width": "60px", "margin": "0 auto" })}"${ssrRenderAttr(
                    "value",
                    qtyApprovedInputs.value[`${detail.product_request_id}-${detail.product_id}`]
                  )} min="0" placeholder="0"${ssrIncludeBooleanAttr(detail.status_id === 12) ? " readonly" : ""} data-v-fc426f3c${_scopeId}></td><td class="text-center" data-v-fc426f3c${_scopeId}><input type="number" class="form-control form-control-sm no-spinner" style="${ssrRenderStyle({ "width": "60px", "margin": "0 auto" })}"${ssrRenderAttr(
                    "value",
                    qtyShortageInputs.value[`${detail.product_request_id}-${detail.product_id}`]
                  )} min="0" placeholder="0"${ssrIncludeBooleanAttr(detail.status_id === 12) ? " readonly" : ""} data-v-fc426f3c${_scopeId}></td><td class="text-center" data-v-fc426f3c${_scopeId}><input type="number" class="form-control form-control-sm no-spinner" style="${ssrRenderStyle({ "width": "60px", "margin": "0 auto" })}"${ssrRenderAttr(
                    "value",
                    qtyOverInputs.value[`${detail.product_request_id}-${detail.product_id}`]
                  )} min="0" placeholder="0"${ssrIncludeBooleanAttr(detail.status_id === 12) ? " readonly" : ""} data-v-fc426f3c${_scopeId}></td><td class="text-center" data-v-fc426f3c${_scopeId}><input type="number" class="form-control form-control-sm no-spinner" style="${ssrRenderStyle({ "width": "40px", "margin": "0 auto" })}"${ssrRenderAttr(
                    "value",
                    inputQuantities.value[`${detail.product_request_id}-${detail.product_id}`] || 0
                  )} min="0" placeholder="0"${ssrIncludeBooleanAttr(detail.status_id === 12) ? " readonly" : ""} data-v-fc426f3c${_scopeId}></td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div>`);
              }
              if (__props.poProductDetails && __props.poProductDetails.length > 0) {
                _push2(`<div class="d-flex justify-content-between align-items-center mt-3" data-v-fc426f3c${_scopeId}><div class="text-muted" data-v-fc426f3c${_scopeId}><small data-v-fc426f3c${_scopeId}>${ssrInterpolate(changedRows.value.size)} baris diubah `);
                if (priceChanged.value) {
                  _push2(`<span data-v-fc426f3c${_scopeId}>, harga diubah</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</small></div><button class="btn btn-primary"${ssrIncludeBooleanAttr(changedRows.value.size === 0 && !priceChanged.value || isLoading.value) ? " disabled" : ""} data-v-fc426f3c${_scopeId}><i class="${ssrRenderClass([{ "fa-spin": isLoading.value }, "fas fa-save me-2"])}" data-v-fc426f3c${_scopeId}></i> ${ssrInterpolate(isLoading.value ? "Menyimpan..." : `Simpan Perubahan (${changedRows.value.size + (priceChanged.value ? 1 : 0)})`)}</button></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "p-3 text-gray-900" }, [
                createVNode("div", { class: "d-flex justify-content-end mb-3" }, [
                  createVNode("button", {
                    onClick: ($event) => goBack(),
                    class: "btn btn-outline-secondary"
                  }, [
                    createVNode("i", { class: "fas fa-arrow-left me-2" }),
                    createTextVNode(" Kembali ")
                  ], 8, ["onClick"])
                ]),
                createVNode("div", { class: "row mb-4" }, [
                  createVNode("div", { class: "col-12" }, [
                    createVNode("div", { class: "card" }, [
                      createVNode("div", { class: "card-body" }, [
                        createVNode("div", { class: "d-flex justify-content-between align-items-center mb-4" }, [
                          createVNode("h5", { class: "card-title mb-0" }, [
                            createVNode("i", { class: "fas fa-box me-2" }),
                            createTextVNode(" Detail Barang ")
                          ]),
                          __props.incomeProduct.status ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode("span", {
                              class: getStatusBadgeClass(__props.incomeProduct.status)
                            }, [
                              ((_f = __props.incomeProduct.status.status_name) == null ? void 0 : _f.toLowerCase().includes("lengkap")) ? (openBlock(), createBlock("i", {
                                key: 0,
                                class: "fas fa-check-circle me-1"
                              })) : createCommentVNode("", true),
                              createTextVNode(" " + toDisplayString(__props.incomeProduct.status.status_name), 1)
                            ], 2)
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode("label", { class: "form-label fw-semibold" }, "Nama Produk:"),
                          createVNode("p", { class: "fw-bold fs-5 text-primary mb-0" }, toDisplayString(((_g = __props.incomeProduct.products) == null ? void 0 : _g.product_name) || "-"), 1)
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode("label", { class: "form-label fw-semibold" }, "SKU:"),
                          createVNode("p", { class: "mb-0" }, [
                            createVNode("code", { class: "fs-6" }, toDisplayString(((_h = __props.incomeProduct.products) == null ? void 0 : _h.product_unit_sku) || "-"), 1)
                          ])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode("label", { class: "form-label fw-semibold" }, "Jumlah Total:"),
                          createVNode("p", { class: "mb-0" }, [
                            createVNode("span", { class: "badge bg-primary fs-6" }, toDisplayString(__props.incomeProduct.stock || 0), 1)
                          ])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode("label", { class: "form-label fw-semibold" }, "Sisa Stock:"),
                          createVNode("p", { class: "mb-0" }, [
                            createVNode("span", {
                              class: ["badge fs-6", remainingStock.value >= 0 ? "bg-success" : "bg-danger"]
                            }, toDisplayString(remainingStock.value), 3)
                          ])
                        ]),
                        createVNode("div", { class: "mb-4" }, [
                          createVNode("label", {
                            for: "price",
                            class: "form-label fw-semibold"
                          }, "Harga:"),
                          createVNode("div", {
                            class: ["input-group", { "has-validation": priceError.value }]
                          }, [
                            createVNode("span", { class: "input-group-text" }, "Rp"),
                            createVNode("input", {
                              type: "text",
                              id: "price",
                              class: ["form-control", { "is-invalid": priceError.value }],
                              value: priceInputFormatted.value,
                              onInput: handlePriceInput,
                              placeholder: "0",
                              readonly: __props.poProductDetails && __props.poProductDetails.every((detail) => detail.status_id === 12)
                            }, null, 42, ["value", "readonly"]),
                            priceError.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "invalid-feedback"
                            }, toDisplayString(priceError.value), 1)) : createCommentVNode("", true)
                          ], 2)
                        ]),
                        createVNode("div", { class: "d-flex gap-2" }, [
                          createVNode("button", {
                            class: "btn btn-outline-warning",
                            onClick: scanPO,
                            disabled: isLoading.value
                          }, [
                            createVNode("i", {
                              class: ["fas fa-recycle me-2", { "fa-spin": isLoading.value }]
                            }, null, 2),
                            createTextVNode(" " + toDisplayString(isLoading.value ? "Scanning..." : "Scaning PO"), 1)
                          ], 8, ["disabled"]),
                          showPOList.value && __props.poProductDetails && __props.poProductDetails.length > 0 ? (openBlock(), createBlock("button", {
                            key: 0,
                            class: "btn btn-outline-success",
                            onClick: autoFillQuantities,
                            disabled: isLoading.value,
                            title: "Otomatis mengisi kolom sudah diterima, kurang, dan qty over"
                          }, [
                            createVNode("i", { class: "fas fa-magic me-2" }),
                            createTextVNode(" Auto Fill ")
                          ], 8, ["disabled"])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ]),
                showPOList.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "row mt-4"
                }, [
                  createVNode("div", { class: "col-12" }, [
                    createVNode("div", { class: "card" }, [
                      createVNode("div", { class: "card-body" }, [
                        createVNode("h5", { class: "card-title mb-4" }, [
                          createVNode("i", { class: "fas fa-clipboard-list me-2" }),
                          createTextVNode(" Detail Barang PO (SKU: " + toDisplayString(((_i = __props.incomeProduct.products) == null ? void 0 : _i.product_unit_sku) || "-") + ") ", 1)
                        ]),
                        !__props.poProductDetails || __props.poProductDetails.length === 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-muted py-4 text-center"
                        }, [
                          createVNode("i", { class: "fas fa-inbox fa-3x mb-3" }),
                          createVNode("p", null, "Tidak ada PO untuk SKU " + toDisplayString(((_j = __props.incomeProduct.products) == null ? void 0 : _j.product_unit_sku) || "ini"), 1)
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "table-responsive"
                        }, [
                          createVNode("table", { class: "table-striped table-hover table" }, [
                            createVNode("thead", { class: "table-light" }, [
                              createVNode("tr", null, [
                                createVNode("th", null, "No Tiket"),
                                createVNode("th", null, "Nama Barang"),
                                createVNode("th", null, "Status"),
                                createVNode("th", { class: "text-center" }, "Jumlah Pesanan"),
                                createVNode("th", { class: "text-center" }, "Sudah Diterima"),
                                createVNode("th", { class: "text-center" }, "Kurang"),
                                createVNode("th", { class: "text-center" }, "Qty Over"),
                                createVNode("th", { class: "text-center" }, "Input Jumlah")
                              ])
                            ]),
                            createVNode("tbody", null, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.poProductDetails, (detail) => {
                                var _a3, _b2;
                                return openBlock(), createBlock("tr", {
                                  key: `${detail.product_request_id}-${detail.product_id}`
                                }, [
                                  createVNode("td", null, [
                                    createVNode("strong", null, toDisplayString(((_a3 = detail.product_request) == null ? void 0 : _a3.no_tiket) || "-"), 1)
                                  ]),
                                  createVNode("td", null, [
                                    createVNode("span", { class: "text-primary fw-medium" }, toDisplayString(((_b2 = detail.product) == null ? void 0 : _b2.product_name) || "-"), 1)
                                  ]),
                                  createVNode("td", { class: "text-center" }, [
                                    withDirectives(createVNode("select", {
                                      class: "form-control form-control-sm",
                                      style: { "width": "120px", "margin": "0 auto" },
                                      "onUpdate:modelValue": ($event) => statusSelections.value[`${detail.product_request_id}-${detail.product_id}`] = $event,
                                      onChange: ($event) => trackRowChange(
                                        `${detail.product_request_id}-${detail.product_id}`
                                      ),
                                      disabled: detail.status_id === 12
                                    }, [
                                      createVNode("option", { value: null }, "- Pilih Status -"),
                                      (openBlock(true), createBlock(Fragment, null, renderList(__props.statusOptions, (status) => {
                                        return openBlock(), createBlock("option", {
                                          key: status.id,
                                          value: status.id
                                        }, toDisplayString(status.status_name), 9, ["value"]);
                                      }), 128))
                                    ], 40, ["onUpdate:modelValue", "onChange", "disabled"]), [
                                      [
                                        vModelSelect,
                                        statusSelections.value[`${detail.product_request_id}-${detail.product_id}`]
                                      ]
                                    ])
                                  ]),
                                  createVNode("td", { class: "text-center" }, [
                                    createVNode("span", { class: "badge bg-info" }, toDisplayString(detail.stock || 0), 1)
                                  ]),
                                  createVNode("td", { class: "text-center" }, [
                                    withDirectives(createVNode("input", {
                                      type: "number",
                                      class: "form-control form-control-sm no-spinner",
                                      style: { "width": "60px", "margin": "0 auto" },
                                      "onUpdate:modelValue": ($event) => qtyApprovedInputs.value[`${detail.product_request_id}-${detail.product_id}`] = $event,
                                      onInput: ($event) => trackRowChange(
                                        `${detail.product_request_id}-${detail.product_id}`
                                      ),
                                      min: "0",
                                      placeholder: "0",
                                      readonly: detail.status_id === 12
                                    }, null, 40, ["onUpdate:modelValue", "onInput", "readonly"]), [
                                      [
                                        vModelText,
                                        qtyApprovedInputs.value[`${detail.product_request_id}-${detail.product_id}`]
                                      ]
                                    ])
                                  ]),
                                  createVNode("td", { class: "text-center" }, [
                                    withDirectives(createVNode("input", {
                                      type: "number",
                                      class: "form-control form-control-sm no-spinner",
                                      style: { "width": "60px", "margin": "0 auto" },
                                      "onUpdate:modelValue": ($event) => qtyShortageInputs.value[`${detail.product_request_id}-${detail.product_id}`] = $event,
                                      onInput: ($event) => trackRowChange(
                                        `${detail.product_request_id}-${detail.product_id}`
                                      ),
                                      min: "0",
                                      placeholder: "0",
                                      readonly: detail.status_id === 12
                                    }, null, 40, ["onUpdate:modelValue", "onInput", "readonly"]), [
                                      [
                                        vModelText,
                                        qtyShortageInputs.value[`${detail.product_request_id}-${detail.product_id}`]
                                      ]
                                    ])
                                  ]),
                                  createVNode("td", { class: "text-center" }, [
                                    withDirectives(createVNode("input", {
                                      type: "number",
                                      class: "form-control form-control-sm no-spinner",
                                      style: { "width": "60px", "margin": "0 auto" },
                                      "onUpdate:modelValue": ($event) => qtyOverInputs.value[`${detail.product_request_id}-${detail.product_id}`] = $event,
                                      onInput: ($event) => trackRowChange(
                                        `${detail.product_request_id}-${detail.product_id}`
                                      ),
                                      min: "0",
                                      placeholder: "0",
                                      readonly: detail.status_id === 12
                                    }, null, 40, ["onUpdate:modelValue", "onInput", "readonly"]), [
                                      [
                                        vModelText,
                                        qtyOverInputs.value[`${detail.product_request_id}-${detail.product_id}`]
                                      ]
                                    ])
                                  ]),
                                  createVNode("td", { class: "text-center" }, [
                                    createVNode("input", {
                                      type: "number",
                                      class: "form-control form-control-sm no-spinner",
                                      style: { "width": "40px", "margin": "0 auto" },
                                      value: inputQuantities.value[`${detail.product_request_id}-${detail.product_id}`] || 0,
                                      onInput: ($event) => updateQuantity(
                                        `${detail.product_request_id}-${detail.product_id}`,
                                        $event.target.value,
                                        inputQuantities.value[`${detail.product_request_id}-${detail.product_id}`] || 0
                                      ),
                                      min: "0",
                                      placeholder: "0",
                                      readonly: detail.status_id === 12
                                    }, null, 40, ["value", "onInput", "readonly"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])
                        ])),
                        __props.poProductDetails && __props.poProductDetails.length > 0 ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "d-flex justify-content-between align-items-center mt-3"
                        }, [
                          createVNode("div", { class: "text-muted" }, [
                            createVNode("small", null, [
                              createTextVNode(toDisplayString(changedRows.value.size) + " baris diubah ", 1),
                              priceChanged.value ? (openBlock(), createBlock("span", { key: 0 }, ", harga diubah")) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("button", {
                            class: "btn btn-primary",
                            onClick: saveChanges,
                            disabled: changedRows.value.size === 0 && !priceChanged.value || isLoading.value
                          }, [
                            createVNode("i", {
                              class: ["fas fa-save me-2", { "fa-spin": isLoading.value }]
                            }, null, 2),
                            createTextVNode(" " + toDisplayString(isLoading.value ? "Menyimpan..." : `Simpan Perubahan (${changedRows.value.size + (priceChanged.value ? 1 : 0)})`), 1)
                          ], 8, ["disabled"])
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreStockOpnameProducts/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Show = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fc426f3c"]]);
export {
  Show as default
};
