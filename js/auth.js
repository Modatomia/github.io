// js/auth.js
async function fetchUserContent() {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${config.API_URL}/api/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error("Error al verificar acceso");

    const data = await response.json();
    displayUserContent(data.data.user.accessLevel);

    if (data.data.user.email) {
      document.getElementById("user-email").textContent = data.data.user.email;
    }
  } catch (error) {
    showError("Error al cargar el contenido: " + error.message);
  }
}

async function initAuth0() {
  try {
    auth0Client = await auth0.createAuth0Client({
      domain: config.AUTH0.domain,
      clientId: config.AUTH0.clientId,
      cacheLocation: "localstorage",
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: `${config.AUTH0.baseURL}/callback.html`,
        scope: "openid profile email",
      },
    });

    const isAuthenticated = await auth0Client.isAuthenticated();
    if (!isAuthenticated) {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.replace("/");
        return;
      }
    }

    await fetchUserContent();
  } catch (error) {
    showError(error.message);
  }
}
