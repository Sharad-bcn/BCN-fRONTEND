import React from 'react';


import s from './styles.module.scss'


import { GoogleMap, MarkerF } from '@react-google-maps/api' //Marker


import { useState } from 'react'



export default function Main({ defaultLocation }) {


  const [map, setMap] = useState(null)


  // const mediaMatch = window.matchMedia('(max-width: 1279px)')


  // const [matches, setMatches] = useState(mediaMatch.matches)



  // useEffect(() => {


  //   const handler = e => setMatches(e.matches)


  //   mediaMatch.addEventListener('change', handler)


  //   return () => mediaMatch.removeEventListener('change', handler)


  // })



  const mapContainerStyle = {


    width: '100%',


    height: '100% '


  }



  const defaultCenter = {


    // lat: 28.838648,


    // lng: 78.773329


    lat: 12.779269951911457,


    lng: 77.60315020341977


  }



  return (


    <div className={s.main}>


      <GoogleMap


        mapContainerStyle={mapContainerStyle}


        center={defaultLocation || defaultCenter}


        zoom={15}


        onLoad={map => setMap(map)}


      >


        <MarkerF position={defaultLocation || defaultCenter} />



        {!!map && (


          <button


            onClick={() => {


              map.panTo(defaultLocation || defaultCenter)


              map.setZoom(15)


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
