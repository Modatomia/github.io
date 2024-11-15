import config from "./auth0-config.js";
import { createAuth0Client } from "https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js";

let auth0 = null;

async function initializeAuth0() {
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
  });

  // Manejo de callback después del login
  if (window.location.search.includes("code=")) {
    try {
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error handling redirect:", error);
    }
  }
  updateUI();
}

async function updateUI() {
  try {
    const isAuthenticated = await auth0.isAuthenticated();
    const loginBtn = document.getElementById("login");
    const logoutBtn = document.getElementById("logout");

    loginBtn.style.display = isAuthenticated ? "none" : "block";
    logoutBtn.style.display = isAuthenticated ? "block" : "none";

    if (isAuthenticated) {
      const user = await auth0.getUser();
      console.log("Usuario autenticado:", user);
    }
  } catch (err) {
    console.log("Error al actualizar UI:", err);
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeAuth0();

  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  loginBtn.addEventListener("click", async () => {
    console.log("Click en login");
    try {
      await auth0.loginWithRedirect();
    } catch (err) {
      console.log("Error en login:", err);
    }
  });

  logoutBtn.addEventListener("click", () => {
    console.log("Click en logout");
    try {
      auth0.logout({
        returnTo: config.returnTo,
      });
    } catch (err) {
      console.log("Error en logout:", err);
    }
  });
});
