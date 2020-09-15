import {buildingActions} from './actions'
import buildingService from '../../services/buildings'

const INITIAL_STATE = {
  data: [],
  error: null
}

export default function buildingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case buildingActions.GET_ALL_BUILDINGS:
      return {
        data: action.payload,
        error: null
      }
    case buildingActions.BUILDINGS_ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export const getAllBuildings = (token) => {
  return async dispatch => {
    try {
      const buildings = await buildingService.getAll(token)
      dispatch(buildingActions.getAllSuccess(buildings))
    } catch (error) {
      dispatch(buildingActions.requestError(error))
    }
  }
}