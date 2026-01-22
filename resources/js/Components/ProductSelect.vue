<script setup>
import { debounce } from 'lodash';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number, Object],
        default: null,
    },
    placeholder: {
        type: String,
        default: 'Select a product...',
    },
    searchPlaceholder: {
        type: String,
        default: 'Search products...',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: true,
    },
    returnObject: {
        type: Boolean,
        default: false,
    },
    itemValue: {
        type: String,
        default: 'id',
    },
    itemText: {
        type: String,
        default: 'product_name',
    },
    apiUrl: {
        type: String,
        default: '/api/parameters/getProducts',
    },
    perPage: {
        type: Number,
        default: 20,
    },
    minChars: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['update:modelValue', 'change', 'search']);

const isOpen = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const products = ref([]);
const pagination = ref({});
const currentPage = ref(1);
const dropdownRef = ref(null);
const searchInputRef = ref(null);
const selectedProducts = ref(props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : null);
const hasError = ref(false);
const errorMessage = ref('');

const selectedValue = computed(() => {
    if (props.multiple) {
        return selectedProducts.value || [];
    }
    return props.modelValue;
});

const displayText = ref(props.placeholder);

const updateDisplayText = async () => {
    if (props.multiple) {
        const selected = selectedProducts.value || [];
        if (selected.length === 0) {
            displayText.value = props.placeholder;
            return;
        }
        if (selected.length === 1) {
            const item = products.value.find(p => getValue(p) === getValue(selected[0]));
            displayText.value = item ? getText(item) : getText(selected[0]);
            return;
        }
        displayText.value = `${selected.length} items selected`;
    } else if (selectedValue.value) {
        const item = products.value.find(p => getValue(p) === getValue(selectedValue.value));
        if (item) {
            displayText.value = getText(item);
        } else if (typeof selectedValue.value === 'object') {
            displayText.value = getText(selectedValue.value);
        } else {
            // If we have ID but no product data, load and show
            await loadProducts('', 1, false, selectedValue.value);
            const item = products.value.find(p => getValue(p) === getValue(selectedValue.value));
            displayText.value = item ? getText(item) : selectedValue.value;
        }
    } else {
        displayText.value = props.placeholder;
    }
};

const getValue = item => {
    return typeof item === 'object' && item !== null ? item[props.itemValue] : item;
};

const getText = item => {
    return typeof item === 'object' && item !== null ? item[props.itemText] : 'test';
};

const loadProducts = async (search = '', page = 1, reset = true, product_id = null) => {
    if (search.length < props.minChars && search.length > 0) return;

    isLoading.value = true;
    hasError.value = false;

    try {
        const requestBody = {
            per_page: props.perPage,
            page: page,
        };

        if (search) requestBody.search = search;
        if (product_id) requestBody.product_id = product_id;

        const response = await fetch(props.apiUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();

        if (data.status_code !== 1) {
            throw new Error(data.status_desc || 'Failed to load products');
        }

        if (reset) {
            products.value = data.results || [];
        } else {
            products.value = [...products.value, ...(data.results || [])];
        }

        pagination.value = data.pagination || {};
        currentPage.value = page;
    } catch (error) {
        hasError.value = true;
        errorMessage.value = error.message || 'Error loading products';
        console.error('Error loading products:', error);
    } finally {
        isLoading.value = false;
    }
};

const debouncedSearch = debounce(query => {
    currentPage.value = 1;
    loadProducts(query, 1, true);
    emit('search', query);
}, 300);

const openDropdown = () => {
    if (props.disabled) return;

    isOpen.value = true;

    nextTick(() => {
        if (searchInputRef.value) {
            searchInputRef.value.focus();
        }
        if (products.value.length === 0) {
            loadProducts(searchQuery.value, 1, true);
        }
    });
};

const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
};

