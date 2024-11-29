import React from 'react';


import { head } from 'helpers'


import s from './styles.module.scss'


import { useCallback, useEffect, useRef, useState } from 'react'


import { Form, GoogleMap, Input, Loader, TextArea } from 'components'


import { Link } from 'react-router-dom'


import * as api from 'api'



export default function Main() {


  const [name, setName] = useState('')


  const [phoneNo, setPhoneNo] = useState('')


  const [message, setMessage] = useState('')


  const [websitePhoneNo, setWebsitePhoneNo] = useState('')


  const [websiteEmail, setWebsiteEmail] = useState('')


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getContactInfo = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchContactInfo = await api.publicApi.landingPage.fetchContactInfo({})



    if (fetchContactInfo.code === 200) {


      setWebsiteEmail(fetchContactInfo.payload.websiteEmail)


      setWebsitePhoneNo(fetchContactInfo.payload.websitePhoneNo)


    }



    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getContactInfo()


  }, [getContactInfo])



  useEffect(() => {


    head({ title: 'Contact Us | BCN' })


  }, [])



  return (


    <div className={s.main}>


      {!loading && (


        <div className={s.contactUs + ' indent'}>


          <div className={s.contactForm}>


            <div className={s.left}>


              <div className={s.header}>


                <div>


                  Get In <span>Touch</span>


                </div>


                <div>Connect with us through our online contact form for swift assistance and inquiries.</div>


              </div>


              <Form onSubmit={() => {}} className={s.form}>


                <Input.Classic


                  label='Name'


                  type='text'


                  iconLeft='badge'


                  placeholder='Enter Name'


                  value={name}


                  onChange={e => setName(e.target.value)}


                />


                <Input.Classic


                  label='Phone No.'


                  type='number'


                  iconLeft='call'


                  placeholder='Enter Phone No.'


                  value={phoneNo}


                  onChange={e => setPhoneNo(e.target.value)}


                />


                <TextArea.Classic


                  label='Message'


                  iconLeft='description'


                  placeholder='Enter Message'


                  value={message}


                  onChange={e => setMessage(e.target.value)}


                />


                <div className={s.button}>


                  <button onClick={() => {}}>SUBMIT</button>


                </div>


              </Form>


              <div className={s.bottomOuter}>


                <div className={s.bottom}>


                  <Link className={s.phone} to='tel:+91-8595101101'>


                    <span className='material-icons-outlined'>call</span>


                    <div>


                      <div>Phone</div>


                      <div>{websitePhoneNo ? '+91-' + websitePhoneNo : '+91-8595101101'}</div>


                    </div>


                  </Link>


                  <Link className={s.email} to={'mailto:' + (websiteEmail ? websiteEmail : 'info@bcnindia.com')}>


                    <span className='material-icons-outlined'>email</span>


                    <div>


                      <div>E-MAIL</div>


                      <div>{websiteEmail ? websiteEmail : 'info@bcnindia.com'}</div>


                    </div>


                  </Link>


                </div>


                <div className={s.address}>


                  <div>


                    <span className='material-icons-outlined'>location_on</span>


                    <div>Address</div>


                  </div>


                  <div>


                    GBCN SOFTWARE PRIVATE LIMITED B 12, Pride Crosswinds, Bukkasagara Vill,anekal, Bannerghatta,


                    Bangalore Rural, Bangalore South, Karnataka, India, 560083


                  </div>


                </div>


              </div>


            </div>


            <div className={s.right}>


              <div className={s.location}>


                <GoogleMap.SingleLocation />


              </div>


            </div>


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
