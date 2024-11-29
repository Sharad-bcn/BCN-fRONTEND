import React from 'react';







import { Alert, Form, Input } from 'components'



import s from './styles.module.scss'



import images from 'images'



import { head } from 'helpers'



import { useEffect, useRef, useState } from 'react'



import { Link, useLocation, useNavigate } from 'react-router-dom'



import * as api from 'api'



import md5 from 'md5'







export default function Main() {



  const [mobile, setMobile] = useState('')



  const [pin, setPin] = useState('')



  const [visible, setVisible] = useState(false)



  const [loading, setLoading] = useState(false)



  const processing = useRef()



  const Navigate = useNavigate()



  const isAuthenticated = window.localStorage.getItem('authorization')



  const userData = JSON.parse(window.localStorage.getItem('userData'))



  const location = useLocation()







  useEffect(() => {



    if (isAuthenticated && userData) {



      if (userData.plan !== 'Plan 0') Navigate('/userAdmin/editProfile', { replace: true })



      else Navigate('/home', { replace: true })



    }



  }, [isAuthenticated, userData, Navigate])







  useEffect(() => {



    head({ title: 'Login | BCN' })



  }, [])







  const loginHandler = async e => {



    e.preventDefault()



    if (!mobile) return Alert.error('Contact no. is required!')



    if (!pin) return Alert.error('Pin is required!')







    if (mobile.length !== 10) {



      Alert.error('Enter Correct Contact No.!')



      return



    }







    if (processing.current) return



    processing.current = true



    setLoading(true)



    Alert.success('Logging In')







    const loginUser = await api.auth.user.logIn({ phoneNo: mobile.trim(), pin: md5(pin.trim()) })







    if (loginUser.code === 201) {



      Alert.success(loginUser.message)



      window.localStorage.setItem('authorization', loginUser.payload.authorization)



      window.localStorage.setItem('userData', JSON.stringify(loginUser.payload.userData))







      // Navigate('/userAdmin/editProfile', { replace: true })



      // if (document.referrer) {



      //   const previousRoute = new URL(document.referrer).pathname



      //   // If the previous route is "/signUp", navigate back by two steps



      //   if (previousRoute === '/signUp') {



      //     Navigate(-2)



      //   } else {



      //     // If a different previous route exists, navigate back by one step



      //     Navigate(-1)



      //   }



      // } else {



      //   const fetchBusinessesCount = await api.userAdmin.business.fetchAll({



      //     perPage: 10,



      //     pageNo: 1,



      //     filter: ''



      //   })



      //   if (fetchBusinessesCount.payload.total > 0) Navigate('/home', { replace: true })



      //   else Navigate('/userAdmin/editProfile', { replace: true })



      // }



      const isNewUser = await api.userAdmin.user.isNewUser({})



      if (!isNewUser.payload.isNewUser)



        if (!location) {



          Navigate('/home', { replace: true })



        } else {



          if (location.state && location.state.pathname === '/signUp') {



            Navigate('/home', { replace: true })



          } else {



            Navigate(-1)



          }



        }



      else {



        if (location && location.state && location.state.pathname === '/signUp') {



          if (loginUser.payload.userData.plan !== 'Plan 0') Navigate('/userAdmin/editProfile', { replace: true })



          else Navigate('/home', { replace: true })



        } else {



          if (!location) Navigate('/home', { replace: true })



          else Navigate(-1)



        }



      }



    } else {



      Alert.warn(loginUser.message)



    }







    setMobile('')



    setPin('')



    setLoading(false)



    processing.current = false



  }







  return (



    <div className={s.main}>



      <div className={s.loginOuter}>



        <div className={s.login + ' indent'}>



          <Form onSubmit={loginHandler} className={s.loginForm}>



            <Link to='/' className={s.logo}>



              <img src={images.logo} alt='' />



            </Link>



            <Input.Classic



              type='number'



              iconLeft='smartphone'



              placeholder='MOBILE'



              value={mobile}



              onChange={e => {



                if (e.target.value.length <= 10) setMobile(e.target.value)



              }}



            />



            <Input.Classic



              type={visible ? 'number' : 'password'}



              iconLeft='lock'



              iconRight={!visible ? 'visibility' : 'visibility_off'}



              onRightIconClick={() => setVisible(!visible)}



              placeholder='PIN'



              value={pin}



              onChange={e => {



                if (e.target.value.length <= 6) setPin(e.target.value)



              }}



            />



            <div className={s.button}>



              <button



                onClick={loginHandler}



                type='submit'



                disabled={loading}



                style={{ opacity: loading ? '0.8' : '1' }}



              >



                {loading ? 'Logging in...' : 'Login'}



              </button>



            </div>







            <div className={s.forgotPin}>



              <Link to='/signUp'>Register Now</Link>



              <Link to='/forgotPin'>Forgot Pin?</Link>



            </div>



          </Form>



        </div>



      </div>



    </div>



  )



}



