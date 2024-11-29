import React from 'react';


import s from './styles.module.scss'


export default function Main(props) {


  const proceedHandler = () => {


    props.proceedHandler()


    props.onCloseModal()


  }



  return (


    <div className={s.main}>


      <div className={s.confirm}>


        <div className={s.confirmInner}>


          <div className={s.title}>{props.message}</div>


          <div className={s.actionIcons}>


            <div className={s.button} onClick={props.onCloseModal}>


              <span className='material-icons-outlined'>arrow_back</span> {!props.binary ? 'Go back' : 'No'}


            </div>


            <div className={s.button} onClick={proceedHandler}>


              {!props.binary ? 'Proceed' : 'Yes'} <span className='material-icons-outlined'>arrow_forward</span>


            </div>


          </div>


        </div>


      </div>


    </div>


  )


}
