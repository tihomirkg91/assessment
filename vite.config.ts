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
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vendor-react',
                test: /node_modules[\\/](react|react-dom|scheduler)/,
                priority: 30,
              },
              {
                name: 'vendor-mui',
                test: /node_modules[\\/](@mui|@emotion)/,
                priority: 20,
              },
              {
                name: 'vendor-query',
                test: /node_modules[\\/]@tanstack/,
                priority: 10,
              },
            ],
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
