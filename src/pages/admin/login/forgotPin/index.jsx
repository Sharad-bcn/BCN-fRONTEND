import React from 'react';


import { Alert, Form, Input } from 'components'


import s from './styles.module.scss'


import images from 'images'


import { head } from 'helpers'


import { useEffect, useRef, useState } from 'react'


import { Link, useNavigate } from 'react-router-dom'


import * as api from 'api'


import md5 from 'md5'



export default function Main() {


  const [mobile, setMobile] = useState('')



  const [loading, setLoading] = useState(false)


  const [part, setPart] = useState(1)



  //part2


  const [otp, setOtp] = useState('')


  const [timer, setTimer] = useState(60) // 60 seconds = 1 minutes


  const [isTimerRunning, setIsTimerRunning] = useState(false)


  const [isOtpVerified, setIsOtpVerified] = useState(false)


  const [newPin, setNewPin] = useState('')


  const [visible, setVisible] = useState(false)


  const [confirmNewPin, setConfirmNewPin] = useState('')


  const [confirmVisible, setConfirmVisible] = useState(false)



  const processing = useRef()


  const Navigate = useNavigate()


  const isAuthenticated = window.localStorage.getItem('authorization')


  const userData = JSON.parse(window.localStorage.getItem('userData'))



  useEffect(() => {


    if (isAuthenticated && userData) {


      if (userData.plan !== 'Plan 0') Navigate('/userAdmin/editProfile', { replace: true })


      else Navigate('/home', { replace: true })


    }


  }, [isAuthenticated, userData, Navigate])



  useEffect(() => {


    head({ title: 'Forgot Pin | BCN' })


  }, [])



  //part2



  useEffect(() => {


    let interval



    if (part === 2 && isTimerRunning) {


      interval = setInterval(() => {


        setTimer(prevTimer => {


          if (prevTimer === 0) {


            clearInterval(interval)


            setIsTimerRunning(false)


          } else {


            return prevTimer - 1


          }


        })


      }, 1000)


    }



    return () => clearInterval(interval) // Cleanup the interval on component unmount or timer reset


  }, [part, isTimerRunning])



  const sendOtpHandler = async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const sendOTP = await api.auth.user.resetPinOTP({ phoneNo: mobile })


    if (sendOTP.code === 201) {


      Alert.success('An OTP is send to your number for verification & is valid for 5 min')


      setTimer(60) // Reset timer to 1 minutes


      setIsTimerRunning(true) // Start the timer again


      setPart(part + 1)


    } else {


      if (sendOTP.code === 400) Alert.error(sendOTP.message)


    }



    setLoading(false)


    processing.current = false


  }



  const handleResendOtp = async () => {


    if (processing.current) return


    processing.current = true


    const sendOTP = await api.auth.user.resetPinOTP({ phoneNo: mobile })


    if (sendOTP.code === 201) {


      Alert.success('An OTP is send to your number for verification & is valid for 5 min')


      setTimer(60) // Reset timer to 1 minutes


      setIsTimerRunning(true) // Start the timer again


    } else {


      if (sendOTP.code === 400) Alert.error(sendOTP.message)


    }


    processing.current = false


  }



  const verifyOtpHandler = async () => {


    if (!otp) {


      Alert.warn('OTP is required!')


      return


    }


    if (otp.length !== 4) {


      Alert.warn('Invalid OTP')


      return


    }



    if (processing.current) return


    processing.current = true


    setLoading(true)



    const verifyOTP = await api.auth.user.verifyResetPinOTP({ phoneNo: mobile, otp })


    if (verifyOTP.code === 201) {


      Alert.success('An OTP is send to your number for verification & is valid for 5 min')


      setIsTimerRunning(false)


      setIsOtpVerified(true)


    } else {


      if (verifyOTP.code === 400) Alert.error(verifyOTP.message)


    }



    setLoading(false)


    processing.current = false


  }



  const resetPinHandler = async () => {


    if (processing.current) return



    if (!newPin) {


      Alert.error('New Pin is required!')


      return


    }



    if (newPin.length !== 6) {


      Alert.error('Enter 6 digit new pin')


      return


    }



    if (!confirmNewPin) {


      Alert.error('Confirm Pin is required!')


      return


    }



    if (confirmNewPin.length !== 6) {


      Alert.error('Enter 6 digit confirm pin')


      return


    }



    if (newPin !== confirmNewPin) {


      Alert.error('Pin not matched!')


      return


    }



    processing.current = true


    setLoading(true)



    const forgotPin = await api.publicApi.user.forgotPin({ phoneNo: mobile, pin: md5(newPin) })


    if (forgotPin.code === 201) {


      Alert.success(forgotPin.message)


      Navigate('/login', { replace: true })


    } else {


      Alert.error(forgotPin.message)


    }



    setLoading(false)


    processing.current = false


  }



  return (


    <div className={s.main}>


      <div className={s.loginOuter}>


        <div className={s.login + ' indent'}>


          <Form


            onSubmit={part === 1 ? sendOtpHandler : isOtpVerified ? resetPinHandler : verifyOtpHandler}


            className={s.loginForm}


          >


            <Link to='/' className={s.logo}>


              <img src={images.logo} alt='' />


            </Link>


            {part === 1 && (


              <Part1 sendOtpHandler={sendOtpHandler} mobile={mobile} setMobile={setMobile} loading={loading} />


            )}


            {part === 2 && (


              <Part2


                handleResendOtp={handleResendOtp}


                otp={otp}


                setOtp={setOtp}


                isTimerRunning={isTimerRunning}


                timer={timer}


                visible={visible}


                setVisible={setVisible}


                newPin={newPin}


                setNewPin={setNewPin}


                isOtpVerified={isOtpVerified}


                confirmNewPin={confirmNewPin}


                setConfirmNewPin={setConfirmNewPin}


                confirmVisible={confirmVisible}


                setConfirmVisible={setConfirmVisible}


              />


            )}


            <div className={s.button}>


              <button


                onClick={part === 1 ? sendOtpHandler : isOtpVerified ? resetPinHandler : verifyOtpHandler}


                type='submit'


                disabled={loading}


                style={{ opacity: loading ? '0.8' : '1' }}


              >


                {part === 1


                  ? loading


                    ? 'Sending OTP...'


                    : 'Send OTP'


                  : isOtpVerified


                  ? loading


                    ? 'Resetting Pin..'


                    : 'Reset Pin'


                  : loading


                  ? 'Verifying OTP...'


                  : 'Verify OTP'}


              </button>


            </div>


          </Form>


        </div>


      </div>


    </div>


  )


}



