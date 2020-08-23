import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authActions} from '../redux/auth/actions'
import {getAllDevices} from '../redux/devices/reducer';

const Auth = () => {
  const dispatch = useDispatch()
  const {user, keycloak} = useSelector(state => state.auth)

  if (user === null) {
    keycloak.init({onLoad: 'login-required'}).then(() => {
      dispatch(authActions.setUser(keycloak.tokenParsed))
    })
  }

  return null
}

export default Auth