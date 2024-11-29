import React from 'react';


import { ImageTag, Modal } from 'components'


import s from './styles.module.scss'


import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api' //Marker


import { useEffect, useState } from 'react'


import { useNavigate } from 'react-router-dom'



export default function Main({ defaultLocation, userBusinessLocations = [] }) {


  const [map, setMap] = useState(null)


  const mediaMatch = window.matchMedia('(max-width: 1279px)')


  const [matches, setMatches] = useState(mediaMatch.matches)


  const userData = JSON.parse(window.localStorage.getItem('userData'))



  useEffect(() => {


    const handler = e => setMatches(e.matches)


    mediaMatch.addEventListener('change', handler)


    return () => mediaMatch.removeEventListener('change', handler)


  })



  const mapContainerStyle = {


    width: '100%',


    height: '100% '


  }



  return (


    <div className={s.main}>


      <GoogleMap


        mapContainerStyle={mapContainerStyle}


        center={defaultLocation || { lat: 20.5937, lng: 78.9629 }}


        zoom={defaultLocation ? 12 : matches ? 4 : 4.75} // Default zoom level


        onLoad={map => setMap(map)}


        onClick={() => {}}


      >


        {userBusinessLocations.length && <Markers userBusinessLocations={userBusinessLocations} userData={userData} />}



        {!!map && (


          <button


            onClick={() => {


              map.panTo(defaultLocation || { lat: 20.5937, lng: 78.9629 })


              map.setZoom(defaultLocation ? 12 : matches ? 4 : 4.75)


            }}


            className={s.locationPicker}


          >


            <span className='material-icons-outlined'>my_location</span>


          </button>


        )}


      </GoogleMap>


    </div>


  )


}



const Markers = props => {


  const [selectedMarker, setSelectedMarker] = useState(null)


  const navigate = useNavigate()



  return props.userBusinessLocations.map((user, i) => (


    <MarkerF


      position={{ lat: user.location.coordinates[1], lng: user.location.coordinates[0] }}


      clickable={true}


      onClick={() => {


        if (selectedMarker === i) setSelectedMarker(null)


        else setSelectedMarker(i)


      }}


      key={i}


    >


      {selectedMarker === i && (


        <InfoWindowF options={{ icon: 'none' }} onCloseClick={() => setSelectedMarker(null)}>


          <div className={s.infoBoxFields}>


            <span>


              <span className={s.logo}>


                <ImageTag src={user.images[0]} alt='' />


              </span>


              {user.businessName}


            </span>


            <span>{user.subCategory}</span>


            <div


              to={user.link}


              className={s.businessLink}


              onClick={() => {


                if (!!props.userData) {


                  if (props.userData.plan !== 'Plan 0') navigate(user.link)


                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                } else Modal.PrivacyModal()


              }}


            >


              Visit


            </div>


            <div


              className={s.viewOnGoogleMaps}


              onClick={() => {


                if (!!props.userData) {


                  if (props.userData.plan !== 'Plan 0')


                    window.open(


                      `https://www.google.com/maps/dir/?api=1&destination=${user.location.coordinates[1]},${user.location.coordinates[0]}`,


                      '_blank'


                    )


                  else Modal.Confirm('You need to buy a plan to use this feature', () => navigate('/renewPlan'))


                } else Modal.PrivacyModal()


              }}


            >


              View on Google Maps


            </div>


          </div>


        </InfoWindowF>


      )}


    </MarkerF>


  ))


}
