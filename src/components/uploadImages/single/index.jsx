import React from 'react';


import { ImageTag } from 'components'


import s from './styles.module.scss'



export default function Main(props) {


  return (


    <div className={s.main}>


      <div className={s.image}>


        <div className={s.imageActions} title='Upload Image'>


          <label htmlFor='imageUpload' className={s.uploadButton}>


            <span className='material-icons-outlined'>photo_camera</span>


          </label>


          <input


            type='file'


            id='imageUpload'


            accept='image/*'


            onChange={props.handleUserLogoChange}


            style={{ display: 'none' }}


          />


        </div>


        <ImageTag src={props.userLogoUrl} alt='' />


      </div>


    </div>


  )


}
