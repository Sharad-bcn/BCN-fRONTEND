import React from 'react';


import { Link, useLocation, useNavigate } from 'react-router-dom'


import s from './styles.module.scss'


import images from 'images'


import { useRef, useState } from 'react'


import { Alert, ImageTag, Modal } from 'components'


import * as api from 'api'


import { Encrypt } from 'helpers'


import { useSelector } from 'react-redux'



export default function Main({


  id,


  title,


  image,


  address,


  adInfo,


  businessName,


  phoneNo,


  isAdmin,


  views = 0,


  status,


  isActive,


  isApproved,


  leads = 0,


  postedOn,


  fkUserId,


  fkBusinessId,


  rejectionMessage,


  deleteHandler


}) {


  const [adStatus, setAdStatus] = useState(isActive)


  const [adStatusInfo, setAdStatusInfo] = useState(status)


  const processing = useRef(false)


  const location = useSelector(state => state.location).location


  const userData = JSON.parse(window.localStorage.getItem('userData'))


  const navigate = useNavigate()


  const urlLocation = useLocation()



  const statusHandler = async () => {


    if (processing.current) return


    processing.current = true



    const toggleListingStatus = await api.userAdmin.listing.toggleListingStatus({ id })



    if (toggleListingStatus.code === 201) {


      const sendNotification = await api.userAdmin.notification.create({


        notification: title + ' status is marked ' + (toggleListingStatus.payload.status ? 'public' : 'private'),


        redirect: Encrypt({ path: urlLocation.pathname })


      })



      if (sendNotification.code === 201) {


      } else {


        //   Alert.error(sendNotification.message)


      }


      setAdStatus(toggleListingStatus.payload.status)


      setAdStatusInfo(toggleListingStatus.payload.status ? 'active' : 'inactive')


      adStatus ? Alert.warn(title + ' is marked private') : Alert.success(title + ' is marked public')


    } else {


      Alert.error(toggleListingStatus.message)


    }


    processing.current = false


  }



  return (


    <div className={s.main}>


      <div


        className={isAdmin ? s.adCardAlt + ' ' + s.adCard : s.adCard}


        style={{


          border:


            isAdmin &&


            (adStatusInfo === 'active'


              ? '0.1rem solid var(--c-primary)'


              : adStatusInfo === 'pending'


              ? '0.1rem solid var(--c-primary)'


              : '0.1rem solid var(--c-red)'),


          marginBottom: !!isAdmin && adStatusInfo === 'rejected' && '0',


          borderBottomLeftRadius: !!isAdmin && adStatusInfo === 'rejected' && '0',


          borderBottomRightRadius: !!isAdmin && adStatusInfo === 'rejected' && '0'


        }}


        onClick={


          !isAdmin


            ? () => {


                if (!!userData) {


                  if (userData.plan !== 'Plan 0') Modal.ViewListing(id)


                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                } else Modal.PrivacyModal()


              }


            : () => {}


        }


      >


        <div className={s.topCard}>


          <div className={isAdmin ? s.leftAlt + ' ' + s.left : s.left}>


            <div className={isAdmin ? s.imageAlt + ' ' + s.image : s.image}>


              <ImageTag src={image} alt='' />


            </div>


            {isAdmin && (


              <div className={s.postedOn}>


                Posted On:


                <br /> {postedOn}


              </div>


            )}


          </div>


          <div className={isAdmin ? s.rightAlt + ' ' + s.right : s.right}>


            <div>


              <div className={s.adTitle}>{title}</div>


              <div


                className={s.businessName}


                onClick={e => {


                  e.stopPropagation()


                  if (!!userData) {


                    if (userData.plan !== 'Plan 0') navigate('/' + location + '/' + Encrypt({ fkBusinessId }))


                    else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                  } else Modal.PrivacyModal()


                }}


              >


                ~by: {businessName}


              </div>


              <div className={s.address}>{address}</div>


              <div className={s.adInfo + ' ellipsis'} style={{ WebkitLineClamp: isAdmin ? '3' : '7' }}>


                {adInfo}


              </div>


            </div>


            {!isAdmin && (


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


                      if (userData.plan !== 'Plan 0') Modal.QueryForm(id, '', fkUserId)


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


                      if (userData.plan !== 'Plan 0') Modal.ViewListing(id)


                      else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                    } else Modal.PrivacyModal()


                  }}


                >


                  view more <span className='material-icons-outlined'>arrow_drop_down</span>


                </div>


              </div>


            )}


            {!!isAdmin && (


              <>


                <div className={s.actionIcons}>


                  {!!isApproved && (


                    <div title={!adStatus ? 'Mark Active' : 'Mark InActive'} onClick={statusHandler}>


                      <span


                        className={'material-icons ' + s.iconSpan}


                        style={{ color: adStatus ? 'var(--c-green)' : 'var(--c-red)' }}


                      >


                        {adStatus ? 'toggle_on' : 'toggle_off'}


                      </span>


                    </div>


                  )}


                  <Link title='Edit Offering' to={'./editListing/' + Encrypt({ id })}>


                    <span className='material-icons-outlined'>edit</span>


                  </Link>


                  <div


                    title='Delete Offering'


                    onClick={() => Modal.Confirm('Are u sure u want to delete your Offering?', () => deleteHandler(id))}


                  >


                    <span className='material-icons-outlined'>delete</span>


                  </div>


                </div>


                <div className={s.adInteractions}>


                  <div className={s.views}>


                    <span className={'material-icons-outlined ' + s.iconSpan}>visibility</span> Views:&nbsp;


                    <span>{views}</span>


                  </div>


                  <div


                    className={s.status}


                    style={{


                      backgroundColor:


                        adStatusInfo === 'active'


                          ? 'var(--c-green)'


                          : adStatusInfo === 'pending'


                          ? 'var(--c-orange)'


                          : 'var(--c-red)'


                    }}


                    title={'Offering status is ' + adStatusInfo}


                  >


                    <span className={'material-icons ' + s.iconSpan}>timeline</span>


                    Status:&nbsp;


                    <span>{adStatusInfo}</span>


                  </div>


                  <div className={s.leads}>


                    <span className={'material-icons-outlined ' + s.iconSpan}>leaderboard</span> Leads:&nbsp;


                    <span>{leads}</span>


                  </div>


                  <Link


                    className={s.viewLeads}


                    to={'/userAdmin/businesses/listings/viewLeads/' + Encrypt({ listingId: id, listingName: title })}


                  >


                    View Leads


                    <span className={'material-icons-outlined ' + s.iconSpan}>visibility</span>


                  </Link>


                </div>


              </>


            )}


          </div>


        </div>


        <div className={s.bottomCard} style={{ paddingTop: isAdmin ? '0.5rem' : '1rem' }}>


          {!isAdmin && (


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


                    if (userData.plan !== 'Plan 0') Modal.QueryForm(id, '', fkUserId)


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


                    if (userData.plan !== 'Plan 0') Modal.ViewListing(id)


                    else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                  } else Modal.PrivacyModal()


                }}


              >


                view more <span className='material-icons-outlined'>arrow_drop_down</span>


              </div>


            </div>


          )}


          {!!isAdmin && (


            <>


              <div className={s.adInteractions}>


                <div className={s.views}>


                  <span className={'material-icons-outlined ' + s.iconSpan}>visibility</span> Views:&nbsp;


                  <span>{views}</span>


                </div>


                <div


                  className={s.status}


                  style={{


                    backgroundColor:


                      adStatusInfo === 'active'


                        ? 'var(--c-green)'


                        : adStatusInfo === 'pending'


                        ? 'var(--c-orange)'


                        : 'var(--c-red)'


                  }}


                  title={'Offering is ' + adStatusInfo}


                >


                  <span className={'material-icons ' + s.iconSpan}>timeline</span>


                  Status:&nbsp;


                  <span>{adStatusInfo}</span>


                </div>


                <div className={s.leads}>


                  <span className={'material-icons-outlined ' + s.iconSpan}>leaderboard</span> Leads:&nbsp;


                  <span>{leads}</span>


                </div>


                <Link


                  className={s.viewLeads}


                  to={'/userAdmin/businesses/listings/viewLeads/' + Encrypt({ listingId: id, listingName: title })}


                >


                  View Leads


                  <span className={'material-icons-outlined ' + s.iconSpan}>visibility</span>


                </Link>


              </div>


            </>


          )}


        </div>


      </div>


      {!!isAdmin && adStatusInfo === 'rejected' && (


        <div className={s.rejectedMessage}>


          <div className={s.title}>


            This Offering is rejected, please comply with the following and update accordingly.


          </div>


          {rejectionMessage}


        </div>


      )}


    </div>


  )


}
