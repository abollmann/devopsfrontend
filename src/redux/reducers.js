import { combineReducers } from 'redux'
import auth from './auth/reducer'
import devices from './devices/reducer'
import tenants from './tenants/reducer'
import buildings from './buildings/reducer'


export default combineReducers({
  auth,
  devices,
  tenants,
  buildings
})