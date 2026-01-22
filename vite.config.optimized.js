import vue from "@vitejs/plugin-vue";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.js",
            ssr: "resources/js/ssr.js",
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            "~": "/resources",
            "@": "/resources/js",
        },
    },
    build: {
        // Optimized build configuration for Windows
        rollupOptions: {
            output: {
                // Reduce chunk splitting to minimize file locks
                manualChunks: undefined,
                // Optimize SSR chunking
                chunkFileNames: "assets/[name]-[hash].js",
                entryFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
            },
        },
        // SSR-specific optimizations
        ssr: {
            // No external dependencies for better SSR performance
            noExternal: [],
        },
        // Reduce parallel processing to avoid file locks on Windows
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        // Target modern browsers for better performance
        target: "esnext",
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Optimize dependencies
        optimizeDeps: {
            include: ["vue", "@inertiajs/vue3", "axios"],
        },
    },
    server: {
        fs: {
            // Allow access to more files during development
            strict: false,
        },
        // Reduce file watching issues on Windows
        watch: {
            usePolling: false,
            interval: 100,
        },
    },
    // CSS optimizations
    css: {
        devSourcemap: false,
        postcss: {
            plugins: [
                // Add any additional PostCSS plugins here
            ],
        },
    },
    // Define global constants
    define: {
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
    },
});
