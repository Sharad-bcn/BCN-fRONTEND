import handler from 'api/handler'

const prefix = '/userAdmin/listing'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  update: args => handler({ method: 'put', url: prefix + '/update', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args }),
  delete: args => handler({ method: 'delete', url: prefix + '/delete', args }),
  toggleListingStatus: args => handler({ method: 'put', url: prefix + '/toggleListingStatus', args }),
  fetchListingsCount: args => handler({ method: 'get', url: prefix + '/fetchListingsCount', args }),
  fetchListingPrefilledData: args => handler({ method: 'get', url: prefix + '/fetchListingPrefilledData', args })
}

export default methods
