const config = {
  AUTH0: {
    domain: "dev-ao28w8mm01qxvpqa.us.auth0.com",
    clientId: "POytIwtV3rWDTkS4apTJCeMzhVqX8v1e",
    baseURL: window.location.origin,
  },
  API: {
    baseURL: "https://modatomia-recursos.vercel.app",
    endpoints: {
      verify: "/api/verify",
      // Puedes agregar más endpoints aquí según necesites
    },
  },
};

// Función helper para construir URLs de API
config.getApiUrl = function (endpoint) {
  return this.API.baseURL + this.API.endpoints[endpoint];
};

window.config = config;
