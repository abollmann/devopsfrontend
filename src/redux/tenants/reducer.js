import {tenantActions} from './actions'
import tenantService from '../../services/tenants'

const INITIAL_STATE = {
  data: [],
  error: null
}

export default function tenantReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case tenantActions.GET_ALL_TENANTS:
      return {
        data: action.payload,
        error: null
      }
    case tenantActions.TENANTS_ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export const getAllTenants = (token) => {
  return async dispatch => {
    try {
      const tenants = await tenantService.getAll(token)
      dispatch(tenantActions.getAllSuccess(tenants))
    } catch (error) {
      dispatch(tenantActions.requestError(error))
    }
  }
}