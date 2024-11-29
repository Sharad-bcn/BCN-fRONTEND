import React from 'react';


import { Link } from 'react-router-dom'


import images from 'images'


import s from './styles.module.scss'


import { useCallback, useEffect, useRef, useState } from 'react'


import { Loader } from 'components'


import * as api from 'api'



export default function Main() {


  const [facebookLink, setFacebookLink] = useState('')


  const [instagramLink, setInstagramLink] = useState('')


  const [whatsappLink, setWhatsappLink] = useState('')


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getSocialLinks = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchSocialLinks = await api.publicApi.landingPage.fetchSocialLinks({})



    if (fetchSocialLinks.code === 200) {


      setFacebookLink(fetchSocialLinks.payload.facebookLink)


      setInstagramLink(fetchSocialLinks.payload.instagramLink)


      setWhatsappLink(fetchSocialLinks.payload.whatsappLink)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getSocialLinks()


  }, [getSocialLinks])



  return (


    <div className={s.main} id='footer'>


      {!loading && (


        <div className={s.footer}>


          <div className={s.row}>


            <div className={s.column}>


              <div className={s.title}>About Us</div>


              <div className={s.content}>


                Looking for seller of a particular product. Just fill the form and connect with thousands of sellers


                associated with us. We have sellers who are looking for selling products at very competitive prices. Be


                it any location in india, we are there for you.


              </div>


            </div>


            <div className={s.column}>


              <div className={s.content}>


                <div className={s.image}>


                  <Link to='/home'>


                    <img src={images.logoWhite} alt='' />


                  </Link>


                </div>


                <div className={s.socialIcons}>


                  <Link to={facebookLink ? facebookLink : '/'}>


                    <img src={images.facebook} alt='' />


                  </Link>


                  <Link to={instagramLink ? instagramLink : '/'}>


                    <img src={images.instagram} alt='' />


                  </Link>


                  <Link to={whatsappLink ? whatsappLink : '/'}>


                    <img src={images.whatsapp} alt='' />


                  </Link>


                </div>


              </div>


            </div>


            <div className={s.column}>


              <div className={s.title}>Quick Links</div>


              <div className={s.content}>


                <Link to='/aboutUs'>About Us</Link>


                <Link to='/contactUs'>Contact Us</Link>


                {/* <Link to='/'>Services</Link> */}


                {/* <Link to='/'>Product Availability</Link> */}


                <Link to='/faq'>FAQ'S</Link>


              </div>


            </div>


            <div className={s.column}>


              <div className={s.title}>Useful Links</div>


              <div className={s.content}>


                <Link to='/signUp'>Register Now</Link>


                {/* <Link to='/'>Campaign</Link> */}


                {/* <Link to='/'>Feedback</Link> */}


                <Link to='/privacyPolicy'>Privacy Policy</Link>


                <Link to='/terms&Conditions'>Terms & Conditions</Link>


              </div>


            </div>


          </div>


          <div className={s.row}>


            <div>© 2023 BCN | www.bcnindia.com</div>


          </div>


        </div>


      )}


      {!!loading && (


        <div className={s.loader}>


          <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


        </div>


      )}


    </div>


  )


}
