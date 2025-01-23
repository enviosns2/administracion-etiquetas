import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
