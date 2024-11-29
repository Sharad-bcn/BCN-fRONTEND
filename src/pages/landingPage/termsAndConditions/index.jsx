import React from 'react';


import { useEffect, useState, useRef, useCallback } from 'react'


import s from './styles.module.scss'


import { head } from 'helpers'


import { Loader, NoData } from 'components'


import * as api from 'api'



export default function Main() {


  const [termsAndConditions, setTermsAndConditions] = useState('')


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getTermsAndConditions = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchTermsAndConditions = await api.publicApi.landingPage.fetchTermsAndConditions({})



    if (fetchTermsAndConditions.code === 200) {


      setTermsAndConditions(fetchTermsAndConditions.payload.termsAndConditions)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getTermsAndConditions()


  }, [getTermsAndConditions])



  useEffect(() => {


    head({ title: 'Terms And Conditions | BCN' })


  }, [])



  return (


    <div className={s.main}>


      <div className={s.termsAndConditionsSection + ' indent'}>


        <div className={s.title}>Terms And Conditions</div>


        {!loading && !termsAndConditions && <NoData />}


        {!loading && !!termsAndConditions && <div className={s.termsAndConditions}>{termsAndConditions}</div>}


        {!!loading && (


          <div className={s.loader}>


            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


          </div>


        )}


      </div>


    </div>


  )


}
