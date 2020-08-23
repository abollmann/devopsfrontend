import {authActions} from './actions'
import Keycloak from 'keycloak-js'


const INITIAL_STATE = {
  user: null,
  keycloak: Keycloak('/keycloak.json')
}

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case authActions.SET_USER:
      return {
        ...state,
        user: action.payload
      }
    case authActions.SET_KEYCLOAK:
      return {
        ...state,
        keycloak: action.payload
      }
    case authActions.LOGOUT:
      return INITIAL_STATE
    default:
      return state
  }

}