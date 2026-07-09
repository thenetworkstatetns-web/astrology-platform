// NOTE: intentionally untyped (no `import type { Config } from "tailwindcss"`)
// so this file has zero dependency on the `tailwindcss` package being
// resolvable from this workspace package's own node_modules. The apps that
// consume this preset (apps/web, apps/admin) already have `tailwindcss`
// installed and will type-check the final merged config on their end.
const preset = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
};

export default preset;
