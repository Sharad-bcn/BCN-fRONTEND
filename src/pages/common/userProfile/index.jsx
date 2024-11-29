import React from 'react';


import s from './styles.module.scss'


import { Decrypt, Encrypt, head } from 'helpers'


import { useCallback, useEffect, useRef, useState } from 'react'


import { Alert, BusinessCard, ImageTag, Loader, Modal, NoData } from 'components'


import * as api from 'api'


import { Location, ScrollToTop, Search } from 'components'


import { useNavigate, useParams } from 'react-router-dom'


import images from 'images'


// import { useSelector } from 'react-redux'


const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL


const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



export default function Main() {


  const [loading, setLoading] = useState(false)


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const [user, setUser] = useState('')


  const [userBusinesses, setUserBusinesses] = useState([])


  const navigate = useNavigate()


  // const location = useSelector(state => state.location).location


  const processing = useRef(false)


  let { fkUserId } = useParams()


  fkUserId = Decrypt(fkUserId).fkUserId



  useEffect(() => {


    head({


      title: (user ? user.firstName + ' ' + user.lastName + ' Profile' : 'User Profile') + ' | BCN'


    })


  }, [user])



  const getUser = useCallback(async () => {


    if (processing.current) return


    processing.current = true



    setLoading(true)



    const fetchUser = await api.publicApi.user.fetch({


      id: fkUserId


    })



    if (fetchUser.code === 201) {


      setUser(fetchUser.payload.user)


    } else {


      if (fetchUser.code === 400) Alert.error('User Profile is not available right now')


    }


    processing.current = false


    setLoading(false)


  }, [fkUserId])



  useEffect(() => {


    getUser()


  }, [getUser])



  const getUserBusinesses = useCallback(async () => {


    if (processing.current) return


    processing.current = true



    setLoading(true)



    const fetchUserBusinesses = await api.publicApi.business.fetchProfileBusinesses({


      fkUserId


    })



    if (fetchUserBusinesses.code === 200) {


      setUserBusinesses(fetchUserBusinesses.payload.getBusiness)


    } else {


      Alert.error(fetchUserBusinesses.message)


    }


    processing.current = false


    setLoading(false)


  }, [fkUserId])



  useEffect(() => {


    if (user) getUserBusinesses()


  }, [user, getUserBusinesses])



  return !loading ? (


    !!user ? (


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


        <div className={s.userProfile + ' indent'}>


          <div className={s.userInfoOuter}>


            <div className={s.title}>User Details</div>


            <div className={s.userInfo}>


              <div className={s.left}>


                <div className={s.userName}>


                  <span>Name:</span>


                  {user.firstName + ' ' + user.lastName}


                </div>


                <a className={s.email} href={'mailto:' + user.email}>


                  <span>Email:</span>


                  {user.email}


                </a>


                <div className={s.refId}>


                  <span>Reference Id:</span>


                  {user.userRefId}


                </div>


                <div className={s.state}>


                  <span>State:</span>


                  {user.state}


                </div>


                <div className={s.city}>


                  <span>City:</span>


                  {user.city}


                </div>


              </div>


              <div className={s.right}>


                <div className={s.logo}>


                  <ImageTag src={IMAGE_HOST + user.logo} alt='' />


                </div>


              </div>


            </div>


            <div className={s.userInteractions} onClick={e => e.stopPropagation()}>


              <div


                className={s.phoneNo}


                onClick={() => {


                  if (!!userData) {


                    if (userData.plan !== 'Plan 0') window.location.href = `tel:+91-${user.phoneNo}`


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


                    if (userData.plan !== 'Plan 0') window.open('https://wa.me/91' + user.phoneNo, '_blank')


                    else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                  } else Modal.PrivacyModal()


                }}


              >


                <div className={s.icon}>


                  <img src={images.whatsapp} alt='' />


                </div>


                whatsapp


              </div>


              {/* <div


                className={s.sendInterest}


                onClick={


                  () => {}


                  //   Modal.QueryForm()


                }


              >


                <span className='material-icons-outlined'>send</span>


                send interest


              </div> */}


              <div


                className={s.share}


                onClick={async () => {


                  await navigator.share({


                    title: 'BCN-India',


                    text: (user.firstName + ' ' + user.lastName + ' Profile' || 'User Profile') + ' | BCN',


                    url: window.location.href


                  })


                }}


              >


                Share <span className='material-icons-outlined'>share</span>


              </div>


            </div>


          </div>


          <div className={s.userBusinessesOuter}>


            <div className={s.title}>User Businesses Details</div>


            <div className={s.userBusinesses}>


              {userBusinesses.map(


                ({ _id, businessName, description, address, images, phoneNo, website, fkUserId, location }, i) => (


                  <BusinessCard


                    id={_id}


                    businessName={businessName}


                    description={description}


                    address={address}


                    image={IMAGE_HOST + images[0]}


                    website={website}


                    businessLocation={{


                      lat: location.coordinates[1],


                      lng: location.coordinates[0]


                    }}


                    fkUserId={fkUserId}


                    phoneNo={phoneNo}


                    key={i}


                  />


                )


              )}


            </div>


          </div>


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



// const BusinessCard = props => (


//   <Link className={s.businessCard} to={'/' + props.location + '/' + Encrypt({ fkBusinessId: props._id })}>


//     <div className={s.image}>


//       <ImageTag src={IMAGE_HOST + props.images[0]} alt='' />


//     </div>


//     <div className={s.businessInfo}>


//       <div className={s.businessName}>{props.businessName}</div>


//       <div className={s.address}>{props.address}</div>


//       <div className={s.description + ' ellipsis'}>{props.description}</div>


//     </div>


//   </Link>


// )
