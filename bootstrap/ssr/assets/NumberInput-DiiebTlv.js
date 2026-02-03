import { mergeModels, useModel, ref, onMounted, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrGetDynamicModelProps } from "vue/server-renderer";
const _sfc_main = {
  __name: "NumberInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    max: {
      type: Number,
      default: null
    },
    min: {
      type: Number,
      default: null
    },
    step: {
      type: [Number, String],
      default: null
    },
    placeholder: {
      type: String,
      default: null
    }
  }, {
    "modelValue": {
      type: Number,
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const model = useModel(__props, "modelValue");
    const input = ref(null);
    onMounted(() => {
      if (input.value.hasAttribute("autofocus")) {
        input.value.focus();
      }
    });
    __expose({ focus: () => input.value.focus() });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
        value: model.value,
        ref_key: "input",
        ref: input,
        class: "form-control",
        type: "number",
        max: __props.max,
        min: __props.min,
        step: __props.step,
        placeholder: __props.placeholder
      }, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, model.value))))}>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/NumberInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
