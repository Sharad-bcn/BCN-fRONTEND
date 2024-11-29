import React from 'react';


import { Link } from 'react-router-dom'


import s from './styles.module.scss'


import images from 'images'



export default function Main({ fullscreen, setFullscreen }) {


  return (


    <>


      <div id='nav' className={s.outernav}>


        <nav className={s.nav}>


          <div className={s.left}>


            <Link to='/home'>


              <img src={images.logoWhite} alt='' />


            </Link>


          </div>



          <div className={s.right}>


            <NavLinks />


          </div>


        </nav>


      </div>



      {!!fullscreen && (


        <div className={s.fullscreenMenu} onClick={() => setFullscreen(false)}>


          <div className={s.close + ' material-icons'}>close</div>


          <NavLinks />


        </div>


      )}



      <div className={s.hamburger + ' material-icons'} onClick={() => setFullscreen(true)}>


        menu


      </div>


    </>


  )


}



const NavLinks = () => (


  <div className={s.navLinks}>


    {navLinks.map(({ name, path, icon }, i) => (


      <Link key={i} to={path} className={window.location.pathname.startsWith(path) ? s.active : ''} title={name}>


        <span className='material-icons-outlined'>{icon}</span>


        <div className={s.fieldName}>{name}</div>


      </Link>


    ))}


  </div>


)



const navLinks = [


  {


    name: 'Home',


    path: '/home',


    icon: 'home'


  },


  {


    name: 'Notifications',


    path: '/userAdmin/notifications',


    icon: 'notifications'


  },


  {


    name: 'My Business',


    path: '/userAdmin/businesses',


    icon: 'business'


  },


  {


    name: 'Edit Profile',


    path: '/userAdmin/editProfile',


    icon: 'person_outline'


  },


  {


    name: 'Membership Card',


    path: '/userAdmin/memberShipCard',


    icon: 'badge'


  },


  {


    name: 'Sign Out',


    path: '/userAdmin/signOut',


    icon: 'logout'


  }


]
