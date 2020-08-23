export const authActions = {
  SET_USER: 'SET_USER',
  SET_KEYCLOAK: 'SET_KEYCLOAK',
  LOGOUT: 'LOGOUT',
  setUser: user => ({
    type: authActions.SET_USER,
    payload: user
  }),
  setKeycloak: keycloak => ({
    type: authActions.SET_KEYCLOAK,
    payload: keycloak
  }),
  logout: () => ({
    type: authActions.LOGOUT
  })
}