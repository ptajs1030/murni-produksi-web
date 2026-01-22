

export const MENUS = [
    {
        name: "Dashboard",
        icon: "fas fa-home",
        route: "dashboard.index",
        roles: ["owner", "admin"],
    },
    {
        type: "divider",
        name: "Management Master Data",
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
                roles: ["owner", "admin"],
            },
        ],
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
                roles: ["owner", "admin"],
            },
            {
                name: "Kategori",
                icon: "fas fa-tags",
                route: "categories.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Supplier",
                icon: "fas fa-truck",
                route: "suppliers.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Sifat Benda",
                icon: "fa fa-flask",
                route: "products.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Ukuran Packaging",
                icon: "fa fa-ruler",
                route: "products.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Wadah Packaging",
                icon: "fa fa-box",
                route: "products.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Repack status",
                icon: "fa fa-retweet",
                route: "products.index",
                roles: ["owner", "admin"],
            },
        ],
    },
    {
        name: "Master Data Gudang",
        icon: "fas fa-warehouse",
        roles: ["owner", "admin"],
        children: [
            {
                name: "Gudang",
                icon: "fas fa-warehouse",
                route: "warehouses.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Gudang Level",
                icon: "fas fa-layer-group",
                route: "stock-opnames.index",
                roles: ["owner", "admin"],
            },
        ],
    },
    {
        name: "Master Data Transaction",
        icon: "fas fa-exchange-alt",
        roles: ["owner", "admin"],
        children: [
            {
                name: "Packing Level",
                icon: "fas fa-layer-group",
                route: "packaging-levels.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Ukuran Packing Type",
                icon: "fas fa-layer-group",
                route: "packaging-types.index",
                roles: ["owner", "admin"],
            },
            {
                name: "Resep",
                icon: "fas fa-receipt",
                route: "recipes.index",
                roles: ["owner", "admin"],
            },
        ],
    },
    {
        type: "divider",
        name: "Core SYSTEM",
    },
    {
        name: "Barang Datang",
        icon: "fas fa-truck-loading",
        route: "incoming-goods.index",
        roles: ["owner", "admin"],
    },
    {
        name: "Barang Keluar",
        icon: "fas fa-truck-moving",
        route: "outgoing-goods.index",
        roles: ["owner", "admin"],
    },
    {
        name: "Stock & History",
        icon: "fas fa-clipboard-list",
        roles: ["owner", "admin"],
    },
    {
        name: "Stock Opname",
        icon: "fas fa-clipboard-check",
        route: "stock-opnames.index",
        roles: ["owner"],
    },
    {
        name: "Produk Expired",
        icon: "fas fa-calendar-times",
        route: "expired-products.index",
        roles: ["owner", "admin"],
    },
];
