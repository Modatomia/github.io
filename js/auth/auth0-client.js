import config from "./auth0-config.js";
import { configureClient, login, logout } from "./auth0-client.js";

async function initializeAuth0() {
  try {
    await configureClient();

    if (window.location.search.includes("code=")) {
      await handleCallback();
    }

    updateUI();
  } catch (err) {
    console.error("Error inicializando Auth0:", err);
  }
}

async function handleCallback() {
  try {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (err) {
    console.error("Error manejando callback:", err);
  }
}

async function updateUI() {
  try {
    const loginBtn = document.getElementById("login");
    const logoutBtn = document.getElementById("logout");

    loginBtn.addEventListener("click", login);
    logoutBtn.addEventListener("click", logout);
  } catch (err) {
    console.error("Error actualizando UI:", err);
  }
}

document.addEventListener("DOMContentLoaded", initializeAuth0);
