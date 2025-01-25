import { resolve } from 'path';
import { defineConfig } from 'vite';
import { terser } from 'rollup-plugin-terser'; // Import plugin minify đúng cách

export default defineConfig({
    build: {
        minify: false, // Tắt minify
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'Gantt',
            fileName: 'frappe-gantt',
        },
        rollupOptions: {
            external: ['vue'],
            output: [
                {
                    // Tệp không minify
                    format: 'es',
                    entryFileNames: 'frappe-gantt.js',
                    dir: 'dist/unminified',
                },
                {
                    // Tệp đã minify
                    format: 'es',
                    entryFileNames: 'frappe-gantt.min.js',
                    dir: 'dist/minified',
                    plugins: [
                        terser(), // Sử dụng cú pháp import thay cho require
                    ],
                },
            ],
        },
    },
    output: { interop: 'auto' },
    server: { watch: { include: ['dist/*', 'src/*'] } }
});
