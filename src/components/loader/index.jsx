import React from 'react';


import s from './styles.module.scss'



export default function Main({ message = 'Loading...', color = 'var(--c-white)', colorText = 'var(--c-white)' }) {


  return (


    <div className={s.main}>


      <div className={s.ldsRipple}>


        <div style={{ borderColor: color }}></div>


        <div style={{ borderColor: color }}></div>


      </div>


      <div className={s.message} style={{ color: colorText }}>


        {message}


      </div>


    </div>


  )


}
