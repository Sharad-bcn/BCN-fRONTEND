import React from 'react';


import { timeFormat } from 'helpers'


import s from './styles.module.scss'


import images from 'images'


import { useState } from 'react'



export default function Main({ LeadsData }) {


  return (


    <div className={s.main}>


      <div className={s.table}>


        <div className={s.tableHeading}>


          <div className={s.srNo}>Id</div>


          <div className={s.contactPerson}>Contact Person</div>


          <div className={s.contact}>Contact</div>


          <div className={s.email}>E-mail</div>


          <div className={s.state}>State</div>


          <div className={s.city}>City</div>


          <div className={s.actions}>Actions</div>


        </div>


        <div className={s.tableBody}>


          {LeadsData.map(({ contactPerson, phoneNo, email, createdAt, state, city, query }, i) => (


            <TableRow


              contactPerson={contactPerson}


              phoneNo={phoneNo}


              email={email}


              createdAt={createdAt}


              state={state}


              city={city}


              query={query}


              index={i}


              key={i}


            />


          ))}


        </div>


      </div>


    </div>


  )


}



const TableRow = ({ contactPerson, phoneNo, email, createdAt, state, city, query, index }) => {


  const [isExpanded, setIsExpanded] = useState(false)



  return (


    <>


      <div


        className={s.tableRow}


        style={{


          borderBottomLeftRadius: isExpanded && '0',


          borderBottomRightRadius: isExpanded && '0',


          boxShadow: isExpanded && '2px 4px 15px var(--c-primary-light)'


        }}


      >


        <div className={s.srNo}>{index + 1}</div>


        <div className={s.contactPerson}>{contactPerson}</div>


        <div className={s.contact}>{phoneNo}</div>


        <a className={s.email} href={'mailto:' + email}>


          {email}


        </a>


        {!!query && (


          <span className={s.expand + ' material-icons-outlined'} onClick={() => setIsExpanded(!isExpanded)}>


            {isExpanded ? 'expand_less' : 'expand_more'}


          </span>


        )}


        <div className={s.state}>{state}</div>


        <div className={s.city}>{city}</div>


        <div className={s.actions}>


          <a href={'tel:+91' + phoneNo}>


            <span className='material-icons-outlined'>call</span>


          </a>


          <a href={'https://wa.me/91' + phoneNo} target='_blank' rel='noreferrer'>


            <img src={images.whatsapp} alt='' />


          </a>


        </div>


        <div className={s.createdAt}>{timeFormat(createdAt)}</div>


      </div>


      {!!isExpanded && <div className={s.query}>{query}</div>}


    </>


  )


}
