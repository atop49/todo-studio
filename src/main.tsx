import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/geist/index.css";
import "@fontsource/jetbrains-mono/index.css";
import "./index.css";
import App from "./App.tsx";

// 开发期兜底：渲染崩溃时把错误显示出来，而不是黑屏
window.addEventListener("error", (e) => {
  document.title = "ERR: " + e.message;
});
window.addEventListener("unhandledrejection", (e) => {
  document.title = "REJ: " + String(e.reason);
});

try {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (err) {
  document.title = "ERR: " + String(err);
}
