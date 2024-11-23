// js/auth.js
let auth0Client = null;

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

    const user = await auth0Client.getUser();
    if (user) {
      document.getElementById("user-email").textContent = user.email;
    }

    await fetchUserContent();
  } catch (error) {
    console.error("Error en autenticación:", error);
    showError("Error de autenticación");
  }
}

async function fetchUserContent() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("No hay token de acceso");
    }

    const response = await fetch(`${config.API_URL}/api/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al verificar acceso");
    }

    const data = await response.json();
    if (data.authenticated) {
      displayUserContent(data.access_level || "curso_basico");
    } else {
      throw new Error("Usuario no autenticado");
    }
  } catch (error) {
    console.error("Error cargando contenido:", error);
    showError("Error al cargar el contenido");
  }
}

async function handleLogout() {
  try {
    localStorage.removeItem("auth_token");
    sessionStorage.clear();

    if (auth0Client) {
      await auth0Client.logout({
        logoutParams: {
          returnTo: config.AUTH0.baseURL,
        },
      });
    } else {
      window.location.replace("/");
    }
  } catch (error) {
    window.location.replace("/");
  }
}

function showError(message) {
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

// Asegurarse de que el botón de logout esté conectado
document.getElementById("logout").addEventListener("click", handleLogout);
