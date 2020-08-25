import {deviceActions} from './actions'
import deviceService from '../../services/devices'

const INITIAL_STATE = {
  data: [],
  error: null
}

export default function deviceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case deviceActions.GET_ALL_DEVICES:
      return {
        data: action.payload,
        error: null
      }
    case deviceActions.DEVICES_ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export const getAllDevices = (token) => {
  return async dispatch => {
    try {
      const devices = await deviceService.getAll(token)
      dispatch(deviceActions.getAllSuccess(devices))
    } catch (error) {
      dispatch(deviceActions.requestError(error))
    }
  }
}