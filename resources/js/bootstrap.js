import $ from "jquery";
window.$ = window.jQuery = $;

import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";

import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-with"] = "XMLHttpRequest";
