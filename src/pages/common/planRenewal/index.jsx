import React from 'react';


import { useCallback, useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'


import { Decrypt, Encrypt, getPlanStatus, head, paymentHandler } from 'helpers'


import * as api from 'api'


import { Link, useNavigate } from 'react-router-dom'


import { Alert, Form, Modal, PaymentConfirmation, PlanCard } from 'components'


import images from 'images'


import { plans, paymentPlatforms } from 'data'



const infos = [


  {


    info: 'List your Business and Offering',


    icon: 'check_circle'


  },


  {


    info: 'Access to Business Listings',


    icon: 'check_circle'


  },


  {


    info: 'Networking Opportunities',


    icon: 'check_circle'


  },


  {


    info: 'Individual Profile Creation',


    icon: 'check_circle'


  }


]



export default function Main() {


  const [loading, setLoading] = useState(false)


  const [step, setStep] = useState(1)


  const [data, setData] = useState('')


  const [plan, setPlan] = useState(plans[0].name)


  const [payLoading, setPayLoading] = useState(false)


  const [payPlatform, setPayPlatform] = useState(paymentPlatforms[0].name)


  const processing = useRef(false)


  const processing1 = useRef(false)


  const processing2 = useRef(false)


  const processing3 = useRef(false)


  let userData = JSON.parse(window.localStorage.getItem('userData'))



  const planStatus = getPlanStatus(userData.planExpiresAt)


  const Navigate = useNavigate()



  const init = useCallback(async () => {


    if (processing1.current) return


    processing1.current = true


    setLoading(true)



    const fetchUser = await api.userAdmin.user.fetch({})



    if (fetchUser.code === 200) {


      let data = {}


      data.firstName = fetchUser.payload.getUser.firstName


      data.lastName = fetchUser.payload.getUser.lastName


      data.phoneNo = fetchUser.payload.getUser.phoneNo


      data.email = fetchUser.payload.getUser.email


      data.gender = fetchUser.payload.getUser.gender


      data.refId = {}


      data.refId.refId = fetchUser.payload.getUser.fkRefId


      data.refId.referredby = fetchUser.payload.referredBy


      data.address = fetchUser.payload.getUser.address


      data.state = fetchUser.payload.getUser.state


      data.city = fetchUser.payload.getUser.city


      data.pinCode = fetchUser.payload.getUser.pinCode


      setData(data)


    } else {


      Alert.error(fetchUser.message)


    }



    setLoading(false)


    processing1.current = false


  }, [])



  useEffect(() => {


    init()


  }, [init])



  useEffect(() => {


    if (!userData) Modal.PrivacyModal()


    if (userData && planStatus === 'Active') Navigate(-1)


    // if (userData && userData.plan !== 'Plan 0') Navigate(-1)


  }, [userData, planStatus, Navigate])



  useEffect(() => {


    head({ title: 'Renew Plan | BCN' })


  }, [])



  const renewHandler = async (plan, razorPayPaymentId, razorPayOrderId, razorPaySignature) => {


    if (!plan) {


      Alert.warn('Plan Type is required!')


      return


    }



    if (processing.current) return


    processing.current = true


    setLoading(true)



    Alert.success('Renewing you plan please wait!!')



    const renewUserPlan = await api.userAdmin.user.renewPlan({


      plan,


      razorPayPaymentId,


      razorPayOrderId,


      razorPaySignature


    })



    if (renewUserPlan.code === 201) {


      Alert.success(renewUserPlan.message)


      userData.plan = renewUserPlan.payload.plan


      userData.planExpiresAt = renewUserPlan.payload.planExpiresAt


      localStorage.setItem('userData', JSON.stringify(userData))



      Navigate(


        '/paymentSuccess/' +


          Encrypt({


            paymentDetails: {


              paymentId: razorPayPaymentId,


              method: paymentPlatforms.filter(x => x.name === payPlatform)[0].showName,


              isLoggedIn: true


            }


          })


      )


    } else {


      Alert.error(renewUserPlan.message)


    }



    setLoading(false)


    processing.current = false


  }



  const paymentCallback = async (razorPayPaymentId, razorPayOrderId, razorPaySignature) => {


    if (processing3.current) return



    processing3.current = true



    const verification = await api.publicApi.user.paymentVerification({


      razorPayPaymentId,


      razorPayOrderId,


      razorPaySignature


    })


    if (verification.code === 201) {


      await renewHandler(plan, razorPayPaymentId, razorPayOrderId, razorPaySignature)


    } else {


      Alert.error('Payment Failed!!')


    }


    processing3.current = false


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


          data.firstName + ' ' + data.lastName,


          data.email,


          '91' + data.phoneNo,


          plan === 'Plan A' ? '1' : plan === 'Plan B' ? '5' : '10',


          paymentCallback,


          () => {}


        )


      } else {


        Alert.error('Some error occured!!')


      }


    }


    processing2.current = false


    setPayLoading(false)


  }



  return (


    <div className={s.main}>


      <div className={s.createAccountOuter}>


        <div className={s.createAccount + ' indent'}>


          {step === 1 && (


            <div className={s.plansSection + ' innerScroll'}>


              <div className={s.title}>Choose Your Plan</div>


              <div className={s.planInfos}>


                {infos.map((info, i) => (


                  <PlanInfo {...info} key={i} />


                ))}


              </div>


              <div className={s.plans}>


                {plans.map((planField, i) => (


                  <PlanCard {...planField} plan={plan} setPlan={setPlan} key={i} />


                ))}


              </div>


              <div className={s.payButton}>


                <div


                  className={s.button}


                  onClick={() => {


                    setPlan(plan)


                    setStep(step + 1)


                  }}


                >


                  Pay Now


                </div>


              </div>


            </div>


          )}


          {step === 2 && (


            <Form className={s.createAccountForm + ' innerScroll'} style={{ justifyContent: 'flex-start' }}>


              <Link to='/' className={s.logo}>


                <img src={images.logo} alt='' />


              </Link>


              <PaymentConfirmation


                {...data}


                plan={plan}


                plans={plans}


                payPlatform={payPlatform}


                setPayPlatform={setPayPlatform}


                paymentPlatforms={paymentPlatforms}


              />


              <div className={s.button} style={{ opacity: loading ? '0.8' : '1' }}>


                <button


                  onClick={() => checkOutHandler(plan, Number(plans.filter(x => x.name === plan)[0].price))}


                  type='submit'


                  disabled={loading}


                >


                  {loading ? 'Renewing Plan...' : 'Renew Plan'}


                </button>


              </div>


            </Form>


          )}


        </div>


      </div>


    </div>


  )


}



const PlanInfo = props => (


  <div className={s.planInfo}>


    <span className='material-icons-outlined'>{props.icon}</span>


    {props.info}


  </div>


)
