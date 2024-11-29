import React from 'react';


import { useCallback, useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'


import { Encrypt, getTimeFormats, head, print } from 'helpers'


import { Alert, Layouts, Loader } from 'components'


import images from 'images'


import { QRCodeSVG } from 'qrcode.react'


import { Link } from 'react-router-dom'


import * as api from 'api'


const REACT_APP_PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL



export default function Main() {


  const [user, setUser] = useState('')


  const [loading, setLoading] = useState(false)


  const [isDownloading, setIsDownloading] = useState(false)


  const processing = useRef(false)


  const mediaMatch = window.matchMedia('(max-width: 1279px)')


  const [matches, setMatches] = useState(mediaMatch.matches)


  // const userData = JSON.parse(window.localStorage.getItem('userData'))



  useEffect(() => {


    const handler = e => setMatches(e.matches)


    mediaMatch.addEventListener('change', handler)


    return () => mediaMatch.removeEventListener('change', handler)


  })



  useEffect(() => {


    head({ title: 'Membership Card | BCN' })


  }, [])



  const getUser = useCallback(async () => {


    if (processing.current) return


    processing.current = true



    setLoading(true)



    const fetchUser = await api.userAdmin.user.fetch({})



    if (fetchUser.code === 200) {


      setUser(fetchUser.payload.getUser)


    } else {


      Alert.error(fetchUser.message)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getUser()


  }, [getUser])



  return (


    <div className={s.main}>


      <div className={s.settings}>


        {/* <div className={s.header}> */}


        <Layouts.Classic title='Membership Card' />


        {/* </div> */}


        {!loading ? (


          <div className={s.content + ' innerScrollX'}>


            <div className={s.actionButtons}>


              <div


                className={s.download}


                onClick={async () => {


                  setIsDownloading(true)


                  Alert.success('Downloading membership card...')


                  await print(document.querySelector(`.cards`))


                  setIsDownloading(false)


                  Alert.success('Membership card downloaded successfully...')


                }}


              >


                Download


                <span className='material-icons-outlined'>download</span>


              </div>


            </div>


            <div className={s.cards + ' cards'} style={{ alignItems: isDownloading && 'center' }}>


              <div


                className={isDownloading ? s.cardFrontIsDownloading + ' ' + s.cardFront : s.cardFront}


                style={{ backgroundImage: `url(${images.Card})` }}


              >


                <div className={s.image}>


                  <img src={images.logoWhite} alt='' />


                </div>


                <div className={s.middleData}>


                  <Link


                    className={s.qrCode}


                    to={'/userProfile/' + Encrypt({ fkUserId: user._id })}


                    target={matches ? '_self' : '_blank'}


                  >


                    <QRCodeSVG


                      value={REACT_APP_PUBLIC_URL + '/userProfile/' + Encrypt({ fkUserId: user._id })}


                      size={matches ? (isDownloading ? 128 : 64) : 128}


                      fgColor={'var(--c-primary)'}


                      includeMargin={true}


                      level='L'


                    />


                  </Link>


                  <div className={s.userInfo}>


                    <div className={s.userName}>{user.firstName + ' ' + user.lastName}</div>


                    <div className={s.userRefId}>{user.userRefId}</div>


                    <div className={s.validity}>


                      {/* Validity From:&nbsp;<span>{getTimeFormats(new Date(user.createdAt), true)}</span> To:&nbsp;


                      <span>{getTimeFormats(new Date(Date.now()), true)}</span> */}


                      Valid Till:&nbsp;<span>{getTimeFormats(new Date(user.planExpiresAt), true)}</span>


                    </div>


                  </div>


                </div>


                <div className={s.lastData}>


                  <div className={s.state}>


                    State: <span>{user.state}</span>


                  </div>


                  <div className={s.city}>


                    City: <span>{user.city}</span>


                  </div>


                </div>


              </div>


              <div


                className={isDownloading ? s.cardBackIsDownloading + ' ' + s.cardBack : s.cardBack}


                style={{ backgroundImage: `url(${images.Card})` }}


              >


                <div className={s.top}>


                  <div className={s.image}>


                    <img src={images.logoWhite} alt='' />


                  </div>


                </div>


                <div className={s.link}>www.bcnindia.com</div>


              </div>


            </div>


          </div>


        ) : (


          <div className={s.loader}>


            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


          </div>


        )}


      </div>


    </div>


  )


}
