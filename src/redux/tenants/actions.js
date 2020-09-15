export const tenantActions = {
  GET_ALL_TENANTS: 'GET_ALL_TENANTS',
  TENANTS_ERROR: 'TENANTS_ERROR',
  getAllSuccess: devices => ({
    type: tenantActions.GET_ALL_TENANTS,
    payload: devices
  }),
  requestError: error => ({
    type: tenantActions.TENANTS_ERROR,
    payload: error
  })
}