import React from 'react';


import s from './styles.module.scss'


import { AdvancedSelect, Alert } from 'components'


import { useCallback, useEffect, useRef, useState } from 'react'


import { useSelector, useDispatch } from 'react-redux'


import { setLocation } from '../../state/actions/locationAction'


import * as api from 'api'



export default function Main() {


  const [city, setCity] = useState(useSelector(state => state.location).location)


  const [cities, setCities] = useState([])


  const processing = useRef(false)


  const dispatch = useDispatch()



  const locationPicker = async (lat, long) => {


    if (processing.current) return


    processing.current = true


    Alert.success('Fetching your location')



    const locationPickerCity = await api.publicApi.locations.locationPicker({


      lat,


      long


    })


    if (locationPickerCity.code === 200) {


      setCity(locationPickerCity.payload.city.city)


      dispatch(setLocation(locationPickerCity.payload.city.city))


      Alert.success('Location Found')


      return locationPickerCity.payload.city.city


    } else {


      Alert.warn('We are not available at your location')


    }


    processing.current = false


  }



  const getCities = useCallback(async citySearch => {


    if (processing.current) return


    processing.current = true



    const fetchCitySuggestions = await api.publicApi.locations.fetchCityViaState({


      limit: 10,


      city: citySearch


    })


    if (fetchCitySuggestions.code === 200) {


      setCities(fetchCitySuggestions.payload.cities)


    } else {


      Alert.error(fetchCitySuggestions.message)


    }


    processing.current = false


  }, [])



  useEffect(() => {


    getCities('')


  }, [getCities])



  return (


    <div className={s.main}>


      <div className={s.locationPicker}>


        <AdvancedSelect


          defaultField={city}


          iconLeft='location_on'


          fieldName='city'


          list={cities}


          detectLocation


          allOverIndia


          locationPicker={locationPicker}


          changeHandler={getCities}


          listFieldHandler={field => {


            setCity(field.city)


            dispatch(setLocation(field.city))


          }}


        />


      </div>


    </div>


  )


}
