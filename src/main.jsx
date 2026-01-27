import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";


const wpContainer = document.getElementById("tracking-app");


const localContainer = document.getElementById("root");

const container = wpContainer || localContainer;

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
