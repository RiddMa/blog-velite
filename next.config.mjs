import { build } from "velite";

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    // formats: ["image/avif", "image/webp"], // Disable avif for less server CPU stress
    formats: ["image/webp"],
    deviceSizes: [162, 322, 482, 642, 1026, 1282, 1922, 3842],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

class VeliteWebpackPlugin {
  static started = false;

  apply(/** @type {import("webpack").Compiler} */ compiler) {
    // executed three times in nextjs
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      await build({ watch: dev, clean: !dev });
    });
  }
}

export default nextConfig;
