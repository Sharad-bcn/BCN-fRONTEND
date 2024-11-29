import React from 'react';







import s from './styles.module.scss'



import { GoogleMap, MarkerF } from '@react-google-maps/api' //Marker



import { geoLocation } from 'helpers'



import { useEffect, useState } from 'react'



// import { useNavigate } from 'react-router-dom'







export default function Main({ defaultLocation, onLocationSelect }) {



  const [map, setMap] = useState(null)



  const [marker, setMarker] = useState(null)



  const [searchBox, setSearchBox] = useState(null)



  // const mediaMatch = window.matchMedia('(max-width: 1279px)')



  // const [matches, setMatches] = useState(mediaMatch.matches)







  // useEffect(() => {



  //   const handler = e => setMatches(e.matches)



  //   mediaMatch.addEventListener('change', handler)



  //   return () => mediaMatch.removeEventListener('change', handler)



  // })







  const handleMapLoad = map => {



    setMap(map)







    const input = document.getElementById('search-box-input')







    const searchBox = new window.google.maps.places.SearchBox(input)



    setSearchBox(searchBox)







    searchBox.addListener('places_changed', () => {



      const places = searchBox.getPlaces()







      if (places.length === 0) return







      const newMarker = {



        lat: places[0].geometry.location.lat(),



        lng: places[0].geometry.location.lng()



      }







      setMarker(newMarker)



      onLocationSelect(newMarker)







      // Center the map to the selected location



      map.panTo(newMarker)



    })



    // Set the default marker if it exists



    if (defaultLocation) {



      setMarker(defaultLocation)



    }



    // Center the map to the marker when the map loads



    // if (marker) {



    //   map.panTo(marker)



    // }



  }







  const mapContainerStyle = {



    width: '100%',



    height: '100% '



  }







  const defaultCenter = {



    lat: 28.7041, // Default center latitude



    lng: 77.1025 // Default center longitude



  }







  const handleMapClick = e => {



    const newMarker = {



      lat: e.latLng.lat(),



      lng: e.latLng.lng()



    }



    setMarker(newMarker)



    // You can pass the new marker coordinates to a callback function



    onLocationSelect(newMarker)



  }







  const handleMarkerDragEnd = e => {



    const newMarker = {



      lat: e.latLng.lat(),



      lng: e.latLng.lng()



    }



    setMarker(newMarker)



    // You can pass the new marker coordinates to a callback function



    onLocationSelect(newMarker)



  }







  const locationPickerHandler = async () => {



    const { latitude, longitude } = await geoLocation()



    const newMarker = {



      lat: latitude,



      lng: longitude



    }



    setMarker(newMarker)



    // You can pass the new marker coordinates to a callback function



    onLocationSelect(newMarker)



  }







  // useEffect to handle map centering when marker changes



  useEffect(() => {



    if (map && marker) {



      map.panTo(marker)



      setTimeout(() => {



        map.setZoom(15)



      }, 2000)



    }



  }, [map, marker])







  return (



    <div className={s.main}>



      <GoogleMap



        mapContainerStyle={mapContainerStyle}



        center={defaultLocation || defaultCenter}



        zoom={15}



        onLoad={handleMapLoad}



        onClick={handleMapClick}



      >



        <>



          {!!marker && <MarkerF position={marker} draggable={true} onDragEnd={handleMarkerDragEnd} />}







          <input id='search-box-input' placeholder='Search for a location' />



        </>







        {!!map && (



          <button onClick={locationPickerHandler} className={s.locationPicker}>



            <span className='material-icons-outlined'>my_location</span>



          </button>



        )}



      </GoogleMap>



    </div>



  )



}



