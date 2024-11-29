import handler from 'api/handler'

const prefix = '/public/businessLeads'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args })
}

export default methods
