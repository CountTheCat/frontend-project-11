import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', /^react\/.*/],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
