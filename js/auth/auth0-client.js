import config from "./auth0-config.js";
import { createAuth0Client } from "https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js";

export let auth0Client = null;

export const configureClient = async () => {
  auth0Client = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
  });
  return auth0Client;
};

export const login = async () => {
  try {
    console.log("Intentando login...");
    await auth0Client.loginWithRedirect();
  } catch (err) {
    console.log("Error en login:", err);
  }
};

export const logout = () => {
  try {
    auth0Client.logout({
      returnTo: config.returnTo,
    });
  } catch (err) {
    console.log("Error en logout:", err);
  }
};

export const isAuthenticated = async () => {
  return await auth0Client.isAuthenticated();
};

export const getUser = async () => {
  return await auth0Client.getUser();
};
