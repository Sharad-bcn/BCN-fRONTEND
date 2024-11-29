import React from 'react';


import s from './styles.module.scss'



export default function Main(props) {


  return (


    <div className={s.main}>


      {!!props.label && <label className={s.label}>{props.label}</label>}


      <div className={s.textField}>


        {props.iconLeft && (


          <span className={(props.isFilled ? 'material-icons ' : 'material-icons-outlined ') + s.iconLeft}>


            {props.iconLeft}


          </span>


        )}


        <textarea


          className={s.textarea}


          rows='5'


          cols='50'


          placeholder={props.placeholder}


          value={props.value}


          onChange={props.onChange}


          autoComplete='off'


        />


      </div>


    </div>


  )


}
