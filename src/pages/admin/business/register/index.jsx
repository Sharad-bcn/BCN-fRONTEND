import React from 'react';


import { Alert, Layouts, Loader } from 'components'


import s from './styles.module.scss'


import { useState, useEffect, useCallback, useRef } from 'react'


import { Decrypt, Encrypt, geoLocation, head, imageCompressor, removeFromS3, uploadToS3 } from 'helpers'


import { useLocation, useNavigate, useParams } from 'react-router-dom'


import * as api from 'api'


import Page1 from './part1'


import Page2 from './part2'


import Page3 from './part3'


import Page4 from './part4'



export default function Main() {


  //main


  const [part, setPart] = useState(1)


  const navigate = useNavigate()


  const urlLocation = useLocation()


  const [loadingStatus, setLoadingStatus] = useState('Loading...')


  let { businessId } = useParams()


  if (businessId) businessId = Decrypt(businessId).id


  const [business, setBusiness] = useState({})



  //part1


  const [categories, setCategories] = useState([])


  const [selectedCategory, setSelectedCategory] = useState({})


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  //part2


  const [subCategories, setSubCategories] = useState([])


  const [selectedSubCategories, setSelectedSubCategories] = useState([])


  const processing1 = useRef(false)



  //part3


  const [tag, setTag] = useState('')


  const [tags, setTags] = useState([])


  const [businessName, setBusinessName] = useState('')


  const [description, setDescription] = useState('')


  const [website, setWebsite] = useState('')


  const [mobile, setMobile] = useState('')


  const [gst, setGst] = useState('')


  const [facebookLink, setFacebookLink] = useState('')


  const [instagramLink, setInstagramLink] = useState('')


  const [dateOfEstablishment, setDateOfEstablishment] = useState('')


  const [workingHours, setWorkingHours] = useState({


    timings: [


      { day: 'Monday', from: '', to: '', isClosed: true },


      { day: 'Tuesday', from: '', to: '', isClosed: true },


      { day: 'Wednesday', from: '', to: '', isClosed: true },


      { day: 'Thursday', from: '', to: '', isClosed: true },


      { day: 'Friday', from: '', to: '', isClosed: true },


      { day: 'Saturday', from: '', to: '', isClosed: true },


      { day: 'Sunday', from: '', to: '', isClosed: true }


    ],


    isOpen24Hours: false


  })



  const [isUploading, setIsUploading] = useState(false)


  const [uploadingProgress, setUploadingProgress] = useState(0)



  const [businessImages, setBusinessImages] = useState([])


  const [businessImagesUrls, setBusinessImagesUrls] = useState([])


  const [oldImagesRemoved, setOldImagesRemoved] = useState([])


  const [oldBusinessImagesUrls, setOldBusinessImagesUrls] = useState([])



  //part4


  const [address, setAddress] = useState('')


  const [state, setState] = useState('')


  const [states, setStates] = useState([])


  const [city, setCity] = useState('')


  const [cities, setCities] = useState([])


  const [selectedLocation, setSelectedLocation] = useState(null)


  const [isBusinessLocation, setIsBusinessLocation] = useState(false)


  const [reRender, setReRender] = useState(false)


  const [pinCode, setPinCode] = useState('')


  const [isProductHolder, setIsProductHolder] = useState(false)


  const processing2 = useRef(false)



  useEffect(() => {


    head({ title: (!businessId ? 'Register' : 'Edit') + ' Business | BCN' })


  }, [businessId])



  const getBusiness = useCallback(async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const fetchBusiness = await api.userAdmin.business.fetch({ id: businessId })



    if (fetchBusiness.code === 200) {


      const business = fetchBusiness.payload.getBusiness


      setBusiness(business)



      //part1


      const findCategoryInCategories = categories.filter(x => x.category === business.category)



      setSelectedCategory({


        _id: findCategoryInCategories[0]._id,


        category: findCategoryInCategories[0].category


      })



      //part3


      setTags(business.tags)


      setBusinessName(business.businessName)


      setDescription(business.description)


      setWebsite(business.website)


      setMobile(business.phoneNo.toString())


      setGst(business.gst)


      setFacebookLink(business.facebookLink)


      setInstagramLink(business.instagramLink)


      setDateOfEstablishment(business.dateOfEstablishment)


      setWorkingHours(business.workingHours)


      setOldBusinessImagesUrls(business.images)



      //part4


      if (business.location.coordinates[0] && business.location.coordinates[1]) {


        setSelectedLocation({ lat: business.location.coordinates[1], lng: business.location.coordinates[0] })


        setIsBusinessLocation(true)


      }


      setAddress(business.address)


      setCity(business.city)


      setState(business.state)


      setPinCode(business.pinCode)


    } else {


      Alert.error(fetchBusiness.message)


    }



    setLoading(false)


    processing.current = false


  }, [businessId, categories])



  useEffect(() => {


    if (businessId && categories.length) getBusiness()


  }, [businessId, getBusiness, categories])



  const getCategories = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchCategories = await api.publicApi.categories.fetchAllCategories({})



    if (fetchCategories.code === 200) {


      setCategories(fetchCategories.payload.categories)


      // setSelectedCategory({


      //   _id: fetchCategories.payload.categories[0]._id,


      //   category: fetchCategories.payload.categories[0].category


      // })


    } else {


      Alert.error(fetchCategories.message)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    if (part === 1) {


      getCategories()


      setSubCategories([])


    }


  }, [getCategories, setSubCategories, part])



  const getSubCategories = useCallback(async () => {


    if (processing1.current) return



    processing1.current = true


    setLoading(true)



    const fetchSubCategories = await api.userAdmin.categories.fetchSubCategoryViaCategory({ id: selectedCategory._id })



    if (fetchSubCategories.code === 200) {


      setSubCategories(fetchSubCategories.payload.subCategories)



      if (businessId && business.subCategories.length) {


        const findSubCategoryInSubCategories = fetchSubCategories.payload.subCategories.filter(x =>


          business.subCategories.some(y => y === x.subCategory)


        )



        if (findSubCategoryInSubCategories.length)


          setSelectedSubCategories(


            findSubCategoryInSubCategories.map(x => ({ _id: x._id, subCategory: x.subCategory }))


          )


      }


    } else {


      if (fetchSubCategories.code === 400) {


        setPart(3)


        if (!businessId) navigate(`/userAdmin/businesses/registerBusiness/part3`, { replace: true })


        else


          navigate(`/userAdmin/businesses/editBusiness/part3` + (businessId ? '/' + Encrypt({ id: businessId }) : ''), {


            replace: true


          })


      } else Alert.error(fetchSubCategories.message)


    }


    processing1.current = false


    setLoading(false)


  }, [selectedCategory, businessId, navigate, business.subCategories])



  useEffect(() => {


    if (part === 2) getSubCategories()


  }, [getSubCategories, part])



  const getStates = useCallback(async stateSearch => {


    if (processing2.current) return


    processing2.current = true



    const fetchStateSuggestions = await api.publicApi.locations.fetchAllStates({ limit: 10, state: stateSearch })



    if (fetchStateSuggestions.code === 200) {


      setStates(fetchStateSuggestions.payload.states)


    } else {


      Alert.error(fetchStateSuggestions.message)


    }


    processing2.current = false


  }, [])



  useEffect(() => {


    if (part === 4) getStates('')


  }, [part, getStates])



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


      setSelectedLocation({ lat: latitude, lng: longitude })


    } else {


      Alert.warn('We are not available at your location')


    }


    setLoading(false)


    processing.current = false


  }, [])



  useEffect(() => {


    if (part === 4 && !isBusinessLocation) {


      // const isConfirmed = window.confirm('Are you at your business Location?')


      // if (isConfirmed) {


      setIsBusinessLocation(true)


      locationPicker()


      // } else setIsBusinessLocation(false)


    }


  }, [part, isBusinessLocation, setIsBusinessLocation, locationPicker])



  const getCities = useCallback(


    async citySearch => {


      if (processing2.current) return


      processing2.current = true



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


      processing2.current = false


    },


    [state]


  )



  const handleRemoveImage = i => {


    let newSelectedImages = [...businessImages]


    let newImageUrls = [...businessImagesUrls]


    newSelectedImages.splice(i, 1)


    newImageUrls.splice(i, 1)


    URL.revokeObjectURL(businessImagesUrls[i])


    setBusinessImages(newSelectedImages)


    setBusinessImagesUrls(newImageUrls)


  }



  const handleRemoveOldImage = i => {


    let newImageUrls = [...oldBusinessImagesUrls]


    let newRemovedImages = [...oldImagesRemoved]


    newRemovedImages.push(oldBusinessImagesUrls[i])


    setOldImagesRemoved(newRemovedImages)


    newImageUrls.splice(i, 1)


    setOldBusinessImagesUrls(newImageUrls)


  }



  const handleBusinessImagesChange = async e => {


    setIsUploading(true)


    const files = Array.prototype.slice.call(e.target.files)



    if (files.length > 6 - (businessImagesUrls.length + oldBusinessImagesUrls.length)) {


      Alert.warn('Upto 6 images allowed')


      setIsUploading(false)


      return


    }



    setUploadingProgress(10)



    if (files.length > 0) {


      const newSelectedImages = businessImages


      const newImageUrls = businessImagesUrls


      setUploadingProgress(30)


      const compressedFiles = await imageCompressor(files, 'business')


      setUploadingProgress(70)



      for (let i = 0; i < compressedFiles.length; i++) {


        const file = compressedFiles[i]


        const imageUrl = URL.createObjectURL(file)


        newSelectedImages.push(file)


        newImageUrls.push(imageUrl)


      }



      setBusinessImages(newSelectedImages)


      setBusinessImagesUrls(newImageUrls)


      setUploadingProgress(100)


      setIsUploading(false)


    }


  }



  const addTag = () => {


    !!tag && !tags.find(x => x === tag) && setTags(tags.concat(tag.toLowerCase()))


    setTag('')


  }



  useEffect(() => {


    if (part === 4 && state) getCities('')


  }, [part, state, getCities])



  useEffect(() => {


    const handlePopState = () => {


      const path = window.location.pathname



      if (path.includes('/part1')) setPart(1)


      else if (path.includes('/part2')) setPart(2)


      else if (path.includes('/part3')) setPart(3)


      else if (path.includes('/part4')) setPart(4)


    }


    window.addEventListener('popstate', handlePopState)



    return () => {


      window.removeEventListener('popstate', handlePopState)


    }


  }, [part])



  const validateFacebookLink = link => {


    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(.?)?]/


    return facebookRegex.test(link)


  }



  const validateInstagramLink = link => {


    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/


    return instagramRegex.test(link)


  }



  const goToNextPart = () => {


    if (part === 3) {


      if (!businessName) {


        Alert.error('Business name required!')


        return


      }



      if (!description) {


        Alert.error('Description required!')


        return


      }



      if (!mobile) {


        Alert.error('Contact No. required!')


        return


      }



      if (mobile.length !== 10) {


        Alert.error('Enter Correct Contact No.!')


        return


      }



      if (facebookLink && !validateFacebookLink(facebookLink)) {


        Alert.error('Enter a valid facebook link!')


        return


      }


      if (instagramLink && !validateInstagramLink(instagramLink)) {


        Alert.error('Enter a valid instagram link!')


        return


      }


    }


    setPart(part + 1)


    if (!businessId) navigate(`/userAdmin/businesses/registerBusiness/part${part + 1}`, { replace: true })


    else


      navigate(


        `/userAdmin/businesses/editBusiness/part${part + 1}` + (businessId ? '/' + Encrypt({ id: businessId }) : ''),


        { replace: true }


      )


  }



  const registerBusiness = async () => {


    if (!address) {


      Alert.error('Address required!')


      return


    }



    if (!state) {


      Alert.error('State required!')


      return


    }



    if (!city) {


      Alert.error('City required!')


      return


    }



    if (!pinCode) {


      Alert.error('Pincode required!')


      return


    }



    if (processing.current) return


    processing.current = true


    setLoading(true)


    setLoadingStatus('Saving!!!')


    Alert.success('Saving!!!')



    const registerBusiness = await api.userAdmin.business.create({


      images: businessImages.map((image, i) => image.name),


      location: {


        type: 'Point',


        coordinates: selectedLocation ? [selectedLocation.lng, selectedLocation.lat] : [0, 0]


      },


      tags,


      businessName,


      description,


      phoneNo: mobile,


      category: selectedCategory.category,


      subCategories: selectedSubCategories.map(x => x.subCategory) || '',


      address,


      state,


      city,


      pinCode,


      gst,


      website,


      facebookLink,


      instagramLink,


      dateOfEstablishment,


      workingHours


    })



    if (registerBusiness.code === 201) {


      let res = []



      for (let i = 0; i < businessImages.length; i++) {


        res.push(await uploadToS3(businessImages[i].name, businessImages[i]))


      }



      for (let i = 0; i < businessImagesUrls.length; i++) {


        URL.revokeObjectURL(businessImagesUrls[i])


      }



      const sendNotification = await api.userAdmin.notification.create({


        notification: businessName + ' is added as a new Business',


        redirect: Encrypt({ path: urlLocation.pathname })


      })



      if (sendNotification.code === 201) {


      } else {


        //   Alert.error(sendNotification.message)


      }



      setBusinessImagesUrls([])


      setBusinessImages([])


      Alert.success(registerBusiness.message)


      if (isProductHolder) navigate(`/userAdmin/businesses/listings/addListing`)


      else navigate(`/userAdmin/businesses`)


    } else {


      Alert.error(registerBusiness.message)


    }



    setLoading(false)


    processing.current = false


  }



  const saveBusiness = async () => {


    if (!address) {


      Alert.error('Address required!')


      return


    }



    if (!state) {


      Alert.error('State required!')


      return


    }



    if (!city) {


      Alert.error('City required!')


      return


    }



    if (!pinCode) {


      Alert.error('Pincode required!')


      return


    }



    if (processing.current) return


    processing.current = true


    setLoading(true)


    setLoadingStatus('Saving!!!')


    Alert.success('Saving...')



    const editBusiness = await api.userAdmin.business.update({


      id: businessId,


      images: [...oldBusinessImagesUrls, ...businessImages.map((image, i) => image.name)],


      location: {


        type: 'Point',


        coordinates: selectedLocation ? [selectedLocation.lng, selectedLocation.lat] : [0, 0]


      },


      tags,


      businessName,


      description,


      phoneNo: mobile,


      category: selectedCategory.category,


      subCategories: selectedSubCategories.map(x => x.subCategory) || '',


      address,


      state,


      city,


      pinCode,


      gst,


      website,


      facebookLink,


      instagramLink,


      dateOfEstablishment,


      workingHours


    })



    if (editBusiness.code === 201) {


      if (businessImages.length) {


        let res = []


        for (let i = 0; i < businessImages.length; i++) {


          res.push(await uploadToS3(businessImages[i].name, businessImages[i]))


        }



        for (let i = 0; i < businessImagesUrls.length; i++) {


          URL.revokeObjectURL(businessImagesUrls[i])


        }


      }



      if (oldImagesRemoved.length) {


        let res = []



        for (let i = 0; i < oldImagesRemoved.length; i++) {


          res.push(await removeFromS3(oldImagesRemoved[i]))


        }


      }



      const sendNotification = await api.userAdmin.notification.create({


        notification: businessName + ' is edited successfully',


        redirect: Encrypt({ path: urlLocation.pathname })


      })



      if (sendNotification.code === 201) {


      } else {


        //   Alert.error(sendNotification.message)


      }



      setOldImagesRemoved([])


      setOldBusinessImagesUrls([])


      setBusinessImagesUrls([])


      setBusinessImages([])


      Alert.success(editBusiness.message)


      if (isProductHolder) navigate(`/userAdmin/businesses/listings/addListing`)


      else navigate(`/userAdmin/businesses`)


    } else {


      Alert.error(editBusiness.message)


    }



    setLoading(false)


    processing.current = false


  }



  const getBusinessPrefilledData = useCallback(async () => {


    if (processing1.current) return


    processing1.current = true



    const fetchBusinessPrefilledData = await api.userAdmin.business.fetchBusinessPrefilledData({})



    if (fetchBusinessPrefilledData.code === 201) {


      setMobile(fetchBusinessPrefilledData.payload.businessPrefilledData.phoneNo.toString())


    } else {


      // Alert.error(fetchLastListingsPrefilledData.message)


    }


    processing1.current = false


  }, [])



  useEffect(() => {


    if (!businessId) {


      getBusinessPrefilledData()


    }


  }, [businessId, getBusinessPrefilledData])



  return (


    <div className={s.main}>


      <div className={s.register}>


        {/* <div className={s.header}> */}


        <Layouts.Classic title={(!businessId ? 'Register' : 'Edit') + ' Business'} />


        {/* <div className={s.addBusiness} onClick={part === 4 ? registerBusiness : goToNextPart}>


              {part === 4 && (


                <span className='material-icons-outlined' style={{ paddingRight: '0.25rem' }}>


                  add_circle_outline


                </span>


              )}


              {part === 4 ? 'Add' : 'Next'}


              {part !== 4 && (


                <span className='material-icons-outlined' style={{ paddingLeft: '0.25rem' }}>


                  arrow_forward


                </span>


              )}


            </div> */}


        {/* </Layouts.Classic> */}


        {/* </div> */}


        <div className={s.content + ' innerScrollX'}>


          {!loading && <Progress part={part} businessId={businessId} />}


          {!!business.rejectionMessage && (


            <div className={s.rejectionMessage}>


              <div className={s.title}>


                This Business is rejected, please comply with the following and update accordingly.


              </div>


              {business.rejectionMessage}


            </div>


          )}


          {part === 1 && !loading && (


            <Page1


              selectedCategory={selectedCategory}


              setSelectedCategory={setSelectedCategory}


              categories={categories}


              goToNextPart={goToNextPart}


              businessId={businessId}


            />


          )}


          {!!loading && (


            <div


              className={s.main}


              style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}


            >


              <Loader message={loadingStatus} color='var(--c-primary)' colorText='var(--c-primary)' />


            </div>


          )}


          {part === 2 && !loading && (


            <Page2


              selectedSubCategories={selectedSubCategories}


              setSelectedSubCategories={setSelectedSubCategories}


              subCategories={subCategories}


              goToNextPart={goToNextPart}


              businessId={businessId}


            />


          )}


          {part === 3 && !loading && (


            <Page3


              businessImagesUrls={businessImagesUrls}


              oldBusinessImagesUrls={oldBusinessImagesUrls}


              handleBusinessImagesChange={handleBusinessImagesChange}


              handleRemoveImage={handleRemoveImage}


              handleRemoveOldImage={handleRemoveOldImage}


              uploadingProgress={uploadingProgress}


              isUploading={isUploading}


              tag={tag}


              setTag={setTag}


              tags={tags}


              setTags={setTags}


              addTag={addTag}


              businessName={businessName}


              setBusinessName={setBusinessName}


              description={description}


              setDescription={setDescription}


              website={website}


              setWebsite={setWebsite}


              mobile={mobile}


              setMobile={setMobile}


              gst={gst}


              setGst={setGst}


              facebookLink={facebookLink}


              setFacebookLink={setFacebookLink}


              validateFacebookLink={validateFacebookLink}


              instagramLink={instagramLink}


              setInstagramLink={setInstagramLink}


              validateInstagramLink={validateInstagramLink}


              dateOfEstablishment={dateOfEstablishment}


              setDateOfEstablishment={setDateOfEstablishment}


              workingHours={workingHours}


              setWorkingHours={setWorkingHours}


              goToNextPart={goToNextPart}


            />


          )}


          {part === 4 && !loading && (


            <Page4


              address={address}


              setAddress={setAddress}


              reRender={reRender}


              setReRender={setReRender}


              state={state}


              states={states}


              setState={setState}


              getStates={getStates}


              city={city}


              cities={cities}


              setCities={setCities}


              setCity={setCity}


              getCities={getCities}


              pinCode={pinCode}


              setPinCode={setPinCode}


              registerBusiness={registerBusiness}


              businessId={businessId}


              saveBusiness={saveBusiness}


              isProductHolder={isProductHolder}


              setIsProductHolder={setIsProductHolder}


              isBusinessLocation={isBusinessLocation}


              selectedLocation={selectedLocation}


              setSelectedLocation={setSelectedLocation}


              locationPicker={locationPicker}


            />


          )}


        </div>


      </div>


    </div>


  )


}



