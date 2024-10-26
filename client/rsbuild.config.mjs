import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  output: { cssModules: { localIdentName: "[local]--[hash:base64:5]" } },
  html: {
    title: "Scrum Voting",
    favicon: "./public/suit-spade.svg",
  },
});
