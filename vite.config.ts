import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    build: {
      // browser downloads smaller files in parallel instead of one giant bundle
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (
              id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')
            )
              return 'vendor-react'
            if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion'))
              return 'vendor-mui'
            if (id.includes('node_modules/@tanstack')) return 'vendor-query'
            return undefined
          },
        },
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env['VITE_API_TARGET'] as string,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
