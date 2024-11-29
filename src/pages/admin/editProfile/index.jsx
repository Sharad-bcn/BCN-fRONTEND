import React from 'react';

import { AdvancedSelect, Alert, Filter, Input, Layouts, Loader, TextArea, UploadImages } from 'components'

import s from './styles.module.scss'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Encrypt, geoLocation, head, imageCompressor, removeFromS3, uploadToS3 } from 'helpers'

import images from 'images'

import * as api from 'api'

import { Link, useLocation, useNavigate } from 'react-router-dom'

const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST


export default function Main() {

  const [userLogo, setUserLogo] = useState()

  const [userOldLogo, setUserOldLogo] = useState()

  const [loadingStatus, setLoadingStatus] = useState('Loading...')

  const [userLogoUrl, setUserLogoUrl] = useState(images.Profile)

  const [firstName, setFirstName] = useState('')

  const [lastName, setLastName] = useState('')

  const [gender, setGender] = useState('Male')

  const [myRefId, setMyRefId] = useState('')

  const [email, setEmail] = useState('')

  const [address, setAddress] = useState('')

  const [mobile, setMobile] = useState('')

  const [state, setState] = useState('')

  const [states, setStates] = useState([])

  const [city, setCity] = useState('')

  const [cities, setCities] = useState([])

  const [reRender, setReRender] = useState(false)

  const [pinCode, setPinCode] = useState('')

  const [isRefIdAvailable, setIsRefIdAvailable] = useState(false)

  const [refId, setRefId] = useState('')

  const [isBusinessHolder, setIsBusinessHolder] = useState(false)

  const [isAlreadyBusinessHolder, setIsAlreadyBusinessHolder] = useState(false)

  const [referredUsers, setReferredUsers] = useState('')

  const [referredBy, setReferredBy] = useState('')

  const [approvalStatus, setApprovalStatus] = useState(true)

  const [rejectionMessage, setRejectionMessage] = useState('')

  const filterFields = [{ field: 'Male' }, { field: 'Female' }, { field: 'Other' }]

  const [loading, setLoading] = useState(false)

  const processing = useRef(false)

  const processing2 = useRef(false)

  const processing3 = useRef(false)

  const navigate = useNavigate()

  const urlLocation = useLocation()


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


  useEffect(() => {

    head({ title: 'Edit Profile | BCN' })

  }, [])


  const discardAll = () => {

    URL.revokeObjectURL(userLogoUrl)

    setUserLogo()

    setUserLogoUrl(images.Profile)

    setFirstName('')

    setLastName('')

    setGender('Male')

    setEmail('')

    setAddress('')

    setMobile('')

    setPinCode('')

  }


  const handleUserLogoChange = async e => {

    const file = Array.prototype.slice.call(e.target.files)

    if (file) {

      let compressedFile = await imageCompressor(file, 'logo')


      if (compressedFile[0]) {

        const imageUrl = URL.createObjectURL(compressedFile[0])

        setUserLogo(compressedFile[0])

        setUserLogoUrl(imageUrl)

      }

    }

  }


  const getUser = useCallback(async () => {

    if (processing2.current) return

    processing2.current = true

    setLoading(true)


    const getUser = await api.userAdmin.user.fetch({})


    if (getUser.code === 200) {

      let user = getUser.payload.getUser

      setUserLogoUrl(user.logo ? IMAGE_HOST + user.logo : '')

      setUserOldLogo(user.logo ? user.logo : '')

      setFirstName(user.firstName)

      setLastName(user.lastName)

      setGender(user.gender)

      setMyRefId(user.userRefId)

      setEmail(user.email)

      setAddress(user.address)

      setMobile(user.phoneNo.toString())

      setCity(user.city)

      setState(user.state)

      setPinCode(user.pinCode)

      setApprovalStatus(user.isApproved)

      setRejectionMessage(user.rejectionMessage)

      if (user.fkRefId) {

        setIsRefIdAvailable(true)

        setRefId(user.fkRefId)

      }

      setReferredUsers(getUser.payload.referredUsers)

      setReferredBy(getUser.payload.referredBy)


      const fetchBusinessesCount = await api.userAdmin.business.fetchAll({

        perPage: 10,

        pageNo: 1,

        filter: ''

      })

      if (fetchBusinessesCount.payload.total > 0) setIsAlreadyBusinessHolder(true)

    } else {

      Alert.error(getUser.message)

    }


    setLoading(false)

    processing2.current = false

  }, [])


  useEffect(() => {

    getUser()

  }, [getUser])


  const saveHandler = async () => {

    if (!firstName) {

      Alert.error('First Name is Required!')

      return

    }


    if (!lastName) {

      Alert.error('Last Name is Required!')

      return

    }


    if (!gender) {

      Alert.error('Gender is Required!')

      return

    }


    // if (!email) {

    //   Alert.error('Email is Required!')

    //   return

    // }


    if (!address) {

      Alert.error('Address is Required!')

      return

    }


    if (!mobile) {

      Alert.error('Contact No is Required!')

      return

    }


    if (mobile.length !== 10) {

      Alert.error('Enter Correct Contact No.!')

      return

    }


    if (!state) {

      Alert.error('State is Required!')

      return

    }


    if (!city) {

      Alert.error('City is Required!')

      return

    }


    // if (!pinCode) {

    //   Alert.error('Pin-Code is Required!')

    //   return

    // }


    // if (pinCode.length !== 6) {

    //   Alert.error('Enter Correct Pin-Code')

    //   return

    // }


    if (processing3.current) return

    processing3.current = true

    Alert.success('Saving user info...')

    setLoading(true)

    setLoadingStatus('Saving...')


    const editProfileUser = await api.userAdmin.user.update({

      logo: userLogo ? userLogo.name : userOldLogo ? userOldLogo : '',

      firstName,

      lastName,

      gender,

      email,

      address,

      phoneNo: mobile,

      city,

      state,

      pinCode,

      fkRefId: refId ? refId : ''

    })


    if (editProfileUser.code === 201) {

      let res = ''

      let removePrevious = ''


      if (userLogo && userOldLogo) {

        removePrevious = await removeFromS3(userOldLogo)

      }


      if (userLogo) {

        res = await uploadToS3(userLogo.name, userLogo)

        // console.log(res)

        let userData = JSON.parse(window.localStorage.getItem('userData'))

        userData.logo = userLogo.name

        localStorage.setItem('userData', JSON.stringify(userData))

        URL.revokeObjectURL(userLogoUrl)

        setUserLogoUrl(res)

        setUserOldLogo(userLogo.name)

        setUserLogo()

      }


      const sendNotification = await api.userAdmin.notification.create({

        notification: 'Profile updated successfully',

        redirect: Encrypt({ path: urlLocation.pathname })

      })


      if (sendNotification.code === 201) {

        if (isBusinessHolder) navigate('/userAdmin/businesses/registerBusiness/part1')

      } else {

        Alert.error(sendNotification.message)

      }


      Alert.success(editProfileUser.message)

      window.location.reload()

    } else {

      // Alert.error('Some Error Occured')

    }


    setLoading(false)

    processing3.current = false

  }


  return (

    <div className={s.main}>

      <div className={s.editProfile}>

        <Layouts.Classic title='Edit profile' />

        {!loading && (

          <div className={s.content + ' innerScrollX'}>

            {!approvalStatus && !rejectionMessage && (

              <div className={s.approvalStatus}>

                <span>

                  Your profile is under review for approval/rejection, you will receive a notification once done

                </span>

              </div>

            )}

            {!approvalStatus && !!rejectionMessage && (

              <div className={s.rejectionMessage}>

                <div className={s.title}>

                  This Profile is rejected, please comply with the following and update accordingly.

                </div>

                {rejectionMessage}

              </div>

            )}

            <div className={s.form}>

              <UploadImages.Single userLogoUrl={userLogoUrl} handleUserLogoChange={handleUserLogoChange} />

              <div className={s.rows + ' row'}>

                <Input.Classic

                  label='First Name'

                  type='text'

                  iconLeft='perm_identity'

                  placeholder='Enter First Name'

                  value={firstName}

                  onChange={e => setFirstName(e.target.value)}

                />

                <Input.Classic

                  label='Last Name'

                  type='text'

                  iconLeft='perm_identity'

                  placeholder='Enter Last Name'

                  value={lastName}

                  onChange={e => setLastName(e.target.value)}

                />

              </div>

              <div className={s.rows + ' row'}>

                <Filter

                  label='Gender'

                  title='Male'

                  heading={gender}

                  filterFields={filterFields}

                  filterHandler={field => setGender(field)}

                  style2

                />

                <Input.Classic

                  label='Membership Number'

                  type='text'

                  iconRight='copy'

                  onRightIconClick={() => {

                    navigator.clipboard.writeText(myRefId)

                    Alert.success('RefId copied to clipboard!')

                  }}

                  onChange={e => setMyRefId(e.target.value)}

                  value={myRefId}

                  disabled

                />

              </div>

              <Input.Classic

                label='Email'

                type='text'

                iconLeft='email'

                placeholder='Enter Email'

                value={email}

                onChange={e => setEmail(e.target.value)}

              />

              <TextArea.Classic

                label='Residential Address'

                iconLeft='location_on'

                placeholder='Enter Residential Address...'

                value={address}

                onChange={e => setAddress(e.target.value)}

              />

              <Input.Classic

                label='Contact Number'

                type='number'

                iconLeft='call'

                placeholder='Enter Whatsapp Contact Number'

                value={mobile}

                onChange={e => {

                  if (e.target.value.length <= 10) setMobile(e.target.value)

                }}

              />

              <div className={'row ' + s.locationFields}>

                <AdvancedSelect

                  defaultField={state ? state : 'Search state'}

                  iconLeft='location_on'

                  label='State'

                  fieldName='state'

                  list={states}

                  changeHandler={getStates}

                  detectLocation

                  locationPicker={locationPicker}

                  listFieldHandler={field => {

                    setState(field.state)

                    setCity('')

                    setCities([])

                    setReRender(true)

                  }}

                />

                {!!state && !reRender && (

                  <AdvancedSelect

                    defaultField={city ? city : 'Search City'}

                    iconLeft='location_on'

                    label='City'

                    fieldName='city'

                    list={cities}

                    changeHandler={getCities}

                    detectLocation

                    locationPicker={locationPicker}

                    listFieldHandler={field => {

                      setCity(field.city)

                    }}

                  />

                )}

                <Input.Classic

                  label='Pin Code'

                  type='number'

                  iconLeft='location_on'

                  placeholder='Enter Pin Code'

                  value={pinCode}

                  onChange={e => setPinCode(e.target.value)}

                />

              </div>

              {!!isRefIdAvailable && (

                <Input.Classic

                  label={'Referred By: (' + referredBy + ')'}

                  type='text'

                  onChange={e => setRefId(e.target.value)}

                  // iconRight={refId ? 'copy' : ''}

                  // onRightIconClick={

                  //   refId

                  //     ? () => {

                  //         navigator.clipboard.writeText(refId)

                  //         Alert.success('Referenced Id copied to clipboard!')

                  //       }

                  //     : () => {}

                  // }

                  value={refId}

                  disabled={isRefIdAvailable}

                />

              )}

              {!!referredUsers && (

                <div className={s.referredUsers}>

                  <span className='material-icons-outlined'>groups</span>

                  People referred:&nbsp;

                  <span>{referredUsers}</span>

                </div>

              )}


              {!isAlreadyBusinessHolder && (

                <div className={s.businessHolder}>

                  <span className='material-icons-outlined'>add_business</span>

                  Are you a business holder?

                  <span>

                    No

                    <span

                      className={'material-icons ' + s.iconSpan}

                      style={{ color: isBusinessHolder ? 'var(--c-green)' : 'var(--c-red)' }}

                      onClick={() => setIsBusinessHolder(!isBusinessHolder)}

                    >

                      {isBusinessHolder ? 'toggle_on' : 'toggle_off'}

                    </span>

                    Yes

                  </span>

                </div>

              )}


              <div className={s.actionButtons}>

                <Link to='/userAdmin/editProfile/changePin'>

                  <span className='material-icons-outlined'>lock</span>Change Pin

                </Link>

                <div onClick={discardAll} className={s.discard}>

                  <span className='material-icons-outlined'>remove_circle_outline</span>

                  Discard

                </div>

                <div onClick={saveHandler} className={s.save}>

                  {!isBusinessHolder && <span className='material-icons-outlined'>save</span>}

                  {!isBusinessHolder ? 'Save' : 'Next'}

                  {!!isBusinessHolder && (

                    <span className='material-icons-outlined' style={{ marginLeft: '0.25rem', marginRight: '0rem' }}>

                      arrow_forward

                    </span>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

        {!!loading && (

          <div className={s.loader}>

            <Loader message={loadingStatus} color='var(--c-primary)' colorText='var(--c-primary)' />

          </div>

        )}

      </div>

    </div>

  )

}
