import React from 'react';


import { useCallback, useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'


import { Encrypt, getPlanStatus, getTimeFormats, head } from 'helpers'


import { Layouts, Loader } from 'components'


import { paymentPlatforms, plans } from 'data'


import { Link } from 'react-router-dom'


import * as api from 'api'



export default function Main() {


  const [loading, setLoading] = useState(false)


  const [razorPayPaymentId, setRazorPayPaymentId] = useState('')


  const processing = useRef(false)


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const activePlan = plans.find(x => x.name === userData.plan) || 'Plan 0'



  const planStatus = getPlanStatus(userData.planExpiresAt)



  useEffect(() => {


    head({ title: 'My Subscription | BCN' })


  }, [])



  const init = useCallback(async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const fetchPaymentId = await api.userAdmin.user.fetchPaymentId({})



    if (fetchPaymentId.code === 201) {


      setRazorPayPaymentId(fetchPaymentId.payload.razorPayPaymentId)


    }



    setLoading(false)


    processing.current = false


  }, [])



  useEffect(() => {


    init()


  }, [init])



  return (


    <div className={s.main}>


      <div className={s.settings}>


        <Layouts.Classic title='My Subscription' />


        {!loading ? (


          <div className={s.content + ' innerScrollX'}>


            <div className={s.planInfoCard}>


              <div className={s.activePlanName}>{activePlan.name}</div>


              <div className={s.activePlanDuration}>{activePlan.duration}</div>


              <div className={s.activePlanPrice}>₹{activePlan.price}</div>


              <div className={s.activePlanExpiresAt}>


                Plan expiring on: {getTimeFormats(new Date(userData.planExpiresAt))}


              </div>


              <div className={s.actionButtons}>


                {planStatus !== 'Active' && (


                  <Link to='/renewPlan' className={s.renewPlan}>


                    Renew Your Plan


                  </Link>


                )}


                {!!razorPayPaymentId && (


                  <Link


                    className={s.viewReceipt}


                    to={


                      '/paymentSuccess/' +


                      Encrypt({


                        paymentDetails: {


                          paymentId: razorPayPaymentId,


                          method: paymentPlatforms.filter(x => x.name === 'razorPay')[0].showName,


                          isLoggedIn: true


                        }


                      })


                    }


                  >


                    View Receipt


                  </Link>


                )}


              </div>


            </div>


          </div>


        ) : (


          <div className={s.loader}>


            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


          </div>


        )}


      </div>


    </div>


  )


}
