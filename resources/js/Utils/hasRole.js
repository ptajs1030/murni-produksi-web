import { usePage } from '@inertiajs/vue3';

export default function hasRole(roleName) {
    const page = usePage();
    const user = page.props.auth?.user;

    if (!user || !user.roles) {
        return false;
    }

    return user.roles.some(role => role.name === roleName);
}
