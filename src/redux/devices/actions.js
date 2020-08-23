export const deviceActions = {
  GET_ALL_DEVICES: 'GET_ALL_DEVICES',
  DEVICES_ERROR: 'DEVICES_ERROR',
  getAllSuccess: devices => ({
    type: deviceActions.GET_ALL_DEVICES,
    payload: devices
  }),
  requestError: error => ({
    type: deviceActions.DEVICES_ERROR,
    payload: error
  })
}