const selectItem = item => {
    if (props.multiple) {
        const selected = selectedProducts.value || [];
        const itemValue = getValue(item);
        const isSelected = selected.some(s => getValue(s) === itemValue);

        if (isSelected) {
            selectedProducts.value = selected.filter(s => getValue(s) !== itemValue);
        } else {
            selectedProducts.value = [...selected, props.returnObject ? item : itemValue];
        }

        emit('update:modelValue', selectedProducts.value);
        emit('change', selectedProducts.value);
    } else {
        const value = props.returnObject ? item : getValue(item);
        emit('update:modelValue', value);
        emit('change', value);
        closeDropdown();
    }
};

const removeItem = item => {
    if (props.multiple) {
        const itemValue = getValue(item);
        selectedProducts.value = selectedProducts.value.filter(s => getValue(s) !== itemValue);
        emit('update:modelValue', selectedProducts.value);
        emit('change', selectedProducts.value);
    }
};

const clearSelection = () => {
    if (props.multiple) {
        selectedProducts.value = [];
        emit('update:modelValue', []);
        emit('change', []);
    } else {
        emit('update:modelValue', null);
        emit('change', null);
    }
};

const loadMore = () => {
    if (pagination.value.has_more_pages && !isLoading.value) {
        loadProducts(searchQuery.value, currentPage.value + 1, false);
    }
};

const isSelected = item => {
    if (props.multiple) {
        const selected = selectedProducts.value || [];
        return selected.some(s => getValue(s) === getValue(item));
    }
    return getValue(selectedValue.value) === getValue(item);
};

const handleClickOutside = event => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        closeDropdown();
    }
};

const handleScroll = event => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && pagination.value.has_more_pages && !isLoading.value) {
        loadMore();
    }
};

watch(
    () => props.modelValue,
    newValue => {
        if (props.multiple) {
            selectedProducts.value = Array.isArray(newValue) ? newValue : [];
        }
        updateDisplayText();
    }
);

watch([selectedProducts, products], () => {
    updateDisplayText();
});

