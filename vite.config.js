import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.posix.resolve(__dirname, "./src"), // Ensures cross-platform compatibility
      },
    },
    base: isProduction ? "/your-subdirectory/" : "/", // Adjust if deploying in a subdirectory
    server: {
      port: 3000, // Default development server port
      open: true, // Automatically opens the browser
    },
    build: {
      outDir: "dist", // Output directory for production build
      sourcemap: !isProduction, // Source maps only in development
      minify: isProduction, // Minify code in production
    },
  };
});

