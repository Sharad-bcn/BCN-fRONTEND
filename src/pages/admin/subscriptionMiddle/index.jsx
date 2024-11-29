import React from 'react';


import { useEffect } from 'react'


import s from './styles.module.scss'


import { head } from 'helpers'


import { Layouts } from 'components'


import { Link } from 'react-router-dom'


import images from 'images'



export default function Main() {


  useEffect(() => {


    head({ title: 'My Subscription | BCN' })


  }, [])



  return (


    <div className={s.main}>


      <div className={s.settings}>


        <Layouts.Classic title='My Subscription' />


        <div className={s.content + ' innerScrollX'}>


          <div className={s.planInfoCard}>


            <div className={s.left}>


              <div className={s.info}>


                No Active Subscription <br /> for Your Account


              </div>


              <Link to='/renewPlan'>Buy a plan</Link>


            </div>


            <div className={s.right}>


              <div className={s.img}>


                <img src={images.SubscriptionInfo} alt='' />


              </div>


            </div>


          </div>


        </div>


      </div>


    </div>


  )


}
