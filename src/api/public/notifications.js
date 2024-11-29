import handler from 'api/handler'

const prefix = '/public/notifications'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args })
}

export default methods
