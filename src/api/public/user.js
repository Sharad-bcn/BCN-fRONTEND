import handler from 'api/handler'

const prefix = '/public/user'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  part2Validation: args => handler({ method: 'get', url: prefix + '/part2Validation', args }),
  forgotPin: args => handler({ method: 'post', url: prefix + '/forgotPin', args }),
  paymentPreRequisites: args => handler({ method: 'get', url: prefix + '/paymentPreRequisites', args }),
  paymentCheckOut: args => handler({ method: 'post', url: prefix + '/paymentCheckOut', args }),
  paymentVerification: args => handler({ method: 'post', url: prefix + '/paymentVerification', args }),
  validPayment: args => handler({ method: 'get', url: prefix + '/validPayment', args })
}

export default methods
