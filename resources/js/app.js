// Bootstrap JS (axios setup, dll)
import "./bootstrap";

// Font Awesome CSS
import "@fortawesome/fontawesome-free/css/all.min.css";
import "vue3-toastify/dist/index.css";

// CSS utama (Tailwind + Template)
import "~/css/app.css";
import "~/css/mobile-sidebar.css";

// Template JS (Soft UI Dashboard)
import "~/template/core/bootstrap.bundle.min.js";
import "~/template/plugins/chartjs.min.js"; // chart.js versi 4
// import './template/plugins/Chart.extension.js'; //deprecated untuk Chart.js 4
import "~/template/soft-ui-dashboard.min.js";

// Vue + Inertia
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import Swal from "sweetalert2"; // Import SweetAlert2
import { createApp, h } from "vue";
import Vue3Toastify from "vue3-toastify";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";
import createDeleteConfirmation from "./Utils/createDeleteConfirmation.js";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title, page) => {
        const appSettingsName = page?.props?.appSettings?.name || appName;
        return title ? `${title} - ${appSettingsName}` : appSettingsName;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue"),
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(Vue3Toastify);

        // Configure global properties BEFORE mounting
        app.config.globalProperties.$swal = Swal;
        app.config.globalProperties.$confirmDelete =
            createDeleteConfirmation(Swal);

        // Mount the app
        app.mount(el);

        // Clean up any residual mobile sidebar state on app initialization
        setTimeout(() => {
            const body = document.body;
            const sidebar = document.getElementById("sidenav-main");

            if (body) {
                body.classList.remove("sidebar-open");
            }
            if (sidebar) {
                sidebar.classList.remove("show-mobile");
            }
        }, 50);

        return app;
    },
    progress: { color: "#f97316" },
});
