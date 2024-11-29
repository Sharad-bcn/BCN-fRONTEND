import handler from 'api/handler'

const prefix = '/public/listings'

const methods = {
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args }),
  searchListings: args => handler({ method: 'get', url: prefix + '/searchListings', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  fetchBusinessListings: args => handler({ method: 'get', url: prefix + '/fetchBusinessListings', args }),
  updateViews: args => handler({ method: 'put', url: prefix + '/updateViews', args })
}

export default methods
