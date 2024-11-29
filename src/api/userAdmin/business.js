import handler from 'api/handler'

const prefix = '/userAdmin/business'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  update: args => handler({ method: 'put', url: prefix + '/update', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args }),
  fetchBusinessPrefilledData: args => handler({ method: 'get', url: prefix + '/fetchBusinessPrefilledData', args }),
  delete: args => handler({ method: 'delete', url: prefix + '/delete', args })
}

export default methods
