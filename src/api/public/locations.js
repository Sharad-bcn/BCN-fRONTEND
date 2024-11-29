import handler from 'api/handler'

const prefix = '/public/locations'

const methods = {
  fetchCityViaState: args => handler({ method: 'get', url: prefix + '/fetchCityViaState', args }),
  locationPicker: args => handler({ method: 'get', url: prefix + '/locationPicker', args }),
  fetchAllStates: args => handler({ method: 'get', url: prefix + '/fetchAllStates', args }),
  fetchAllCitiesViaState: args => handler({ method: 'get', url: prefix + '/fetchAllCitiesViaState', args }),
  fetchCoordinatesViaCity: args => handler({ method: 'get', url: prefix + '/fetchCoordinatesViaCity', args })
}

export default methods
