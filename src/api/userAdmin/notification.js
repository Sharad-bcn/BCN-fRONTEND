import handler from 'api/handler'

const prefix = '/userAdmin/notification'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args }),
  markAsRead: args => handler({ method: 'put', url: prefix + '/markAsRead', args }),
  markAllAsRead: args => handler({ method: 'put', url: prefix + '/markAllAsRead', args }),
  delete: args => handler({ method: 'delete', url: prefix + '/delete', args }),
  deleteAll: args => handler({ method: 'delete', url: prefix + '/deleteAll', args }),
  count: args => handler({ method: 'get', url: prefix + '/count', args })
}

export default methods
