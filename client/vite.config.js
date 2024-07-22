import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
