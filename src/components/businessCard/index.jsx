import React from 'react';


import { useNavigate } from 'react-router-dom'


import s from './styles.module.scss'


import images from 'images'


import { ImageTag, Modal } from 'components'


import { Encrypt } from 'helpers'


import { useSelector } from 'react-redux'



export default function Main({


  id,


  businessName,


  image,


  address,


  description,


  phoneNo,


  fkUserId,


  website,


  businessLocation


}) {


  const location = useSelector(state => state.location).location


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const navigate = useNavigate()



  return (


    <div className={s.main}>


      <div


        className={s.adCard}


        onClick={() => {


          if (!!userData) {


            if (userData.plan !== 'Plan 0') navigate('/' + location + '/' + Encrypt({ fkBusinessId: id }))


            else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


          } else Modal.PrivacyModal()


        }}


      >


        <div className={s.topCard}>


          <div className={s.left}>


            <div className={s.image}>


              <ImageTag src={image} alt='' />


            </div>


          </div>


          <div className={s.right}>


            <div>


              <div className={s.adTitle}>{businessName}</div>


              {!!businessLocation.lat && !!businessLocation.lng && (


                <div


                  className={s.directions}


                  onClick={e => {


                    e.stopPropagation()


                    if (!!userData) {


                      if (userData.plan !== 'Plan 0')


                        window.open(


                          `https://www.google.com/maps/dir/?api=1&destination=${businessLocation.lat},${businessLocation.lng}`,


                          '_blank'


                        )


                      else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                    } else Modal.PrivacyModal()


                  }}


                >


                  <span className='material-icons-outlined'>directions</span> Directions


                </div>


              )}


              {website && (


                <div


                  className={s.businessName + ' ellipsis'}


                  style={{ WebkitLineClamp: '1' }}


                  onClick={e => {


                    e.stopPropagation()


                    if (!!userData) {


                      if (userData.plan !== 'Plan 0') {


                        if (!website.startsWith('https://')) website = 'https://' + website


                        window.location.href = website


                      } else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                    } else Modal.PrivacyModal()


                  }}


                >


                  ~website: {website}


                </div>


              )}


              <div className={s.address}>{address}</div>


              <div className={s.adInfo + ' ellipsis'} style={{ WebkitLineClamp: '7' }}>


                {description}


              </div>


            </div>



            <div className={s.adInteractions} onClick={e => e.stopPropagation()}>


              <div


                className={s.phoneNo}


                onClick={() => {


                  if (!!userData) {


                    if (userData.plan !== 'Plan 0') window.location.href = `tel:+91-${phoneNo}`


                    else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                  } else Modal.PrivacyModal()


                }}


              >


                <span className='material-icons-outlined'>call</span>


                Call Us


              </div>


              <div


                className={s.whatsapp}


                onClick={() => {


                  if (!!userData) {


                    if (userData.plan !== 'Plan 0') window.open('https://wa.me/91' + phoneNo, '_blank')


                    else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                  } else Modal.PrivacyModal()


                }}


              >


                <div className={s.icon}>


                  <img src={images.whatsapp} alt='' />


                </div>


                whatsapp


              </div>


              <div


                className={s.sendInterest}


                onClick={() => {


                  if (!!userData) {


                    if (userData.plan !== 'Plan 0') Modal.QueryForm('', id, fkUserId)


                    else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                  } else Modal.PrivacyModal()


                }}


              >


                <span className='material-icons-outlined'>send</span>


                send interest


              </div>


              <div


                className={s.viewMore}


                onClick={() => {


                  if (!!userData) {


                    if (userData.plan !== 'Plan 0') navigate('/' + location + '/' + Encrypt({ fkBusinessId: id }))


                    else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                  } else Modal.PrivacyModal()


                }}


              >


                view more <span className='material-icons-outlined'>arrow_drop_down</span>


              </div>


            </div>


          </div>


        </div>


        <div className={s.bottomCard} style={{ paddingTop: '1rem' }}>


          <div className={s.adInteractions} onClick={e => e.stopPropagation()}>


            <div


              className={s.phoneNo}


              onClick={() => {


                if (!!userData) {


                  if (userData.plan !== 'Plan 0') window.location.href = `tel:+91-${phoneNo}`


                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                } else Modal.PrivacyModal()


              }}


            >


              <span className='material-icons-outlined'>call</span>


              Call Us


            </div>


            <div


              className={s.whatsapp}


              onClick={() => {


                if (!!userData) {


                  if (userData.plan !== 'Plan 0') window.open('https://wa.me/91' + phoneNo, '_blank')


                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                } else Modal.PrivacyModal()


              }}


            >


              <div className={s.icon}>


                <img src={images.whatsapp} alt='' />


              </div>


              whatsapp


            </div>


            <div


              className={s.sendInterest}


              onClick={() => {


                if (!!userData) {


                  if (userData.plan !== 'Plan 0') Modal.QueryForm('', id, fkUserId)


                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                } else Modal.PrivacyModal()


              }}


            >


              <span className='material-icons-outlined'>send</span>


              send interest


            </div>


            <div


              className={s.viewMore}


              onClick={() => {


                if (!!userData) {


                  if (userData.plan !== 'Plan 0') navigate('/' + location + '/' + Encrypt({ fkBusinessId: id }))


                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                } else Modal.PrivacyModal()


              }}


            >


              view more <span className='material-icons-outlined'>arrow_drop_down</span>


            </div>


          </div>


        </div>


      </div>


    </div>


  )


}
