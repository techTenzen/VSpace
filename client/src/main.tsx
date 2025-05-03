import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@/components/theme-provider";

createRoot(document.getElementById("root")!).render(<App />);
