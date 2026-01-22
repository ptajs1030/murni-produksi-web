// Utils/createDeleteConfirmation.js
import { router } from '@inertiajs/vue3';

/**
 * Creates a delete confirmation function with SweetAlert2
 * @param {Object} swal - SweetAlert2 instance
 * @returns {Function} Delete confirmation function
 */
const createDeleteConfirmation = swal => {
    return (url, id, options = {}) => {
        const defaultOptions = {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            successTitle: 'Deleted!',
            successText: 'Your item has been deleted.',
            successIcon: 'success',
            showSuccessAlert: false,
            ...options,
        };

        return swal
            .fire({
                title: defaultOptions.title,
                text: defaultOptions.text,
                icon: defaultOptions.icon,
                showCancelButton: defaultOptions.showCancelButton,
                confirmButtonColor: defaultOptions.confirmButtonColor,
                cancelButtonColor: defaultOptions.cancelButtonColor,
                confirmButtonText: defaultOptions.confirmButtonText,
                cancelButtonText: defaultOptions.cancelButtonText,
            })
            .then(result => {
                if (result.isConfirmed) {
                    if (id == null) {
                        swal.fire({
                            title: defaultOptions.successTitle,
                            text: 'testing deleted',
                            icon: defaultOptions.successIcon,
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        return;
                    }
                    // Construct the full URL
                    const deleteUrl = url.includes('{id}') ? url.replace('{id}', id) : `${url}/${id}`;

                    router.delete(deleteUrl, {
                        onSuccess: () => {
                            if (defaultOptions.showSuccessAlert) {
                                swal.fire({
                                    title: defaultOptions.successTitle,
                                    text: defaultOptions.successText,
                                    icon: defaultOptions.successIcon,
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
                            }
                        },
                        onError: () => {
                            swal.fire({
                                title: 'Error!',
                                text: 'Something went wrong while deleting.',
                                icon: 'error',
                            });
                        },
                    });
                }
                return result;
            });
    };
};

export default createDeleteConfirmation;
