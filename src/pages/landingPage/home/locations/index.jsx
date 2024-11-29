import React from 'react';


import { useCallback, useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'


import * as api from 'api'


import { Alert, GoogleMap } from 'components'


import { useSelector } from 'react-redux'


import { Encrypt } from 'helpers'



export default function Main() {


  const [loading, setLoading] = useState(false)


  const [userBusinessLocations, setUserBusinessLocations] = useState([])


  const [defaultCoordinates, setDefaultCoordinates] = useState(null)


  const location = useSelector(state => state.location).location


  const processing = useRef(false)


  const processing1 = useRef(false)



  const getBusinessLocations = useCallback(async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const fetchBusinessLocations = await api.publicApi.business.fetchBusinessLocations({})



    if (fetchBusinessLocations.code === 200) {


      const newBusinessLocations = fetchBusinessLocations.payload.getBusinessLocations.map(business => ({


        ...business,


        link: '/' + business.city + '/' + Encrypt({ fkBusinessId: business._id })


      }))



      setUserBusinessLocations(newBusinessLocations)


    } else {


      Alert.error(fetchBusinessLocations.message)


    }



    setLoading(false)


    processing.current = false


  }, [])



  useEffect(() => {


    getBusinessLocations()


  }, [getBusinessLocations])



  const getCoordinatesViaCity = useCallback(async () => {


    if (processing1.current) return


    processing1.current = true


    setLoading(true)



    const matchingCityCoordinates = await api.publicApi.locations.fetchCoordinatesViaCity({ city: location })



    if (matchingCityCoordinates.code === 200) {


      setDefaultCoordinates(matchingCityCoordinates.payload)


    } else {


      Alert.error(matchingCityCoordinates.message)


    }



    setLoading(false)


    processing1.current = false


  }, [location])



  useEffect(() => {


    if (location !== 'All Over India') getCoordinatesViaCity()


    else {


      setDefaultCoordinates(null)


    }


  }, [location, getCoordinatesViaCity])



  return (


    !loading && (


      <div className={s.main}>


        <div className={s.locationsOuter}>


          <div className={s.Locations + ' indent'}>


            <div className={s.title}>Registered Users</div>


            <div className={s.locationsBox}>


              <GoogleMap.MultipleLocations


                defaultLocation={defaultCoordinates}


                userBusinessLocations={userBusinessLocations}


              />


            </div>


          </div>


        </div>


      </div>


    )


  )


}
