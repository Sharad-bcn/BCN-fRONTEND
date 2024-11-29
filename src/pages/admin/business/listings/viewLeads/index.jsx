import React from 'react';


import { Alert, Layouts, Loader, NoData, Table } from 'components'


import s from './styles.module.scss'


import { useParams } from 'react-router-dom'


import { useCallback, useEffect, useRef, useState } from 'react'


import { Decrypt, downloadCsv, head } from 'helpers'


import * as api from 'api'



export default function Main() {


  const [leadsData, setLeadsData] = useState([])


  const [loading, setLoading] = useState([])


  const processing = useRef(false)



  let { listingId } = useParams()


  let listingName = ''


  if (listingId) {


    listingName = Decrypt(listingId).listingName


    listingId = Decrypt(listingId).listingId


  }



  useEffect(() => {


    head({ title: 'View Leads | BCN' })


  }, [])



  const DownloadLeadsHandler = () => {


    Alert.success('Downloading Leads...')


    downloadCsv(leadsData)


  }



  const getLeads = useCallback(async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const fetchLeads = await api.userAdmin.leads.fetchAll({ fkListingId: listingId })



    if (fetchLeads.code === 200) {


      setLeadsData(fetchLeads.payload.leads)


    } else {


      Alert.error('Leads not available')


    }



    setLoading(false)


    processing.current = false


  }, [listingId])



  useEffect(() => {


    if (listingId) getLeads()


  }, [listingId, getLeads])



  return (


    <div className={s.main}>


      <div className={s.viewLeads}>


        {/* <div className={s.header}> */}


        <Layouts.Classic title={listingName ? 'Your leads for ' + listingName : 'Your Leads For “Listing”'}>


          <div className={s.downloadLeads} onClick={leadsData.length ? DownloadLeadsHandler : () => {}}>


            Download Leads


            <span className='material-icons-outlined'>download</span>


          </div>


        </Layouts.Classic>


        {/* </div> */}


        <div className={s.content + ' innerScrollX'} style={{ justifyContent: !leadsData.length && 'center' }}>


          {!loading ? (


            <div className={s.leadsData}>{!!leadsData.length ? <Table.Leads LeadsData={leadsData} /> : <NoData />}</div>


          ) : (


            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


          )}


        </div>


      </div>


    </div>


  )


}
