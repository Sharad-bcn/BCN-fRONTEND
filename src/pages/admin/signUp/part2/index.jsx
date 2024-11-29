import React from 'react';

import { Input } from 'components'

import s from './styles.module.scss'


export default function Main(props) {

  return (

    <div className={s.part2}>

      <div className={s.title}>Verify Mobile</div>

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

    </div>

  )

}
