import handler from 'api/handler'

const prefix = '/auth/user'

const methods = {
  logIn: args => handler({ method: 'post', url: prefix + '/logIn', args }),
  requestOTP: args => handler({ method: 'get', url: prefix + '/requestOTP', args }),
  verifyOTP: args => handler({ method: 'post', url: prefix + '/verifyOTP', args }),
  getUser: args => handler({ method: 'get', url: prefix + '/getUser', args }),
  logOut: args => handler({ method: 'delete', url: prefix + '/logOut', args }),
  resetPinOTP: args => handler({ method: 'get', url: prefix + '/resetPinOTP', args }),
  verifyResetPinOTP: args => handler({ method: 'post', url: prefix + '/verifyResetPinOTP', args })
}

export default methods
