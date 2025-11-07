import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-navigation-menu'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'vendor-auth': ['@clerk/clerk-react', '@react-oauth/google'],
          'vendor-utils': ['clsx', 'class-variance-authority', 'tailwind-merge'],
          'vendor-animations': ['framer-motion', 'react-confetti', 'canvas-confetti'],
          'vendor-icons': ['lucide-react'],
          'vendor-forms': ['react-razorpay'],
          'vendor-api': ['@supabase/supabase-js', 'axios'],
          'vendor-notifications': ['sonner'],
        },
      },
    },
    chunkSizeWarningLimit: 300, // Set warning limit to 300KB
    sourcemap: false, // Disable sourcemaps for production
  },
});
