import { ref, onMounted, computed, watch, unref, withCtx, createBlock, openBlock, createVNode, createTextVNode, withModifiers, withDirectives, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$5 } from "./NumberInput-DiiebTlv.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { _ as _sfc_main$1 } from "./AuthenticatedLayout-CJQU9ReZ.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { u as uploadDefaultImg } from "./upload_default-DzIANolR.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue3-toastify";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    product: Object,
    categories: Array,
    productTypes: Array,
    suppliers: Array,
    propertyItems: Array,
    packagingSizes: Array,
    packagingTypes: Array,
    repackStatus: Array
  },
  setup(__props) {
    const props = __props;
    const imagePreview = ref([]);
    const fileInputRef = ref(null);
    const targetSellingDays = ref(0);
    const formProductType = [
      { name: "Produk Bahan Baku" },
      { name: "Produk Jadi" }
    ];
    const form = useForm({
      product_name: props.product.product_name || "",
      brand_name: props.product.brand_name || "",
      m_category_id: props.product.m_category_id,
      product_type: props.product.product_type,
      m_supplier_id: props.product.m_supplier_id,
      description: props.product.description || "",
      target_selling_date: props.product.target_selling_date,
      product_is_pre_order: props.product.product_is_pre_order || false,
      product_processing_days: props.product.product_processing_days || 0,
      m_property_item_id: props.product.m_property_item_id,
      m_packaging_size_id: props.product.m_packaging_size_id,
      m_packaging_type_id: props.product.m_packaging_type_id,
      m_repack_status_id: props.product.m_repack_status_id,
      packaging_size_input: Number(props.product.packaging_size_input) || 0,
      product_unit_sku: props.product.product_unit_sku || "",
      product_unit_qty: props.product.product_unit_qty || 0,
      product_unit_price: props.product.product_unit_price || 0,
      expired_date: props.product.expired_date ? new Date(props.product.expired_date).toISOString().split("T")[0] : null,
      images: [],
      existing_images: props.product.product_images || props.product.productImages || [],
      deleted_images: []
    });
    onMounted(() => {
      if (props.product.target_selling_date) {
        const today = /* @__PURE__ */ new Date();
        const targetDate = new Date(props.product.target_selling_date);
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        targetSellingDays.value = diffDays > 0 ? diffDays : 1;
      }
    });
    const calculatedTargetDate = computed(() => {
      if (!targetSellingDays.value) return "";
      const today = /* @__PURE__ */ new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + parseInt(targetSellingDays.value));
      return targetDate.toISOString().split("T")[0];
    });
    watch(targetSellingDays, (newDays) => {
      if (newDays) {
        const today = /* @__PURE__ */ new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + parseInt(newDays));
        form.target_selling_date = targetDate.toISOString().split("T")[0];
      } else {
        form.target_selling_date = null;
      }
    });
    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      imagePreview.value = [];
      form.images = [];
      files.forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreview.value.push({
              url: e.target.result,
              file,
              index
            });
          };
          reader.readAsDataURL(file);
          form.images.push(file);
        }
      });
    };
    const removeNewImage = (index) => {
      imagePreview.value.splice(index, 1);
      form.images.splice(index, 1);
    };
    const removeExistingImage = (imageId, index) => {
      form.deleted_images.push(imageId);
      form.existing_images.splice(index, 1);
    };
    const submit = () => {
      form.transform((data) => ({
        ...data,
        _method: "PUT"
      })).post(route("products.update", props.product.id), {
        forceFormData: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Edit Produk" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { title: "Edit Produk" }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h2 class="text-xl font-semibold leading-tight text-gray-800"${_scopeId}> Edit Produk </h2>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("products.index"),
              class: "btn btn-secondary"
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
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h2", { class: "text-xl font-semibold leading-tight text-gray-800" }, " Edit Produk "),
                createVNode(unref(Link), {
                  href: _ctx.route("products.index"),
                  class: "btn btn-secondary"
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
            _push2(`<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg"${_scopeId}><div class="m-3 text-gray-900"${_scopeId}><form${_scopeId}><div class="row"${_scopeId}><div class="col-md-8"${_scopeId}><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_name",
              value: "Nama Produk"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "product_name",
              modelValue: unref(form).product_name,
              "onUpdate:modelValue": ($event) => unref(form).product_name = $event,
              type: "text",
              class: "form-control",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.product_name,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "brand_name",
              value: "Brand"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "brand_name",
              modelValue: unref(form).brand_name,
              "onUpdate:modelValue": ($event) => unref(form).brand_name = $event,
              type: "text",
              class: "form-control"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.brand_name,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_category_id",
              value: "Kategori"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_category_id" class="form-select" required${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_category_id) ? ssrLooseContain(unref(form).m_category_id, null) : ssrLooseEqual(unref(form).m_category_id, null)) ? " selected" : ""}${_scopeId}> Pilih Kategori </option><!--[-->`);
            ssrRenderList(__props.categories, (category) => {
              _push2(`<option${ssrRenderAttr("value", category.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_category_id) ? ssrLooseContain(unref(form).m_category_id, category.id) : ssrLooseEqual(unref(form).m_category_id, category.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(category.category_name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_category_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_type",
              value: "Tipe Produk"
            }, null, _parent2, _scopeId));
            _push2(`<select id="product_type" class="form-select" required${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_type) ? ssrLooseContain(unref(form).product_type, null) : ssrLooseEqual(unref(form).product_type, null)) ? " selected" : ""}${_scopeId}> Pilih Tipe Produk </option><!--[-->`);
            ssrRenderList(formProductType, (type, index) => {
              _push2(`<option${ssrRenderAttr("value", type.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_type) ? ssrLooseContain(unref(form).product_type, type.name) : ssrLooseEqual(unref(form).product_type, type.name)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(type.name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.product_type,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_supplier_id",
              value: "Supplier"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_supplier_id" class="form-select" required${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_supplier_id) ? ssrLooseContain(unref(form).m_supplier_id, null) : ssrLooseEqual(unref(form).m_supplier_id, null)) ? " selected" : ""}${_scopeId}> Pilih Supplier </option><!--[-->`);
            ssrRenderList(__props.suppliers, (supplier) => {
              _push2(`<option${ssrRenderAttr("value", supplier.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_supplier_id) ? ssrLooseContain(unref(form).m_supplier_id, supplier.id) : ssrLooseEqual(unref(form).m_supplier_id, supplier.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(supplier.supplier_name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_supplier_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "target_selling_date",
              value: "Target Selling Date (days)"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              id: "target_selling_date",
              modelValue: targetSellingDays.value,
              "onUpdate:modelValue": ($event) => targetSellingDays.value = $event,
              type: "number",
              min: "1",
              class: "form-control",
              placeholder: "Enter days from today"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.target_selling_date,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`<small class="text-muted"${_scopeId}>Calculated date: ${ssrInterpolate(calculatedTargetDate.value)}</small></div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "expired_date",
              value: "Expired Date"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "expired_date",
              modelValue: unref(form).expired_date,
              "onUpdate:modelValue": ($event) => unref(form).expired_date = $event,
              type: "date",
              class: "form-control"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.expired_date,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_property_item_id",
              value: "Property Item",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_property_item_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_property_item_id) ? ssrLooseContain(unref(form).m_property_item_id, null) : ssrLooseEqual(unref(form).m_property_item_id, null)) ? " selected" : ""}${_scopeId}> Select Property Item </option><!--[-->`);
            ssrRenderList(__props.propertyItems, (item) => {
              _push2(`<option${ssrRenderAttr("value", item.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_property_item_id) ? ssrLooseContain(unref(form).m_property_item_id, item.id) : ssrLooseEqual(unref(form).m_property_item_id, item.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(item.property_code)} (${ssrInterpolate(item.property_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_property_item_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_packaging_size_id",
              value: "Packaging Size",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_packaging_size_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_size_id) ? ssrLooseContain(unref(form).m_packaging_size_id, null) : ssrLooseEqual(unref(form).m_packaging_size_id, null)) ? " selected" : ""}${_scopeId}> Select Packaging Size </option><!--[-->`);
            ssrRenderList(__props.packagingSizes, (size) => {
              _push2(`<option${ssrRenderAttr("value", size.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_size_id) ? ssrLooseContain(unref(form).m_packaging_size_id, size.id) : ssrLooseEqual(unref(form).m_packaging_size_id, size.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(size.packaging_size_code)} (${ssrInterpolate(size.packaging_size_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_packaging_size_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_packaging_type_id",
              value: "Packaging Type",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_packaging_type_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_type_id) ? ssrLooseContain(unref(form).m_packaging_type_id, null) : ssrLooseEqual(unref(form).m_packaging_type_id, null)) ? " selected" : ""}${_scopeId}> Select Packaging Type </option><!--[-->`);
            ssrRenderList(__props.packagingTypes, (type) => {
              _push2(`<option${ssrRenderAttr("value", type.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_type_id) ? ssrLooseContain(unref(form).m_packaging_type_id, type.id) : ssrLooseEqual(unref(form).m_packaging_type_id, type.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(type.packaging_type_code)} (${ssrInterpolate(type.packaging_type_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_packaging_type_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_repack_status_id",
              value: "Repack Status",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_repack_status_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_repack_status_id) ? ssrLooseContain(unref(form).m_repack_status_id, null) : ssrLooseEqual(unref(form).m_repack_status_id, null)) ? " selected" : ""}${_scopeId}> Select Repack Status </option><!--[-->`);
            ssrRenderList(__props.repackStatus, (status) => {
              _push2(`<option${ssrRenderAttr("value", status.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_repack_status_id) ? ssrLooseContain(unref(form).m_repack_status_id, status.id) : ssrLooseEqual(unref(form).m_repack_status_id, status.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(status.repack_code)} (${ssrInterpolate(status.repack_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_repack_status_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_unit_sku",
              value: "SKU"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "product_unit_sku",
              modelValue: unref(form).product_unit_sku,
              "onUpdate:modelValue": ($event) => unref(form).product_unit_sku = $event,
              type: "text",
              class: "form-control",
              disabled: true
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.product_unit_sku,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_unit_price",
              value: "Price"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "product_unit_price",
              modelValue: unref(form).product_unit_price,
              "onUpdate:modelValue": ($event) => unref(form).product_unit_price = $event,
              type: "number",
              class: "form-control"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.product_unit_price,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "description",
              value: "Description"
            }, null, _parent2, _scopeId));
            _push2(`<textarea id="description" class="form-control"${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.description,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="col-md-4"${_scopeId}><div class="mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "images",
              value: "Gambar Produk"
            }, null, _parent2, _scopeId));
            _push2(`<div class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400"${_scopeId}><img${ssrRenderAttr("src", unref(uploadDefaultImg))} alt="Upload" class="mx-auto mb-2" style="${ssrRenderStyle({ "width": "64px", "height": "64px", "opacity": "0.6" })}"${_scopeId}><p class="mb-0 text-gray-500"${_scopeId}> Klik untuk memilih gambar </p><small class="text-muted"${_scopeId}> Format yang didukung: JPG, PNG, GIF. Maksimal 5MB per file. </small></div><input type="file" id="images" class="d-none" multiple accept="image/*"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.images,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (imagePreview.value.length > 0) {
              _push2(`<div class="mb-3"${_scopeId}><h6${_scopeId}>Preview Gambar Baru:</h6><div class="row"${_scopeId}><!--[-->`);
              ssrRenderList(imagePreview.value, (image, index) => {
                _push2(`<div class="col-md-6 mb-2"${_scopeId}><div class="position-relative"${_scopeId}><img${ssrRenderAttr("src", image.url)} alt="Preview" class="img-thumbnail" style="${ssrRenderStyle({ "width": "100%", "height": "120px", "object-fit": "cover" })}"${_scopeId}><button type="button" class="btn btn-danger btn-sm position-absolute end-0 top-0" style="${ssrRenderStyle({ "z-index": "10" })}"${_scopeId}><i class="fas fa-times"${_scopeId}></i></button></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(form).existing_images && unref(form).existing_images.length > 0) {
              _push2(`<div class="mb-3"${_scopeId}><h6${_scopeId}>Gambar Saat Ini:</h6><div class="row"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).existing_images, (image, index) => {
                _push2(`<div class="col-md-6 mb-2"${_scopeId}><div class="position-relative"${_scopeId}><img${ssrRenderAttr("src", image.image_url)} alt="Existing" class="img-thumbnail" style="${ssrRenderStyle({ "width": "100%", "height": "120px", "object-fit": "cover" })}"${_scopeId}><button type="button" class="btn·btn-danger·btn-sm·position-absolute·end-0·top-0" style="${ssrRenderStyle({ "z-index": "10" })}"${_scopeId}><i class="fas fa-times"${_scopeId}></i></button></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="d-flex justify-content-start mt-4 gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              disabled: unref(form).processing,
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(form).processing) {
                    _push3(`<span${_scopeId2}><i class="fas fa-spinner fa-spin me-1"${_scopeId2}></i> Menyimpan... </span>`);
                  } else {
                    _push3(`<span${_scopeId2}><i class="fas fa-save me-1"${_scopeId2}></i> Update </span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Menyimpan... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-save me-1" }),
                      createTextVNode(" Update ")
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("products.index"),
              class: "btn btn-secondary"
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
          } else {
            return [
              createVNode("div", { class: "overflow-hidden bg-white shadow-sm sm:rounded-lg" }, [
                createVNode("div", { class: "m-3 text-gray-900" }, [
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "row" }, [
                      createVNode("div", { class: "col-md-8" }, [
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "product_name",
                            value: "Nama Produk"
                          }),
                          createVNode(_sfc_main$3, {
                            id: "product_name",
                            modelValue: unref(form).product_name,
                            "onUpdate:modelValue": ($event) => unref(form).product_name = $event,
                            type: "text",
                            class: "form-control",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.product_name,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "brand_name",
                            value: "Brand"
                          }),
                          createVNode(_sfc_main$3, {
                            id: "brand_name",
                            modelValue: unref(form).brand_name,
                            "onUpdate:modelValue": ($event) => unref(form).brand_name = $event,
                            type: "text",
                            class: "form-control"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.brand_name,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "m_category_id",
                            value: "Kategori"
                          }),
                          withDirectives(createVNode("select", {
                            id: "m_category_id",
                            "onUpdate:modelValue": ($event) => unref(form).m_category_id = $event,
                            class: "form-select",
                            required: ""
                          }, [
                            createVNode("option", {
                              value: null,
                              disabled: ""
                            }, " Pilih Kategori "),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (category) => {
                              return openBlock(), createBlock("option", {
                                key: category.id,
                                value: category.id
                              }, toDisplayString(category.category_name), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).m_category_id]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.m_category_id,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "product_type",
                            value: "Tipe Produk"
                          }),
                          withDirectives(createVNode("select", {
                            id: "product_type",
                            "onUpdate:modelValue": ($event) => unref(form).product_type = $event,
                            class: "form-select",
                            required: ""
                          }, [
                            createVNode("option", {
                              value: null,
                              disabled: ""
                            }, " Pilih Tipe Produk "),
                            (openBlock(), createBlock(Fragment, null, renderList(formProductType, (type, index) => {
                              return createVNode("option", {
                                key: index,
                                value: type.name
                              }, toDisplayString(type.name), 9, ["value"]);
                            }), 64))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).product_type]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.product_type,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "m_supplier_id",
                            value: "Supplier"
                          }),
                          withDirectives(createVNode("select", {
                            id: "m_supplier_id",
                            "onUpdate:modelValue": ($event) => unref(form).m_supplier_id = $event,
                            class: "form-select",
                            required: ""
                          }, [
                            createVNode("option", {
                              value: null,
                              disabled: ""
                            }, " Pilih Supplier "),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.suppliers, (supplier) => {
                              return openBlock(), createBlock("option", {
                                key: supplier.id,
                                value: supplier.id
                              }, toDisplayString(supplier.supplier_name), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).m_supplier_id]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.m_supplier_id,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "target_selling_date",
                            value: "Target Selling Date (days)"
                          }),
                          createVNode(_sfc_main$5, {
                            id: "target_selling_date",
                            modelValue: targetSellingDays.value,
                            "onUpdate:modelValue": ($event) => targetSellingDays.value = $event,
                            type: "number",
                            min: "1",
                            class: "form-control",
                            placeholder: "Enter days from today"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.target_selling_date,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"]),
                          createVNode("small", { class: "text-muted" }, "Calculated date: " + toDisplayString(calculatedTargetDate.value), 1)
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "expired_date",
                            value: "Expired Date"
                          }),
                          createVNode(_sfc_main$3, {
                            id: "expired_date",
                            modelValue: unref(form).expired_date,
                            "onUpdate:modelValue": ($event) => unref(form).expired_date = $event,
                            type: "date",
                            class: "form-control"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.expired_date,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "m_property_item_id",
                            value: "Property Item",
                            required: ""
                          }),
                          withDirectives(createVNode("select", {
                            id: "m_property_item_id",
                            "onUpdate:modelValue": ($event) => unref(form).m_property_item_id = $event,
                            class: "form-select"
                          }, [
                            createVNode("option", {
                              value: null,
                              disabled: ""
                            }, " Select Property Item "),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.propertyItems, (item) => {
                              return openBlock(), createBlock("option", {
                                key: item.id,
                                value: item.id
                              }, toDisplayString(item.property_code) + " (" + toDisplayString(item.property_name) + ") ", 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).m_property_item_id]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.m_property_item_id,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "m_packaging_size_id",
                            value: "Packaging Size",
                            required: ""
                          }),
                          withDirectives(createVNode("select", {
                            id: "m_packaging_size_id",
                            "onUpdate:modelValue": ($event) => unref(form).m_packaging_size_id = $event,
                            class: "form-select"
                          }, [
                            createVNode("option", {
                              value: null,
                              disabled: ""
                            }, " Select Packaging Size "),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.packagingSizes, (size) => {
                              return openBlock(), createBlock("option", {
                                key: size.id,
                                value: size.id
                              }, toDisplayString(size.packaging_size_code) + " (" + toDisplayString(size.packaging_size_name) + ") ", 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).m_packaging_size_id]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.m_packaging_size_id,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "m_packaging_type_id",
                            value: "Packaging Type",
                            required: ""
                          }),
                          withDirectives(createVNode("select", {
                            id: "m_packaging_type_id",
                            "onUpdate:modelValue": ($event) => unref(form).m_packaging_type_id = $event,
                            class: "form-select"
                          }, [
                            createVNode("option", {
                              value: null,
                              disabled: ""
                            }, " Select Packaging Type "),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.packagingTypes, (type) => {
                              return openBlock(), createBlock("option", {
                                key: type.id,
                                value: type.id
                              }, toDisplayString(type.packaging_type_code) + " (" + toDisplayString(type.packaging_type_name) + ") ", 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).m_packaging_type_id]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.m_packaging_type_id,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "m_repack_status_id",
                            value: "Repack Status",
                            required: ""
                          }),
                          withDirectives(createVNode("select", {
                            id: "m_repack_status_id",
                            "onUpdate:modelValue": ($event) => unref(form).m_repack_status_id = $event,
                            class: "form-select"
                          }, [
                            createVNode("option", {
                              value: null,
                              disabled: ""
                            }, " Select Repack Status "),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.repackStatus, (status) => {
                              return openBlock(), createBlock("option", {
                                key: status.id,
                                value: status.id
                              }, toDisplayString(status.repack_code) + " (" + toDisplayString(status.repack_name) + ") ", 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).m_repack_status_id]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.m_repack_status_id,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "product_unit_sku",
                            value: "SKU"
                          }),
                          createVNode(_sfc_main$3, {
                            id: "product_unit_sku",
                            modelValue: unref(form).product_unit_sku,
                            "onUpdate:modelValue": ($event) => unref(form).product_unit_sku = $event,
                            type: "text",
                            class: "form-control",
                            disabled: true
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.product_unit_sku,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "product_unit_price",
                            value: "Price"
                          }),
                          createVNode(_sfc_main$3, {
                            id: "product_unit_price",
                            modelValue: unref(form).product_unit_price,
                            "onUpdate:modelValue": ($event) => unref(form).product_unit_price = $event,
                            type: "number",
                            class: "form-control"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.product_unit_price,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "description",
                            value: "Description"
                          }),
                          withDirectives(createVNode("textarea", {
                            id: "description",
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            class: "form-control"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).description]
                          ]),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.description,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ])
                      ]),
                      createVNode("div", { class: "col-md-4" }, [
                        createVNode("div", { class: "mb-3" }, [
                          createVNode(_sfc_main$2, {
                            for: "images",
                            value: "Gambar Produk"
                          }),
                          createVNode("div", {
                            class: "cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400",
                            onClick: () => fileInputRef.value.click()
                          }, [
                            createVNode("img", {
                              src: unref(uploadDefaultImg),
                              alt: "Upload",
                              class: "mx-auto mb-2",
                              style: { "width": "64px", "height": "64px", "opacity": "0.6" }
                            }, null, 8, ["src"]),
                            createVNode("p", { class: "mb-0 text-gray-500" }, " Klik untuk memilih gambar "),
                            createVNode("small", { class: "text-muted" }, " Format yang didukung: JPG, PNG, GIF. Maksimal 5MB per file. ")
                          ], 8, ["onClick"]),
                          createVNode("input", {
                            ref_key: "fileInputRef",
                            ref: fileInputRef,
                            type: "file",
                            id: "images",
                            class: "d-none",
                            multiple: "",
                            accept: "image/*",
                            onChange: handleFileUpload
                          }, null, 544),
                          createVNode(_sfc_main$4, {
                            message: unref(form).errors.images,
                            class: "text-danger mt-1"
                          }, null, 8, ["message"])
                        ]),
                        imagePreview.value.length > 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mb-3"
                        }, [
                          createVNode("h6", null, "Preview Gambar Baru:"),
                          createVNode("div", { class: "row" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(imagePreview.value, (image, index) => {
                              return openBlock(), createBlock("div", {
                                key: `preview-${index}`,
                                class: "col-md-6 mb-2"
                              }, [
                                createVNode("div", { class: "position-relative" }, [
                                  createVNode("img", {
                                    src: image.url,
                                    alt: "Preview",
                                    class: "img-thumbnail",
                                    style: { "width": "100%", "height": "120px", "object-fit": "cover" }
                                  }, null, 8, ["src"]),
                                  createVNode("button", {
                                    type: "button",
                                    class: "btn btn-danger btn-sm position-absolute end-0 top-0",
                                    onClick: ($event) => removeNewImage(index),
                                    style: { "z-index": "10" }
                                  }, [
                                    createVNode("i", { class: "fas fa-times" })
                                  ], 8, ["onClick"])
                                ])
                              ]);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        unref(form).existing_images && unref(form).existing_images.length > 0 ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "mb-3"
                        }, [
                          createVNode("h6", null, "Gambar Saat Ini:"),
                          createVNode("div", { class: "row" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(form).existing_images, (image, index) => {
                              return openBlock(), createBlock("div", {
                                key: `existing-${image.id}`,
                                class: "col-md-6 mb-2"
                              }, [
                                createVNode("div", { class: "position-relative" }, [
                                  createVNode("img", {
                                    src: image.image_url,
                                    alt: "Existing",
                                    class: "img-thumbnail",
                                    style: { "width": "100%", "height": "120px", "object-fit": "cover" }
                                  }, null, 8, ["src"]),
                                  createVNode("button", {
                                    type: "button",
                                    class: "btn·btn-danger·btn-sm·position-absolute·end-0·top-0",
                                    onClick: ($event) => removeExistingImage(
                                      image.id,
                                      index
                                    ),
                                    style: { "z-index": "10" }
                                  }, [
                                    createVNode("i", { class: "fas fa-times" })
                                  ], 8, ["onClick"])
                                ])
                              ]);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "d-flex justify-content-start mt-4 gap-2" }, [
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
                            createTextVNode(" Update ")
                          ]))
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(unref(Link), {
                        href: _ctx.route("products.index"),
                        class: "btn btn-secondary"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreProducts/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
