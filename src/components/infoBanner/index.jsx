import React from 'react';


import { useEffect, useState } from 'react'


import s from './styles.module.scss'



export default function Main({ message = '', handler = () => {} }) {


  const [display, setDisplay] = useState(true)



  useEffect(() => {


    document.body.style.overflow = display ? 'hidden' : 'unset'



    // Clean up function to reset the overflow style when the component unmounts or display changes


    return () => {


      document.body.style.overflow = 'unset'


    }


  }, [display])



  return !!display ? (


    <div className={s.mainOuter}>


      <div className={s.main}>


        <div className={s.inner}>


          <div className={s.message}>{message}</div>


          <div className={s.actionButtons}>


            {/* <Link to='/renewPlan' className={s.close} onClick={() => setDisplay(false)}>


              Renew Your Plan


            </Link> */}


            <div


              className={s.close}


              onClick={() => {


                handler()


                setDisplay(false)


              }}


            >


              Close


            </div>


          </div>


        </div>


      </div>


    </div>


  ) : (


    <div></div>


  )


}
