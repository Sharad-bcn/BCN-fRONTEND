import React from 'react';


import { useEffect, useState, useRef, useCallback } from 'react'


import s from './styles.module.scss'


import { head } from 'helpers'


import { Loader, NoData } from 'components'


import * as api from 'api'



export default function Main() {


  const [privacyPolicy, setPrivacyPolicy] = useState('')


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getPrivacyPolicy = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchPrivacyPolicy = await api.publicApi.landingPage.fetchPrivacyPolicy({})



    if (fetchPrivacyPolicy.code === 200) {


      setPrivacyPolicy(fetchPrivacyPolicy.payload.privacyPolicy)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getPrivacyPolicy()


  }, [getPrivacyPolicy])



  useEffect(() => {


    head({ title: 'Privacy Policy | BCN' })


  }, [])



  return (


    <div className={s.main}>


      <div className={s.privacyPolicySection + ' indent'}>


        <div className={s.title}>Privacy Policy</div>


        {!loading && !privacyPolicy && <NoData />}


        {!loading && !!privacyPolicy && <div className={s.privacyPolicy}>{privacyPolicy}</div>}


        {!!loading && (


          <div className={s.loader}>


            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


          </div>


        )}


      </div>


    </div>


  )


}
