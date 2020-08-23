import { combineReducers } from 'redux'
import auth from './auth/reducer'
import devices from './devices/reducer'


export default combineReducers({
  auth,
  devices
})