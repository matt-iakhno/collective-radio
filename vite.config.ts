import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { viteStaticCopy } from "vite-plugin-static-copy";

const BUILD_TIME_VALUE = JSON.stringify(Date.now());

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),viteStaticCopy({
    targets: [
      {
        src: "src/service-worker.js",
        dest: "",
        // 👇 Use a transform function to replace the placeholder
        transform: (content) => {
          return content.toString().replace(/__BUILD_TIME__/g, BUILD_TIME_VALUE);
        }
      }
    ]
  })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    }
  },
})