watch(searchQuery, newValue => {
    debouncedSearch(newValue);
});

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    await updateDisplayText();
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="product-select" ref="dropdownRef">
        <!-- Selected Display -->
        <div
            class="form-control product-select__control"
            :class="{
                'product-select__control--disabled': disabled,
                'product-select__control--open': isOpen,
                'product-select__control--has-value': selectedValue,
            }"
            @click="openDropdown"
        >
            <div class="product-select__value-container">
                <!-- Multiple Selection Tags -->
                <template v-if="multiple && selectedProducts?.length > 0">
                    <span
                        v-for="item in selectedProducts.slice(0, 3)"
                        :key="getValue(item)"
                        class="product-select__tag"
                    >
                        {{ getText(item) }}
                        <button
                            type="button"
                            class="product-select__tag-remove"
                            @click.stop="removeItem(item)"
                            v-if="!disabled"
                        >
                            ×
                        </button>
                    </span>
                    <span v-if="selectedProducts.length > 3" class="product-select__tag">
                        +{{ selectedProducts.length - 3 }} more
                    </span>
                </template>

                <!-- Single Selection or Placeholder -->
                <span
                    v-else
                    class="product-select__single-value"
                    :class="{ 'product-select__placeholder': !selectedValue }"
                >
                    {{ displayText }}
                </span>
            </div>

            <!-- Clear Button -->
            <button
                v-if="clearable && selectedValue && !disabled"
                type="button"
                class="product-select__clear"
                @click.stop="clearSelection"
            >
                ×
            </button>

            <!-- Dropdown Arrow -->
            <div class="product-select__indicators">
                <div class="product-select__indicator" :class="{ 'product-select__indicator--open': isOpen }">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path
                            d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="isOpen" class="product-select__menu">
            <!-- Search Input -->
            <div class="product-select__search">
                <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    class="form-control form-control-sm"
                    :placeholder="searchPlaceholder"
                />
            </div>

            <!-- Loading State -->
            <div v-if="isLoading && products.length === 0" class="product-select__loading">
                <div class="d-flex align-items-center justify-content-center py-3">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Loading products...
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="hasError" class="product-select__error">
                <div class="text-danger py-3 text-center">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    {{ errorMessage }}
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="products.length === 0 && !isLoading" class="product-select__no-options">
                <div class="text-muted py-3 text-center">
                    <i class="fas fa-search me-1"></i>
                    {{ searchQuery ? 'No products found' : 'Start typing to search products' }}
                </div>
            </div>

            <!-- Options List -->
            <div v-else class="product-select__options" @scroll="handleScroll">
                <div
                    v-for="product in products"
                    :key="getValue(product)"
                    class="product-select__option"
                    :class="{ 'product-select__option--selected': isSelected(product) }"
                    @click="selectItem(product)"
                >
                    <div class="d-flex align-items-center">
                        <!-- Checkbox for Multiple Selection -->
                        <input
                            v-if="multiple"
                            type="checkbox"
                            :checked="isSelected(product)"
                            class="form-check-input me-2"
                            @click.stop
                        />

                        <div class="grow-1">
                            <div class="product-select__option-title">
                                {{ getText(product) }}
                            </div>
                            <div class="product-select__option-subtitle">
                                <span class="badge bg-secondary me-1">{{ product.product_unit_sku }}</span>
                                <span class="text-muted">{{ product.category?.category_name }}</span>
                                <span class="text-muted ms-2">{{ product.supplier?.supplier_name }}</span>
                            </div>
                        </div>

                        <!-- Selected Check -->
                        <div v-if="!multiple && isSelected(product)" class="product-select__option-check">
                            <i class="fas fa-check text-primary"></i>
                        </div>
                    </div>
                </div>

                <!-- Load More -->
                <div v-if="pagination.has_more_pages" class="product-select__load-more" @click="loadMore">
                    <div class="py-2 text-center">
                        <button type="button" class="btn btn-sm btn-outline-primary" :disabled="isLoading">
                            <div v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></div>
                            {{ isLoading ? 'Loading...' : 'Load More' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-select {
    position: relative;
    width: 100%;
}

.product-select__control {
    display: flex;
    align-items: center;
    min-height: 38px;
    cursor: pointer;
    position: relative;
    padding-right: 40px;
}

.product-select__control--disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
}

.product-select__control--open {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
}

.product-select__value-container {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
}

.product-select__single-value {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-select__placeholder {
    color: #6c757d;
}

.product-select__tag {
    background-color: #e9ecef;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.875em;
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 150px;
}

.product-select__tag-remove {
    background: none;
    border: none;
    font-size: 16px;
    line-height: 1;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    margin: 0;
}

.product-select__tag-remove:hover {
    color: #dc3545;
}

.product-select__clear {
    position: absolute;
    right: 30px;
    background: none;
    border: none;
    font-size: 20px;
    line-height: 1;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-select__clear:hover {
    color: #dc3545;
}

.product-select__indicators {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
}

.product-select__indicator {
    color: #6c757d;
    transition: transform 0.2s;
}

.product-select__indicator--open {
    transform: rotate(180deg);
}

.product-select__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    max-height: 300px;
    overflow: hidden;
    margin-top: 2px;
}

.product-select__search {
    padding: 8px;
    border-bottom: 1px solid #dee2e6;
}

.product-select__options {
    max-height: 240px;
    overflow-y: auto;
}

.product-select__option {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;
}

.product-select__option:hover {
    background-color: #f8f9fa;
}

.product-select__option--selected {
    background-color: #e7f3ff;
}

.product-select__option-title {
    font-weight: 500;
    margin-bottom: 2px;
}

.product-select__option-subtitle {
    font-size: 0.875em;
    color: #6c757d;
}

.product-select__option-check {
    color: #0d6efd;
}

.product-select__loading,
.product-select__error,
.product-select__no-options {
    padding: 12px;
}

.product-select__load-more {
    border-top: 1px solid #dee2e6;
    cursor: pointer;
}

.product-select__load-more:hover {
    background-color: #f8f9fa;
}

/* Scrollbar styling for dropdown */
.product-select__options::-webkit-scrollbar {
    width: 6px;
}

.product-select__options::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.product-select__options::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
}

.product-select__options::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
}
</style>
