<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    items: { type: Array, default: () => [] },
    modelValue: { type: [String, Number], default: "" },
    placeholder: { type: String, default: "Ketik untuk mencari produk..." },
    displayField: { type: String, default: "product_name" },
    secondaryField: { type: String, default: "" },
    id: { type: String, default: "product-search" },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const searchQuery = ref("");
const isOpen = ref(false);
const highlightIndex = ref(-1);
const wrapperRef = ref(null);

// Get display text for item
const getDisplayText = (item) => {
    if (props.secondaryField && item[props.secondaryField]) {
        return `${item[props.secondaryField]} - ${item[props.displayField]}`;
    }
    return item[props.displayField] || "";
};

// Filter items based on search query
const filteredItems = computed(() => {
    if (!searchQuery.value) return props.items;
    const query = searchQuery.value.toLowerCase();
    return props.items.filter((item) => {
        const primary = (item[props.displayField] || "").toLowerCase();
        const secondary = props.secondaryField
            ? (item[props.secondaryField] || "").toLowerCase()
            : "";
        return primary.includes(query) || secondary.includes(query);
    });
});

// Set initial display text from modelValue
const setDisplayFromValue = () => {
    if (props.modelValue) {
        const found = props.items.find(
            (item) => item.id == props.modelValue,
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
        // Reset display if no valid selection
        if (!props.modelValue) {
            searchQuery.value = "";
        } else {
            setDisplayFromValue();
        }
    }
};

const onFocus = () => {
    isOpen.value = true;
    highlightIndex.value = -1;
    // Select all text on focus for easy re-search
    searchQuery.value = "";
};

const onInput = () => {
    isOpen.value = true;
    highlightIndex.value = -1;
    // Clear selection when user types
    emit("update:modelValue", "");
};

const selectItem = (item) => {
    emit("update:modelValue", item.id);
    searchQuery.value = getDisplayText(item);
    isOpen.value = false;
    highlightIndex.value = -1;
};

const onKeydown = (e) => {
    if (!isOpen.value) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            isOpen.value = true;
        }
        return;
    }

    switch (e.key) {
        case "ArrowDown":
            e.preventDefault();
            if (highlightIndex.value < filteredItems.value.length - 1) {
                highlightIndex.value++;
            }
            break;
        case "ArrowUp":
            e.preventDefault();
            if (highlightIndex.value > 0) {
                highlightIndex.value--;
            }
            break;
        case "Enter":
            e.preventDefault();
            if (
                highlightIndex.value >= 0 &&
                highlightIndex.value < filteredItems.value.length
            ) {
                selectItem(filteredItems.value[highlightIndex.value]);
            }
            break;
        case "Escape":
            isOpen.value = false;
            setDisplayFromValue();
            break;
    }
};
</script>

<template>
    <div ref="wrapperRef" class="product-search-wrapper">
        <div class="input-group">
            <span class="input-group-text">
                <i class="fas fa-search"></i>
            </span>
            <input
                :id="id"
                type="text"
                class="form-control"
                v-model="searchQuery"
                :placeholder="placeholder"
                :required="required && !modelValue"
                :disabled="disabled"
                autocomplete="off"
                @focus="onFocus"
                @input="onInput"
                @keydown="onKeydown"
            />
            <button
                v-if="modelValue"
                type="button"
                class="btn btn-outline-secondary"
                @click="
                    emit('update:modelValue', '');
                    searchQuery = '';
                    isOpen = false;
                "
                title="Hapus pilihan"
            >
                <i class="fas fa-times"></i>
            </button>
        </div>

        <ul
            v-show="isOpen && filteredItems.length > 0"
            class="product-search-dropdown"
        >
            <li
                v-for="(item, idx) in filteredItems"
                :key="item.id"
                class="product-search-item"
                :class="{
                    'is-highlighted': idx === highlightIndex,
                    'is-selected': item.id == modelValue,
                }"
                @mousedown.prevent="selectItem(item)"
                @mouseenter="highlightIndex = idx"
            >
                <span>{{ getDisplayText(item) }}</span>
                <i
                    v-if="item.id == modelValue"
                    class="fas fa-check text-success ms-2"
                ></i>
            </li>
        </ul>

        <div
            v-show="isOpen && searchQuery && filteredItems.length === 0"
            class="product-search-dropdown"
        >
            <div class="product-search-empty">
                <i class="fas fa-exclamation-circle me-1"></i>
                Produk tidak ditemukan
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-search-wrapper {
    position: relative;
}

.product-search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1050;
    max-height: 220px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #dee2e6;
    border-top: none;
    border-radius: 0 0 0.375rem 0.375rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    list-style: none;
    padding: 0;
    margin: 0;
}

.product-search-item {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    transition: background-color 0.15s;
}

.product-search-item:hover,
.product-search-item.is-highlighted {
    background-color: #e9ecef;
}

.product-search-item.is-selected {
    background-color: #e8f4fd;
    font-weight: 500;
}

.product-search-empty {
    padding: 0.75rem;
    text-align: center;
    color: #6c757d;
    font-size: 0.875rem;
}
</style>
