import React from 'react';

import { PlanCard } from 'components'

import s from './styles.module.scss'

import { useState } from 'react'

import { plans } from 'data'


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


export default function Main(props) {

  const [plan, setPlan] = useState(plans[0].name)


  return (

    <div className={s.plansSection + ' innerScroll'}>

      <div className={s.title}>Choose Your Plan</div>

      <div className={s.info}>or</div>

      <div

        className={s.registerAsGuest}

        onClick={() => {

          props.setPlan('Plan 0')

          props.addHandler('Plan 0')

        }}

      >

        Continue as

        <span> Guest</span>

      </div>

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

            props.setPlan(plan)

            props.setPart(props.part + 1)

          }}

        >

          Pay Now

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
