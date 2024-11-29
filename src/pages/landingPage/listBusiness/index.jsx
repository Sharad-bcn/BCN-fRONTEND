import React from 'react';







import { head } from 'helpers'



import s from './styles.module.scss'



import { useEffect } from 'react'







export default function Main() {



  useEffect(() => {



    head({ title: 'List Business | BCN' })



  }, [])



  return (



    <div className={s.main}>



      <div className={s.comingSoon + ' indent'}>Coming Soon!!</div>



    </div>



  )



}



