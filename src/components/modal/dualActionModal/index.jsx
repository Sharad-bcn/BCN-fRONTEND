import React from 'react';







import s from './styles.module.scss'



export default function Main(props) {



  const proceedHandler = () => {



    props.proceedHandler()



    props.onCloseModal()



  }



  const backHandler = () => {



    props.backHandler()



    props.onCloseModal()



  }







  return (



    <div className={s.main}>



      <div className={s.confirm}>



        <div className={s.confirmInner}>



          <div className={s.title}>{props.message}</div>



          <div className={s.actionIcons}>



            <div className={s.button} onClick={backHandler}>



              <span className='material-icons-outlined'>arrow_back</span> Go back



            </div>



            <div className={s.button} onClick={proceedHandler}>



              Proceed <span className='material-icons-outlined'>arrow_forward</span>



            </div>



          </div>



        </div>



      </div>



    </div>



  )



}



