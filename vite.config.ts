import { defineConfig, type PluginOption, type UserConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// Standalone Vite config (previously wrapped by @lovable.dev/vite-tanstack-config).
// Composes the standard TanStack Start + React + Tailwind toolchain. Nitro builds
// the deployable server output and is pinned to the Vercel preset for production.
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const isBuild = command === "build";
  const isDevBuild = isBuild && mode === "development";

  const plugins: PluginOption[] = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Block accidental imports of server-only modules from client code.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Use src/server.ts as the SSR entry (our error-wrapping handler).
      server: { entry: "server" },
    }),
  ];

  // Nitro produces the deployable output. Build-only; targets Vercel.
  if (isBuild) {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ preset: "vercel" }));
  }

  plugins.push(viteReact());

  return {
    plugins,
    // Match the build CSS pipeline in dev so backdrop-filter/glass utilities
    // render identically in preview and production.
    css: { transformer: "lightningcss" },
    // Keep dev React semantics for `vite build --mode development`.
    ...(isDevBuild
      ? {
          environments: {
            client: { define: { "process.env.NODE_ENV": JSON.stringify("development") } },
          },
          esbuild: { keepNames: true },
        }
      : {}),
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      // De-duplicate React/Query so SSR and client share a single instance
      // (prevents hydration crashes from duplicate copies).
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    // Port 5173 matches the MedySure backend's CORS origin and the Supabase
    // OAuth redirect (http://localhost:5173/auth/callback). Keep them in sync.
    server: { host: "::", port: 5173 },
  };
});
