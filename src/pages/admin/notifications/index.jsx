import React from 'react';






import { Alert, Filter, InfiniteScroll, Layouts, Loader, Modal, NoData } from 'components'



import s from './styles.module.scss'



import { useCallback, useEffect, useRef, useState } from 'react'



import { Decrypt, head, timeFormat } from 'helpers'



import * as api from 'api'



import { useNavigate } from 'react-router-dom'







const notificationsFilterFields = [



  {



    field: 'All'



  },



  {



    field: 'New'



  },



  {



    field: 'Read'



  }



]







export default function Main() {



  const [selectedFilterField, setSelectedFilterField] = useState(notificationsFilterFields[0].field)



  const [notifications, setNotifications] = useState([])



  const [totalPages, setTotalPages] = useState(0)



  const [pageNo, setPageNo] = useState(1)



  const [loading, setLoading] = useState(false)



  const processing = useRef(false)



  const navigate = useNavigate()



  const perPage = 15







  useEffect(() => {



    head({ title: 'Notifications | BCN' })



  }, [])







  const filterHandler = field => {



    setNotifications([])



    setPageNo(1)



    setSelectedFilterField(field)



  }







  const getNotifications = useCallback(



    async (filter, currPage) => {



      if (processing.current) return



      processing.current = true



      setLoading(true)



      setPageNo(currPage + 1)



      // console.log(filter)







      const fetchListings = await api.userAdmin.notification.fetchAll({



        perPage,



        pageNo: currPage,



        filter



      })







      if (fetchListings.code === 200) {



        setNotifications(notifications.concat(fetchListings.payload.notifications))



        setTotalPages(Math.ceil(fetchListings.payload.total / perPage))



      } else {



        Alert.error('Notifications Not Found')



      }







      setLoading(false)



      processing.current = false



    },



    [notifications]



  )







  const markAsReadHandler = async id => {



    if (processing.current) return



    processing.current = true







    const markAsRead = await api.userAdmin.notification.markAsRead({



      id



    })







    if (markAsRead.code === 201) {



      setNotifications(



        notifications.map(notification => {



          if (notification._id === id) return { ...notification, isMarkedRead: true }



          else return notification



        })



      )



      Alert.success(markAsRead.message)



    } else {



      Alert.error(markAsRead.error)



    }







    processing.current = false



  }







  const deleteNotificationHandler = async id => {



    if (processing.current) return



    processing.current = true







    const deleteNotification = await api.userAdmin.notification.delete({



      id



    })







    if (deleteNotification.code === 201) {



      setNotifications(notifications.filter(x => x._id !== id))



      Alert.success(deleteNotification.message)



    } else {



      Alert.error(deleteNotification.error)



    }







    processing.current = false



  }







  const markAllAsReadHandler = async () => {



    if (processing.current) return



    processing.current = true







    const markAllAsRead = await api.userAdmin.notification.markAllAsRead({})







    if (markAllAsRead.code === 201) {



      setNotifications(notifications.map(notification => ({ ...notification, isMarkedRead: true })))



      Alert.success(markAllAsRead.message)



    } else {



      Alert.error(markAllAsRead.error)



    }







    processing.current = false



  }







  const deleteAllHandler = async () => {



    if (processing.current) return



    processing.current = true







    const deleteAll = await api.userAdmin.notification.deleteAll({})







    if (deleteAll.code === 201) {



      setNotifications([])



      Alert.success(deleteAll.message)



    } else {



      Alert.error(deleteAll.error)



    }







    processing.current = false



  }







  return (



    <div className={s.main}>



      <div className={s.notificationSection}>



        <Layouts.Classic title='Notifications'>



          <div className={s.headerBottom}>



            <div



              className={s.markAllAsRead}



              onClick={



                !notifications.length



                  ? () => {}



                  : () =>



                      Modal.Confirm('Are u sure u want to mark all your notifications as read?', markAllAsReadHandler)



              }



            >



              <span className='material-icons-outlined'>done</span>



              Mark All As Read



            </div>



            <div



              className={s.deleteAll}



              onClick={



                !notifications.length



                  ? () => {}



                  : () => Modal.Confirm('Are u sure u want to delete all your notifications?', deleteAllHandler)



              }



            >



              <span className='material-icons-outlined'>delete</span>



              Delete All



            </div>



            <Filter



              title={selectedFilterField}



              heading={selectedFilterField}



              filterFields={notificationsFilterFields}



              filterHandler={filterHandler}



              style2



              right



            />



          </div>



        </Layouts.Classic>



        <div className={s.content + ' innerScrollX'} style={{ justifyContent: !notifications.length && 'center' }}>



          <div className={s.notifications}>



            {!loading && !notifications.length && <NoData />}







            <InfiniteScroll



              next={getNotifications}



              filter={selectedFilterField}



              currentPage={pageNo}



              hasMore={pageNo <= totalPages}



              inLayout



            >



              {notifications.map(({ _id, notification, createdAt, isMarkedRead, redirect }, i) => (



                <div



                  className={isMarkedRead ? s.notification : s.notification + ' ' + s.active}



                  key={i}



                  onClick={



                    redirect



                      ? () => {



                          navigate(Decrypt(redirect).path)



                        }



                      : () => {}



                  }



                >



                  <div className={s.notificationTitle + ' ellipsis'}>



                    <span className='material-icons-outlined'>notifications</span>



                    {notification}



                  </div>



                  <div className={s.notificationActions}>



                    <div className={s.timeStamp}>{timeFormat(createdAt, true)}</div>



                    {!isMarkedRead && (



                      <span



                        className='material-icons-outlined'



                        onClick={e => {



                          e.stopPropagation()



                          markAsReadHandler(_id)



                        }}



                        title='Mark As Read'



                      >



                        done



                      </span>



                    )}



                    <span



                      className='material-icons-outlined'



                      onClick={e => {



                        e.stopPropagation()



                        deleteNotificationHandler(_id)



                      }}



                      title='Delete Notification'



                    >



                      delete



                    </span>



                  </div>



                </div>



              ))}



            </InfiniteScroll>



            {!!loading && <Loader color='var(--c-primary)' colorText='var(--c-primary)' />}



          </div>



          <div id='footer'></div>



        </div>



      </div>



    </div>



  )



}



