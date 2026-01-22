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
        default: 'Select a user...',
    },
    searchPlaceholder: {
        type: String,
        default: 'Search users...',
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
        default: 'name',
    },
    apiUrl: {
        type: String,
        default: '/api/parameters/getUsers',
    },
    perPage: {
        type: Number,
        default: 20,
    },
    minChars: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['update:modelValue', 'change', 'search']);

const isOpen = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const users = ref([]);
const pagination = ref({});
const currentPage = ref(1);
const dropdownRef = ref(null);
const searchInputRef = ref(null);
const selectedUsers = ref(props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : null);
const hasError = ref(false);
const errorMessage = ref('');

const selectedValue = computed(() => {
    if (props.multiple) {
        return selectedUsers.value || [];
    }
    return props.modelValue;
});

const displayText = computed(() => {
    if (props.multiple) {
        const selected = selectedUsers.value || [];
        if (selected.length === 0) return props.placeholder;
        if (selected.length === 1) {
            const item = users.value.find(u => getValue(u) === getValue(selected[0]));
            return item ? getText(item) : getText(selected[0]);
        }
        return `${selected.length} users selected`;
    } else if (selectedValue.value) {
        const item = users.value.find(u => getValue(u) === getValue(selectedValue.value));
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
    return typeof item === 'object' && item !== null ? item[props.itemText] : item;
};

const loadUsers = async (search = '', page = 1, reset = true) => {
    if (search.length < props.minChars && search.length > 0) return;

    isLoading.value = true;
    hasError.value = false;

    try {
        const requestBody = {
            per_page: props.perPage,
            page: page,
        };

        if (search) requestBody.search = search;
        if (props.role) requestBody.role = props.role;

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

        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();

        if (data.status_code !== 1) {
            throw new Error(data.status_desc || 'Failed to load users');
        }

        if (reset) {
            users.value = data.results || [];
        } else {
            users.value = [...users.value, ...(data.results || [])];
        }

        pagination.value = data.pagination || {};
        currentPage.value = page;
    } catch (error) {
        hasError.value = true;
        errorMessage.value = error.message || 'Error loading users';
        console.error('Error loading users:', error);
    } finally {
        isLoading.value = false;
    }
};

const debouncedSearch = debounce(query => {
    currentPage.value = 1;
    loadUsers(query, 1, true);
    emit('search', query);
}, 300);

const openDropdown = () => {
    if (props.disabled) return;

    isOpen.value = true;

    nextTick(() => {
        if (searchInputRef.value) {
            searchInputRef.value.focus();
        }
        if (users.value.length === 0) {
            loadUsers(searchQuery.value, 1, true);
        }
    });
};

const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
};

const selectItem = item => {
    if (props.multiple) {
        const selected = selectedUsers.value || [];
        const itemValue = getValue(item);
        const isSelected = selected.some(s => getValue(s) === itemValue);

        if (isSelected) {
            selectedUsers.value = selected.filter(s => getValue(s) !== itemValue);
        } else {
            selectedUsers.value = [...selected, props.returnObject ? item : itemValue];
        }

        emit('update:modelValue', selectedUsers.value);
        emit('change', selectedUsers.value);
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
        selectedUsers.value = selectedUsers.value.filter(s => getValue(s) !== itemValue);
        emit('update:modelValue', selectedUsers.value);
        emit('change', selectedUsers.value);
    }
};

const clearSelection = () => {
    if (props.multiple) {
        selectedUsers.value = [];
        emit('update:modelValue', []);
        emit('change', []);
    } else {
        emit('update:modelValue', null);
        emit('change', null);
    }
};

const loadMore = () => {
    if (pagination.value.has_more_pages && !isLoading.value) {
        loadUsers(searchQuery.value, currentPage.value + 1, false);
    }
};

const isSelected = item => {
    if (props.multiple) {
        const selected = selectedUsers.value || [];
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
            selectedUsers.value = Array.isArray(newValue) ? newValue : [];
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
    <div class="user-select" ref="dropdownRef">
        <!-- Selected Display -->
        <div
            class="form-control user-select__control"
            :class="{
                'user-select__control--disabled': disabled,
                'user-select__control--open': isOpen,
                'user-select__control--has-value': selectedValue,
            }"
            @click="openDropdown"
        >
            <div class="user-select__value-container">
                <!-- Multiple Selection Tags -->
                <template v-if="multiple && selectedUsers?.length > 0">
                    <span v-for="item in selectedUsers.slice(0, 3)" :key="getValue(item)" class="user-select__tag">
                        {{ getText(item) }}
                        <button
                            type="button"
                            class="user-select__tag-remove"
                            @click.stop="removeItem(item)"
                            v-if="!disabled"
                        >
                            ×
                        </button>
                    </span>
                    <span v-if="selectedUsers.length > 3" class="user-select__tag">
                        +{{ selectedUsers.length - 3 }} more
                    </span>
                </template>

                <!-- Single Selection or Placeholder -->
                <span v-else class="user-select__single-value" :class="{ 'user-select__placeholder': !selectedValue }">
                    {{ displayText }}
                </span>
            </div>

            <!-- Clear Button -->
            <button
                v-if="clearable && selectedValue && !disabled"
                type="button"
                class="user-select__clear"
                @click.stop="clearSelection"
            >
                ×
            </button>

            <!-- Dropdown Arrow -->
            <div class="user-select__indicators">
                <div class="user-select__indicator" :class="{ 'user-select__indicator--open': isOpen }">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path
                            d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="isOpen" class="user-select__menu">
            <!-- Search Input -->
            <div class="user-select__search">
                <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    class="form-control form-control-sm"
                    :placeholder="searchPlaceholder"
                />
            </div>

            <!-- Loading State -->
            <div v-if="isLoading && users.length === 0" class="user-select__loading">
                <div class="d-flex align-items-center justify-content-center py-3">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Loading users...
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="hasError" class="user-select__error">
                <div class="text-danger py-3 text-center">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    {{ errorMessage }}
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="users.length === 0 && !isLoading" class="user-select__no-options">
                <div class="text-muted py-3 text-center">
                    <i class="fas fa-search me-1"></i>
                    {{ searchQuery ? 'No users found' : 'Start typing to search users' }}
                </div>
            </div>

            <!-- Options List -->
            <div v-else class="user-select__options" @scroll="handleScroll">
                <div
                    v-for="user in users"
                    :key="getValue(user)"
                    class="user-select__option"
                    :class="{ 'user-select__option--selected': isSelected(user) }"
                    @click="selectItem(user)"
                >
                    <div class="d-flex align-items-center">
                        <!-- Checkbox for Multiple Selection -->
                        <input
                            v-if="multiple"
                            type="checkbox"
                            :checked="isSelected(user)"
                            class="form-check-input me-2"
                            @click.stop
                        />

                        <div class="grow-1">
                            <div class="user-select__option-title">
                                {{ getText(user) }}
                            </div>
                            <div class="user-select__option-subtitle">
                                <span class="text-muted">{{ user.email }}</span>
                                <span v-if="user.phone" class="text-muted ms-2">• {{ user.phone }}</span>
                                <span v-if="user.roles && user.roles.length > 0" class="text-muted ms-2">
                                    • {{ user.roles.map(role => role.name).join(', ') }}
                                </span>
                            </div>
                        </div>

                        <!-- Selected Check -->
                        <div v-if="!multiple && isSelected(user)" class="user-select__option-check">
                            <i class="fas fa-check text-primary"></i>
                        </div>
                    </div>
                </div>

                <!-- Load More -->
                <div v-if="pagination.has_more_pages" class="user-select__load-more" @click="loadMore">
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
.user-select {
    position: relative;
    width: 100%;
}

.user-select__control {
    display: flex;
    align-items: center;
    min-height: 38px;
    cursor: pointer;
    position: relative;
    padding-right: 40px;
}

.user-select__control--disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
}

.user-select__control--open {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
}

.user-select__value-container {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
}

.user-select__single-value {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-select__placeholder {
    color: #6c757d;
}

.user-select__tag {
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

.user-select__tag-remove {
    background: none;
    border: none;
    font-size: 16px;
    line-height: 1;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    margin: 0;
}

.user-select__tag-remove:hover {
    color: #dc3545;
}

.user-select__clear {
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

.user-select__clear:hover {
    color: #dc3545;
}

.user-select__indicators {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
}

.user-select__indicator {
    color: #6c757d;
    transition: transform 0.2s;
}

.user-select__indicator--open {
    transform: rotate(180deg);
}

.user-select__menu {
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

.user-select__search {
    padding: 8px;
    border-bottom: 1px solid #dee2e6;
}

.user-select__options {
    max-height: 240px;
    overflow-y: auto;
}

.user-select__option {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;
}

.user-select__option:hover {
    background-color: #f8f9fa;
}

.user-select__option--selected {
    background-color: #e7f3ff;
}

.user-select__option-title {
    font-weight: 500;
    margin-bottom: 2px;
}

.user-select__option-subtitle {
    font-size: 0.875em;
    color: #6c757d;
}

.user-select__option-check {
    color: #0d6efd;
}

.user-select__loading,
.user-select__error,
.user-select__no-options {
    padding: 12px;
}

.user-select__load-more {
    border-top: 1px solid #dee2e6;
    cursor: pointer;
}

.user-select__load-more:hover {
    background-color: #f8f9fa;
}

/* Scrollbar styling for dropdown */
.user-select__options::-webkit-scrollbar {
    width: 6px;
}

.user-select__options::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.user-select__options::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
}

.user-select__options::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
}
</style>
