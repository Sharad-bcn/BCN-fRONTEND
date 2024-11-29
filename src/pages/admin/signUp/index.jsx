import React from 'react';


import { Alert, Form, Modal, PaymentConfirmation } from 'components'


import s from './styles.module.scss'


import images from 'images'


import { Decrypt, Encrypt, geoLocation, head, paymentHandler } from 'helpers'


import { useCallback, useEffect, useRef, useState } from 'react'


import { Link, useLocation, useNavigate } from 'react-router-dom'


import * as api from 'api'


import md5 from 'md5'


import Part1 from './part1'


import Part2 from './part2'


import Part3 from './part3'


import Part4 from './part4'


import Part5 from './part5'


import { plans, paymentPlatforms } from 'data'



export default function Main() {


  const [part, setPart] = useState(1) // need to change to 1 when subscription pages are added


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)


  const processing1 = useRef(false)


  const Navigate = useNavigate()


  let userRefId = new URLSearchParams(window.location.search).get('refId')


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const location = useLocation()



  //part1


  const [firstName, setFirstName] = useState('')


  const [lastName, setLastName] = useState('')


  const [phoneNo, setPhoneNo] = useState('')


  const [email, setEmail] = useState('')


  const [refId, setRefId] = useState(userRefId ? Decrypt(userRefId) : '')



  //part2


  const [otp, setOtp] = useState('')


  const [timer, setTimer] = useState(60) // 60 seconds = 1 minutes


  const [isTimerRunning, setIsTimerRunning] = useState(false)



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



  const handleResendOtp = async () => {


    if (processing.current) return


    processing.current = true


    const sendOTP = await api.auth.user.requestOTP({ phoneNo })


    if (sendOTP.code === 201) {


      Alert.success('An OTP is send to your number for verification & is valid for 5 min')


      setTimer(60) // Reset timer to 1 minutes


      setIsTimerRunning(true) // Start the timer again


    } else {


      if (sendOTP.code === 400) Alert.error(sendOTP.message)


    }


    processing.current = false


  }



  //part3


  const [gender, setGender] = useState('Male')


  const [address, setAddress] = useState('')


  const [state, setState] = useState('')


  const [states, setStates] = useState([])


  const [city, setCity] = useState('')


  const [cities, setCities] = useState([])


  const [pinCode, setPinCode] = useState('')


  const filterFields = [{ field: 'Male' }, { field: 'Female' }, { field: 'Other' }]



  //part4


  const [pin, setPin] = useState('')


  const [confirmPin, setConfirmPin] = useState('')



  //part5


  const [plan, setPlan] = useState('')


  const processing2 = useRef(false)


  const processing3 = useRef(false)


  const [payLoading, setPayLoading] = useState(false)


  // const [paymentFailed, setPaymentFailed] = useState(false)



  useEffect(() => {


    head({ title: 'Sign Up | BCN' })


  }, [])



  //part3



  const locationPicker = useCallback(async () => {


    const { latitude, longitude } = await geoLocation()


    if (processing1.current) return


    processing1.current = true


    setLoading(true)



    Alert.success('Fetching your location')



    const locationPickerCity = await api.publicApi.locations.locationPicker({


      lat: latitude,


      long: longitude


    })


    if (locationPickerCity.code === 200) {


      Alert.success('Location Found')


      setCity(locationPickerCity.payload.city.city)


      setState(locationPickerCity.payload.city.state)


    } else {


      Alert.warn('We are not available at your location')


    }


    setLoading(false)


    processing1.current = false


  }, [])



  const getStates = useCallback(async stateSearch => {


    if (processing.current) return


    processing.current = true



    const fetchStateSuggestions = await api.publicApi.locations.fetchAllStates({ limit: 10, state: stateSearch })


    if (fetchStateSuggestions.code === 200) {

      setStates(fetchStateSuggestions.payload.states)

    } else {

      // Alert.error(fetchStateSuggestions.message)

    }

    processing.current = false

  }, [])


  useEffect(() => {

    if (part === 3) {

      getStates('')

      locationPicker()

    }

  }, [part, getStates, locationPicker])


  // useEffect(() => {

  //   if (part === 3) {

  //     const isConfirmed = window.confirm('Detect business Location?')

  //     if (isConfirmed) locationPicker()

  //   }

  // }, [part, locationPicker])


  const getCities = useCallback(

    async citySearch => {

      if (processing.current) return

      processing.current = true

      let fkStateId = ''


      const stateSelected = await api.publicApi.locations.fetchAllStates({ limit: 10, state })


      if (stateSelected.code === 200) {

        fkStateId = stateSelected.payload.states[0]._id

      } else return


      const fetchCitySuggestions = await api.publicApi.locations.fetchAllCitiesViaState({

        limit: 10,

        city: citySearch,

        fkStateId

      })


      if (fetchCitySuggestions.code === 200) {

        setCities(fetchCitySuggestions.payload.cities)

      } else {

        // Alert.error(fetchCitySuggestions.message)

      }

      processing.current = false

    },

    [state]

  )


  useEffect(() => {

    if (part === 3 && state) {

      getCities('')

    }

  }, [part, state, getCities])


  const goToNextPart = async () => {

    if (part === 1) {

      if (!firstName) {

        Alert.warn('First name is required!')

        return

      }


      if (!lastName) {

        Alert.warn('Last name is required!')

        return

      }


      if (!phoneNo) {

        Alert.warn('Contact No. is required!')

        return

      }


      if (phoneNo.length !== 10) {

        Alert.warn('Enter Correct Contact No.!')

        return

      }


      // if (!email) {

      //   Alert.error('Email is required!')

      //   return

      // }


      if (!userRefId && refId && refId.length !== 10) {

        Alert.warn('Enter Correct referenceId!')

        return

      }


      if ((!userRefId && refId) || email || phoneNo) {

        if (processing.current) return

        processing.current = true


        const checkPart2Validation = await api.publicApi.user.part2Validation({

          email: email || '',

          fkRefId: refId.refId || refId,

          phoneNo

        })


        if (checkPart2Validation.code === 201) {

          if (checkPart2Validation.payload.refId) setRefId(checkPart2Validation.payload.refId)

        } else {

          Alert.error(checkPart2Validation.message)

          if (checkPart2Validation.message === 'User with this email already exists') setEmail('')

          if (checkPart2Validation.message === 'Reference Id not found') setRefId('')

          if (checkPart2Validation.message === 'User with this phoneNo already exists') setPhoneNo('')

          processing.current = false

          return

        }


        const sendOTP = await api.auth.user.requestOTP({ phoneNo })

        if (sendOTP.code === 201) {

          Alert.success('OTP sent on whatsapp, valid for 5 mins', 5000)

          setIsTimerRunning(true)

        } else {

          if (sendOTP.code === 400) Alert.error(sendOTP.message)

          else Alert.error("Registration isn't available right now, please try again later!")

          processing.current = false

          return

        }


        processing.current = false

      }

    }


    if (part === 2) {

      if (!otp) {

        Alert.warn('OTP is required!')

        return

      }

      if (otp.length !== 4) {

        Alert.warn('Invalid OTP')

        return

      }


      if (otp && otp.length === 4 && phoneNo) {

        if (processing.current) return

        processing.current = true

        const verifyOTP = await api.auth.user.verifyOTP({ phoneNo, otp })

        if (verifyOTP.code === 201) {

          Alert.success('OTP is verified')

        } else {

          // Alert.error(verifyOTP.message)

          Alert.error('Invalid OTP')

          window.location.reload()

          processing.current = false

          return

        }

        processing.current = false

      }

    }


    if (part === 3) {

      if (!gender) {

        Alert.warn('Gender is required!')

        return

      }


      if (!address) {

        Alert.warn('Address is required!')

        return

      }


      if (!state) {

        Alert.warn('State is required!')

        return

      }


      if (!city) {

        Alert.warn('City is required!')

        return

      }


      // if (!pinCode) {

      //   Alert.error('Pin-Code is required!')

      //   return

      // }


      // if (pinCode.length !== 6) {

      //   Alert.error('Enter Correct Pin-Code')

      //   return

      // }

    }


    if (part === 4) {

      if (confirmPin !== pin) {

        Alert.warn('Pin Mismatch!!')

        return

      }

    }


    setPart(part + 1)

  }


  const addHandler = async (plan = '', razorPayOrderId = '', razorPayPaymentId = '', razorPaySignature = '') => {

    if (!plan) {

      Alert.warn('Plan Type is required!')

      return

    }


    if (!pin) {

      Alert.warn('Pin is required!')

      return

    }


    if (pin.length !== 6) {

      Alert.warn('Enter 6 digit pin')

      return

    }


    if (pin !== confirmPin) {

      Alert.warn('Pin not matched!')

      return

    }


    if (processing.current) return

    processing.current = true

    setLoading(true)


    const createUser = await api.publicApi.user.create({

      razorPayOrderId: razorPayOrderId,

      razorPayPaymentId: razorPayPaymentId,

      razorPaySignature: razorPaySignature,

      plan,

      firstName,

      lastName,

      phoneNo,

      email,

      fkRefId: refId ? refId.refId : '',

      gender,

      address,

      state,

      city,

      pinCode,

      logo: '',

      pin: md5(pin)

    })


    if (createUser.code === 201) {

      Alert.success(createUser.message)

      if (razorPayOrderId && razorPayPaymentId && razorPaySignature) {

        Navigate(

          '/paymentSuccess/' +

            Encrypt({

              paymentDetails: {

                paymentId: razorPayPaymentId,

                method: paymentPlatforms.filter(x => x.name === payPlatform)[0].showName,

                isLoggedIn: false

              }

            })

        )

      } else {

        Navigate('/login', { replace: true })

      }

    } else {

      Alert.error(createUser.message)

      setTimeout(() => {

        window.location.reload()

      }, 5000)

    }


    setLoading(false)

    processing.current = false

  }


  useEffect(() => {

    if (userData) {

      Modal.DualActionModal(

        'You need to sign out first in order to create a new profile',

        async () => {

          if (processing.current) return

          processing.current = true

          setLoading(true)

          Alert.success('Logging Out...')


          const logOut = await api.auth.user.logOut({})


          if (logOut.code === 201) {

            window.localStorage.removeItem('authorization')

            window.localStorage.removeItem('userData')

            window.localStorage.removeItem('planStatusShownDate')

            Alert.success('Thanks for visting BCN, Would be happy to serve you again!')

            window.location.reload()

          } else Alert.error(logOut.message)


          setLoading(false)

          processing.current = false

        },

        () => {

          Navigate(-1)

        }

      )

    }

  }, [Navigate, userData])


  //part 5

  const paymentCallback = async (razorPayPaymentId, razorPayOrderId, razorPaySignature) => {

    if (processing3.current) return


    processing3.current = true


    const verification = await api.publicApi.user.paymentVerification({

      razorPayPaymentId,

      razorPayOrderId,

      razorPaySignature

    })

    if (verification.code === 201) {

      await addHandler(plan, razorPayOrderId, razorPayPaymentId, razorPaySignature)

    } else {

      Alert.error('Payment Failed!!')

    }

    processing3.current = false

  }


  const failureCallback = async () => {

    Alert.error('Payment failed or was Cancelled!!')

    // setPaymentFailed(true)

    addHandler('Plan 0')

  }


  const checkOutHandler = async (plan, amount) => {

    if (processing2.current) return


    processing2.current = true

    setPayLoading(true)


    let key = ''


    const paymentPreRequisites = await api.publicApi.user.paymentPreRequisites({})

    if (paymentPreRequisites.code === 201) {

      key = Decrypt(paymentPreRequisites.payload.data.key)

    } else {

      Alert.error('Some error occured!!')

    }

    if (key) {

      let paymentCheckOut = await api.publicApi.user.paymentCheckOut({ amount })

      if (paymentCheckOut.code === 201) {

        const order = paymentCheckOut.payload.order

        paymentHandler(

          key,

          order,

          firstName + ' ' + lastName,

          email,

          '91' + phoneNo,

          plan === 'Plan A' ? '1' : plan === 'Plan B' ? '5' : '10',

          paymentCallback,

          failureCallback

        )

      } else {

        Alert.error('Some error occured!!')

      }

    }

    processing2.current = false

    setPayLoading(false)

  }


  //part6

  const [payPlatform, setPayPlatform] = useState(paymentPlatforms[0].name)


  return (

    <div className={s.main}>

      <div className={s.createAccountOuter}>

        <div className={s.createAccount + ' indent'}>

          {part !== 5 && (

            <Form

              className={s.createAccountForm + (part === 2 || part === 4 ? '' : ' innerScroll')}

              style={part === 2 || part === 4 ? { justifyContent: 'center' } : { justifyContent: 'flex-start' }}

            >

              <Link to='/' className={s.logo}>

                <img src={images.logo} alt='' />

              </Link>

              {part === 1 && (

                <Part1

                  firstName={firstName}

                  setFirstName={setFirstName}

                  lastName={lastName}

                  setLastName={setLastName}

                  phoneNo={phoneNo}

                  setPhoneNo={setPhoneNo}

                  email={email}

                  setEmail={setEmail}

                  refId={refId}

                  setRefId={setRefId}

                  userRefId={userRefId}

                />

              )}

              {part === 2 && (

                <Part2

                  otp={otp}

                  setOtp={setOtp}

                  timer={timer}

                  isTimerRunning={isTimerRunning}

                  handleResendOtp={handleResendOtp}

                />

              )}

              {part === 3 && !loading && (

                <Part3

                  gender={gender}

                  setGender={setGender}

                  address={address}

                  setAddress={setAddress}

                  state={state}

                  states={states}

                  setState={setState}

                  getStates={getStates}

                  city={city}

                  cities={cities}

                  setCity={setCity}

                  getCities={getCities}

                  pinCode={pinCode}

                  setPinCode={setPinCode}

                  filterFields={filterFields}

                  locationPicker={locationPicker}

                />

              )}

              {part === 4 && <Part4 pin={pin} setPin={setPin} confirmPin={confirmPin} setConfirmPin={setConfirmPin} />}

              {part === 6 && (

                <PaymentConfirmation

                  firstName={firstName}

                  lastName={lastName}

                  phoneNo={phoneNo}

                  email={email}

                  gender={gender}

                  refId={refId}

                  address={address}

                  state={state}

                  city={city}

                  pinCode={pinCode}

                  plan={plan}

                  plans={plans}

                  payPlatform={payPlatform}

                  setPayPlatform={setPayPlatform}

                  paymentPlatforms={paymentPlatforms}

                />

              )}

              <div className={s.button} style={{ opacity: loading ? '0.8' : '1' }}>

                <button

                  onClick={

                    part === 6

                      ? () => checkOutHandler(plan, Number(plans.filter(x => x.name === plan)[0].price))

                      : goToNextPart

                  }

                  type='submit'

                  disabled={loading}

                >

                  {part === 6 ? (loading ? 'Creating Account...' : 'Create Account') : 'Next'}

                </button>

              </div>

              {/* { {!!paymentFailed && part === 6 && (

                <div className={s.button} style={{ opacity: loading ? '0.8' : '1' }}>

                  <div

                    className={s.registerAsGuest}

                    onClick={() => {

                      addHandler('Plan 0')

                    }}

                  >

                    Register As

                    <span> Guest</span>

                  </div>

                </div>

              )}} */}

              {part < 5 && (

                <div className={s.alreadyAccount}>

                  Already Have an Account?

                  <Link to='/login' state={location} relative='path'>

                    Log in

                  </Link>

                </div>

              )}

            </Form>

          )}

          {part === 5 && <Part5 part={part} setPart={setPart} setPlan={setPlan} addHandler={addHandler} />}

        </div>

      </div>

    </div>

  )

}
