import { onMounted, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext, computed, ref, toDisplayString, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { Link, usePage } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { toast } from "vue3-toastify";
const _sfc_main$3 = {
  __name: "Navbar",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String
    }
  },
  setup(__props) {
    onMounted(() => {
      const cleanupSidebar = () => {
        const sidebar = document.getElementById("sidenav-main");
        const body = document.body;
        if (sidebar) {
          sidebar.classList.remove("show-mobile");
        }
        if (body) {
          body.classList.remove("sidebar-open");
        }
      };
      cleanupSidebar();
      setTimeout(() => {
        const toggleSidenav = (e) => {
          e.preventDefault();
          const sidebar = document.getElementById("sidenav-main");
          const body = document.body;
          if (sidebar) {
            if (sidebar.classList.contains("show-mobile")) {
              sidebar.classList.remove("show-mobile");
              body.classList.remove("sidebar-open");
            } else {
              sidebar.classList.add("show-mobile");
              body.classList.add("sidebar-open");
            }
          }
        };
        const hamburgerToggle = document.getElementById("iconNavbarSidenav");
        if (hamburgerToggle) {
          hamburgerToggle.addEventListener("click", toggleSidenav);
        }
        const closeSidenav = document.getElementById("iconSidenav");
        if (closeSidenav) {
          closeSidenav.addEventListener("click", toggleSidenav);
        }
        document.addEventListener("click", (e) => {
          const sidebar = document.getElementById("sidenav-main");
          const hamburger = document.getElementById("iconNavbarSidenav");
          const closeIcon = document.getElementById("iconSidenav");
          if (sidebar && sidebar.classList.contains("show-mobile")) {
            if (!sidebar.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target) && e.target !== closeIcon) {
              sidebar.classList.remove("show-mobile");
              document.body.classList.remove("sidebar-open");
            }
          }
        });
      }, 100);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "navbar navbar-main navbar-expand-lg border-radius-xl px-0 shadow-none",
        id: "navbarBlur",
        "navbar-scroll": "true"
      }, _attrs))}><div class="container-fluid px-3 py-1"><nav aria-label="breadcrumb"><ol class="breadcrumb me-sm-6 mb-0 me-5 bg-transparent px-0 pb-0 pt-1"><li class="breadcrumb-item text-sm"><a class="text-dark opacity-5" href="#">Pages</a></li><li class="breadcrumb-item text-dark active text-sm" aria-current="page">${ssrInterpolate(__props.title)}</li></ol></nav><div class="navbar-collapse mt-sm-0 me-md-0 me-sm-4 collapse mt-2" id="navbar"><div class="ms-md-auto pe-md-3 d-flex align-items-center"><div class="input-group"><span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span><input type="text" class="form-control" placeholder="Type here..."></div></div><ul class="navbar-nav justify-content-end"><li class="nav-item d-xl-none d-flex align-items-center ps-3"><a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav"><div class="sidenav-toggler-inner"><i class="sidenav-toggler-line"></i><i class="sidenav-toggler-line"></i><i class="sidenav-toggler-line"></i></div></a></li><li class="nav-item dropdown"><a href="#" class="nav-link dropdown-toggle d-flex align-items-center text-body px-3" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-user me-2"></i><span class="d-none d-md-inline">${ssrInterpolate(_ctx.$page.props.auth.user.name)}</span></a><ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown"><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("profile.edit"),
        class: "dropdown-item d-flex align-items-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa fa-cog text-muted me-2"${_scopeId}></i> Profile Settings `);
          } else {
            return [
              createVNode("i", { class: "fa fa-cog text-muted me-2" }),
              createTextVNode(" Profile Settings ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li><hr class="dropdown-divider"></li><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("logout"),
        method: "post",
        as: "button",
        class: "dropdown-item d-flex align-items-center text-danger w-100 border-0 bg-transparent text-start"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa fa-sign-out-alt me-2"${_scopeId}></i> Logout `);
          } else {
            return [
              createVNode("i", { class: "fa fa-sign-out-alt me-2" }),
              createTextVNode(" Logout ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></li></ul></div></div></nav>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Layout/Navbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const MENUS = [
  {
    name: "Dashboard",
    icon: "fas fa-home",
    route: "dashboard.index",
    roles: ["owner", "admin"]
  },
  {
    type: "divider",
    name: "Management Master Data"
  },
  {
    name: "Master Data Users",
    icon: "fas fa-user-cog",
    roles: ["owner", "admin"],
    children: [
      {
        name: "Users",
        icon: "fas fa-users",
        route: "users.index",
        roles: ["owner", "admin"]
      }
    ]
  },
  {
    name: "Master Data Produk",
    icon: "fas fa-boxes",
    roles: ["owner", "admin"],
    children: [
      {
        name: "Produk",
        icon: "fas fa-box",
        route: "products.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Kategori",
        icon: "fas fa-tags",
        route: "categories.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Supplier",
        icon: "fas fa-truck",
        route: "suppliers.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Sifat Benda",
        icon: "fa fa-flask",
        route: "property-items.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Ukuran Packaging",
        icon: "fa fa-ruler",
        route: "packaging-sizes.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Wadah Packaging",
        icon: "fa fa-box",
        route: "packaging-types.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Repack status",
        icon: "fa fa-retweet",
        route: "repack-status.index",
        roles: ["owner", "admin"]
      }
    ]
  },
  {
    name: "Master Data Transaction",
    icon: "fas fa-exchange-alt",
    roles: ["owner", "admin"],
    children: [
      {
        name: "Packing Level",
        icon: "fas fa-layer-group",
        route: "packaging-size-levels.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Ukuran Packing Type",
        icon: "fas fa-layer-group",
        route: "packaging-size-types.index",
        roles: ["owner", "admin"]
      },
      {
        name: "Resep",
        icon: "fas fa-receipt",
        route: "recipes.index",
        roles: ["owner", "admin"]
      }
    ]
  },
  {
    type: "divider",
    name: "Core SYSTEM"
  },
  {
    name: "Barang Datang",
    icon: "fas fa-truck-loading",
    route: "incoming-goods.index",
    roles: ["owner", "admin"]
  },
  {
    name: "Barang Keluar",
    icon: "fas fa-truck-moving",
    route: "outgoing-goods.index",
    roles: ["owner", "admin"]
  },
  {
    name: "Repack",
    icon: "fas fa-retweet",
    route: "repack.index",
    roles: ["owner", "admin"]
  },
  {
    name: "Produksi",
    icon: "fas fa-industry",
    route: "production.index",
    roles: ["owner", "admin"]
  },
  {
    name: "Stock Opname",
    icon: "fas fa-clipboard-check",
    route: "stock-opnames.index",
    roles: ["owner", "admin"]
  },
  {
    name: "Produk Expired",
    icon: "fas fa-calendar-times",
    route: "product-expired.index",
    roles: ["owner", "admin"]
  },
  {
    name: "Riwayat Transaksi",
    icon: "fas fa-history",
    route: "stock-transactions.index",
    roles: ["owner", "admin"]
  },
  {
    type: "divider",
    name: "SYSTEM"
  },
  {
    name: "Pengaturan",
    icon: "fas fa-cog",
    route: "settings.index",
    roles: ["owner", "admin"]
  }
];
const _sfc_main$2 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const page2 = usePage();
    const userRole = computed(() => {
      var _a, _b;
      return (_b = (_a = page2.props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.role;
    });
    const openDropdowns = ref({});
    const showOptimizeConfirm = ref(false);
    const isOptimizing = ref(false);
    const optimizeStatus = ref(null);
    const menus = computed(() => {
      if (!userRole.value) return [];
      return MENUS.filter((menu) => {
        if (!menu.roles) return true;
        return menu.roles.includes(userRole.value);
      }).map((menu) => {
        if (!menu.children) return menu;
        return {
          ...menu,
          children: menu.children.filter(
            (child) => !child.roles || child.roles.includes(userRole.value)
          )
        };
      }).filter((menu) => !menu.children || menu.children.length > 0);
    });
    const currentUrl = computed(() => page2.url);
    const isActive = (routeName) => {
      if (!routeName) return false;
      try {
        const currentPath = currentUrl.value.split("?")[0];
        const targetUrl = route(routeName);
        const targetPath = new URL(targetUrl).pathname;
        const isMatch = currentPath === targetPath || currentPath.startsWith(targetPath + "/");
        return isMatch;
      } catch (error) {
        console.warn(`Route "${routeName}" not found:`, error);
        return false;
      }
    };
    const hasActiveChild = (children) => {
      return children.some((child) => isActive(child.route));
    };
    const shouldOpenDropdown = (index, children) => {
      if (hasActiveChild(children)) {
        openDropdowns.value[index] = true;
        return true;
      }
      return openDropdowns.value[index];
    };
    const getRouteUrl = (routeName) => {
      if (!routeName) return "#";
      try {
        return route(routeName);
      } catch (error) {
        console.warn(`Route "${routeName}" not found:`, error);
        return "#";
      }
    };
    const canOptimize = computed(() => {
      var _a;
      return ((_a = page2.props.auth) == null ? void 0 : _a.user) !== null;
    });
    const checkOptimizeStatus = async () => {
      try {
        const response = await axios.get(route("system.optimize.status"));
        optimizeStatus.value = response.data;
      } catch (error) {
        console.error("Failed to check optimize status:", error);
      }
    };
    if (canOptimize.value) {
      checkOptimizeStatus();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><ul class="navbar-nav" data-v-97cb4849><!--[-->`);
      ssrRenderList(menus.value, (menu, index) => {
        _push(`<!--[-->`);
        if (menu.type === "divider") {
          _push(`<li class="nav-item mt-3" data-v-97cb4849><h6 class="text-uppercase font-weight-bolder opacity-6 ms-2 ps-4 text-xs" data-v-97cb4849>${ssrInterpolate(menu.name)}</h6></li>`);
        } else if (menu.children && menu.children.length > 0) {
          _push(`<li class="nav-item" data-v-97cb4849><a href="javascript:void(0)" class="${ssrRenderClass([
            "nav-link d-flex align-items-center",
            {
              "active bg-gradient-primary text-white": hasActiveChild(menu.children),
              "text-dark": !hasActiveChild(menu.children)
            }
          ])}" data-v-97cb4849><div class="${ssrRenderClass([
            "icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow",
            {
              "bg-white": !hasActiveChild(menu.children),
              "bg-gradient-light": hasActiveChild(
                menu.children
              )
            }
          ])}" data-v-97cb4849><i class="${ssrRenderClass([
            menu.icon,
            {
              "text-dark": !hasActiveChild(menu.children),
              "text-white": hasActiveChild(menu.children)
            }
          ])}" data-v-97cb4849></i></div><span class="nav-link-text grow-1 ms-1" data-v-97cb4849>${ssrInterpolate(menu.name)}</span><i class="${ssrRenderClass([
            "fas fa-chevron-down ms-auto size-4 transition-transform duration-200",
            {
              "rotate-180": shouldOpenDropdown(
                index,
                menu.children
              )
            }
          ])}" data-v-97cb4849></i></a><div class="${ssrRenderClass([
            "collapse",
            {
              show: shouldOpenDropdown(index, menu.children)
            }
          ])}" data-v-97cb4849><ul style="${ssrRenderStyle({ "list-style": "none" })}" class="flex-column ms-3 mt-1" data-v-97cb4849><!--[-->`);
          ssrRenderList(menu.children, (child, cIndex) => {
            _push(`<li class="nav-item" data-v-97cb4849>`);
            _push(ssrRenderComponent(unref(Link), {
              href: getRouteUrl(child.route),
              class: [
                "nav-link d-flex align-items-center py-2",
                {
                  "active btn-outline-primary-bottom text-primary": isActive(child.route),
                  "text-dark": !isActive(child.route)
                }
              ]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="${ssrRenderClass([
                    "icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow",
                    {
                      "bg-white": !isActive(child.route),
                      "bg-gradient-light": isActive(
                        child.route
                      )
                    }
                  ])}" style="${ssrRenderStyle({ "width": "28px", "height": "28px" })}" data-v-97cb4849${_scopeId}><i class="${ssrRenderClass([
                    child.icon,
                    {
                      "text-dark": !isActive(
                        child.route
                      ),
                      "text-white": isActive(
                        child.route
                      )
                    }
                  ])}" data-v-97cb4849${_scopeId}></i></div><span class="nav-link-text ms-1" data-v-97cb4849${_scopeId}>${ssrInterpolate(child.name)}</span>`);
                } else {
                  return [
                    createVNode("div", {
                      class: [
                        "icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow",
                        {
                          "bg-white": !isActive(child.route),
                          "bg-gradient-light": isActive(
                            child.route
                          )
                        }
                      ],
                      style: { "width": "28px", "height": "28px" }
                    }, [
                      createVNode("i", {
                        class: [
                          child.icon,
                          {
                            "text-dark": !isActive(
                              child.route
                            ),
                            "text-white": isActive(
                              child.route
                            )
                          }
                        ]
                      }, null, 2)
                    ], 2),
                    createVNode("span", { class: "nav-link-text ms-1" }, toDisplayString(child.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div></li>`);
        } else {
          _push(`<li class="nav-item" data-v-97cb4849>`);
          _push(ssrRenderComponent(unref(Link), {
            href: getRouteUrl(menu.route),
            class: [
              "nav-link d-flex align-items-center",
              {
                "active bg-gradient-primary text-white": isActive(
                  menu.route
                ),
                "text-dark": !isActive(menu.route)
              }
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([
                  "icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow",
                  {
                    "bg-white": !isActive(menu.route),
                    "bg-gradient-light": isActive(menu.route)
                  }
                ])}" data-v-97cb4849${_scopeId}><i class="${ssrRenderClass([
                  menu.icon,
                  {
                    "text-dark": !isActive(menu.route),
                    "text-white": isActive(menu.route)
                  }
                ])}" data-v-97cb4849${_scopeId}></i></div><span class="nav-link-text ms-1" data-v-97cb4849${_scopeId}>${ssrInterpolate(menu.name)}</span>`);
              } else {
                return [
                  createVNode("div", {
                    class: [
                      "icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow",
                      {
                        "bg-white": !isActive(menu.route),
                        "bg-gradient-light": isActive(menu.route)
                      }
                    ]
                  }, [
                    createVNode("i", {
                      class: [
                        menu.icon,
                        {
                          "text-dark": !isActive(menu.route),
                          "text-white": isActive(menu.route)
                        }
                      ]
                    }, null, 2)
                  ], 2),
                  createVNode("span", { class: "nav-link-text ms-1" }, toDisplayString(menu.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]-->`);
      if (canOptimize.value) {
        _push(`<li class="nav-item mt-4" data-v-97cb4849><button${ssrIncludeBooleanAttr(isOptimizing.value) ? " disabled" : ""} class="${ssrRenderClass([
          "nav-link d-flex align-items-center w-100",
          {
            "cursor-not-allowed opacity-50": isOptimizing.value,
            "text-dark": !isOptimizing.value
          }
        ])}" style="${ssrRenderStyle({ "border": "none", "background": "transparent", "text-align": "left" })}" data-v-97cb4849><div class="${ssrRenderClass([
          "icon icon-shape icon-sm border-radius-md d-flex align-items-center justify-content-center me-2 text-center shadow",
          {
            "bg-white": !isOptimizing.value,
            "bg-gradient-light": isOptimizing.value
          }
        ])}" data-v-97cb4849><i class="${ssrRenderClass([
          isOptimizing.value ? "fas fa-spinner fa-spin" : "fas fa-sync-alt",
          {
            "text-dark": !isOptimizing.value,
            "text-white": isOptimizing.value
          }
        ])}" data-v-97cb4849></i></div><span class="nav-link-text ms-1" data-v-97cb4849>${ssrInterpolate(isOptimizing.value ? "Optimizing..." : "Refresh Halaman")}</span></button></li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul>`);
      if (showOptimizeConfirm.value) {
        _push(`<div class="modal fade show d-block" style="${ssrRenderStyle({ "background-color": "rgba(0, 0, 0, 0.5)" })}" data-v-97cb4849><div class="modal-dialog modal-dialog-centered" data-v-97cb4849><div class="modal-content" data-v-97cb4849><div class="modal-header" data-v-97cb4849><h5 class="modal-title" data-v-97cb4849><i class="fas fa-sync-alt me-2" data-v-97cb4849></i> Konfirmasi Refresh Halaman </h5><button type="button" class="btn-close" data-v-97cb4849></button></div><div class="modal-body" data-v-97cb4849><p data-v-97cb4849>Apakah Anda yakin ingin menjalankan optimasi sistem?</p><div class="alert alert-info" data-v-97cb4849><i class="fas fa-info-circle me-2" data-v-97cb4849></i><strong data-v-97cb4849>Informasi:</strong><ul class="mb-0 mt-2" data-v-97cb4849><li data-v-97cb4849> Proses ini akan menjalankan <code data-v-97cb4849>php artisan optimize</code></li><li data-v-97cb4849> Halaman akan otomatis refresh setelah optimasi selesai </li><li data-v-97cb4849> Mungkin memerlukan beberapa detik untuk menyelesaikan </li></ul></div>`);
        if (optimizeStatus.value) {
          _push(`<div class="mt-3" data-v-97cb4849><small class="text-muted" data-v-97cb4849><strong data-v-97cb4849>Rate Limit:</strong> ${ssrInterpolate(optimizeStatus.value.rate_limit_remaining)} dari 3 percobaan tersisa </small></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="modal-footer" data-v-97cb4849><button type="button" class="btn btn-secondary" data-v-97cb4849><i class="fas fa-times me-2" data-v-97cb4849></i> Batal </button><button type="button" class="btn btn-primary" data-v-97cb4849><i class="fas fa-sync-alt me-2" data-v-97cb4849></i> Ya, Refresh Sekarang </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Layout/Sidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Sidebar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-97cb4849"]]);
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
    onClose: () => reToasted.value = false
  });
}
const getAutoClose = (notification, isSticky) => {
  if (isSticky) {
    return false;
  }
  switch (notification.type) {
    case "success":
      return 2e3;
    case "warning":
      return 5e3;
    default:
      return false;
  }
};
function fireToasts(sticky = false) {
  var _a;
  (_a = toasts.value) == null ? void 0 : _a.forEach((notification) => fireToast(notification, sticky));
}
watch(
  // NOTE: Since Inertia.js 1.0.1, usePage() may return null initially.
  () => {
    var _a, _b;
    return (_b = (_a = page.props) == null ? void 0 : _a.flash) == null ? void 0 : _b.toasts;
  },
  (newToasts) => {
    reToasted.value = false;
    toasts.value = newToasts;
    fireToasts();
  }
);
const _sfc_main$1 = {
  __name: "ToastNotifications",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ToastNotifications.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function useAppSettings() {
  const page2 = usePage();
  const appSettings = computed(() => page2.props.appSettings || {});
  const appName = computed(() => appSettings.value.name || "Murni Produksi");
  const appLogo = computed(
    () => appSettings.value.logo || "/resources/img/logo.png"
  );
  const appFavicon = computed(
    () => appSettings.value.favicon || "/favicon.ico"
  );
  const appDescription = computed(
    () => appSettings.value.description || "Warehouse Management System"
  );
  const footerText = computed(
    () => appSettings.value.footer_text || "© 2024 Murni Warehouse. All rights reserved."
  );
  const getSetting = (key, defaultValue = null) => {
    const keys = key.split(".");
    let value = appSettings.value;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    return value !== void 0 ? value : defaultValue;
  };
  const hasSetting = (key) => {
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
    hasSetting
  };
}
const _sfc_main = {
  __name: "AuthenticatedLayout",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String
    }
  },
  setup(__props) {
    const { appName, appLogo } = useAppSettings();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><aside class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl fixed-start my-3 ms-3 border-0" id="sidenav-main"><div class="sidenav-header"><i class="fas fa-times text-secondary position-absolute d-xl-none end-0 top-0 me-3 cursor-pointer p-3 opacity-5" aria-hidden="true" id="iconSidenav"></i>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "navbar-brand m-0",
        href: _ctx.route("dashboard.index")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(appLogo))} class="navbar-brand-img h-100" alt="main_logo"${_scopeId}><br${_scopeId}><span class="font-weight-bold d-block ms-1 text-center"${_scopeId}>${ssrInterpolate(unref(appName))}</span>`);
          } else {
            return [
              createVNode("img", {
                src: unref(appLogo),
                class: "navbar-brand-img h-100",
                alt: "main_logo"
              }, null, 8, ["src"]),
              createVNode("br"),
              createVNode("span", { class: "font-weight-bold d-block ms-1 text-center" }, toDisplayString(unref(appName)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><hr class="horizontal dark mt-0">`);
      _push(ssrRenderComponent(Sidebar, null, null, _parent));
      _push(`</aside><main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">`);
      _push(ssrRenderComponent(_sfc_main$3, { title: __props.title }, null, _parent));
      _push(`<div class="container-fluid bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AuthenticatedLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
