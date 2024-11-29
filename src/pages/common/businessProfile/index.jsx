import React from 'react';







import s from './styles.module.scss'



import { Decrypt, Encrypt, formatWorkingHours, head } from 'helpers'



import { useCallback, useEffect, useRef, useState } from 'react'



import { Alert, Loader, NoData } from 'components'



import * as api from 'api'



import { useSelector } from 'react-redux'



import { ImageTag, Location, Modal, ScrollToTop, Search } from 'components'



import { useNavigate, useParams } from 'react-router-dom'



import images from 'images'



const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL



const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST







export default function Main() {



  const [loading, setLoading] = useState(false)



  const userData = JSON.parse(window.localStorage.getItem('userData'))



  const [business, setBusiness] = useState('')



  const [businessListings, setBusinessListings] = useState([])



  const [convertedTimings, setConvertedTimings] = useState([])



  const location = useSelector(state => state.location).location



  const mediaMatch = window.matchMedia('(max-width: 1279px)')



  const [matches, setMatches] = useState(mediaMatch.matches)



  const processing = useRef(false)



  const navigate = useNavigate()







  useEffect(() => {



    const handler = e => setMatches(e.matches)



    mediaMatch.addEventListener('change', handler)



    return () => mediaMatch.removeEventListener('change', handler)



  })







  let { fkBusinessId } = useParams()



  fkBusinessId = Decrypt(fkBusinessId).fkBusinessId







  useEffect(() => {



    head({



      title: (business ? business.businessName : 'Business') + ' in ' + location + ' | BCN'



    })



  }, [location, business])







  const getBusiness = useCallback(async () => {



    if (processing.current) return



    processing.current = true







    setLoading(true)







    const fetchBusiness = await api.publicApi.business.fetch({



      id: fkBusinessId



    })







    if (fetchBusiness.code === 200) {



      setBusiness(fetchBusiness.payload.getBusiness)



      setConvertedTimings(formatWorkingHours(fetchBusiness.payload.getBusiness.workingHours.timings))



    } else {



      if (fetchBusiness.code === 400) Alert.error('Business is not available right now')



    }



    processing.current = false



    setLoading(false)



  }, [fkBusinessId])







  useEffect(() => {



    getBusiness()



  }, [getBusiness])







  const updateNotificationAndViews = useCallback(async () => {



    if (processing.current) return



    processing.current = true







    const sendNotification = await api.publicApi.notifications.create({



      notification: business.businessName + " is catching people's attention",



      fkUserId: business.fkUserId,



      redirect: ''



    })







    if (sendNotification.code === 201) {



    } else {



      Alert.error(sendNotification.message)



    }







    const updateViews = await api.publicApi.business.updateViews({



      fkBusinessId: business._id



    })







    if (updateViews.code === 201) {



    } else {



      Alert.error(updateViews.message)



    }







    processing.current = false



  }, [business])







  useEffect(() => {



    if (business) updateNotificationAndViews()



  }, [business, updateNotificationAndViews])







  useEffect(() => {



    const swiper = new window.Swiper('.mySwiper', {



      slidesPerView: matches ? 1 : 3,



      spaceBetween: 30,



      loop: true,



      autoplay: false,



      // pagination: {



      //   el: '.swiper-pagination',



      //   clickable: true,



      //   dynamicBullets: true



      // },



      navigation: {



        nextEl: '.swiper-button-next',



        prevEl: '.swiper-button-prev'



      }



    })



  }, [business, businessListings, matches])







  const getBusinessListings = useCallback(async () => {



    if (processing.current) return



    processing.current = true







    setLoading(true)







    const fetchBusinessListings = await api.publicApi.listings.fetchBusinessListings({



      id: fkBusinessId



    })







    if (fetchBusinessListings.code === 200) {



      setBusinessListings(fetchBusinessListings.payload.getBusinessListings)



    } else {



      Alert.error(fetchBusinessListings.message)



    }



    processing.current = false



    setLoading(false)



  }, [fkBusinessId])







  useEffect(() => {



    if (business.listingsCount) getBusinessListings()



  }, [business.listingsCount, getBusinessListings])







  return !loading ? (



    !!business ? (



      <div className={s.main}>



        <div className={s.header + ' indent'}>



          <div className={s.searchField}>



            <div className={s.fields}>



              <Location />



              {!!userData && (



                <div



                  className={s.inviteResponsive}



                  onClick={async () => {



                    await navigator.share({



                      title: 'BCN-India',



                      text: 'Join bcn-india today!!',



                      url:



                        PUBLIC_URL +



                        '/signUp?refId=' +



                        Encrypt({ refId: userData.userRefId, referredby: userData.name })



                    })



                  }}



                  style={{



                    justifyContent: !!userData.referredUsersCount ? 'flex-end' : 'center'



                  }}



                >



                  <span>



                    Invite a brahmin friend <span className='material-icons-outlined'>share</span>



                  </span>



                  {!!userData.referredUsersCount && (



                    <span>



                      ({userData.referredUsersCount + (userData.referredUsersCount === 1 ? ' user ' : ' users ')}{' '}



                      referred)



                    </span>



                  )}



                </div>



              )}



            </div>



            <Search />



          </div>



          {!!userData && (



            <div



              className={s.invite}



              onClick={async () => {



                await navigator.share({



                  title: 'BCN-India',



                  text: 'Join bcn-india today!!',



                  url: PUBLIC_URL + '/signUp?refId=' + Encrypt({ refId: userData.userRefId, referredby: userData.name })



                })



              }}



            >



              <span>



                Invite a brahmin friend <span className='material-icons-outlined'>share</span>



              </span>



              {!!userData.referredUsersCount && (



                <span>



                  ({userData.referredUsersCount + (userData.referredUsersCount === 1 ? ' user ' : ' users ')} referred)



                </span>



              )}



            </div>



          )}



        </div>



        <div className={s.businessProfile + ' indent'}>



          <div className={s.banners}>



            <div className={'swiper mySwiper ' + s.swiperContainer}>



              <div className='swiper-wrapper'>



                {business.images.length ? (



                  business.images.map((image, i) => (



                    <div className={s.slide + ' swiper-slide'} key={i}>



                      <ImageTag src={IMAGE_HOST + image} alt='' />



                    </div>



                  ))



                ) : (



                  <>



                    <div className={s.slide + ' swiper-slide'}>



                      <ImageTag src='' alt='' />



                    </div>



                    <div className={s.slide + ' swiper-slide'}>



                      <ImageTag src='' alt='' />



                    </div>



                    <div className={s.slide + ' swiper-slide'}>



                      <ImageTag src='' alt='' />



                    </div>



                  </>



                )}



              </div>



              <div className='swiper-button-next'></div>



              <div className='swiper-button-prev'></div>



              <div className='swiper-pagination'></div>



            </div>



          </div>



          <div className={s.businessInteractions} onClick={e => e.stopPropagation()}>



            <div



              className={s.phoneNo}



              onClick={() => {



                if (!!userData) {



                  if (userData.plan !== 'Plan 0') window.location.href = `tel:+91-${business.phoneNo}`



                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))



                } else Modal.PrivacyModal()



              }}



            >



              <span className='material-icons-outlined'>call</span>



              Call Us



            </div>



            <div



              className={s.whatsapp}



              onClick={() => {



                if (!!userData) {



                  if (userData.plan !== 'Plan 0') window.open('https://wa.me/91' + business.phoneNo, '_blank')



                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))



                } else Modal.PrivacyModal()



              }}



            >



              <div className={s.icon}>



                <img src={images.whatsapp} alt='' />



              </div>



              whatsapp



            </div>



            <div



              className={s.sendInterest}



              onClick={() => {



                if (!!userData) {



                  if (userData.plan !== 'Plan 0') Modal.QueryForm('', business._id, business.fkUserId)



                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))



                } else Modal.PrivacyModal()



              }}



            >



              <span className='material-icons-outlined'>send</span>



              send interest



            </div>



            <div



              className={s.share}



              onClick={async () => {



                await navigator.share({



                  title: 'BCN-India',



                  text: (business.businessName || 'Business') + ' in ' + location + ' | BCN',



                  url: window.location.href



                })



              }}



            >



              Share <span className='material-icons-outlined'>share</span>



            </div>



          </div>



          {!!business.location.coordinates[1] && !!business.location.coordinates[0] && (



            <div



              className={s.directions}



              onClick={() => {



                if (!!userData) {



                  if (userData.plan !== 'Plan 0')



                    window.open(



                      `https://www.google.com/maps/dir/?api=1&destination=${business.location.coordinates[1]},${business.location.coordinates[0]}`,



                      '_blank'



                    )



                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))



                } else Modal.PrivacyModal()



              }}



            >



              <span className='material-icons-outlined'>directions</span> Directions



            </div>



          )}



          <div className={s.tags}>



            {business.tags.map((tag, i) => (



              <div className={s.tag} key={i}>



                #{tag}



                {business.tags.length === i + 1 ? '' : ','}



              </div>



            ))}



          </div>



          <div className={s.businessName}> {business.businessName}</div>



          <div



            className={s.userProfileLink}



            onClick={() => {



              if (!!userData) {



                if (userData.plan !== 'Plan 0') navigate('/userProfile/' + Encrypt({ fkUserId: business.fkUserId }))



                else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))



              } else Modal.PrivacyModal()



            }}



          >



            Check out user Profile



          </div>



          <div className={s.address}> {business.address}</div>



          <div className={s.description}> {business.description}</div>



          <div className={s.businessTimelines}>



            {!business.workingHours.isOpen24Hours &&



              !business.workingHours.timings.every(day => day.isClosed) &&



              !business.workingHours.timings.every(day => day.from === '' || day.to === '') && (



                <div className={s.workingDays}>



                  <div className={s.title}>Business Hours:</div>



                  <div className={s.workingHours}>



                    {convertedTimings.map((day, i) => (



                      <div className={s.workingDay} key={i}>



                        <div className={s.day}>{day.day}:</div>



                        <div className={s.dayWorkingHours}>



                          {/* {!day.isClosed ? (day.from && day.to ? day.from + ' - ' + day.to : 'Closed') : 'Closed'}



                           */}



                          {!day.isClosed ? (day.from && day.to ? day.from + ' - ' + day.to : 'N/A') : 'Closed'}



                        </div>



                      </div>



                    ))}



                  </div>



                </div>



              )}



            {business.workingHours.isOpen24Hours && (



              <div className={s.workingDays}>



                <div className={s.title}>Business Hours:</div>



                <div className={s.workingHours}>



                  <div className={s.workingDay}>



                    <div className={s.day}>Mon - Sun:</div>



                    <div className={s.dayWorkingHours}>Open 24 hours</div>



                  </div>



                </div>



              </div>



            )}



            {!!business.dateOfEstablishment && (



              <div className={s.dateOfEstablishment}>



                <div className={s.title}>Date of Establishment:</div>



                <div className={s.content}>{business.dateOfEstablishment}</div>



              </div>



            )}



          </div>



          {(business.instagramLink || business.facebookLink) && (



            <div className={s.socials}>



              <span> Follow Us On: </span>



              {business.facebookLink && (



                <a className={s.image} href={business.facebookLink}>



                  <div className={s.image}>



                    <img src={images.facebookAlt} alt='' />



                  </div>



                </a>



              )}



              {business.instagramLink && (



                <a className={s.image} href={business.instagramLink}>



                  <div className={s.image}>



                    <img src={images.instagramAlt} alt='' />



                  </div>



                </a>



              )}



            </div>



          )}



          {!!businessListings.length && (



            <div className={s.businessProducts}>



              <div className={s.title}>Business Offerings</div>



              <div className={'swiper mySwiper ' + s.swiperContainer}>



                <div className='swiper-wrapper'>



                  {businessListings.map(({ _id, listingName, images }, i) => (



                    <div



                      className={s.slide + ' swiper-slide'}



                      onClick={() => {



                        if (!!userData) {



                          if (userData.plan !== 'Plan 0') Modal.ViewListing(_id)



                          else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))



                        } else Modal.PrivacyModal()



                      }}



                      key={i}



                    >



                      <ImageTag src={IMAGE_HOST + images[0]} alt='' />



                      <div className={s.listingName}>{listingName}</div>



                    </div>



                  ))}



                </div>



                <div className='swiper-button-next'></div>



                <div className='swiper-button-prev'></div>



                <div className='swiper-pagination'></div>



              </div>



            </div>



          )}



        </div>



        <ScrollToTop />



      </div>



    ) : (



      <div className={s.noData}>



        <NoData />



      </div>



    )



  ) : (



    <div className={s.loader}>



      <Loader color='var(--c-primary)' colorText='var(--c-primary)' />



    </div>



  )



}



