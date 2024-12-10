import { createRoot } from "react-dom/client";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-center" />
    </Provider>
  </HelmetProvider>
);
