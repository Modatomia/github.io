import config from "./auth0-config.js";

let auth0Client = null;

// Inicializar Auth0
async function initializeAuth0() {
  auth0Client = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
  });

  // Manejo de callback después del login
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

// Actualizar UI basado en estado de autenticación
async function updateUI() {
  const isAuthenticated = await auth0Client.isAuthenticated();
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  loginBtn.style.display = isAuthenticated ? "none" : "block";
  logoutBtn.style.display = isAuthenticated ? "block" : "none";

  if (isAuthenticated) {
    const user = await auth0Client.getUser();
    console.log("Usuario autenticado:", user);
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeAuth0();

  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  loginBtn.addEventListener("click", async () => {
    await auth0Client.loginWithRedirect();
  });

  logoutBtn.addEventListener("click", () => {
    auth0Client.logout({
      returnTo: config.returnTo,
    });
  });
});
