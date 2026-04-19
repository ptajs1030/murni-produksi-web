import { ref, computed, watch, onMounted, onBeforeUnmount, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "ProductSearchInput",
  __ssrInlineRender: true,
  props: {
    items: { type: Array, default: () => [] },
    modelValue: { type: [String, Number], default: "" },
    placeholder: { type: String, default: "Ketik untuk mencari produk..." },
    displayField: { type: String, default: "product_name" },
    secondaryField: { type: String, default: "" },
    id: { type: String, default: "product-search" },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const searchQuery = ref("");
    const isOpen = ref(false);
    const highlightIndex = ref(-1);
    const wrapperRef = ref(null);
    const getDisplayText = (item) => {
      if (props.secondaryField && item[props.secondaryField]) {
        return `${item[props.secondaryField]} - ${item[props.displayField]}`;
      }
      return item[props.displayField] || "";
    };
    const filteredItems = computed(() => {
      if (!searchQuery.value) return props.items;
      const query = searchQuery.value.toLowerCase();
      return props.items.filter((item) => {
        const primary = (item[props.displayField] || "").toLowerCase();
        const secondary = props.secondaryField ? (item[props.secondaryField] || "").toLowerCase() : "";
        return primary.includes(query) || secondary.includes(query);
      });
    });
    const setDisplayFromValue = () => {
      if (props.modelValue) {
        const found = props.items.find(
          (item) => item.id == props.modelValue
        );
        if (found) {
          searchQuery.value = getDisplayText(found);
        }
      } else {
        searchQuery.value = "";
      }
    };
    watch(() => props.modelValue, setDisplayFromValue);
    watch(() => props.items, () => {
      if (props.modelValue) setDisplayFromValue();
    }, { immediate: true });
    onMounted(() => {
      setDisplayFromValue();
      document.addEventListener("click", handleClickOutside);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    const handleClickOutside = (e) => {
      if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
        isOpen.value = false;
        if (!props.modelValue) {
          searchQuery.value = "";
        } else {
          setDisplayFromValue();
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "wrapperRef",
        ref: wrapperRef,
        class: "product-search-wrapper"
      }, _attrs))} data-v-939c4cfc><div class="input-group" data-v-939c4cfc><span class="input-group-text" data-v-939c4cfc><i class="fas fa-search" data-v-939c4cfc></i></span><input${ssrRenderAttr("id", __props.id)} type="text" class="form-control"${ssrRenderAttr("value", searchQuery.value)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.required && !__props.modelValue) ? " required" : ""}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} autocomplete="off" data-v-939c4cfc>`);
      if (__props.modelValue) {
        _push(`<button type="button" class="btn btn-outline-secondary" title="Hapus pilihan" data-v-939c4cfc><i class="fas fa-times" data-v-939c4cfc></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><ul class="product-search-dropdown" style="${ssrRenderStyle(isOpen.value && filteredItems.value.length > 0 ? null : { display: "none" })}" data-v-939c4cfc><!--[-->`);
      ssrRenderList(filteredItems.value, (item, idx) => {
        _push(`<li class="${ssrRenderClass([{
          "is-highlighted": idx === highlightIndex.value,
          "is-selected": item.id == __props.modelValue
        }, "product-search-item"])}" data-v-939c4cfc><span data-v-939c4cfc>${ssrInterpolate(getDisplayText(item))}</span>`);
        if (item.id == __props.modelValue) {
          _push(`<i class="fas fa-check text-success ms-2" data-v-939c4cfc></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul><div class="product-search-dropdown" style="${ssrRenderStyle(isOpen.value && searchQuery.value && filteredItems.value.length === 0 ? null : { display: "none" })}" data-v-939c4cfc><div class="product-search-empty" data-v-939c4cfc><i class="fas fa-exclamation-circle me-1" data-v-939c4cfc></i> Produk tidak ditemukan </div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ProductSearchInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductSearchInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-939c4cfc"]]);
export {
  ProductSearchInput as P
};
