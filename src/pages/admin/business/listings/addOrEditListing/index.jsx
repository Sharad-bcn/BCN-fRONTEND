import React from 'react';


import { Alert, Input, Layouts, Loader, TextArea, UploadImages } from 'components'


import { Decrypt, Encrypt, head, imageCompressor, removeFromS3, uploadToS3 } from 'helpers'


import { useCallback, useEffect, useRef, useState } from 'react'


import { useLocation, useNavigate, useParams } from 'react-router-dom'


import s from './styles.module.scss'


import * as api from 'api'



export default function Main() {


  const navigate = useNavigate()


  const [business, setBusiness] = useState('')


  const [fkBusinessId, setFkBusinessId] = useState('')


  const [loadingStatus, setLoadingStatus] = useState('Loading...')


  const [listingsCount, setListingsCount] = useState(


    0


    // parseInt(new URLSearchParams(window.location.search).get('listingsCount'))


  )


  // const [businesses, setBusinesses] = useState([])


  // const [category, setCategory] = useState('')


  // const [categories, setCategories] = useState([])


  // const [subCategories, setSubCategories] = useState([])


  // const [subCategoriesFiltered, setSubCategoriesFiltered] = useState([])


  // const [subCategory, setSubCategory] = useState('')


  const [loading, setLoading] = useState(false)


  const [isUploading, setIsUploading] = useState(false)


  const [uploadingProgress, setUploadingProgress] = useState(0)


  const [listingName, setListingName] = useState('')


  const [description, setDescription] = useState('')


  const [contactPerson, setContactPerson] = useState('')


  const [mobile, setMobile] = useState('')


  const [listingImages, setListingImages] = useState([])


  const [listingImagesUrls, setListingImagesUrls] = useState([])


  const [oldImagesRemoved, setOldImagesRemoved] = useState([])


  const [oldListingImagesUrls, setOldListingImagesUrls] = useState([])


  const [rejectionMessage, setRejectionMessage] = useState('')


  const processing = useRef(false)


  const processing1 = useRef(false)


  // const processing2 = useRef(false)


  // const processing3 = useRef(false)


  const urlLocation = useLocation()



  let { listingId, businessId } = useParams()


  if (listingId) listingId = Decrypt(listingId).id


  if (businessId) businessId = Decrypt(businessId).id



  useEffect(() => {


    head({ title: (!listingId ? 'Add' : 'Edit') + ' Offerings | BCN' })


  }, [listingId])



  const getListing = useCallback(async () => {


    if (processing.current) return


    processing.current = true



    const fetchListing = await api.userAdmin.listing.fetch({ id: listingId })



    if (fetchListing.code === 200) {


      const listing = fetchListing.payload.getListing


      setOldListingImagesUrls(listing.images)


      setBusiness(listing.businessName)


      setFkBusinessId(listing.fkBusinessId)


      // setCategory(listing.category)


      // setSubCategory(listing.subCategory)


      setListingName(listing.listingName)


      setDescription(listing.description)


      setContactPerson(listing.contactPerson)


      setMobile(listing.phoneNo.toString())


      setRejectionMessage(listing.rejectionMessage)


    } else {


      Alert.error(fetchListing.message)


    }


    processing.current = false


  }, [listingId])



  useEffect(() => {


    if (listingId) getListing()


  }, [listingId, getListing])



  const getListingsCount = useCallback(async () => {


    if (processing.current) return


    processing.current = true



    const fetchListingCount = await api.userAdmin.listing.fetchListingsCount({ fkBusinessId: businessId })



    if (fetchListingCount.code === 201) {


      setListingsCount(fetchListingCount.payload.listingsCount)


    } else {


      // Alert.error(fetchListingCount.message)


    }


    processing.current = false


  }, [businessId])



  const getListingsPrefilledData = useCallback(async () => {


    if (processing1.current) return


    processing1.current = true



    const fetchListingsPrefilledData = await api.userAdmin.listing.fetchListingPrefilledData({})



    if (fetchListingsPrefilledData.code === 201) {


      setContactPerson(


        fetchListingsPrefilledData.payload.listingPrefilledData.firstName +


          ' ' +


          fetchListingsPrefilledData.payload.listingPrefilledData.lastName


      )


      setMobile(fetchListingsPrefilledData.payload.listingPrefilledData.phoneNo.toString())


    } else {


      // Alert.error(fetchLastListingsPrefilledData.message)


    }


    processing1.current = false


  }, [])



  useEffect(() => {


    if (!listingId) {


      getListingsCount()


      getListingsPrefilledData()


    }


  }, [listingId, getListingsCount, getListingsPrefilledData])



  const discardAll = () => {


    if (listingImagesUrls.length) {


      listingImagesUrls.forEach(imageUrl => {


        URL.revokeObjectURL(imageUrl)


      })


    }



    setListingImages([])


    setListingImagesUrls([])


    setOldListingImagesUrls([])


    // setBusiness(businesses[0].businessName)


    // setCategory(categories[0].category)


    // setSubCategory(subCategoriesFiltered[0].field)


    setListingName('')


    setDescription('')


    setContactPerson('')


    setMobile('')


  }



  const handleRemoveImage = i => {


    let newSelectedImages = [...listingImages]


    let newImageUrls = [...listingImagesUrls]


    newSelectedImages.splice(i, 1)


    newImageUrls.splice(i, 1)


    URL.revokeObjectURL(listingImagesUrls[i])


    setListingImages(newSelectedImages)


    setListingImagesUrls(newImageUrls)


  }



  const handleRemoveOldImage = i => {


    let newImageUrls = [...oldListingImagesUrls]


    let newRemovedImages = [...oldImagesRemoved]


    newRemovedImages.push(oldListingImagesUrls[i])


    setOldImagesRemoved(newRemovedImages)


    newImageUrls.splice(i, 1)


    setOldListingImagesUrls(newImageUrls)


  }



  const handleListingImagesChange = async e => {


    setIsUploading(true)


    const files = Array.prototype.slice.call(e.target.files)



    if (files.length > 6 - (listingImagesUrls.length + oldListingImagesUrls.length)) {


      Alert.warn('Upto 6 images allowed')


      setIsUploading(false)


      return


    }



    setUploadingProgress(10)



    if (files.length > 0) {


      const newSelectedImages = listingImages


      const newImageUrls = listingImagesUrls


      setUploadingProgress(30)


      const compressedFiles = await imageCompressor(files, 'listing')


      setUploadingProgress(70)



      for (let i = 0; i < compressedFiles.length; i++) {


        const file = compressedFiles[i]


        const imageUrl = URL.createObjectURL(file)


        newSelectedImages.push(file)


        newImageUrls.push(imageUrl)


      }



      setListingImages(newSelectedImages)


      setListingImagesUrls(newImageUrls)


      setUploadingProgress(100)


      setIsUploading(false)


    }


  }



  // const getBusinesses = useCallback(async () => {


  //   if (processing2.current) return


  //   processing2.current = true



  //   const fetchBusinesses = await api.userAdmin.business.fetchAll({})



  //   if (fetchBusinesses.code === 200) {


  //     setBusinesses(fetchBusinesses.payload.getAllBusiness)



  //     // setBusiness(fetchBusinesses.payload.getAllBusiness[0].businessName)


  //   } else {


  //     Alert.error(fetchBusinesses.message)


  //   }


  //   processing2.current = false


  // }, [])



  // useEffect(() => {


  //   getBusinesses()


  // }, [getBusinesses])



  // const getCategories = useCallback(async () => {


  //   if (processing3.current) return



  //   processing3.current = true


  //   setLoading(true)



  //   const fetchCategories = await api.publicApi.categories.fetchAllCategories({})



  //   if (fetchCategories.code === 200) {


  //     setCategories(fetchCategories.payload.categories)


  //     // setCategory(fetchCategories.payload.categories[0].category)


  //   } else {


  //     Alert.error(fetchCategories.message)


  //   }


  //   processing3.current = false


  //   setLoading(false)


  // }, [])



  // useEffect(() => {


  //   getCategories()


  // }, [getCategories])



  // const getSubCategories = useCallback(async () => {


  //   if (processing1.current) return


  //   processing1.current = true



  //   const fetchSubCategories = await api.publicApi.categories.fetchAllSubCategories({})



  //   if (fetchSubCategories.code === 200) {


  //     let subCategoriesFilteredTemp = fetchSubCategories.payload.subCategories.flatMap(categoryField => {


  //       if (categoryField.category === category)


  //         return categoryField.subCategoriesData.map(subcategory => ({


  //           field: subcategory.subCategory


  //         }))


  //       return []


  //     })


  //     setSubCategories(fetchSubCategories.payload.subCategories)


  //     setSubCategoriesFiltered(subCategoriesFilteredTemp)


  //     // setSubCategory(subCategoriesFilteredTemp.length ? subCategoriesFilteredTemp[0].field : '')


  //   } else {


  //     Alert.error(fetchSubCategories.message)


  //   }


  //   processing1.current = false


  // }, [category])



  // useEffect(() => {


  //   if (category) getSubCategories()


  // }, [getSubCategories, category])



  const addHandler = async (finish = false) => {


    if (!listingName) {


      Alert.warn('Offering Name is Required!')


      return


    }



    if (!description) {


      Alert.warn('Description is Required!')


      return


    }



    if (!contactPerson) {


      Alert.warn('Contact Person Name is Required!')


      return


    }



    if (!mobile) {


      Alert.warn('Contact Number is Required!')


      return


    }



    if (mobile.length !== 10) {


      Alert.warn('Invalid Contact Number!')


      return


    }



    if (processing.current) return


    processing.current = true


    setLoading(true)


    setLoadingStatus('Adding Offering...')


    Alert.success('Adding Offering')



    // let fkBusinessId = businesses.filter(x => x.businessName === business)[0]._id



    const addListing = await api.userAdmin.listing.create({


      listingName,


      images: listingImages.map((image, i) => image.name),


      description,


      contactPerson,


      phoneNo: mobile,


      // category,


      // subCategory,


      // businessName: business,


      fkBusinessId: businessId


    })



    if (addListing.code === 201) {


      let res = []



      for (let i = 0; i < listingImages.length; i++) {


        res.push(await uploadToS3(listingImages[i].name, listingImages[i]))


      }



      for (let i = 0; i < listingImagesUrls.length; i++) {


        URL.revokeObjectURL(listingImagesUrls[i])


      }



      const sendNotification = await api.userAdmin.notification.create({


        notification: listingName + ' is added successfully',


        redirect: Encrypt({ path: urlLocation.pathname })


      })



      if (sendNotification.code === 201) {


      } else {


        //   Alert.error(sendNotification.message)


      }



      setListingImagesUrls([])


      setListingImages([])


      // setBusiness('')


      setListingName('')


      // setCategory(categories[0].category)


      // setSubCategory(subCategoriesFiltered.length ? subCategoriesFiltered[0].field : '')


      setDescription('')


      // setContactPerson('')


      // setMobile('')


      Alert.success(addListing.message)


      setListingsCount(listingsCount + 1)


      if (listingsCount === 5) navigate('/userAdmin/businesses')


      if (finish) navigate('/home')


    } else {


      Alert.error(addListing.message)


    }



    setLoading(false)


    processing.current = false


  }



  const saveHandler = async () => {


    if (!listingName) {


      Alert.warn('Offering Name is Required!')


      return


    }



    if (!description) {


      Alert.warn('Description is Required!')


      return


    }



    if (!contactPerson) {


      Alert.warn('Contact Person Name is Required!')


      return


    }



    if (!mobile) {


      Alert.warn('Contact Number is Required!')


      return


    }



    if (mobile.length !== 10) {


      Alert.warn('Invalid Contact Number!')


      return


    }



    if (processing.current) return


    processing.current = true


    setLoading(true)


    setLoadingStatus('Saving Offering...')


    Alert.success('Saving...')



    // let fkBusinessId = businesses.filter(x => x.businessName === business)[0]._id



    const saveListing = await api.userAdmin.listing.update({


      id: listingId,


      listingName,


      images: [...oldListingImagesUrls, ...listingImages.map((image, i) => image.name)],


      description,


      contactPerson,


      phoneNo: mobile,


      // category,


      // subCategory,


      businessName: business,


      fkBusinessId


    })



    if (saveListing.code === 201) {


      if (listingImages.length) {


        let res = []


        for (let i = 0; i < listingImages.length; i++) {


          res.push(await uploadToS3(listingImages[i].name, listingImages[i]))


        }



        for (let i = 0; i < listingImagesUrls.length; i++) {


          URL.revokeObjectURL(listingImagesUrls[i])


        }


      }



      if (oldImagesRemoved.length) {


        let res = []



        for (let i = 0; i < oldImagesRemoved.length; i++) {


          res.push(await removeFromS3(oldImagesRemoved[i]))


        }


      }



      const sendNotification = await api.userAdmin.notification.create({


        notification: listingName + ' is edited successfully',


        redirect: Encrypt({ path: urlLocation.pathname })


      })



      if (sendNotification.code === 201) {


      } else {


        // Alert.error(sendNotification.message)


      }



      setOldImagesRemoved([])


      setOldListingImagesUrls([])


      setListingImagesUrls([])


      setListingImages([])


      Alert.success(saveListing.message)


      // navigate(-1)


      navigate('/userAdmin/businesses')


    } else {


      Alert.error(saveListing.message)


    }



    setLoading(false)


    processing.current = false


  }



  return (


    <div className={s.main}>


      <div className={s.listingActions}>


        {/* <div className={s.header}> */}


        <Layouts.Classic


          title={!listingId ? 'Add Offering / Service / Product' : 'Edit Offering / Service / Product'}


        />


        {/* </div> */}



        {!loading && (


          <div className={s.content + ' innerScrollX'}>


            {!!rejectionMessage && (


              <div className={s.rejectionMessage}>


                <div className={s.title}>


                  This Offering is rejected, please comply with the following and update accordingly.


                </div>


                {rejectionMessage}


              </div>


            )}


            <UploadImages.Multiple


              listingImagesUrls={listingImagesUrls}


              oldListingImagesUrls={oldListingImagesUrls}


              handleListingImagesChange={handleListingImagesChange}


              handleRemoveImage={handleRemoveImage}


              handleRemoveOldImage={handleRemoveOldImage}


              max={6}


            />


            {!!isUploading && (


              <Loader


                message={uploadingProgress + '% uploaded'}


                color='var(--c-primary)'


                colorText='var(--c-primary)'


              />


            )}


            {/* <div className={s.businessFilter}>


              <Filter


                label='Select Business'


                title={business ? business : 'Select Business'}


                heading={business}


                filterFields={businesses.map(business => ({


                  field: business.businessName


                }))}


                forcedTitle={business}


                filterHandler={field => setBusiness(field)}


                style2


              />


            </div> */}


            <Input.Classic


              label='Offering Name *'


              type='text'


              iconLeft='badge'


              placeholder='Enter Offering Name'


              value={listingName}


              onChange={e => setListingName(e.target.value)}


            />


            {/* <div className={s.rows + ' row'}>


              <Filter


                label='Select Category'


                title='choose category'


                heading={category}


                forcedTitle={category}


                filterFields={categories.map(category => ({


                  field: category.category


                }))}


                filterHandler={field => setCategory(field)}


                style2


              />


              {!!subCategoriesFiltered.length && (


                <Filter


                  label='Select Sub-Category'


                  title='choose sub-category'


                  heading={subCategory}


                  forcedTitle={subCategory}


                  filterFields={subCategoriesFiltered}


                  filterHandler={field => setSubCategory(field)}


                  style2


                />


              )}


            </div> */}


            <TextArea.Classic


              label='Description *'


              iconLeft='description'


              placeholder='1000 words (Max.)'


              value={description}


              onChange={e => setDescription(e.target.value)}


            />



            <div className={s.rows + ' row'}>


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


                placeholder='Enter Whatsapp Contact No.'


                value={mobile}


                onChange={e => e.target.value.length <= 10 && setMobile(e.target.value)}


              />


            </div>


            <div className={s.actionButtons}>


              <div className={s.discard} onClick={discardAll}>


                <span className='material-icons-outlined'>remove_circle_outline</span> Discard


              </div>


              <div


                className={s.add + ' ' + (listingsCount === 5 ? s.finish : '')}


                onClick={listingId ? saveHandler : addHandler}


              >


                <span className='material-icons-outlined'>


                  {listingId ? 'save' : listingsCount === 5 ? 'check_circle_outline' : 'add_circle_outline'}


                </span>


                {listingId ? 'Save' : listingsCount === 5 ? 'Finish' : 'Add More'}


              </div>


              {!listingId && listingsCount !== 5 && (


                <div className={s.add + ' ' + s.finish} onClick={() => addHandler(true)}>


                  <span className='material-icons-outlined'>check_circle_outline</span>


                  Finish


                </div>


              )}


            </div>


          </div>


        )}



        {!!loading && (


          <div


            className={s.main}


            style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}


          >


            <Loader message={loadingStatus} color='var(--c-primary)' colorText='var(--c-primary)' />


          </div>


        )}


      </div>


    </div>


  )


}
