<script setup>
import { debounce } from 'lodash';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number, Object],
        default: null,
    },
    packagingSizeId: {
        type: [String, Number],
        default: null,
    },
    placeholder: {
        type: String,
        default: 'Select packaging size...',
    },
    searchPlaceholder: {
        type: String,
        default: 'Search packaging sizes...',
    },
    disabled: {
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
        default: 'packaging_size_name',
    },
    apiUrl: {
        type: String,
        default: '/api/parameters/getPackSizePerProducts',
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const packagingSizes = ref([]);
const dropdownRef = ref(null);
const searchInputRef = ref(null);
const hasError = ref(false);
const errorMessage = ref('');

const selectedValue = computed(() => {
    return props.modelValue;
});

const displayText = ref(props.placeholder);

const updateDisplayText = async () => {
    if (selectedValue.value) {
        const item = packagingSizes.value.find(p => getValue(p) === getValue(selectedValue.value));
        if (item) {
            displayText.value = getText(item);
        } else if (typeof selectedValue.value === 'object') {
            displayText.value = getText(selectedValue.value);
        } else {
            displayText.value = selectedValue.value;
        }
    } else {
        displayText.value = props.placeholder;
    }
};

const getValue = item => {
    return typeof item === 'object' && item !== null ? item[props.itemValue] : item;
};

const getText = item => {
    return typeof item === 'object' && item !== null ? item[props.itemText] : item;
};

const loadPackagingSizes = async (autoSelectSmallest = false) => {
    if (!props.packagingSizeId) {
        packagingSizes.value = [];
        return;
    }

    isLoading.value = true;
    hasError.value = false;

    try {
        const requestBody = {
            m_packaging_size_id: props.packagingSizeId,
        };

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

        if (!response.ok) throw new Error('Failed to fetch packaging sizes');

        const data = await response.json();

        if (data.status_code !== 1) {
            throw new Error(data.status_desc || 'Failed to load packaging sizes');
        }

        packagingSizes.value = data.results || [];

        // Auto-select packaging level terkecil (smallest packaging_level_id)
        if (autoSelectSmallest && packagingSizes.value.length > 0 && !selectedValue.value) {
            const smallest = packagingSizes.value.reduce((min, item) => {
                return item.packaging_level_id < min.packaging_level_id ? item : min;
            });
            selectItem(smallest);
        }
    } catch (error) {
        hasError.value = true;
        errorMessage.value = error.message || 'Error loading packaging sizes';
        console.error('Error loading packaging sizes:', error);
        packagingSizes.value = [];
    } finally {
        isLoading.value = false;
    }
};

const openDropdown = () => {
    if (props.disabled || !props.packagingSizeId) return;

    isOpen.value = true;

    nextTick(() => {
        if (searchInputRef.value) {
            searchInputRef.value.focus();
        }
        if (packagingSizes.value.length === 0) {
            loadPackagingSizes();
        }
    });
};

const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
};

const selectItem = item => {
    const value = props.returnObject ? item : getValue(item);
    emit('update:modelValue', value);
    emit('change', value);
    closeDropdown();
};

const clearSelection = () => {
    emit('update:modelValue', null);
    emit('change', null);
};

const isSelected = item => {
    return getValue(selectedValue.value) === getValue(item);
};

const handleClickOutside = event => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        closeDropdown();
    }
};

// Filter packaging sizes based on search query
const filteredPackagingSizes = computed(() => {
    if (!searchQuery.value) return packagingSizes.value;

    const query = searchQuery.value.toLowerCase();
    return packagingSizes.value.filter(item => {
        const text = getText(item).toLowerCase();
        return text.includes(query);
    });
});

watch(
    () => props.modelValue,
    () => {
        updateDisplayText();
    }
);

watch(
    () => props.packagingSizeId,
    (newId, oldId) => {
        if (newId) {
            // Auto-select smallest only when packagingSizeId changes (not on initial load if already has value)
            const shouldAutoSelect = newId !== oldId;
            loadPackagingSizes(shouldAutoSelect);
        } else {
            packagingSizes.value = [];
            clearSelection();
        }
    }
);

