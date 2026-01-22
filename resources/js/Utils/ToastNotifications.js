import { usePage } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';

const toasts = ref();

const reToasted = ref(false);

const page = usePage();

function fireToast(notification, sticky = false) {
    toast(notification.message, {
        toastId: notification.id,
        type: notification.type,
        newestOnTop: true,
        theme: toast.THEME.COLORED,
        autoClose: getAutoClose(notification, sticky),
        closeOnClick: !sticky,
        onClose: () => (reToasted.value = false),
    });
}

const getAutoClose = (notification, isSticky) => {
    if (isSticky) {
        return false;
    }

    switch (notification.type) {
        case 'success':
            return 2000;
        case 'warning':
            return 5000;
        default:
            return false;
    }
};

function fireToasts(sticky = false) {
    toasts.value?.forEach(notification => fireToast(notification, sticky));
}

function toastAgain() {
    reToasted.value ? toast.remove() : fireToasts(true);
    reToasted.value = !reToasted.value;
}

watch(
    // NOTE: Since Inertia.js 1.0.1, usePage() may return null initially.
    () => page.props?.flash?.toasts,
    newToasts => {
        reToasted.value = false;
        toasts.value = newToasts;
        fireToasts();
    }
);

export function useToasts() {
    return {
        toasts,
        toastAgain,
        reToasted,
    };
}
