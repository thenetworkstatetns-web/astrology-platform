import type { Config } from "tailwindcss";
import uiPreset from "../../packages/ui/tailwind.preset";

const config: Config = {
  presets: [uiPreset as Partial<Config>],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
