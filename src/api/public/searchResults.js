import handler from 'api/handler'

const prefix = '/public/searchResults'

const methods = {
  fetchBaseFields: args => handler({ method: 'get', url: prefix + '/fetchBaseFields', args }),
  searchFields: args => handler({ method: 'get', url: prefix + '/searchFields', args })
}

export default methods
