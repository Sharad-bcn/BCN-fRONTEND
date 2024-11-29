import React from 'react';


import { Link } from 'react-router-dom'


import s from './styles.module.scss'


import images from 'images'


import { useCallback, useEffect, useRef, useState } from 'react'


import * as api from 'api'


import { getPlanStatus } from 'helpers'


const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



export default function Main({ children, title }) {


  const [notifications, setNotifications] = useState(0)


  const [loading, setLoading] = useState(false)


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const processing = useRef(false)



  const getNotificationsCount = useCallback(async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const fetchNotifications = await api.userAdmin.notification.count({})



    if (fetchNotifications.code === 201) {


      setNotifications(fetchNotifications.payload.total)


    } else {


      // Alert.error(fetchNotifications.message)


    }



    setLoading(false)


    processing.current = false


  }, [])



  const planStatus = getPlanStatus(userData.planExpiresAt)



  useEffect(() => {


    getNotificationsCount()


  }, [getNotificationsCount])



  return (


    <div className={s.main}>


      <div className={s.header}>


        <div className={s.title}>{title}</div>


        <div className={s.right}>


          <div className={s.children}>{children}</div>


          <div className={s.profile}>


            <Link


              className={


                planStatus === 'Active'


                  ? s.subscription


                  : planStatus === 'Expiring'


                  ? s.subscriptionAlt


                  : s.subscriptionHalt


              }


              to={userData.plan === 'Plan 0' ? '/userAdmin/subscriptionInfo' : '/userAdmin/subscription'}


              title={


                planStatus === 'Active'


                  ? 'Your plan is active'


                  : planStatus === 'Expiring'


                  ? 'Your plan expires soon'


                  : 'Your plan has expired'


              }


            >


              <span className='material-icons-outlined'>card_membership</span>


            </Link>


            <Link


              className={s.notifications}


              to='/userAdmin/notifications'


              title={notifications + ' new notifications'}


            >


              <span className='material-icons-outlined'>notifications</span>


              {!loading && notifications !== 0 && (


                <span className={s.notificationsNumber}>{notifications > 99 ? '99+' : notifications}</span>


              )}


            </Link>


            <Link className={s.editProfile} to='/userAdmin/editProfile' title={userData ? userData.name : ''}>


              <img src={userData && userData.logo ? IMAGE_HOST + userData.logo : images.Profile} alt='' />


            </Link>


            {!!userData && <div className={s.userAdminName}>{userData.name}</div>}


          </div>


        </div>


      </div>


      <div className={s.childrenResponsive}>{children}</div>


    </div>


  )


}
