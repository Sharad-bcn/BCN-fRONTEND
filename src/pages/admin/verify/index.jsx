import React from 'react';

import { Input } from 'components'

import s from './styles.module.scss'

import images from 'images'

import { head } from 'helpers'

import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'


export default function Main() {

  const [otp, setOtp] = useState('')


  useEffect(() => {

    head({ title: 'Login | BCN' })

  }, [])


  return (

    <div className={s.main}>

      <div className={s.verifyOuter}>

        <div className={s.verify + ' indent'}>

          <div className={s.verifyForm}>

            <div className={s.logo}>

              <img src={images.logo} alt='' />

            </div>

            <div className={s.title}>Verify Mobile</div>

            <Input.Classic

              type='number'

              iconLeft='pin'

              placeholder='Enter OTP'

              value={otp}

              onChange={e => setOtp(e.target.value)}

            />

            <div className={s.button}>

              <Link to='/'>Next</Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}
