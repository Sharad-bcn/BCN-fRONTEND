import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.scss'
import Pages from './pages'
import { Provider } from 'react-redux'
import store from './state/store'
import { LoadScript } from '@react-google-maps/api'
import { Loader } from 'components'
const REACT_APP_GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LoadScript
        googleMapsApiKey={REACT_APP_GOOGLE_MAP_API_KEY}
        libraries={['places']}
        loadingElement={
          <div
            style={{
              display: 'flex',
              height: '100%',
              minHeight: '100vh',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />
          </div>
        }
      >
        <Pages />
      </LoadScript>
    </Provider>
  </React.StrictMode>
)
