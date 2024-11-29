import React from 'react';





import { Alert, Form, Input, Layouts } from 'components'



import s from './styles.module.scss'



import { head } from 'helpers'



import { useEffect, useRef, useState } from 'react'



import * as api from 'api'



import md5 from 'md5'



import { useNavigate } from 'react-router-dom'







export default function Main() {



  const [oldPin, setOldPin] = useState('')



  const [newPin, setNewPin] = useState('')



  const [oldPinVisible, setOldPinVisible] = useState(false)



  const [newPinVisible, setNewPinVisible] = useState(false)



  const [confirmPinVisible, setConfirmPinVisible] = useState(false)



  const [confirmPin, setConfirmPin] = useState('')



  // const [otp, setOtp] = useState('')



  // const [timer, setTimer] = useState(60) // 60 seconds = 1 minutes



  // const [isTimerRunning, setIsTimerRunning] = useState(false)



  // const [isOTPVerified, setIsOTPVerified] = useState(false)



  // const [isOTPSent, setIsOTPSent] = useState(false)



  const Navigate = useNavigate()







  const processing = useRef(false)







  // useEffect(() => {



  //   let interval







  //   if (isTimerRunning) {



  //     interval = setInterval(() => {



  //       setTimer(prevTimer => {



  //         if (prevTimer === 0) {



  //           clearInterval(interval)



  //           setIsTimerRunning(false)



  //         } else {



  //           return prevTimer - 1



  //         }



  //       })



  //     }, 1000)



  //   }







  //   return () => clearInterval(interval) // Cleanup the interval on component unmount or timer reset



  // }, [isTimerRunning])







  // const handleResendOtp = async () => {



  //   if (processing.current) return



  //   processing.current = true



  //   const sendOTP = await api.auth.user.resetPinOTP({})



  //   if (sendOTP.code === 201) {



  //     Alert.success('An OTP is send to your number for verification & is valid for 5 min')



  //     setTimer(60) // Reset timer to 1 minutes



  //     setIsTimerRunning(true) // Start the timer again



  //     setIsOTPSent(true)



  //   } else {



  //     if (sendOTP.code === 400) Alert.error(sendOTP.message)



  //     else Alert.error("Pin Reset isn't available right now, please try again later!")



  //   }



  //   processing.current = false



  // }







  // const verifyOtp = async () => {



  //   if (processing.current) return



  //   processing.current = true







  //   if (!otp) {



  //     Alert.warn('OTP is required!')



  //     return



  //   }







  //   if (otp.length !== 4) {



  //     Alert.warn('Invalid OTP')



  //     return



  //   }







  //   const verifyOTP = await api.auth.user.verifyResetPinOTP({ otp })







  //   if (verifyOTP.code === 201) {



  //     Alert.success('OTP is verified')



  //     setIsOTPVerified(true)



  //   } else {



  //     if (verifyOTP.code === 400) Alert.error(verifyOTP.message)



  //     else Alert.error("Pin Reset isn't available right now, please try again later!")



  //   }



  //   processing.current = false



  // }







  useEffect(() => {



    head({ title: 'Change Pin | BCN' })



  }, [])







  const changePinHandler = async () => {



    if (!oldPin) {



      Alert.error('Old Pin is required!')



      return



    }







    if (oldPin.length !== 6) {



      Alert.error('Enter 6 digit old pin')



      return



    }







    if (!newPin) {



      Alert.error('New Pin is required!')



      return



    }







    if (newPin.length !== 6) {



      Alert.error('Enter 6 digit new pin')



      return



    }







    if (!confirmPin) {



      Alert.error('Confirm Pin is required!')



      return



    }







    if (confirmPin.length !== 6) {



      Alert.error('Enter 6 digit confirm pin')



      return



    }







    if (newPin !== confirmPin) {



      Alert.error('Pin not matched!')



      return



    }







    if (processing.current) return



    processing.current = true



    const changePin = await api.userAdmin.user.changePin({



      oldPin: md5(oldPin),



      newPin: md5(newPin)



    })







    if (changePin.code === 201) {



      Alert.success(changePin.message)



      Navigate('/userAdmin/editProfile')



    } else {



      Alert.error(changePin.message)



    }







    processing.current = false



  }







  return (



    <div className={s.main}>



      <div className={s.changePinOuter}>



        <Layouts.Classic title='Change Pin'>



          <div className={s.headerBottom}>



            {/* {!!isOTPVerified && ( */}



            <div className={s.button}>



              <button onClick={changePinHandler}>Save</button>



            </div>



            {/* )} */}



            {/* {!isOTPVerified && (



              <div className={s.button}>



                <button onClick={!isTimerRunning ? handleResendOtp : () => {}}>



                  {!!isTimerRunning



                    ? Math.floor(timer / 60) + ':' + (timer % 60 < 10 ? `0${timer % 60}` : timer % 60)



                    : isOTPSent



                    ? 'Resend OTP'



                    : 'Send OTP'}



                </button>



              </div>



            )} */}



          </div>



        </Layouts.Classic>



        <div className={s.changePin + ' innerScrollX'}>



          <Form className={s.changePinForm}>



            <Input.Classic



              type={oldPinVisible ? 'number' : 'password'}



              iconLeft='pin'



              iconRight={!oldPinVisible ? 'visibility' : 'visibility_off'}



              onRightIconClick={() => setOldPinVisible(!oldPinVisible)}



              label='Old Pin'



              placeholder='Enter Old Pin (6 Digits)'



              value={oldPin}



              onChange={e => setOldPin(e.target.value)}



            />



            <Input.Classic



              type={newPinVisible ? 'number' : 'password'}



              iconLeft='pin'



              iconRight={!newPinVisible ? 'visibility' : 'visibility_off'}



              onRightIconClick={() => setNewPinVisible(!newPinVisible)}



              label='New Pin'



              placeholder='Enter New Pin (6 Digits)'



              value={newPin}



              onChange={e => setNewPin(e.target.value)}



            />



            <div className={s.confirm}>



              <Input.Classic



                type={confirmPinVisible ? 'number' : 'password'}



                label='Confirm Pin'



                iconLeft='pin'



                iconRight={!confirmPinVisible ? 'visibility' : 'visibility_off'}



                onRightIconClick={() => setConfirmPinVisible(!confirmPinVisible)}



                placeholder='Confirm Pin (6 Digits)'



                value={confirmPin}



                onChange={e => setConfirmPin(e.target.value)}



              />



              {oldPin &&



                newPin &&



                confirmPin &&



                (newPin === confirmPin ? (



                  <span className='material-icons' style={{ color: 'var(--c-green)' }}>



                    check_circle



                  </span>



                ) : (



                  <span className='material-icons' style={{ color: 'var(--c-red)' }}>



                    cancel



                  </span>



                ))}



            </div>



            {/* {!!isOTPSent && !isOTPVerified && (



              <div className={s.otpSection}>



                <div className={s.label}>Enter OTP</div>



                <div className={s.otp}>



                  <Input.Classic



                    type='number'



                    iconLeft='pin'



                    placeholder='Enter OTP'



                    value={otp}



                    onChange={e => {



                      if (e.target.value.length <= 4) setOtp(e.target.value)



                    }}



                  />



                  <div className={s.button}>



                    <button onClick={verifyOtp}>Verify</button>



                  </div>



                </div>



              </div>



            )} */}



          </Form>



        </div>



      </div>



    </div>



  )



}



