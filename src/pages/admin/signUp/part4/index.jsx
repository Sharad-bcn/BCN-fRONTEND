import React from 'react';







import { Input } from 'components'



import s from './styles.module.scss'



import { useState } from 'react'







export default function Main(props) {



  const [visible, setVisible] = useState(false)



  const [confirmVisible, setConfirmVisible] = useState(false)







  return (



    <div className={s.part4}>



      <div className={s.title}>Create Pin</div>



      <Input.Classic



        iconLeft='pin'



        placeholder='Enter Pin (6 Digits)'



        type={visible ? 'number' : 'password'}



        iconRight={!visible ? 'visibility' : 'visibility_off'}



        onRightIconClick={() => setVisible(!visible)}



        value={props.pin}



        onChange={e => {



          if (e.target.value.length <= 6) props.setPin(e.target.value)



        }}



      />



      <div className={s.confirm}>



        <Input.Classic



          iconLeft='pin'



          placeholder='Confirm Pin'



          type={confirmVisible ? 'number' : 'password'}



          iconRight={!confirmVisible ? 'visibility' : 'visibility_off'}



          onRightIconClick={() => setConfirmVisible(!confirmVisible)}



          value={props.confirmPin}



          onChange={e => {



            if (e.target.value.length <= 6) props.setConfirmPin(e.target.value)



          }}



        />



        {props.pin &&



          props.confirmPin &&



          (props.pin === props.confirmPin ? (



            <span className='material-icons' style={{ color: 'var(--c-green)' }}>



              check_circle



            </span>



          ) : (



            <span className='material-icons' style={{ color: 'var(--c-red)' }}>



              cancel



            </span>



          ))}



      </div>



    </div>



  )



}



