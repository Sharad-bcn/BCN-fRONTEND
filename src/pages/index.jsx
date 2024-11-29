import React from 'react';


import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom'


import defaultRoutes from './routes'


import { useEffect, useCallback, useRef, useState } from 'react'


import { Alert, InfoBanner, Loader, Modal } from 'components'


import * as api from 'api'


import { getPlanStatus, getTimeFormats } from 'helpers'



export default function Main() {


  let routes = [...defaultRoutes]


  const userData = JSON.parse(window.localStorage.getItem('userData'))



  const isToday = someDate => {


    const today = new Date()


    return (


      someDate.getDate() === today.getDate() &&


      someDate.getMonth() === today.getMonth() &&


      someDate.getFullYear() === today.getFullYear()


    )


  }



  let planStatus = ''


  if (userData) {


    const planStatusShownDate = localStorage.getItem('planStatusShownDate')


    if (!planStatusShownDate || !isToday(new Date(planStatusShownDate)))


      planStatus = getPlanStatus(userData.planExpiresAt)


  }



  const InfoBannerHandler = () => {


    localStorage.setItem('planStatusShownDate', new Date().toISOString())


  }



  return (


    <Router>


      <Alert.Component />


      <Modal.Component />


      {!!planStatus && planStatus !== 'Active' && userData.plan !== 'Plan 0' && (


        <InfoBanner


          message={'Your plan expiring on ' + getTimeFormats(new Date(userData.planExpiresAt))}


          handler={InfoBannerHandler}


        />


      )}


      <Routes>


        <Route path='/' element={<Redirect />} />



        {routes.map(({ path, Component, Super, auth }, i) => (


          <Route


            key={i}


            path={path}


            element={


              auth ? (


                <Auth>


                  <Super>


                    <Component />


                  </Super>


                </Auth>


              ) : Super ? (


                <Super>


                  <Component />


                </Super>


              ) : (


                <Component />


              )


            }


          />


        ))}



        <Route path='*' element={<Redirect />} />


      </Routes>


    </Router>


  )


}



const Redirect = () => {


  const navigate = useNavigate()



  useEffect(() => {


    navigate('/home', { replace: true })


  }, [navigate])


  return null


}



const Auth = ({ children }) => {


  const [loading, setLoading] = useState(false)


  const navigate = useNavigate()


  const authenticated = useRef(false)


  const processing = useRef()


  const location = useLocation()



  const authTest = useCallback(async () => {


    if (processing.current) return



    processing.current = true



    if (!authenticated.current) {


      const signInAPI = await api.auth.user.getUser({})



      if (signInAPI.code === 201) {


        authenticated.current = true


        setLoading(false)


      } else if (signInAPI.code === 401) {


        authenticated.current = true


        setLoading(false)


        let userData = JSON.parse(window.localStorage.getItem('userData'))


        userData.plan = 'Plan 0'


        localStorage.setItem('userData', JSON.stringify(userData))


        if (window.location.pathname !== '/userAdmin/subscriptionInfo') {


          Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


          navigate('/home', { replace: true })


        }


      } else {


        window.localStorage.clear()


        navigate('/login', { state: location, replace: true })


      }


    } else setLoading(false)


    processing.current = false


  }, [navigate, location])



  useEffect(() => {


    if (!window.localStorage.getItem('authorization')) navigate('/login', { state: location, replace: true })


    else authTest()


  }, [authTest, navigate, location])



  return loading ? <Loader /> : <div style={{ overflow: 'hidden' }}>{children}</div>


}