const Part1 = props => (


  <div className={s.part1}>


    <div className={s.title}>Verify Mobile</div>


    <Input.Classic


      type='number'


      iconLeft='smartphone'


      placeholder='MOBILE'


      value={props.mobile}


      onChange={e => {


        if (e.target.value.length <= 10) props.setMobile(e.target.value)


      }}


    />


  </div>


)



const Part2 = props => (


  <div className={s.part2}>


    <div className={s.title}>{!props.isOtpVerified ? 'Verify Mobile' : 'Reset Pin'}</div>


    {!props.isOtpVerified && (


      <>


        <Input.Classic


          type='number'


          iconLeft='pin'


          placeholder='Enter OTP'


          value={props.otp}


          onChange={e => {


            if (e.target.value.length <= 4) props.setOtp(e.target.value)


          }}


        />


        <div className={s.resendOTP}>


          {props.isTimerRunning ? (


            <div className={s.timeRemaining}>


              Resend OTP: {Math.floor(props.timer / 60)}:


              {props.timer % 60 < 10 ? `0${props.timer % 60}` : props.timer % 60}


            </div>


          ) : (


            <div onClick={props.handleResendOtp} className={s.resend}>


              Resend OTP


            </div>


          )}


        </div>


      </>


    )}



    {!!props.isOtpVerified && (


      <div className={s.verified}>


        <Input.Classic


          type={props.visible ? 'number' : 'password'}


          iconLeft='lock'


          //   label='Enter New Pin'


          iconRight={!props.visible ? 'visibility' : 'visibility_off'}


          onRightIconClick={() => props.setVisible(!props.visible)}


          placeholder='Enter New Pin'


          value={props.newPin}


          onChange={e => {


            if (e.target.value.length <= 6) props.setNewPin(e.target.value)


          }}


        />


        <div className={s.confirm}>


          <Input.Classic


            type={props.confirmVisible ? 'number' : 'password'}


            // label='Confirm New Pin'


            iconLeft='pin'


            iconRight={!props.confirmVisible ? 'visibility' : 'visibility_off'}


            onRightIconClick={() => props.setConfirmVisible(!props.confirmVisible)}


            placeholder='Confirm Pin (6 Digits)'


            value={props.confirmNewPin}


            onChange={e => {


              if (e.target.value.length <= 6) props.setConfirmNewPin(e.target.value)


            }}


          />


          {props.newPin &&


            props.confirmNewPin &&


            (props.newPin === props.confirmNewPin ? (


              <span className='material-icons' style={{ color: 'var(--c-green)' }}>


                check_circle


              </span>


            ) : (


              <span className='material-icons' style={{ color: 'var(--c-red)' }}>


                cancel


              </span>


            ))}


        </div>


      </div>


    )}


  </div>


)