const Progress = ({ part, businessId }) => (


  <div className={s.progress}>


    <div


      className={s.progressInner + ' ' + (part === 2 ? s.part2 : part === 3 ? s.part3 : part !== 1 ? s.part4 : '')}


    ></div>


    <div className={(part > 1 && s.done) + ' ' + (part === 1 && s.active) + ' ' + s.part}>


      <span>{part <= 1 ? '1' : <span className='material-icons-outlined'>done</span>}</span>


      <div className={s.partInfo}>{!businessId ? 'Business Category' : 'Edit Business Category'}</div>


    </div>


    <div className={(part > 2 && s.done) + ' ' + (part === 2 && s.active) + ' ' + s.part}>


      <span>{part <= 2 ? '2' : <span className='material-icons-outlined'>done</span>}</span>


      <div className={s.partInfo}>{!businessId ? 'Business Sub-Category' : 'Edit Business Sub-Category'}</div>


    </div>


    <div className={(part > 3 && s.done) + ' ' + (part === 3 && s.active) + ' ' + s.part}>


      <span>{part <= 3 ? '3' : <span className='material-icons-outlined'>done</span>}</span>


      <div className={s.partInfo}>{!businessId ? 'Business Details' : 'Edit Business Details'}</div>


    </div>


    <div className={(part > 4 && s.done) + ' ' + (part === 4 && s.active) + ' ' + s.part}>


      <span>{part <= 4 ? '4' : <span className='material-icons-outlined'>done</span>}</span>


      <div className={s.partInfo}>{!businessId ? 'Business Location' : 'Edit Business Location'}</div>


    </div>


  </div>


)