watch([packagingSizes], () => {
    updateDisplayText();
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
    <div class="packaging-size-select" ref="dropdownRef">
        <!-- Selected Display -->
        <div
            class="form-control packaging-size-select__control"
            :class="{
                'packaging-size-select__control--disabled': disabled || !packagingSizeId,
                'packaging-size-select__control--open': isOpen,
                'packaging-size-select__control--has-value': selectedValue,
            }"
            @click="openDropdown"
        >
            <div class="packaging-size-select__value-container">
                <span
                    class="packaging-size-select__single-value"
                    :class="{ 'packaging-size-select__placeholder': !selectedValue }"
                >
                    {{ displayText }}
                </span>
            </div>

            <!-- Clear Button -->
            <button
                v-if="clearable && selectedValue && !disabled"
                type="button"
                class="packaging-size-select__clear"
                @click.stop="clearSelection"
            >
                ×
            </button>

            <!-- Dropdown Arrow -->
            <div class="packaging-size-select__indicators">
                <div class="packaging-size-select__indicator" :class="{ 'packaging-size-select__indicator--open': isOpen }">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path
                            d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="isOpen" class="packaging-size-select__menu">
            <!-- Search Input -->
            <div class="packaging-size-select__search">
                <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    class="form-control form-control-sm"
                    :placeholder="searchPlaceholder"
                />
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="packaging-size-select__loading">
                <div class="d-flex align-items-center justify-content-center py-3">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Loading packaging sizes...
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="hasError" class="packaging-size-select__error">
                <div class="text-danger py-3 text-center">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    {{ errorMessage }}
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="filteredPackagingSizes.length === 0 && !isLoading" class="packaging-size-select__no-options">
                <div class="text-muted py-3 text-center">
                    <i class="fas fa-search me-1"></i>
                    {{ searchQuery ? 'No packaging sizes found' : 'No packaging sizes available' }}
                </div>
            </div>

            <!-- Options List -->
            <div v-else class="packaging-size-select__options">
                <div
                    v-for="packagingSize in filteredPackagingSizes"
                    :key="getValue(packagingSize)"
                    class="packaging-size-select__option"
                    :class="{ 'packaging-size-select__option--selected': isSelected(packagingSize) }"
                    @click="selectItem(packagingSize)"
                >
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="packaging-size-select__option-title">
                                {{ getText(packagingSize) }}
                            </div>
                            <div class="packaging-size-select__option-subtitle">
                                <span v-if="packagingSize.packaging_size_value" class="badge bg-secondary me-1">{{ packagingSize.packaging_size_value }}</span>
                                <span v-if="packagingSize.packaging_unit_name" class="text-muted">{{ packagingSize.packaging_unit_name }}</span>
                            </div>
                        </div>

                        <!-- Selected Check -->
                        <div v-if="isSelected(packagingSize)" class="packaging-size-select__option-check">
                            <i class="fas fa-check text-primary"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.packaging-size-select {
    position: relative;
    width: 100%;
}

.packaging-size-select__control {
    display: flex;
    align-items: center;
    min-height: 38px;
    cursor: pointer;
    position: relative;
    padding-right: 40px;
}

.packaging-size-select__control--disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
}

.packaging-size-select__control--open {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
}

.packaging-size-select__value-container {
    flex: 1;
    display: flex;
    align-items: center;
}

.packaging-size-select__single-value {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.packaging-size-select__placeholder {
    color: #6c757d;
}

.packaging-size-select__clear {
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

.packaging-size-select__clear:hover {
    color: #dc3545;
}

.packaging-size-select__indicators {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
}

.packaging-size-select__indicator {
    color: #6c757d;
    transition: transform 0.2s;
}

.packaging-size-select__indicator--open {
    transform: rotate(180deg);
}

.packaging-size-select__menu {
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

.packaging-size-select__search {
    padding: 8px;
    border-bottom: 1px solid #dee2e6;
}

.packaging-size-select__options {
    max-height: 240px;
    overflow-y: auto;
}

.packaging-size-select__option {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;
}

.packaging-size-select__option:hover {
    background-color: #f8f9fa;
}

.packaging-size-select__option--selected {
    background-color: #e7f3ff;
}

.packaging-size-select__option-title {
    font-weight: 500;
    margin-bottom: 2px;
}

.packaging-size-select__option-subtitle {
    font-size: 0.875em;
    color: #6c757d;
}

.packaging-size-select__option-check {
    color: #0d6efd;
}

.packaging-size-select__loading,
.packaging-size-select__error,
.packaging-size-select__no-options {
    padding: 12px;
}

/* Scrollbar styling for dropdown */
.packaging-size-select__options::-webkit-scrollbar {
    width: 6px;
}

.packaging-size-select__options::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.packaging-size-select__options::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
}

.packaging-size-select__options::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
}
</style>