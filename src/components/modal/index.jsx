import React from 'react';


import s from './styles.module.scss'


import QueryForm from './queryForm'


import Confirm from './confirm'


import ViewListing from './viewListing'


import PrivacyModal from './privacyModal'


import DualActionModal from './dualActionModal'



import { useState } from 'react'



var $obj, $setObj, $setVisible



const commonHandler = obj => {


  $setObj(obj)


  $setVisible(true)


  document.body.style.overflow = 'hidden'


}



const onCloseModal = () => {


  $setVisible(false)


  $setObj({})


  document.body.style.overflow = 'unset'


}



window.onclick = function (event) {


  if (event.target === document.getElementById('myModal') && $obj.title !== 'Dual Action') onCloseModal()


}



const Main = {


  QueryForm: (id = '', fkBusinessId = '', fkUserId = '') => {


    const obj = { title: 'Query Form', id, fkBusinessId, fkUserId }


    commonHandler(obj)


  },


  Confirm: (message = '', proceedHandler = () => {}, binary = false) => {


    const obj = { message, title: 'Confirm', proceedHandler, binary }


    commonHandler(obj)


  },


  ViewListing: (id = '') => {


    const obj = { title: 'View Listing', id }


    commonHandler(obj)


  },


  PrivacyModal: () => {


    const obj = { title: 'Privacy' }


    commonHandler(obj)


  },


  DualActionModal: (message = '', proceedHandler = () => {}, backHandler = () => {}) => {


    const obj = { message, title: 'Dual Action', proceedHandler, backHandler }


    commonHandler(obj)


  }


}



Main.Component = function Component() {


  const [obj, setObj] = useState({})


  const [visible, setVisible] = useState(false)



  $obj = obj


  $setObj = setObj


  $setVisible = setVisible



  const onClose = () => {


    setObj({})


    onCloseModal()


  }



  return (


    <div className={s.main} style={{ display: visible ? 'flex' : 'none' }} id='myModal'>


      {obj.title === 'Query Form' && (


        <QueryForm id={obj.id} fkBusinessId={obj.fkBusinessId} fkUserId={obj.fkUserId} onCloseModal={onClose} />


      )}


      {obj.title === 'Confirm' && (


        <Confirm message={obj.message} proceedHandler={obj.proceedHandler} binary={obj.binary} onCloseModal={onClose} />


      )}


      {obj.title === 'View Listing' && <ViewListing id={obj.id} onCloseModal={onClose} />}


      {obj.title === 'Privacy' && <PrivacyModal onCloseModal={onClose} />}



      {obj.title === 'Dual Action' && (


        <DualActionModal


          message={obj.message}


          proceedHandler={obj.proceedHandler}


          backHandler={obj.backHandler}


          onCloseModal={onClose}


        />


      )}


    </div>


  )


}



export default Main
