export const buildingActions = {
  GET_ALL_BUILDINGS: 'GET_ALL_BUILDINGS',
  BUILDINGS_ERROR: 'BUILDINGS_ERROR',
  getAllSuccess: devices => ({
    type: buildingActions.GET_ALL_BUILDINGS,
    payload: devices
  }),
  requestError: error => ({
    type: buildingActions.BUILDINGS_ERROR,
    payload: error
  })
}