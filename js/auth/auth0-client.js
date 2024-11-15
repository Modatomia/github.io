import { Auth0Client } from "@auth0/auth0-spa-js";
// Elimina la segunda importación duplicada
// import { Auth0Client } from './node_modules/@auth0/auth0-spa-js';

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
  if (auth0Client) {
    // Asegúrate de que auth0Client no sea null
    auth0Client.logout({
      returnTo: config.returnTo,
    });
  } else {
    console.log("auth0Client is not initialized");
  }
};

export const isAuthenticated = async () => {
  if (auth0Client) {
    // Asegúrate de que auth0Client no sea null
    return await auth0Client.isAuthenticated();
  } else {
    console.log("auth0Client is not initialized");
    return false;
  }
};

export const getUser = async () => {
  if (auth0Client) {
    // Asegúrate de que auth0Client no sea null
    return await auth0Client.getUser();
  } else {
    console.log("auth0Client is not initialized");
    return null;
  }
};
