import { combineReducers } from 'redux'
import locationReducer from './locationReducer'

const reducers = combineReducers({
  location: locationReducer
})
export default reducers
