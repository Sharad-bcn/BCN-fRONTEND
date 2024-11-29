import handler from 'api/handler'

const prefix = '/public/landingPage'

const methods = {
  fetchCommonInfo: args => handler({ method: 'get', url: prefix + '/fetchCommonInfo', args }),
  fetchBanners: args => handler({ method: 'get', url: prefix + '/fetchBanners', args }),
  fetchTermsAndConditions: args => handler({ method: 'get', url: prefix + '/fetchTermsAndConditions', args }),
  fetchPrivacyPolicy: args => handler({ method: 'get', url: prefix + '/fetchPrivacyPolicy', args }),
  fetchSuccessStories: args => handler({ method: 'get', url: prefix + '/fetchSuccessStories', args }),
  fetchFaqs: args => handler({ method: 'get', url: prefix + '/fetchFaqs', args }),
  fetchContactInfo: args => handler({ method: 'get', url: prefix + '/fetchContactInfo', args }),
  fetchAboutUs: args => handler({ method: 'get', url: prefix + '/fetchAboutUs', args }),
  fetchSocialLinks: args => handler({ method: 'get', url: prefix + '/fetchSocialLinks', args })
}

export default methods
