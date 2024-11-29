import React from 'react';







import {



  AdCard,



  Alert,



  BusinessCard,



  Filter,



  InfiniteScroll,



  Loader,



  Location,



  NoData,



  ScrollToTop,



  Search



} from 'components'



import s from './styles.module.scss'



import { useState, useEffect, useCallback, useRef } from 'react'



import { head } from 'helpers'



import { useSelector } from 'react-redux'



import * as api from 'api'



const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST







const filterFields = [



  { field: 'Date, new to old' },



  { field: 'Date, old to new' },



  { field: 'Alphabetically A-Z' },



  { field: 'Alphabetically Z-A' }



]







export default function Main() {



  const category = new URLSearchParams(window.location.search).get('category') || ''



  const subCategory = new URLSearchParams(window.location.search).get('subCategory') || ''



  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(window.location.search).get('searchQuery') || '')



  const location = useSelector(state => state.location).location



  const [sort, setSort] = useState(filterFields[0].field)



  const [totalPages, setTotalPages] = useState(0)



  const [pageNo, setPageNo] = useState(1)



  const [pageData, setPageData] = useState([])



  const [searchedData, setSearchedData] = useState([])



  const [searchedPageNo, setSearchedPageNo] = useState(1)



  const [totalSearchedPages, setTotalSearchedPages] = useState(0)



  const [loading, setLoading] = useState(false)



  const processing = useRef(false)



  const perPage = 10







  // console.log(searchQuery)







  const filterHandler = field => {



    if (searchQuery) {



      setSearchedData([])



      setSearchedPageNo(1)



    } else {



      setPageData([])



      setPageNo(1)



    }



    setSort(field)



  }







  useEffect(() => {



    head({



      title:



        ((searchQuery ? searchQuery : subCategory ? subCategory : category) || 'Offerings') +



        ' in ' +



        location +



        ' | BCN'



    })



  }, [subCategory, category, location, searchQuery])







  //imp on location change infinite scroll rerenderer



  useEffect(() => {



    setPageData([])



    setPageNo(1)



    setSearchedData([])



    setSearchedPageNo(1)



  }, [location])







  // useEffect(() => {



  //   if (!searchQuery) {



  //     setPageData([])



  //     setPageNo(1)



  //   } else {



  //     setSearchedData([])



  //     setSearchedPageNo(1)



  //   }



  // }, [searchQuery])







  const getData = useCallback(



    async (filter, currPage) => {



      if (processing.current) return



      processing.current = true







      setLoading(true)



      setPageNo(currPage + 1)







      const fetchData = await api.publicApi.searchResults.fetchBaseFields({



        city: location,



        limit: perPage,



        pageNo: currPage,



        category,



        subCategory,



        filter



      })







      if (fetchData.code === 200) {



        setPageData(pageData.concat(fetchData.payload.results))



        setTotalPages(Math.ceil(fetchData.payload.total / perPage))



      } else {



        if (currPage === 1) Alert.error(fetchData.message)



      }







      processing.current = false



      setLoading(false)



    },



    [location, pageData, category, subCategory]



  )







  const searchHandler = useCallback(



    async (filter, currPage) => {



      if (processing.current) return



      processing.current = true



      // console.log('called')







      setLoading(true)



      setSearchedPageNo(currPage + 1)







      const fetchData = await api.publicApi.searchResults.searchFields({



        searchQuery: filter.searchQuery,



        city: location,



        limit: perPage,



        pageNo: currPage,



        filter: filter.sort



      })







      if (fetchData.code === 200) {



        setSearchedData(searchedData.concat(fetchData.payload.results))



        setTotalSearchedPages(Math.ceil(fetchData.payload.total / perPage))



      } else {



        if (currPage === 1) Alert.error('No results found!!')



        // Alert.error(fetchData.message)



      }



      processing.current = false



      setLoading(false)



    },



    [location, searchedData]



  )







  return (



    <div className={s.main}>



      <div className={s.searchOuter}>



        <div className={s.search + ' indent'}>



          <div className={s.header}>



            <div className={s.searchField}>



              <div className={s.fields}>



                <Location />



                <Filter



                  title='Sort By'



                  heading={sort}



                  filterFields={filterFields}



                  filterHandler={filterHandler}



                  style2



                />



              </div>







              <Search



                searchHandler={search => {



                  if (search) {



                    setSearchedData([])



                    setSearchedPageNo(1)



                    // if (!searchedListings.length)



                    setSearchQuery(search)



                  }



                }}



              />



            </div>



            <Filter title='Sort By' heading={sort} filterFields={filterFields} filterHandler={filterHandler} style2 />



          </div>



          <div className={s.adsSection}>



            <div className={s.title}>



              "



              {((searchQuery ? searchQuery : subCategory ? subCategory : category) || 'Businesses & Offerings') +



                '" in ' +



                location}



            </div>



            {!loading && !pageData.length && !searchQuery && <NoData />}



            {!loading && !searchedData.length && searchQuery && <NoData />}







            <InfiniteScroll



              next={!searchQuery ? getData : searchHandler}



              filter={!searchQuery ? sort : { sort, searchQuery }}



              currentPage={!searchQuery ? pageNo : searchedPageNo}



              hasMore={!searchQuery ? pageNo <= totalPages : searchedPageNo <= totalSearchedPages}



            >



              <div className={s.ads}>



                {!searchQuery &&



                  pageData.map((data, i) =>



                    data.listingName ? (



                      <AdCard



                        id={data._id}



                        title={data.listingName}



                        businessName={data.businessName}



                        image={IMAGE_HOST + data.images[0]}



                        address={data.address}



                        adInfo={data.description}



                        phoneNo={data.phoneNo}



                        fkUserId={data.fkUserId}



                        fkBusinessId={data.fkBusinessId}



                        key={i}



                      />



                    ) : (



                      <BusinessCard



                        id={data._id}



                        businessName={data.businessName}



                        image={IMAGE_HOST + data.images[0]}



                        address={data.address}



                        description={data.description}



                        phoneNo={data.phoneNo}



                        website={data.website}



                        fkUserId={data.fkUserId}



                        businessLocation={{



                          lat: data.location.coordinates[1],



                          lng: data.location.coordinates[0]



                        }}



                        key={i}



                      />



                    )



                  )}



                {!!searchQuery &&



                  searchedData.map((data, i) =>



                    data.listingName ? (



                      <AdCard



                        id={data._id}



                        businessName={data.businessName}



                        title={data.listingName}



                        image={IMAGE_HOST + data.images[0]}



                        address={data.address}



                        adInfo={data.description}



                        phoneNo={data.phoneNo}



                        fkUserId={data.fkUserId}



                        fkBusinessId={data.fkBusinessId}



                        key={i}



                      />



                    ) : (



                      <BusinessCard



                        id={data._id}



                        businessName={data.businessName}



                        image={IMAGE_HOST + data.images[0]}



                        address={data.address}



                        description={data.description}



                        phoneNo={data.phoneNo}



                        website={data.website}



                        fkUserId={data.fkUserId}



                        businessLocation={{



                          lat: data.location.coordinates[1],



                          lng: data.location.coordinates[0]



                        }}



                        key={i}



                      />



                    )



                  )}



              </div>



            </InfiniteScroll>



            {!!loading && <Loader color='var(--c-primary)' colorText='var(--c-primary)' />}



          </div>



        </div>



        <ScrollToTop />



      </div>



    </div>



  )



}



