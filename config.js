// config.js
const config = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "https://api.modatomia.com" // URL de producción de tu API
      : "http://localhost:3000", // URL de desarrollo
  AUTH0: {
    domain: "dev-ao28w8mm01qxvpqa.us.auth0.com",
    clientId: "POytIwtV3rWDTkS4apTJCeMzhVqX8v1e",
    audience: "https://api.modatomia.com", // Este será el identificador de tu API
    redirectUri: window.location.origin + "/callback.html",
  },
};

export default config;
