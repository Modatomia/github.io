import config from "./auth0-config.js";
import {
  configureClient,
  login,
  logout,
  isAuthenticated,
  getUser,
} from "./auth0-client.js";

let auth0Client = null;

async function initializeAuth0() {
  auth0Client = await configureClient();

  if (window.location.search.includes("code=")) {
    try {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
      updateUI();
    } catch (error) {
      console.error("Error handling redirect:", error);
    }
  }

  updateUI();
}

async function updateUI() {
  const authenticated = await isAuthenticated();
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  loginBtn.style.display = authenticated ? "none" : "block";
  logoutBtn.style.display = authenticated ? "block" : "none";

  if (authenticated) {
    const user = await getUser();
    console.log("Usuario autenticado:", user);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeAuth0();

  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  loginBtn.addEventListener("click", login);
  logoutBtn.addEventListener("click", logout);
});
