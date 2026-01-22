<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    links: Array,
});
</script>

<template>
    <div v-if="links.length > 3">
        <div class="d-flex justify-content-end flex-wrap-reverse">
            <template v-for="(link, key) in links" :key="key">
                <div
                    v-if="link.url === null"
                    class="btn btn-sm btn-outline-primary disabled mb-1 me-1 px-3 py-2"
                    v-html="link.label"
                />
                <Link
                    v-else
                    class="btn btn-sm mb-1 me-1 px-3 py-2"
                    :class="{
                        'btn-primary': link.active,
                        'btn-outline-primary': !link.active,
                    }"
                    :href="link.url"
                >
                    <span v-html="link.label"></span>
                </Link>
            </template>
        </div>
    </div>
</template>
