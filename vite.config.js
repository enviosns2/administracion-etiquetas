import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000/api'),
  },
  build: {
    rollupOptions: {
      output: {
        // Dividir las dependencias principales en chunks separados
        manualChunks: {
          vendor: ['react', 'react-dom', 'axios'], // Chunks para librerías comunes
          pdf: ['jspdf'], // Chunks para jsPDF
          barcode: ['jsbarcode'], // Chunks para jsBarcode
        },
      },
    },
    chunkSizeWarningLimit: 500, // Ajustar el límite de advertencia
  },
});
