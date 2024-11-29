import React from 'react';


import { AdvancedSelect, Alert, Input, Loader, TextArea } from 'components'


import s from './styles.module.scss'


import { useCallback, useEffect, useRef, useState } from 'react'


import * as api from 'api'


import { geoLocation } from 'helpers'



export default function Main(props) {


  const [contactPerson, setContactPerson] = useState('')


  const [mobile, setMobile] = useState('')


  const [loading, setLoading] = useState(false)


  const [email, setEmail] = useState('')


  const [query, setQuery] = useState('')


  const [state, setState] = useState('')


  const [states, setStates] = useState([])


  const [reRender, setReRender] = useState(false)


  const [city, setCity] = useState('')


  const [cities, setCities] = useState([])


  const processing = useRef(false)



  const locationPicker = useCallback(async () => {


    const { latitude, longitude } = await geoLocation()


    if (processing.current) return


    processing.current = true


    setLoading(true)



    Alert.success('Fetching your location')



    const locationPickerCity = await api.publicApi.locations.locationPicker({


      lat: latitude,


      long: longitude


    })


    if (locationPickerCity.code === 200) {


      Alert.success('Location Found')


      setCity(locationPickerCity.payload.city.city)


      setState(locationPickerCity.payload.city.state)


    } else {


      Alert.warn('We are not available at your location')


    }


    setLoading(false)


    processing.current = false


  }, [])



  const submitHandler = async () => {


    if (!contactPerson) {


      Alert.error('Contact person is required!')


      return


    }



    if (!mobile) {


      Alert.error('Contact no. is required!')


      return


    }



    if (mobile.length !== 10) {


      Alert.error('Enter correct contact no.')


      return


    }



    if (!email) {


      Alert.error('Email is required!')


      return


    }



    if (!state) {


      Alert.error('State is required!')


      return


    }



    if (!city) {


      Alert.error('City is required!')


      return


    }



    if (processing.current) return


    processing.current = true



    const createLead = props.id


      ? await api.publicApi.leads.create({


          contactPerson,


          phoneNo: mobile,


          email,


          query,


          state,


          city,


          fkListingId: props.id


        })


      : await api.publicApi.businessLeads.create({


          contactPerson,


          phoneNo: mobile,


          email,


          query,


          state,


          city,


          fkBusinessId: props.fkBusinessId


        })



    if (createLead.code === 201) {


      const sendNotification = await api.publicApi.notifications.create({


        notification: 'New query from ' + contactPerson,


        fkUserId: props.fkUserId,


        redirect: ''


      })



      if (sendNotification.code === 201) {


      } else {


        Alert.error(sendNotification.message)


      }


      // Alert.success(createLead.message)


      Alert.success('Your interest has been sent!')


      props.onCloseModal()


    } else {


      Alert.error(createLead.message)


    }



    processing.current = false


  }



  const getStates = useCallback(async stateSearch => {


    if (processing.current) return


    processing.current = true



    const fetchStateSuggestions = await api.publicApi.locations.fetchAllStates({ limit: 10, state: stateSearch })



    if (fetchStateSuggestions.code === 200) {


      setStates(fetchStateSuggestions.payload.states)


    } else {


      Alert.error(fetchStateSuggestions.message)


    }


    processing.current = false


  }, [])



  useEffect(() => {


    getStates('')


  }, [getStates])



  useEffect(() => {


    locationPicker()


  }, [locationPicker])



  const getCities = useCallback(


    async citySearch => {


      if (processing.current) return


      processing.current = true


      let fkStateId = ''



      const stateSelected = await api.publicApi.locations.fetchAllStates({ limit: 10, state })



      if (stateSelected.code === 200) {


        fkStateId = stateSelected.payload.states[0]._id


      } else return



      const fetchCitySuggestions = await api.publicApi.locations.fetchAllCitiesViaState({


        limit: 10,


        city: citySearch,


        fkStateId


      })



      if (fetchCitySuggestions.code === 200) {


        setCities(fetchCitySuggestions.payload.cities)


      } else {


        Alert.error(fetchCitySuggestions.message)


      }



      setReRender(false)


      processing.current = false


    },


    [state]


  )



  useEffect(() => {


    if (state) getCities('')


  }, [state, getCities])



  return (


    <div className={s.main}>


      <div className={s.queryForm}>


        <div className={s.formInner + ' innerScroll'}>


          {!loading && (


            <>


              <div className={s.title}>Provide Your Information</div>


              <div className={s.field + ' row'}>


                <Input.Classic


                  label='Contact Person *'


                  type='text'


                  iconLeft='person'


                  placeholder='Enter Contact Person Name'


                  value={contactPerson}


                  onChange={e => setContactPerson(e.target.value)}


                />


                <Input.Classic


                  label='Contact Number *'


                  type='number'


                  iconLeft='call'


                  placeholder='Enter Contact Number'


                  value={mobile}


                  onChange={e => {


                    if (e.target.value.length <= 10) setMobile(e.target.value)


                  }}


                />


              </div>


              <div className={s.field + ' row'}>


                <Input.Classic


                  label='Email *'


                  type='text'


                  iconLeft='email'


                  placeholder='Enter Email'


                  value={email}


                  onChange={e => setEmail(e.target.value)}


                />


                <AdvancedSelect


                  defaultField={state ? state : 'Search state'}


                  iconLeft='location_on'


                  label='State *'


                  fieldName='state'


                  list={states}


                  changeHandler={getStates}


                  detectLocation


                  locationPicker={locationPicker}


                  listFieldHandler={field => {


                    setCity('')


                    setCities([])


                    setReRender(true)


                    setState(field.state)


                  }}


                />


              </div>


              {!!state && !reRender && (


                <div className={s.city}>


                  <AdvancedSelect


                    defaultField={city ? city : 'Select City'}


                    iconLeft='location_on'


                    fieldName='city'


                    label='City *'


                    list={cities}


                    detectLocation


                    locationPicker={locationPicker}


                    changeHandler={getCities}


                    listFieldHandler={field => setCity(field.city)}


                  />


                </div>


              )}


              <TextArea.Classic


                label='Query'


                iconLeft='description'


                placeholder='Enter your query...'


                value={query}


                onChange={e => setQuery(e.target.value)}


              />


              <div className={s.button} onClick={submitHandler}>


                <div>


                  <span className='material-icons-outlined'>send</span>


                  send interest


                </div>


              </div>


            </>


          )}


          {!!loading && (


            <div className={s.loader}>


              <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


            </div>


          )}


        </div>


      </div>


      <span className={'material-icons-outlined ' + s.close} onClick={props.onCloseModal}>


        cancel


      </span>


    </div>


  )


}
