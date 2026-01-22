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
        default: 'Select a warehouse...',
    },
    searchPlaceholder: {
        type: String,
        default: 'Search warehouses...',
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
        default: 'warehouse_name',
    },
    apiUrl: {
        type: String,
        default: '/api/parameters/getWarehouses',
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
const warehouses = ref([]);
const pagination = ref({});
const currentPage = ref(1);
const dropdownRef = ref(null);
const searchInputRef = ref(null);
const selectedWarehouses = ref(props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : null);
const hasError = ref(false);
const errorMessage = ref('');

const selectedValue = computed(() => {
    if (props.multiple) {
        return selectedWarehouses.value || [];
    }
    return props.modelValue;
});

const displayText = computed(() => {
    if (props.multiple) {
        const selected = selectedWarehouses.value || [];
        if (selected.length === 0) return props.placeholder;
        if (selected.length === 1) {
            const item = warehouses.value.find(w => getValue(w) === getValue(selected[0]));
            return item ? getText(item) : getText(selected[0]);
        }
        return `${selected.length} warehouses selected`;
    } else if (selectedValue.value) {
        const item = warehouses.value.find(w => getValue(w) === getValue(selectedValue.value));
        return item
            ? getText(item)
            : typeof selectedValue.value === 'object'
              ? getText(selectedValue.value)
              : selectedValue.value;
    }
    return props.placeholder;
});

const getValue = item => {
    return typeof item === 'object' && item !== null ? item[props.itemValue] : item;
};

const getText = item => {
    if (typeof item === 'object' && item !== null) {
        // Show warehouse name with level description
        const name = item[props.itemText] || item.warehouse_name || 'Unknown Warehouse';
        const level = item.level?.level_description;
        return level ? `${name} (${level})` : name;
    }
    return item?.toString() || '';
};

const loadWarehouses = async (search = '', page = 1, reset = true) => {
    if (search.length < props.minChars && search.length > 0) return;

    isLoading.value = true;
    hasError.value = false;

    try {
        const params = new URLSearchParams();
        params.append('per_page', props.perPage);
        params.append('page', page);

        if (search) params.append('search', search);

        const url = `${props.apiUrl}?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (!response.ok) throw new Error('Failed to fetch warehouses');

        const data = await response.json();

        if (data.status_code !== 1) {
            throw new Error(data.status_desc || 'Failed to load warehouses');
        }

        if (reset) {
            warehouses.value = data.results || [];
        } else {
            warehouses.value = [...warehouses.value, ...(data.results || [])];
        }

        pagination.value = data.pagination || {};
        currentPage.value = page;
    } catch (error) {
        hasError.value = true;
        errorMessage.value = error.message || 'Error loading warehouses';
        console.error('Error loading warehouses:', error);
    } finally {
        isLoading.value = false;
    }
};

const debouncedSearch = debounce(query => {
    currentPage.value = 1;
    loadWarehouses(query, 1, true);
    emit('search', query);
}, 300);

const openDropdown = () => {
    if (props.disabled) return;

    isOpen.value = true;

    nextTick(() => {
        if (searchInputRef.value) {
            searchInputRef.value.focus();
        }
        if (warehouses.value.length === 0) {
            loadWarehouses(searchQuery.value, 1, true);
        }
    });
};

const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
};

const selectItem = item => {
    if (props.multiple) {
        const selected = selectedWarehouses.value || [];
        const itemValue = getValue(item);
        const isSelected = selected.some(s => getValue(s) === itemValue);

        if (isSelected) {
            selectedWarehouses.value = selected.filter(s => getValue(s) !== itemValue);
        } else {
            selectedWarehouses.value = [...selected, props.returnObject ? item : itemValue];
        }

        emit('update:modelValue', selectedWarehouses.value);
        emit('change', selectedWarehouses.value);
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
        selectedWarehouses.value = selectedWarehouses.value.filter(s => getValue(s) !== itemValue);
        emit('update:modelValue', selectedWarehouses.value);
        emit('change', selectedWarehouses.value);
    }
};

const clearSelection = () => {
    if (props.multiple) {
        selectedWarehouses.value = [];
        emit('update:modelValue', []);
        emit('change', []);
    } else {
        emit('update:modelValue', null);
        emit('change', null);
    }
};

const loadMore = () => {
    if (pagination.value.has_more_pages && !isLoading.value) {
        loadWarehouses(searchQuery.value, currentPage.value + 1, false);
    }
};

const isSelected = item => {
    if (props.multiple) {
        const selected = selectedWarehouses.value || [];
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
            selectedWarehouses.value = Array.isArray(newValue) ? newValue : [];
        }
    }
);

watch(searchQuery, newValue => {
    debouncedSearch(newValue);
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="warehouse-select" ref="dropdownRef">
        <!-- Selected Display -->
        <div
            class="form-control warehouse-select__control"
            :class="{
                'warehouse-select__control--disabled': disabled,
                'warehouse-select__control--open': isOpen,
                'warehouse-select__control--has-value': selectedValue,
            }"
            @click="openDropdown"
        >
            <div class="warehouse-select__value-container">
                <!-- Multiple Selection Tags -->
                <template v-if="multiple && selectedWarehouses?.length > 0">
                    <span
                        v-for="item in selectedWarehouses.slice(0, 3)"
                        :key="getValue(item)"
                        class="warehouse-select__tag"
                    >
                        {{ getText(item) }}
                        <button
                            type="button"
                            class="warehouse-select__tag-remove"
                            @click.stop="removeItem(item)"
                            v-if="!disabled"
                        >
                            ×
                        </button>
                    </span>
                    <span v-if="selectedWarehouses.length > 3" class="warehouse-select__tag">
                        +{{ selectedWarehouses.length - 3 }} more
                    </span>
                </template>

                <!-- Single Selection or Placeholder -->
                <span
                    v-else
                    class="warehouse-select__single-value"
                    :class="{ 'warehouse-select__placeholder': !selectedValue }"
                >
                    {{ displayText }}
                </span>
            </div>

            <!-- Clear Button -->
            <button
                v-if="clearable && selectedValue && !disabled"
                type="button"
                class="warehouse-select__clear"
                @click.stop="clearSelection"
            >
                ×
            </button>

            <!-- Dropdown Arrow -->
            <div class="warehouse-select__indicators">
                <div class="warehouse-select__indicator" :class="{ 'warehouse-select__indicator--open': isOpen }">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path
                            d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="isOpen" class="warehouse-select__menu">
            <!-- Search Input -->
            <div class="warehouse-select__search">
                <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    class="form-control form-control-sm"
                    :placeholder="searchPlaceholder"
                />
            </div>

            <!-- Loading State -->
            <div v-if="isLoading && warehouses.length === 0" class="warehouse-select__loading">
                <div class="d-flex align-items-center justify-content-center py-3">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Loading warehouses...
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="hasError" class="warehouse-select__error">
                <div class="text-danger py-3 text-center">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    {{ errorMessage }}
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="warehouses.length === 0 && !isLoading" class="warehouse-select__no-options">
                <div class="text-muted py-3 text-center">
                    <i class="fas fa-search me-1"></i>
                    {{ searchQuery ? 'No warehouses found' : 'Start typing to search warehouses' }}
                </div>
            </div>

            <!-- Options List -->
            <div v-else class="warehouse-select__options" @scroll="handleScroll">
                <div
                    v-for="warehouse in warehouses"
                    :key="getValue(warehouse)"
                    class="warehouse-select__option"
                    :class="{ 'warehouse-select__option--selected': isSelected(warehouse) }"
                    @click="selectItem(warehouse)"
                >
                    <div class="d-flex align-items-center">
                        <!-- Checkbox for Multiple Selection -->
                        <input
                            v-if="multiple"
                            type="checkbox"
                            :checked="isSelected(warehouse)"
                            class="form-check-input me-2"
                            @click.stop
                        />

                        <div class="grow-1">
                            <div class="warehouse-select__option-title">
                                {{ warehouse.warehouse_name }}
                            </div>
                            <div class="warehouse-select__option-subtitle">
                                <span v-if="warehouse.level" class="text-muted">
                                    {{ warehouse.level.level_description }}
                                </span>
                            </div>
                        </div>

                        <!-- Selected Check -->
                        <div v-if="!multiple && isSelected(warehouse)" class="warehouse-select__option-check">
                            <i class="fas fa-check text-primary"></i>
                        </div>
                    </div>
                </div>

                <!-- Load More -->
                <div v-if="pagination.has_more_pages" class="warehouse-select__load-more" @click="loadMore">
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
.warehouse-select {
    position: relative;
    width: 100%;
}

.warehouse-select__control {
    display: flex;
    align-items: center;
    min-height: 38px;
    cursor: pointer;
    position: relative;
    padding-right: 40px;
}

.warehouse-select__control--disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
}

.warehouse-select__control--open {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
}

.warehouse-select__value-container {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
}

.warehouse-select__single-value {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.warehouse-select__placeholder {
    color: #6c757d;
}

.warehouse-select__tag {
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

.warehouse-select__tag-remove {
    background: none;
    border: none;
    font-size: 16px;
    line-height: 1;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    margin: 0;
}

.warehouse-select__tag-remove:hover {
    color: #dc3545;
}

.warehouse-select__clear {
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

.warehouse-select__clear:hover {
    color: #dc3545;
}

.warehouse-select__indicators {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
}

.warehouse-select__indicator {
    color: #6c757d;
    transition: transform 0.2s;
}

.warehouse-select__indicator--open {
    transform: rotate(180deg);
}

.warehouse-select__menu {
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

.warehouse-select__search {
    padding: 8px;
    border-bottom: 1px solid #dee2e6;
}

.warehouse-select__options {
    max-height: 240px;
    overflow-y: auto;
}

.warehouse-select__option {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;
}

.warehouse-select__option:hover {
    background-color: #f8f9fa;
}

.warehouse-select__option--selected {
    background-color: #e7f3ff;
}

.warehouse-select__option-title {
    font-weight: 500;
    margin-bottom: 2px;
}

.warehouse-select__option-subtitle {
    font-size: 0.875em;
    color: #6c757d;
}

.warehouse-select__option-check {
    color: #0d6efd;
}

.warehouse-select__loading,
.warehouse-select__error,
.warehouse-select__no-options {
    padding: 12px;
}

.warehouse-select__load-more {
    border-top: 1px solid #dee2e6;
    cursor: pointer;
}

.warehouse-select__load-more:hover {
    background-color: #f8f9fa;
}

/* Scrollbar styling for dropdown */
.warehouse-select__options::-webkit-scrollbar {
    width: 6px;
}

.warehouse-select__options::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.warehouse-select__options::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
}

.warehouse-select__options::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
}
</style>
