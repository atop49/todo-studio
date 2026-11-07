import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* GitHub Pages 把项目站挂在 /<repo>/ 子路径下，资源必须带上前缀；
   本地 dev 与其他平台保持根路径。这里用 globalThis 取 env，
   免得为了一个字符串再引 @types/node。 */
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const base = env?.GITHUB_PAGES === "true" ? "/todo-studio/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
