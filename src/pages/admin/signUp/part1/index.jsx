import React from 'react';


import { Input } from 'components'


import s from './styles.module.scss'



export default function Main(props) {


  return (


    <div className={s.part1}>


      <div className={s.title}>Create Account</div>


      <div className={'row ' + s.name}>


        <Input.Classic


          type='text'


          iconLeft='person_outline'


          placeholder='Enter first name *'


          value={props.firstName}


          onChange={e => props.setFirstName(e.target.value)}


        />


        <Input.Classic


          type='text'


          iconLeft='person_outline'


          placeholder='Enter last name *'


          value={props.lastName}


          onChange={e => props.setLastName(e.target.value)}


        />


      </div>


      <Input.Classic


        type='number'


        iconLeft='call'


        placeholder='Enter contact number *'


        value={props.phoneNo}


        onChange={e => {


          if (e.target.value.length <= 10) props.setPhoneNo(e.target.value)


        }}


      />


      <Input.Classic


        type='text'


        iconLeft='email'


        placeholder='Enter email (optional)'


        value={props.email}


        onChange={e => props.setEmail(e.target.value)}


      />


      {props.refId.referredby && <div className={s.refLabel}>Referred By: {props.refId.referredby}</div>}


      <Input.Classic


        type='number'


        iconLeft='how_to_reg'


        placeholder='Reference code (optional)'


        value={props.refId.refId ? props.refId.refId : props.refId}


        onChange={e => {


          if (e.target.value.length <= 10) props.setRefId(e.target.value)


        }}


        disabled={props.userRefId ? true : false}


      />


    </div>


  )


}
