import handler from 'api/handler'

const prefix = '/public/categories'

const methods = {
  fetchAllCategories: args => handler({ method: 'get', url: prefix + '/fetchAllCategories', args }),
  fetchAllSubCategories: args => handler({ method: 'get', url: prefix + '/fetchAllSubCategories', args })
}

export default methods
