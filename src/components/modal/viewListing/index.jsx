import React from 'react';


import { useCallback, useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'


import * as api from 'api'


import { Alert, ImageTag, Loader, NoData } from 'components'


const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



export default function Main(props) {


  const [listing, setListing] = useState(null)


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getListing = useCallback(async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const fetchListing = await api.publicApi.listings.fetch({


      id: props.id


    })



    if (fetchListing.code === 200) {


      setListing(fetchListing.payload.getListing)


    } else {


      if (fetchListing.code === 400) Alert.error('Offering not found')


    }


    processing.current = false


    setLoading(false)


  }, [props.id])



  useEffect(() => {


    if (props.id) getListing()


  }, [props.id, getListing])



  const updateNotificationAndViews = useCallback(async () => {


    if (processing.current) return


    processing.current = true



    const sendNotification = await api.publicApi.notifications.create({


      notification: listing.listingName + " is catching people's attention",


      fkUserId: listing.fkUserId,


      redirect: ''


    })



    if (sendNotification.code === 201) {


    } else {


      Alert.error(sendNotification.message)


    }



    const updateViews = await api.publicApi.listings.updateViews({


      fkListingId: listing._id


    })



    if (updateViews.code === 201) {


    } else {


      Alert.error(updateViews.message)


    }



    processing.current = false


  }, [listing])



  useEffect(() => {


    if (listing) updateNotificationAndViews()


  }, [listing, updateNotificationAndViews])



  useEffect(() => {


    if (listing) {


      const swiper = new window.Swiper('.mySwiper1', {


        slidesPerView: 1,


        spaceBetween: 30,


        loop: true,


        autoplay: true,


        pagination: {


          el: '.swiper-pagination',


          clickable: true,


          dynamicBullets: true


        },


        navigation: {


          nextEl: '.swiper-button-next',


          prevEl: '.swiper-button-prev'


        }


      })


    }


  }, [listing])



  return (


    <div className={s.main}>


      <div className={s.viewListing}>


        <div className={s.viewListingInner + ' innerScroll'}>


          {!loading && listing ? (


            <>


              <div className={s.listingImages}>


                <div className='swiper mySwiper1'>


                  <div className='swiper-wrapper'>


                    {listing.images.length ? (


                      listing.images.map((image, i) => (


                        <div className={s.slide + ' swiper-slide'} key={i}>


                          <ImageTag src={IMAGE_HOST + image} alt='' />


                        </div>


                      ))


                    ) : (


                      <div className={s.slide + ' swiper-slide'} style={{ background: 'transparent' }}>


                        <ImageTag src='' alt='' />


                      </div>


                    )}


                  </div>


                  <div className='swiper-button-next'></div>


                  <div className='swiper-button-prev'></div>


                  <div className='swiper-pagination'></div>


                </div>


              </div>


              <div className={s.title}>{listing.listingName}</div>


              <div className={s.info}>


                <div className={s.contactNo}>


                  <div>Contact No.</div>


                  <div


                    href={'tel:+91-' + listing.phoneNo}


                    onClick={() => {


                      window.location.href = `tel:+91-${listing.phoneNo}`


                    }}


                  >


                    <span className='material-icons'>call</span>


                    Call Us


                  </div>


                </div>


                <div className={s.address}>


                  <div>Address</div>


                  <div>


                    <span className='material-icons'>location_on</span>


                    {listing.address}


                  </div>


                </div>


              </div>


              <div className={s.adInfo}>


                <div>Description</div>


                <div>{listing.description}</div>


              </div>


            </>


          ) : (


            <div className={s.noData}>


              <NoData />


            </div>


          )}


          {!!loading && (


            <div className={s.loader}>


              <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


            </div>


          )}


        </div>


      </div>


      <span className={'material-icons-outlined ' + s.close} onClick={props.onCloseModal}>


        cancel


      </span>


    </div>


  )


}
