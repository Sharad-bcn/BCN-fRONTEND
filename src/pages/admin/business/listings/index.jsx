import React from 'react';







import { AdCard, Alert, Filter, InfiniteScroll, Layouts, Loader, NoData, Search } from 'components'



import s from './styles.module.scss'



import { useCallback, useEffect, useRef, useState } from 'react'



import { Decrypt, Encrypt, head, timeFormat } from 'helpers'



import { Link, useLocation, useParams } from 'react-router-dom'



import * as api from 'api'







const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST







const myListingsFilterFields = [



  {



    field: 'All'



  },



  {



    field: 'Active'



  },



  {



    field: 'InActive'



  },



  {



    field: 'Pending'



  }



]







export default function Main() {



  const [selectedFilterField, setSelectedFilterField] = useState(myListingsFilterFields[0].field)



  const [listings, setListings] = useState([])



  const [searchQuery, setSearchQuery] = useState('')



  const [totalPages, setTotalPages] = useState(0)



  const [pageNo, setPageNo] = useState(1)



  const [searchedListings, setSearchedListings] = useState([])



  const [searchedPageNo, setSearchedPageNo] = useState(1)



  const [totalsearchedPages, setTotalSearchedPages] = useState(0)



  const [loading, setLoading] = useState(false)



  const processing = useRef(false)



  const perPage = 10



  let { businessId } = useParams()



  if (businessId) businessId = Decrypt(businessId).id



  const urlLocation = useLocation()







  useEffect(() => {



    head({ title: 'My Listings | BCN' })



  }, [])







  const filterHandler = field => {



    setListings([])



    setPageNo(1)



    setSearchedListings([])



    setSearchedPageNo(1)



    setSelectedFilterField(field)



  }







  const getListings = useCallback(



    async (filter, currPage) => {



      if (processing.current) return



      processing.current = true



      setLoading(true)



      setPageNo(currPage + 1)



      // console.log(filter)







      const fetchListings = await api.userAdmin.listing.fetchAll({



        perPage,



        pageNo: currPage,



        filter,



        searchQuery: '',



        fkBusinessId: businessId



      })







      if (fetchListings.code === 200) {



        setListings(listings.concat(fetchListings.payload.listings))



        setTotalPages(Math.ceil(fetchListings.payload.total / perPage))



      } else {



        // Alert.error('Offerings Not Found')



      }







      setLoading(false)



      processing.current = false



    },



    [listings, businessId]



  )







  const searchHandler = useCallback(



    async (filter, currPage) => {



      if (processing.current) return



      processing.current = true







      setLoading(true)



      setSearchedPageNo(currPage + 1)







      const fetchListings = await api.userAdmin.listing.fetchAll({



        searchQuery,



        perPage,



        pageNo: currPage,



        filter,



        fkBusinessId: businessId



      })







      if (fetchListings.code === 200) {



        setSearchedListings(searchedListings.concat(fetchListings.payload.listings))



        setTotalSearchedPages(Math.ceil(fetchListings.payload.total / perPage))



      } else {



        // Alert.error('Some error occoured')



      }



      processing.current = false



      setLoading(false)



    },



    [searchQuery, businessId, searchedListings]



  )







  const deleteHandler = async id => {



    if (processing.current) return



    processing.current = true







    let listingBeingDeleted = listings.filter(listing => listing._id === id)[0]







    const deleteListing = await api.userAdmin.listing.delete({ id })







    if (deleteListing.code === 200) {



      const sendNotification = await api.userAdmin.notification.create({



        notification: listingBeingDeleted.listingName + ' is removed successfully',



        redirect: Encrypt({ path: urlLocation.pathname })



      })







      if (sendNotification.code === 201) {



      } else {



        //   Alert.error(sendNotification.message)



      }



      setListings(listings.filter(listing => listing._id !== id))



      Alert.warn(deleteListing.message)



    } else {



      Alert.error(deleteListing.message)



    }



    processing.current = false



  }







  return (



    <div className={s.main}>



      <div className={s.myListings}>



        {/* <div className={s.header}> */}



        <Layouts.Classic title='My Offerings'>



          <div className={s.headerBottom}>



            <Search



              placeholder='Search Offerings'



              searchHandler={search => {



                setSearchQuery(search)



                setSearchedListings([])



                setSearchedPageNo(1)



              }}



              isAdmin



            />



            <div className={s.headerInner}>



              <Filter



                title={selectedFilterField}



                heading={selectedFilterField}



                filterFields={myListingsFilterFields}



                filterHandler={filterHandler}



                style2



              />



              {listings.length < 6 && (



                <Link



                  className={s.addListing}



                  to={



                    './addListing'



                    // ?listingsCount=' + listings.length



                  }



                >



                  <span className='material-icons-outlined'>add_circle_outline</span> Add Offering



                </Link>



              )}



            </div>



          </div>



        </Layouts.Classic>



        {/* </div> */}







        <div



          className={s.content + ' innerScrollX'}



          style={{



            justifyContent:



              ((!listings.length && !searchQuery) || (!searchedListings.length && searchQuery)) && 'center'



          }}



        >



          <div className={s.listings}>



            {!!searchQuery && <div className={s.searchResults}>"Search Results for {searchQuery}"</div>}



            {!loading && !listings.length && !searchQuery && <NoData />}



            {!loading && !searchedListings.length && searchQuery && <NoData />}







            <InfiniteScroll



              next={!searchQuery ? getListings : searchHandler}



              filter={selectedFilterField}



              currentPage={!searchQuery ? pageNo : searchedPageNo}



              hasMore={!searchQuery ? pageNo <= totalPages : searchedPageNo <= totalsearchedPages}



              inLayout



            >



              {!searchQuery &&



                listings.map(



                  (



                    {



                      _id,



                      listingName,



                      images,



                      address,



                      description,



                      isActive,



                      isApproved,



                      createdAt,



                      leads,



                      views,



                      businessName,



                      approvalStatus,



                      rejectionMessage,



                      fkBusinessId



                    },



                    i



                  ) => (



                    <AdCard



                      isAdmin



                      id={_id}



                      businessName={businessName}



                      title={listingName}



                      image={IMAGE_HOST + images[0]}



                      fkBusinessId={fkBusinessId}



                      address={address}



                      adInfo={description}



                      status={



                        isApproved



                          ? isActive



                            ? 'active'



                            : 'inactive'



                          : approvalStatus === 'Rejected'



                          ? 'rejected'



                          : 'pending'



                      }



                      isActive={isActive}



                      isApproved={isApproved}



                      deleteHandler={deleteHandler}



                      leads={leads}



                      views={views}



                      rejectionMessage={rejectionMessage}



                      postedOn={timeFormat(createdAt)}



                      key={i}



                    />



                  )



                )}







              {!!searchQuery &&



                searchedListings.map(



                  (



                    {



                      _id,



                      listingName,



                      images,



                      address,



                      description,



                      isActive,



                      isApproved,



                      createdAt,



                      leads,



                      views,



                      businessName,



                      approvalStatus,



                      rejectionMessage,



                      fkBusinessId



                    },



                    i



                  ) => (



                    <AdCard



                      isAdmin



                      id={_id}



                      businessName={businessName}



                      title={listingName}



                      image={IMAGE_HOST + images[0]}



                      fkBusinessId={fkBusinessId}



                      address={address}



                      adInfo={description}



                      status={



                        isApproved



                          ? isActive



                            ? 'active'



                            : 'inactive'



                          : approvalStatus === 'Rejected'



                          ? 'rejected'



                          : 'pending'



                      }



                      isActive={isActive}



                      isApproved={isApproved}



                      deleteHandler={deleteHandler}



                      leads={leads}



                      views={views}



                      rejectionMessage={rejectionMessage}



                      postedOn={timeFormat(createdAt)}



                      key={i}



                    />



                  )



                )}



            </InfiniteScroll>



            {!!loading && <Loader color='var(--c-primary)' colorText='var(--c-primary)' />}



          </div>



        </div>



      </div>



    </div>



  )



}



