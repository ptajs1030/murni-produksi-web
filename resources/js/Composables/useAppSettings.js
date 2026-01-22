import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

export function useAppSettings() {
    const page = usePage();

    // Reactive computed properties for all app settings
    const appSettings = computed(() => page.props.appSettings || {});

    // Individual setting getters with default values
    const appName = computed(() => appSettings.value.name || 'Soft UI');
    const appLogo = computed(() => appSettings.value.logo || 'resources/logo.png');
    const appFavicon = computed(() => appSettings.value.favicon || '/favicon.ico');
    const appDescription = computed(() => appSettings.value.description || 'Warehouse Management System');
    const footerText = computed(() => appSettings.value.footer_text || '© 2024 Murni Warehouse. All rights reserved.');

    // Helper function to get any setting by key with default
    const getSetting = (key, defaultValue = null) => {
        const keys = key.split('.');
        let value = appSettings.value;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }

        return value !== undefined ? value : defaultValue;
    };

    // Helper function to check if setting exists
    const hasSetting = key => {
        return getSetting(key) !== null;
    };

    return {
        // Raw settings object
        appSettings,

        // Individual settings
        appName,
        appLogo,
        appFavicon,
        appDescription,
        footerText,

        // Helper functions
        getSetting,
        hasSetting,
    };
}
