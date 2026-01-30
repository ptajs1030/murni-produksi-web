import { ssrRenderStyle, ssrRenderClass, ssrRenderSlot } from "vue/server-renderer";
import { ref, onMounted, onUnmounted, watch, computed, useSSRContext } from "vue";
const _sfc_main = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: "lg"
      // default untuk Bootstrap
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const showSlot = ref(props.show);
    const close = () => {
      if (props.closeable) {
        emit("close");
      }
    };
    const closeOnEscape = (e) => {
      if (e.key === "Escape" && props.show) {
        e.preventDefault();
        close();
      }
    };
    onMounted(() => document.addEventListener("keydown", closeOnEscape));
    onUnmounted(() => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    });
    watch(
      () => props.show,
      () => {
        if (props.show) {
          document.body.style.overflow = "hidden";
          showSlot.value = true;
        } else {
          document.body.style.overflow = "";
          setTimeout(() => showSlot.value = false, 200);
        }
      }
    );
    const maxWidthClass = computed(() => {
      return {
        sm: "modal-sm",
        md: "",
        // default Bootstrap modal
        lg: "modal-lg",
        xl: "modal-xl"
      }[props.maxWidth] || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div tabindex="-1" role="dialog" style="${ssrRenderStyle([
        { "display": "block" },
        props.show ? null : { display: "none" }
      ])}" class="${ssrRenderClass([{ show: props.show }, "modal fade"])}"><div class="${ssrRenderClass([maxWidthClass.value, "modal-dialog modal-dialog-scrollable"])}" role="document"><div class="modal-content">`);
      if (showSlot.value) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (props.show) {
        _push(`<div class="modal-backdrop fade show"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Modal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
