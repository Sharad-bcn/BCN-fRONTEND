import handler from 'api/handler'

const prefix = '/public/business'

const methods = {
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  fetchBusinessLocations: args => handler({ method: 'get', url: prefix + '/fetchBusinessLocations', args }),
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args }),
  fetchAllBusinessWithNoListings: args =>
    handler({ method: 'get', url: prefix + '/fetchAllBusinessWithNoListings', args }),
  searchBusiness: args => handler({ method: 'get', url: prefix + '/searchBusiness', args }),
  fetchProfileBusinesses: args => handler({ method: 'get', url: prefix + '/fetchProfileBusinesses', args }),
  updateViews: args => handler({ method: 'put', url: prefix + '/updateViews', args })
}

export default methods
