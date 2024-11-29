import handler from 'api/handler'

const prefix = '/userAdmin/user'

const methods = {
  update: args => handler({ method: 'put', url: prefix + '/update', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  changePin: args => handler({ method: 'put', url: prefix + '/changePin', args }),
  isNewUser: args => handler({ method: 'get', url: prefix + '/isNewUser', args }),
  renewPlan: args => handler({ method: 'post', url: prefix + '/renewPlan', args }),
  fetchPaymentId: args => handler({ method: 'get', url: prefix + '/fetchPaymentId', args })
}

export default methods
