import handler from 'api/handler'

const prefix = '/userAdmin/leads'

const methods = {
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args })
}

export default methods
