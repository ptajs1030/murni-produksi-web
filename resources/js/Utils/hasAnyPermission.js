import { usePage } from '@inertiajs/vue3';

export default function hasAnyPermission(permissions = []) {
    const page = usePage();
    const allPermissions = page.props.auth?.permissions || {};

    return permissions.some(permission => allPermissions[permission]);
}
