import { SET_LOCATION } from '../../actions/locationAction'

const initialState = {
  location: window.localStorage.getItem('location') || 'All Over India'
}

export default function locationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOCATION:
      window.localStorage.setItem('location', action.payload)
      return {
        ...state,
        location: action.payload
      }
    default:
      return state
  }
}
