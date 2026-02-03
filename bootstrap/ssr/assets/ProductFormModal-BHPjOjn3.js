import { ref, computed, watch, mergeProps, withCtx, unref, createBlock, openBlock, createVNode, createTextVNode, toDisplayString, withModifiers, createCommentVNode, withDirectives, Fragment, renderList, vModelSelect, vModelText, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./InputError-C5ky-J1T.js";
import { _ as _sfc_main$2 } from "./InputLabel-Dkex7vHI.js";
import { _ as _sfc_main$1 } from "./Modal-DBd8rNSf.js";
import { P as PrimaryButton } from "./PrimaryButton-CIooT64n.js";
import { _ as _sfc_main$3 } from "./TextInput-BEWjE_Xr.js";
import { useForm } from "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ProductFormModal",
  __ssrInlineRender: true,
  props: {
    categories: Array,
    suppliers: Array,
    propertyItems: Array,
    packagingSizes: Array,
    packagingTypes: Array,
    repackStatus: Array
  },
  emits: ["saved"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const show = ref(false);
    const imagePreview = ref([]);
    const fileInputRef = ref(null);
    const form = useForm({
      id: null,
      created_by: null,
      product_name: "",
      brand_name: "",
      m_category_id: null,
      m_supplier_id: null,
      description: "",
      target_selling_date: null,
      product_is_pre_order: false,
      product_processing_days: 0,
      m_property_item_id: null,
      m_packaging_size_id: null,
      m_packaging_type_id: null,
      m_repack_status_id: null,
      packaging_size_input: 0,
      product_unit_sku: "",
      product_unit_qty: 0,
      product_unit_price: 0,
      expired_date: null,
      images: [],
      existing_images: [],
      deleted_images: []
    });
    const isEditing = computed(() => form.id !== null);
    watch(
      () => form.product_code,
      (newValue) => {
        if (newValue && newValue !== newValue.toUpperCase()) {
          form.product_code = newValue.toUpperCase();
        }
      }
    );
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
    const open = (product = null) => {
      if (product) {
        console.log("Product data received:", product);
        form.id = product.id;
        form.created_by = product.created_by;
        form.product_name = product.product_name;
        form.m_category_id = product.m_category_id;
        form.m_supplier_id = product.m_supplier_id;
        form.brand_name = product.brand_name;
        form.description = product.description;
        form.target_selling_date = product.target_selling_date;
        form.product_is_pre_order = product.product_is_pre_order;
        form.product_processing_days = product.product_processing_days;
        form.m_property_item_id = product.m_property_item_id;
        form.m_packaging_size_id = product.m_packaging_size_id;
        form.m_packaging_type_id = product.m_packaging_type_id;
        form.m_repack_status_id = product.m_repack_status_id;
        form.packaging_size_input = product.packaging_size_input;
        form.product_unit_sku = product.product_unit_sku;
        form.product_unit_qty = product.product_unit_qty;
        form.product_unit_price = product.product_unit_price;
        form.expired_date = product.expired_date;
        form.existing_images = product.product_images || product.productImages || [];
      } else {
        form.reset();
        imagePreview.value = [];
      }
      show.value = true;
    };
    const close = () => {
      show.value = false;
      form.reset();
      imagePreview.value = [];
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    };
    const submit = () => {
      const options = {
        onSuccess: () => {
          close();
          emit("saved");
        },
        forceFormData: true
      };
      if (form.id) {
        console.log("Form data:", form.data());
        form.transform((data) => ({
          ...data,
          _method: "PUT"
        })).post(route("products.update", form.id), options);
      } else {
        console.log("Store URL:", route("products.store"));
        form.post("/products", options);
      }
    };
    __expose({ open, close });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        show: show.value,
        closeable: false,
        maxWidth: "lg"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form${_scopeId}><div class="modal-header"${_scopeId}><h5 class="modal-title"${_scopeId}>${ssrInterpolate(isEditing.value ? "Edit Produk" : "Tambah Produk")}</h5></div><div class="modal-body" style="${ssrRenderStyle({ "max-height": "70vh", "overflow-y": "auto" })}"${_scopeId}><div class="row"${_scopeId}><div class="col-md-6 mb-3"${_scopeId}>`);
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
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
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
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_category_id",
              value: "Kategori"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_category_id" class="form-select" required${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_category_id) ? ssrLooseContain(unref(form).m_category_id, null) : ssrLooseEqual(unref(form).m_category_id, null)) ? " selected" : ""}${_scopeId}>Pilih Kategori</option><!--[-->`);
            ssrRenderList(__props.categories, (category) => {
              _push2(`<option${ssrRenderAttr("value", category.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_category_id) ? ssrLooseContain(unref(form).m_category_id, category.id) : ssrLooseEqual(unref(form).m_category_id, category.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(category.category_name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_category_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_supplier_id",
              value: "Supplier"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_supplier_id" class="form-select" required${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_supplier_id) ? ssrLooseContain(unref(form).m_supplier_id, null) : ssrLooseEqual(unref(form).m_supplier_id, null)) ? " selected" : ""}${_scopeId}>Pilih Supplier</option><!--[-->`);
            ssrRenderList(__props.suppliers, (supplier) => {
              _push2(`<option${ssrRenderAttr("value", supplier.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_supplier_id) ? ssrLooseContain(unref(form).m_supplier_id, supplier.id) : ssrLooseEqual(unref(form).m_supplier_id, supplier.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(supplier.supplier_name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_supplier_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-12 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "description",
              value: "Description"
            }, null, _parent2, _scopeId));
            _push2(`<textarea id="description" class="form-control"${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.description,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "target_selling_date",
              value: "Target Selling Date"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "target_selling_date",
              modelValue: unref(form).target_selling_date,
              "onUpdate:modelValue": ($event) => unref(form).target_selling_date = $event,
              type: "date",
              class: "form-control"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.target_selling_date,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
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
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}><div class="form-check"${_scopeId}><input class="form-check-input" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).product_is_pre_order) ? ssrLooseContain(unref(form).product_is_pre_order, null) : unref(form).product_is_pre_order) ? " checked" : ""} id="product_is_pre_order"${_scopeId}><label class="form-check-label" for="product_is_pre_order"${_scopeId}>Pre-order?</label></div></div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_processing_days",
              value: "Processing Days"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "product_processing_days",
              modelValue: unref(form).product_processing_days,
              "onUpdate:modelValue": ($event) => unref(form).product_processing_days = $event,
              type: "number",
              class: "form-control"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.product_processing_days,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_property_item_id",
              value: "Property Item"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_property_item_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_property_item_id) ? ssrLooseContain(unref(form).m_property_item_id, null) : ssrLooseEqual(unref(form).m_property_item_id, null)) ? " selected" : ""}${_scopeId}>Select Property Item</option><!--[-->`);
            ssrRenderList(__props.propertyItems, (item) => {
              _push2(`<option${ssrRenderAttr("value", item.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_property_item_id) ? ssrLooseContain(unref(form).m_property_item_id, item.id) : ssrLooseEqual(unref(form).m_property_item_id, item.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(item.property_code)} (${ssrInterpolate(item.property_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_property_item_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_packaging_size_id",
              value: "Packaging Size"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_packaging_size_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_size_id) ? ssrLooseContain(unref(form).m_packaging_size_id, null) : ssrLooseEqual(unref(form).m_packaging_size_id, null)) ? " selected" : ""}${_scopeId}>Select Packaging Size</option><!--[-->`);
            ssrRenderList(__props.packagingSizes, (size) => {
              _push2(`<option${ssrRenderAttr("value", size.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_size_id) ? ssrLooseContain(unref(form).m_packaging_size_id, size.id) : ssrLooseEqual(unref(form).m_packaging_size_id, size.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(size.packaging_size_code)} (${ssrInterpolate(size.packaging_size_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_packaging_size_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_packaging_type_id",
              value: "Packaging Type"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_packaging_type_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_type_id) ? ssrLooseContain(unref(form).m_packaging_type_id, null) : ssrLooseEqual(unref(form).m_packaging_type_id, null)) ? " selected" : ""}${_scopeId}>Select Packaging Type</option><!--[-->`);
            ssrRenderList(__props.packagingTypes, (type) => {
              _push2(`<option${ssrRenderAttr("value", type.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_packaging_type_id) ? ssrLooseContain(unref(form).m_packaging_type_id, type.id) : ssrLooseEqual(unref(form).m_packaging_type_id, type.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(type.packaging_type_code)} (${ssrInterpolate(type.packaging_type_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_packaging_type_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "m_repack_status_id",
              value: "Repack Status"
            }, null, _parent2, _scopeId));
            _push2(`<select id="m_repack_status_id" class="form-select"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_repack_status_id) ? ssrLooseContain(unref(form).m_repack_status_id, null) : ssrLooseEqual(unref(form).m_repack_status_id, null)) ? " selected" : ""}${_scopeId}>Select Repack Status</option><!--[-->`);
            ssrRenderList(__props.repackStatus, (status) => {
              _push2(`<option${ssrRenderAttr("value", status.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).m_repack_status_id) ? ssrLooseContain(unref(form).m_repack_status_id, status.id) : ssrLooseEqual(unref(form).m_repack_status_id, status.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(status.repack_code)} (${ssrInterpolate(status.repack_name)}) </option>`);
            });
            _push2(`<!--]--></select>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.m_repack_status_id,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "packaging_size_input",
              value: "Packaging Size Input"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "packaging_size_input",
              modelValue: unref(form).packaging_size_input,
              "onUpdate:modelValue": ($event) => unref(form).packaging_size_input = $event,
              type: "number",
              class: "form-control"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.packaging_size_input,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "product_unit_qty",
              value: "Quantity"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "product_unit_qty",
              modelValue: unref(form).product_unit_qty,
              "onUpdate:modelValue": ($event) => unref(form).product_unit_qty = $event,
              type: "number",
              class: "form-control"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.product_unit_qty,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              for: "images",
              value: "Gambar Produk"
            }, null, _parent2, _scopeId));
            _push2(`<input type="file" id="images" class="form-control" multiple accept="image/*"${_scopeId}><small class="text-muted"${_scopeId}>Format yang didukung: JPG, PNG, GIF. Maksimal 5MB per file.</small>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              message: unref(form).errors.images,
              class: "text-danger mt-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="col-md-6 mb-3"${_scopeId}>`);
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
            _push2(`</div>`);
            if (imagePreview.value.length > 0) {
              _push2(`<div${_scopeId}><h6${_scopeId}>Preview Gambar Baru:</h6><div class="row"${_scopeId}><!--[-->`);
              ssrRenderList(imagePreview.value, (image, index) => {
                _push2(`<div class="col-md-3 mb-2"${_scopeId}><div class="position-relative"${_scopeId}><img${ssrRenderAttr("src", image.url)} alt="Preview" class="img-thumbnail" style="${ssrRenderStyle({ "width": "100%", "height": "120px", "object-fit": "cover" })}"${_scopeId}><button type="button" class="btn btn-danger btn-sm position-absolute end-0 top-0" style="${ssrRenderStyle({ "z-index": "10" })}"${_scopeId}><i class="fas fa-times"${_scopeId}></i></button></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(form).existing_images && unref(form).existing_images.length > 0) {
              _push2(`<div${_scopeId}><h6${_scopeId}>Gambar Saat Ini:</h6><div class="row"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).existing_images, (image, index) => {
                _push2(`<div class="col-md-3 mb-2"${_scopeId}><div class="position-relative"${_scopeId}><img${ssrRenderAttr("src", image.image_url)} alt="Existing" class="img-thumbnail" style="${ssrRenderStyle({ "width": "100%", "height": "120px", "object-fit": "cover" })}"${_scopeId}><button type="button" class="btn btn-danger btn-sm position-absolute end-0 top-0" style="${ssrRenderStyle({ "z-index": "10" })}"${_scopeId}><i class="fas fa-times"${_scopeId}></i></button></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="modal-footer"${_scopeId}><button type="button" class="btn btn-secondary me-2"${_scopeId}><i class="fas fa-times me-1"${_scopeId}></i> Batal </button>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              disabled: unref(form).processing,
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(form).processing) {
                    _push3(`<span${_scopeId2}><i class="fas fa-spinner fa-spin me-1"${_scopeId2}></i> Menyimpan... </span>`);
                  } else {
                    _push3(`<span${_scopeId2}><i class="fas fa-save me-1"${_scopeId2}></i> ${ssrInterpolate(isEditing.value ? "Update" : "Simpan")}</span>`);
                  }
                } else {
                  return [
                    unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, [
                      createVNode("i", { class: "fas fa-spinner fa-spin me-1" }),
                      createTextVNode(" Menyimpan... ")
                    ])) : (openBlock(), createBlock("span", { key: 1 }, [
                      createVNode("i", { class: "fas fa-save me-1" }),
                      createTextVNode(" " + toDisplayString(isEditing.value ? "Update" : "Simpan"), 1)
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
                  createVNode("h5", { class: "modal-title" }, toDisplayString(isEditing.value ? "Edit Produk" : "Tambah Produk"), 1)
                ]),
                createVNode("div", {
                  class: "modal-body",
                  style: { "max-height": "70vh", "overflow-y": "auto" }
                }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-md-6 mb-3" }, [
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
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
                        }, "Pilih Kategori"),
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
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
                        }, "Pilih Supplier"),
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
                    createVNode("div", { class: "col-md-12 mb-3" }, [
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
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "target_selling_date",
                        value: "Target Selling Date"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "target_selling_date",
                        modelValue: unref(form).target_selling_date,
                        "onUpdate:modelValue": ($event) => unref(form).target_selling_date = $event,
                        type: "date",
                        class: "form-control"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.target_selling_date,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode("div", { class: "form-check" }, [
                        withDirectives(createVNode("input", {
                          class: "form-check-input",
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).product_is_pre_order = $event,
                          id: "product_is_pre_order"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).product_is_pre_order]
                        ]),
                        createVNode("label", {
                          class: "form-check-label",
                          for: "product_is_pre_order"
                        }, "Pre-order?")
                      ])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "product_processing_days",
                        value: "Processing Days"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "product_processing_days",
                        modelValue: unref(form).product_processing_days,
                        "onUpdate:modelValue": ($event) => unref(form).product_processing_days = $event,
                        type: "number",
                        class: "form-control"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.product_processing_days,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "m_property_item_id",
                        value: "Property Item"
                      }),
                      withDirectives(createVNode("select", {
                        id: "m_property_item_id",
                        "onUpdate:modelValue": ($event) => unref(form).m_property_item_id = $event,
                        class: "form-select"
                      }, [
                        createVNode("option", {
                          value: null,
                          disabled: ""
                        }, "Select Property Item"),
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "m_packaging_size_id",
                        value: "Packaging Size"
                      }),
                      withDirectives(createVNode("select", {
                        id: "m_packaging_size_id",
                        "onUpdate:modelValue": ($event) => unref(form).m_packaging_size_id = $event,
                        class: "form-select"
                      }, [
                        createVNode("option", {
                          value: null,
                          disabled: ""
                        }, "Select Packaging Size"),
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "m_packaging_type_id",
                        value: "Packaging Type"
                      }),
                      withDirectives(createVNode("select", {
                        id: "m_packaging_type_id",
                        "onUpdate:modelValue": ($event) => unref(form).m_packaging_type_id = $event,
                        class: "form-select"
                      }, [
                        createVNode("option", {
                          value: null,
                          disabled: ""
                        }, "Select Packaging Type"),
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "m_repack_status_id",
                        value: "Repack Status"
                      }),
                      withDirectives(createVNode("select", {
                        id: "m_repack_status_id",
                        "onUpdate:modelValue": ($event) => unref(form).m_repack_status_id = $event,
                        class: "form-select"
                      }, [
                        createVNode("option", {
                          value: null,
                          disabled: ""
                        }, "Select Repack Status"),
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
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "packaging_size_input",
                        value: "Packaging Size Input"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "packaging_size_input",
                        modelValue: unref(form).packaging_size_input,
                        "onUpdate:modelValue": ($event) => unref(form).packaging_size_input = $event,
                        type: "number",
                        class: "form-control"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.packaging_size_input,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "product_unit_qty",
                        value: "Quantity"
                      }),
                      createVNode(_sfc_main$3, {
                        id: "product_unit_qty",
                        modelValue: unref(form).product_unit_qty,
                        "onUpdate:modelValue": ($event) => unref(form).product_unit_qty = $event,
                        type: "number",
                        class: "form-control"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.product_unit_qty,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        for: "images",
                        value: "Gambar Produk"
                      }),
                      createVNode("input", {
                        ref_key: "fileInputRef",
                        ref: fileInputRef,
                        type: "file",
                        id: "images",
                        class: "form-control",
                        multiple: "",
                        accept: "image/*",
                        onChange: handleFileUpload
                      }, null, 544),
                      createVNode("small", { class: "text-muted" }, "Format yang didukung: JPG, PNG, GIF. Maksimal 5MB per file."),
                      createVNode(_sfc_main$4, {
                        message: unref(form).errors.images,
                        class: "text-danger mt-1"
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "col-md-6 mb-3" }, [
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
                    imagePreview.value.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode("h6", null, "Preview Gambar Baru:"),
                      createVNode("div", { class: "row" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(imagePreview.value, (image, index) => {
                          return openBlock(), createBlock("div", {
                            key: `preview-${index}`,
                            class: "col-md-3 mb-2"
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
                    unref(form).existing_images && unref(form).existing_images.length > 0 ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode("h6", null, "Gambar Saat Ini:"),
                      createVNode("div", { class: "row" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(form).existing_images, (image, index) => {
                          return openBlock(), createBlock("div", {
                            key: `existing-${image.id}`,
                            class: "col-md-3 mb-2"
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
                                class: "btn btn-danger btn-sm position-absolute end-0 top-0",
                                onClick: ($event) => removeExistingImage(image.id, index),
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
                createVNode("div", { class: "modal-footer" }, [
                  createVNode("button", {
                    type: "button",
                    class: "btn btn-secondary me-2",
                    onClick: close
                  }, [
                    createVNode("i", { class: "fas fa-times me-1" }),
                    createTextVNode(" Batal ")
                  ]),
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
                        createTextVNode(" " + toDisplayString(isEditing.value ? "Update" : "Simpan"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CoreProducts/ProductFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
