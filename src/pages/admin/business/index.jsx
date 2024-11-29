import React from 'react';







import { Alert, Filter, InfiniteScroll, Layouts, Loader, NoData, Table } from 'components'



import s from './styles.module.scss'



import { useCallback, useEffect, useRef, useState } from 'react'



import { Encrypt, head } from 'helpers'



import { Link, useLocation } from 'react-router-dom'



import * as api from 'api'







const myBusinessFilterFields = [



  {



    field: 'All'



  },



  {



    field: 'Active'



  },



  // {



  //   field: 'InActive'



  // },



  {



    field: 'Pending'



  }



]







export default function Main() {



  const [selectedFilterField, setSelectedFilterField] = useState(myBusinessFilterFields[0].field)



  const [totalPages, setTotalPages] = useState(0)



  const [pageNo, setPageNo] = useState(1)



  const [loading, setLoading] = useState(false)



  const [businesses, setBusinesses] = useState([])



  const [businessesCount, setBusinessesCount] = useState([])



  const processing = useRef(false)



  const processing1 = useRef(false)



  const perPage = 10



  const urlLocation = useLocation()







  const getBusinessesCount = useCallback(async () => {



    if (processing1.current) return



    processing1.current = true



    setLoading(true)







    const fetchBusinessesCount = await api.userAdmin.business.fetchAll({



      perPage,



      pageNo: 1,



      filter: ''



    })







    if (fetchBusinessesCount.code === 200) {



      setBusinessesCount(fetchBusinessesCount.payload.total)



    } else {



      // Alert.error(fetchBusinessesCount.message)



    }



    processing1.current = false



    setLoading(false)



  }, [])







  useEffect(() => {



    getBusinessesCount()



  }, [getBusinessesCount])







  const getBusinesses = useCallback(



    async (filter, currPage) => {



      if (processing.current) return



      processing.current = true







      setLoading(true)



      setPageNo(currPage + 1)







      const fetchBusinesses = await api.userAdmin.business.fetchAll({



        perPage,



        pageNo: currPage,



        filter



      })







      if (fetchBusinesses.code === 200) {



        setBusinesses(businesses.concat(fetchBusinesses.payload.getAllBusiness))



        setTotalPages(Math.ceil(fetchBusinesses.payload.total / perPage))



      } else {



        // Alert.error(fetchBusinesses.message)



      }



      processing.current = false



      setLoading(false)



    },



    [businesses]



  )







  const filterHandler = field => {



    setBusinesses([])



    setPageNo(1)



    setSelectedFilterField(field)



  }







  const deleteHandler = async id => {



    if (processing.current) return



    processing.current = true







    let businessBeingDeleted = businesses.filter(business => business._id === id)[0]







    const deleteBusiness = await api.userAdmin.business.delete({ id })







    if (deleteBusiness.code === 200) {



      const sendNotification = await api.userAdmin.notification.create({



        notification: businessBeingDeleted.businessName + " is deleted successfully along with all it's offerings",



        redirect: Encrypt({ path: urlLocation.pathname })



      })







      if (sendNotification.code === 201) {



      } else {



        // Alert.error(sendNotification.message)



      }



      setBusinesses(businesses.filter(business => business._id !== id))



      Alert.warn(deleteBusiness.message)



    } else {



      Alert.error(deleteBusiness.message)



    }



    processing.current = false



  }







  useEffect(() => {



    head({ title: 'My Businesses | BCN' })



  }, [])







  return (



    <div className={s.main}>



      <div className={s.businesses}>



        {/* <div className={s.header}> */}



        <Layouts.Classic title='My Business'>



          <div className={s.headerInner}>



            {/* <Link className={s.addBusiness} to='/userAdmin/businesses/listings/addListing'>



                <span className='material-icons-outlined'>add_circle_outline</span> Add Offering



              </Link> */}



            <Filter



              title={selectedFilterField}



              heading={selectedFilterField}



              filterFields={myBusinessFilterFields}



              filterHandler={filterHandler}



              style2



            />



            {businessesCount < 5 && (



              <Link className={s.addBusiness} to='./registerBusiness/part1'>



                <span className='material-icons-outlined'>add_circle_outline</span> Register Business



              </Link>



            )}



          </div>



        </Layouts.Classic>



        {/* </div> */}



        <div className={s.content + ' innerScrollX'} style={{ justifyContent: !businesses.length && 'center' }}>



          {!loading && !businesses.length && <NoData />}







          <InfiniteScroll



            next={getBusinesses}



            filter={selectedFilterField}



            currentPage={pageNo}



            hasMore={pageNo <= totalPages}



            inLayout



          >



            {!!businesses.length && (



              <div className={s.businessesData}>



                <Table.Business businessesData={businesses} deleteHandler={deleteHandler} />



              </div>



            )}



          </InfiniteScroll>



          {!!loading && <Loader color='var(--c-primary)' colorText='var(--c-primary)' />}



        </div>



      </div>



    </div>



  )



}



