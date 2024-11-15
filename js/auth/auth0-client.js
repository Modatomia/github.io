let auth0Client = null;

const configureClient = async () => {
  auth0Client = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
  });
};

const login = async () => {
  try {
    await auth0Client.loginWithRedirect();
  } catch (err) {
    console.log("Error en login:", err);
  }
};

const logout = () => {
  auth0Client.logout({
    returnTo: config.returnTo,
  });
};

const isAuthenticated = async () => {
  return await auth0Client.isAuthenticated();
};

const getUser = async () => {
  return await auth0Client.getUser();
};
