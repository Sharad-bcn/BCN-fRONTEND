import React from 'react';


import s from './styles.module.scss'



export default function Main({ id, field, image, selectedField, setSelectedField }) {


  return (


    <div className={s.outer}>


      <div


        className={selectedField._id === id ? s.serviceField + ' ' + s.active : s.serviceField}


        onClick={setSelectedField}


        title={field}


      >


        <div>


          <img src={image} alt='' />


        </div>


        <div>{field}</div>


      </div>


      <div className={selectedField._id === id ? s.icon + ' ' + s.activeIcon : s.icon}>


        <span className='material-icons'>{selectedField._id === id ? 'check_circle' : 'add_circle_outline'}</span>


      </div>


    </div>


  )


}
