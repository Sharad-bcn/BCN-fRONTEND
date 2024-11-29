import React from 'react';


import { useLocation, useNavigate } from 'react-router-dom'


import s from './styles.module.scss'



export default function Main(props) {


  const navigate = useNavigate()


  const location = useLocation()



  return (


    <div className={s.main}>


      <div className={s.confirm}>


        <div className={s.confirmInner}>


          <div className={s.title}>Register Now or Login to Continue</div>


          <div className={s.actionIcons}>


            <div


              className={s.button}


              onClick={() => {


                navigate('/login', { state: location })


                props.onCloseModal()


              }}


            >


              <span className='material-icons-outlined'>login</span> Login


            </div>


            <div


              className={s.button}


              onClick={() => {


                navigate('/signUp')


                props.onCloseModal()


              }}


            >


              Register Now <span className='material-icons-outlined'>app_registration</span>


            </div>


          </div>


        </div>


      </div>


      <span className={'material-icons-outlined ' + s.close} onClick={props.onCloseModal}>


        cancel


      </span>


    </div>


  )


}
