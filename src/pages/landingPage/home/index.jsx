import React from 'react';


import { Location, ScrollToTop, Search } from 'components'


import s from './styles.module.scss'


import { Encrypt, head } from 'helpers'


import { useEffect } from 'react'


import images from 'images'


import Banners from './banners'


import UserData from './userData'


import Services from './services'


import Trending from './trending'


import SuccessStories from './successStories'


import Locations from './locations'


const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL



export default function Main() {


  const userData = JSON.parse(window.localStorage.getItem('userData'))



  useEffect(() => {


    head({})


  }, [])



  return (


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


                      PUBLIC_URL + '/signUp?refId=' + Encrypt({ refId: userData.userRefId, referredby: userData.name })


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


                    ({userData.referredUsersCount + (userData.referredUsersCount === 1 ? ' user ' : ' users ')}


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


      <Banners />


      <UserData />


      <Trending />


      <Services />


      <div className={s.show}>


        <img src={images.back1} alt='' />


      </div>


      <SuccessStories />


      <Locations />


      <ScrollToTop />


    </div>


  )


}
