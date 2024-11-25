// js/auth.js
let auth0Client = null;

function showError(message) {
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function displayUserContent(accessLevel) {
  const modulesContainer = document.getElementById("modules");
  let contentHTML = "";

  switch (accessLevel) {
    case "curso_basico":
      contentHTML = `
                <div class="module">
                    <h3 class="module-title">Módulo 1: Fundamentos de Optitex</h3>
                    <div class="module-content">
                        <div class="welcome-message">
                            <p>¡Bienvenido/a al curso de Optitex! Aquí encontrarás todo el material complementario organizado por secciones.</p>
                        </div>
                        
                        <div class="resources-section">
                            <h4>Guías y Recursos</h4>
                            <ul class="resources-list">
                                <li>
                                    <div class="resource-item">
                                        <div class="resource-icon">📄</div>
                                        <div class="resource-details">
                                            <h5>Introducción a Optitex</h5>
                                            <p>Guía básica de configuración y primeros pasos</p>
                                            <a href="#" class="resource-link">Ver documento</a>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="resource-item">
                                        <div class="resource-icon">📚</div>
                                        <div class="resource-details">
                                            <h5>Manual de Referencia</h5>
                                            <p>Comandos y funciones principales</p>
                                            <a href="#" class="resource-link">Ver documento</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="exercises-section">
                            <h4>Ejercicios Prácticos</h4>
                            <div class="exercises-grid">
                                <div class="exercise-card">
                                    <div class="exercise-icon">✏️</div>
                                    <h5>Ejercicio 1</h5>
                                    <p>Configuración inicial del espacio de trabajo</p>
                                    <a href="#" class="exercise-link">Ver ejercicio</a>
                                </div>
                                <div class="exercise-card">
                                    <div class="exercise-icon">✏️</div>
                                    <h5>Ejercicio 2</h5>
                                    <p>Creación de patrones básicos</p>
                                    <a href="#" class="exercise-link">Ver ejercicio</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      break;
    default:
      contentHTML = `
                <div class="module error-module">
                    <h3>Contenido no disponible</h3>
                    <p>No se encontró contenido para tu nivel de acceso.</p>
                </div>
            `;
  }

  modulesContainer.innerHTML = contentHTML;
}

async function fetchUserContent() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const response = await fetch(
      "https://modatomia-recursos.vercel.app/api/verify",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al verificar acceso");
    }

    const data = await response.json();

    if (data.success && data.data) {
      displayUserContent(data.data.accessLevel);
      if (data.data.email) {
        document.getElementById("user-email").textContent = data.data.email;
        document.getElementById("user-email").style.display = "block";
      }
    } else {
      throw new Error("Formato de respuesta inválido");
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

async function handleLogout() {
  try {
    localStorage.clear();
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

document.getElementById("logout").addEventListener("click", handleLogout);
