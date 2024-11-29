import React from 'react';


import { useEffect, useState, useRef, useCallback } from 'react'


import s from './styles.module.scss'


import { head } from 'helpers'


import { Loader } from 'components'


import * as api from 'api'



export default function Main() {


  const [aboutUs, setAboutUs] = useState('')


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getAboutUs = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchAboutUs = await api.publicApi.landingPage.fetchAboutUs({})



    if (fetchAboutUs.code === 200) {


      setAboutUs(fetchAboutUs.payload.aboutUs)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getAboutUs()


  }, [getAboutUs])



  useEffect(() => {


    head({ title: 'About Us | BCN' })


  }, [])



  return (


    <div className={s.main}>


      <div className={s.aboutUsSection + ' indent'}>


        <div className={s.title}>About Us</div>


        {!loading && !aboutUs.length && (


          <div className={s.aboutUs}>


            BCN is a community pltform created for Brahmins to help and promote the financial growth of community


            members. The objective of BCN is to bring the Brahmin community together on a common platform and help them


            in getting their businesses or services to be listed there. By mandating the community members to prioritize


            and provide referrals or leads to these registered individual businesses or services, this network creates a


            huge opportunity for financial gain and a continuous flow of regular income. BCN's final goal is to make


            Brahmin financially strong and uplift the Brahmin community. To achieve this goal BCN wants to leverage the


            great power of social networking by bringing the whole community together on a web platform where brahmins


            can seek services, buy goods, get consultation, get help wherever they are in the country of across the


            globe.


            <ul>


              Directors and Founders


              <li> Bhavesh Kandpal</li>


              <li>Priyanka Swami </li>


              <li>Uma Sharma</li>


            </ul>


            <ul>


              Co-Founders and Promoters


              <li>Amber Swami </li>


              <li>Anupam Sharma</li>


            </ul>


          </div>


        )}


        {!loading && !!aboutUs.length && <div className={s.aboutUs}>{aboutUs}</div>}


        {!!loading && (


          <div className={s.loader}>


            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


          </div>


        )}


      </div>


    </div>


  )


}
