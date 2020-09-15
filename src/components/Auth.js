import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authActions} from '../redux/auth/actions'
import Keycloak from 'keycloak-js';

const Auth = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const keycloak = Keycloak(`/keycloak-${window.REACT_APP_ENV}.json` )
  if (user === null) {
    keycloak.init({onLoad: 'login-required'}).then(() => {
      dispatch(authActions.setUser(keycloak.tokenParsed))
      dispatch(authActions.setKeycloak(keycloak))
    }).catch(() => window.location.reload())
  }

  return null
}

export default Auth