import handler from 'api/handler'

const prefix = '/userAdmin/categories'

const methods = {
  fetchSubCategoryViaCategory: args => handler({ method: 'get', url: prefix + '/fetchSubCategoryViaCategory', args })
}

export default methods
