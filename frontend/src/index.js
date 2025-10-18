import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./components/Farmer/pages/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

<<<<<<< HEAD


const root = ReactDOM.createRoot(document.getElementById('root'));
=======
const root = ReactDOM.createRoot(document.getElementById("root"));
>>>>>>> Agriculture-Inspector-review-query
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
