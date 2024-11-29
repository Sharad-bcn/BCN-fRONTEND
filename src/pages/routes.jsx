import React from 'react';

import Home from './landingPage/home'

import RegisterNow from './landingPage/registerNow'

import ListBusiness from './landingPage/listBusiness'

import Jobs from './landingPage/jobs'

import Matrimonial from './landingPage/matrimonial'

import AboutUs from './landingPage/aboutUs'

import ContactUs from './landingPage/contactUs'

import Faq from './landingPage/faqs'

import PrivacyPolicy from './landingPage/privacyPolicy'

import TermsAndConditions from './landingPage/termsAndConditions'


import Search from './common/searchResults'

import BusinessProfile from './common/businessProfile'

import UserProfile from './common/userProfile'

import PlanRenewal from './common/planRenewal'

import SuccessPage from './common/successPage'


import ChangePin from './admin/changePin'

import Login from './admin/login'

import ForgotPin from './admin/login/forgotPin'

import SignUp from './admin/signUp'

import Verify from './admin/verify'

import EditProfile from './admin/editProfile'

import Listings from './admin/business/listings'

import AddOrEditListing from './admin/business/listings/addOrEditListing'

import Business from './admin/business'

import ViewBusinessLeads from './admin/business/viewLeads'

import RegisterBusiness from './admin/business/register'

import SignOut from './admin/signOut'

import Notifications from './admin/notifications'

import SubscriptionMiddle from './admin/subscriptionMiddle'

import Subscription from './admin/subscription'

import ViewLeads from './admin/business/listings/viewLeads'

import MembershipCard from './admin/memberShipCard'


import * as Layout from 'layouts'


const landingPage = [

  {

    path: '/home',

    Component: Home,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/registerNow',

    Component: RegisterNow,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/listBusiness',

    Component: ListBusiness,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/jobs',

    Component: Jobs,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/matrimonial',

    Component: Matrimonial,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/aboutUs',

    Component: AboutUs,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/faq',

    Component: Faq,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/privacyPolicy',

    Component: PrivacyPolicy,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/terms&conditions',

    Component: TermsAndConditions,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/contactUs',

    Component: ContactUs,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/:location',

    Component: Search,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/:location/:fkBusinessId',

    Component: BusinessProfile,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/userProfile/:fkUserId',

    Component: UserProfile,

    Super: Layout.Home,

    auth: false

  },

  {

    path: '/login',

    Component: Login,

    auth: false

  },

  {

    path: '/forgotPin',

    Component: ForgotPin,

    auth: false

  },

  {

    path: '/signUp',

    Component: SignUp,

    auth: false

  },

  {

    path: '/verify',

    Component: Verify,

    auth: false

  },

  {

    path: '/renewPlan',

    Component: PlanRenewal,

    auth: false

  },

  {

    path: '/paymentSuccess/:paymentDetails',

    Component: SuccessPage,

    auth: false

  }

]


const admin = [

  {

    path: '/userAdmin/editProfile',

    Component: EditProfile,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/editProfile/changePin',

    Component: ChangePin,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses/:businessId/listings',

    Component: Listings,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses/:businessId/listings/addListing',

    Component: AddOrEditListing,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses/:businessId/listings/editListing/:listingId',

    Component: AddOrEditListing,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses',

    Component: Business,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses/viewLeads/:businessId',

    Component: ViewBusinessLeads,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses/editBusiness/:partNo/:businessId',

    Component: RegisterBusiness,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses/registerBusiness/:partNo',

    Component: RegisterBusiness,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/businesses/listings/viewLeads/:listingId',

    Component: ViewLeads,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/signOut',

    Component: SignOut,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/notifications',

    Component: Notifications,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/subscriptionInfo',

    Component: SubscriptionMiddle,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/subscription',

    Component: Subscription,

    Super: Layout.Admin,

    auth: true

  },

  {

    path: '/userAdmin/memberShipCard',

    Component: MembershipCard,

    Super: Layout.Admin,

    auth: true

  }

]


const routes = [...landingPage, ...admin]


export default routes
