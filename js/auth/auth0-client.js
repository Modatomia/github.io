import config from "./auth0-config.js";

export let auth0Client = null;

export const configureClient = async () => {
  auth0Client = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
  });
};

export const login = async () => {
  try {
    await auth0Client.loginWithRedirect();
  } catch (err) {
    console.log("Error en login:", err);
  }
};

export const logout = () => {
  auth0Client.logout({
    returnTo: config.returnTo,
  });
};

export const isAuthenticated = async () => {
  return await auth0Client.isAuthenticated();
};

export const getUser = async () => {
  return await auth0Client.getUser();
};
