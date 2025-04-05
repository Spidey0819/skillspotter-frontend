// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [
      react(),
      tailwindcss(),
    ],
  };
  
  // Only add proxy for development mode
  if (command === 'serve') { // This checks if we're in development mode
    config.server = {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    };
  }
  
  return config;
});