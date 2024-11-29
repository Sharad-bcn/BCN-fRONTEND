import React from 'react';


import { useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'


import { head } from 'helpers'


import { Alert, Layouts, Modal } from 'components'


import { useNavigate } from 'react-router-dom'


import * as api from 'api'



export default function Main() {


  const processing = useRef()


  const navigate = useNavigate()


  const [loading, setLoading] = useState(false)


  const userData = JSON.parse(window.localStorage.getItem('userData'))



  useEffect(() => {


    head({ title: 'SignOut | BCN' })


  }, [])



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


          navigate('/', { replace: true })


        } else Alert.error(logOut.message)



        setLoading(false)


        processing.current = false


      },


      true


    )


  }



  return (


    <div className={s.main}>


      <div className={s.settings}>


        {/* <div className={s.header}> */}


        <Layouts.Classic title='SignOut' />


        {/* </div> */}


        <div className={s.content + ' innerScrollX'}>


          <div className={s.loggedUser}>{userData.name}</div>


          <div


            className={s.logOutButton}


            onClick={loading ? () => {} : logOutHandler}


            style={{ opacity: loading ? '0.8' : '1' }}


          >


            <span className='material-icons-outlined'>logout</span>


            <span className={s.button}>{loading ? 'Logging Out' : 'Sign Out'}</span>


          </div>


        </div>


      </div>


    </div>


  )


}



// const Setting = props => {


//   const setting = (


//     <div className={s.setting} style={{ borderColor: props.color }}>


//       <div className={s.settingName}>{props.settingName}</div>


//       <span


//         className={props.filledIcon ? 'material-icons' : 'material-icons-outlined'}


//         onClick={props.onClick ? props.onClick : () => {}}


//         style={{ color: props.color }}


//       >


//         {props.iconName}


//       </span>


//     </div>


//   )


//   return props.link ? <Link to={props.link}>{setting}</Link> : setting


// }
