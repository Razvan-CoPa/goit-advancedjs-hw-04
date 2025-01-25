import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        global: 'window',
    },
    build: {
        rollupOptions: {
            output: {
                globals: {
                    simplelightbox: 'SimpleLightbox',
                },
            },
        },
    },
});