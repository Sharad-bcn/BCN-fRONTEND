import React from 'react';


import { Link, useLocation } from 'react-router-dom'


import { Alert, Modal } from 'components'


import images from 'images'


import s from './styles.module.scss'


import { useEffect, useRef, useState } from 'react'


import * as api from 'api'


const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



export default function Main({ fullscreen, setFullscreen }) {


  const [isScrolled, setIsScrolled] = useState(false)


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const location = useLocation()



  useEffect(() => {


    const handleScroll = () => {


      if (window.scrollY > 0) {


        setIsScrolled(true)


      } else {


        setIsScrolled(false)


      }


    }



    window.addEventListener('scroll', handleScroll)



    return () => {


      window.removeEventListener('scroll', handleScroll)


    }


  }, [])



  return (


    <div id='nav' className={isScrolled ? s.outerNav + ' ' + s.outerNavScrolled : s.outerNav}>


      <nav className={isScrolled ? s.nav + ' ' + s.scrolled : s.nav}>


        <div className={s.left}>


          <Link to='/home'>


            <img src={images.logo} alt='' />


          </Link>


        </div>



        <div className={s.right}>


          <NavLinks isScrolled={isScrolled} />


        </div>



        <div className={s.mobileLinks}>


          {!userData && (


            <Link to='/signUp' className={s.highlight}>


              Register Now


            </Link>


          )}


          {!userData && (


            <Link to='/login' state={location}>


              Login


            </Link>


          )}



          <div className={s.hamburger + ' material-icons'} onClick={() => setFullscreen(true)}>


            menu


          </div>


        </div>


      </nav>



      {!!fullscreen && (


        <div


          className={s.fullscreenMenu}


          onClick={() => {


            setFullscreen(false)


          }}


        >


          <div className={s.close + ' material-icons'}>close</div>


          <NavLinks fullScreen />


        </div>


      )}


    </div>


  )


}



const NavLinks = props => {


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const processing = useRef()


  const [loading, setLoading] = useState(false)


  const location = useLocation()



  const logOutHandler = async () => {


    Modal.Confirm(


      'Are you sure you want to logout?',


      async () => {


        if (processing.current) return


        processing.current = true


        setLoading(true)


        Alert.success('Logging Out...')



        const logOut = await api.auth.user.logOut({})



        if (logOut.code === 201) {


          window.localStorage.removeItem('authorization')


          window.localStorage.removeItem('userData')


          window.localStorage.removeItem('planStatusShownDate')


          Alert.success('Thanks for visting BCN, Would be happy to serve you again!')



          window.location.reload()


        } else Alert.error(logOut.message)



        setLoading(false)


        processing.current = false


      },


      true


    )


  }



  return (


    <div className={s.navLinks}>


      {navLinks.map(({ name, path }, i) =>


        path === '/signUp' ? (


          !userData &&


          !props.fullScreen && (


            <Link key={i} to={path} className={window.location.pathname.startsWith(path) ? s.active : s.highlight}>


              <div>{name}</div>


            </Link>


          )


        ) : path === '/userAdmin/businesses' ? (


          !!userData && (


            <Link


              key={i}


              to={path}


              className={window.location.pathname.startsWith(path) ? s.active + ' ' + s.highlight : ' ' + s.highlight}


            >


              <div>{name}</div>


            </Link>


          )


        ) : (


          <Link key={i} to={path} className={window.location.pathname.startsWith(path) ? s.active : ''}>


            <div>{name}</div>


          </Link>


        )


      )}



      {/* {!!userData && (


        <Link to='/userAdmin/businesses' className={s.responsiveLinks + ' ' + s.highlight}>


          My Businesses


        </Link>


      )} */}


      {!!userData && (


        <Link to='/userAdmin/editProfile' className={s.responsiveLinks}>


          Edit Profile


        </Link>


      )}


      {!!userData && (


        <Link to='/userAdmin/memberShipCard' className={s.responsiveLinks}>


          Membership Card


        </Link>


      )}


      {!!userData && (


        <Link


          to={userData.plan === 'Plan 0' ? '/userAdmin/subscriptionInfo' : '/userAdmin/subscription'}


          className={s.responsiveLinks}


        >


          My Subscription


        </Link>


      )}


      {!!userData && (


        <Link to='/userAdmin/notifications' className={s.responsiveLinks}>


          Notifications


        </Link>


      )}


      {!!userData && (


        <div className={s.responsiveLinks + ' ' + s.logOut} onClick={loading ? () => {} : logOutHandler}>


          Logout


        </div>


      )}


      {!userData && (


        <Link to='/' className={s.responsiveLinks}>


          Help


        </Link>


      )}


      {!userData && !props.fullScreen && (


        <Link to='/login' state={location} className={s.responsiveLinks}>


          Login


        </Link>


      )}



      <div className={s.user}>


        <div className={s.logo} title={!!userData ? userData.name : ''}>


          <img src={!!userData && userData.logo ? IMAGE_HOST + userData.logo : images.Profile} alt='' />


        </div>



        <div className={s.hoverLinks}>


          <div className={s.hoverInner} style={{ marginTop: props.isScrolled ? '2.5rem' : '3rem' }}>


            {/* {!!userData && (


              <Link to='/userAdmin/businesses' className={s.highlight}>


                My Businesses


              </Link>


            )} */}


            {!!userData && <Link to='/userAdmin/editProfile'>Edit Profile</Link>}


            {!!userData && <Link to='/userAdmin/memberShipCard'>Membership Card</Link>}


            {!!userData && (


              <Link to={userData.plan === 'Plan 0' ? '/userAdmin/subscriptionInfo' : '/userAdmin/subscription'}>


                My Subscription


              </Link>


            )}


            {!!userData && <Link to='/userAdmin/notifications'>Notifications</Link>}


            {!!userData && (


              <div className={s.login} onClick={loading ? () => {} : logOutHandler}>


                Logout


              </div>


            )}


            {!userData && <Link to='/'>Help</Link>}


            {!userData && (


              <Link to='/login' state={location} className={s.login}>


                Login


              </Link>


            )}


          </div>


        </div>


      </div>


    </div>


  )


}



const navLinks = [


  {


    name: 'Home',


    path: '/home',


    icon: 'home'


  },


  {


    name: 'Register Now',


    path: '/signUp',


    icon: 'app_registration'


  },



  // {


  //   name: 'List Business',


  //   path: '/listBusiness'


  // },


  {


    name: 'My Business',


    path: '/userAdmin/businesses',


    icon: 'business'


  },


  // {


  //   name: 'Jobs',


  //   path: '/jobs',


  //   icon: 'work'


  // },


  // {


  //   name: 'Matrimonial',


  //   path: '/matrimonial',


  //   icon: 'diversity_1'


  // },


  {


    name: 'About Us',


    path: '/aboutUs',


    icon: 'description'


  },


  {


    name: 'Contact Us',


    path: '/contactUs',


    icon: 'contact_support'


  }


]
