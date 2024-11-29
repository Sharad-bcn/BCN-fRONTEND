import React from 'react';


import s from './styles.module.scss'



export default function Main(props) {


  return (


    <div className={s.planCard} onClick={() => props.setPlan(props.name)}>


      <div className={s.left}>


        <div className={s.radio}>


          <div className={props.name === props.plan ? s.active : ''}></div>


        </div>


        <div className={s.duration}>{props.duration} Subscription</div>


      </div>


      <div className={s.right}>


        {props.discount && <div className={s.mrp}> ₹{parseInt(props.discount) + parseInt(props.price)}</div>}


        <div className={s.price}>₹{props.price}</div>


      </div>


    </div>


  )


}
