import React from 'react';


import { Alert, Loader } from 'components'


import s from './styles.module.scss'


import { useCallback, useEffect, useRef, useState } from 'react'


import { Decrypt, head, print, timeFormat } from 'helpers'


import { Link, useNavigate, useParams } from 'react-router-dom'


import * as api from 'api'


import images from 'images'


import { plans } from 'data'



export default function Main() {


  const [isDownloading, setIsDownloading] = useState(false)


  const [loading, setLoading] = useState(false)


  const [data, setData] = useState('')


  const processing = useRef(false)


  const navigate = useNavigate()



  let { paymentDetails } = useParams()


  if (paymentDetails) paymentDetails = Decrypt(paymentDetails).paymentDetails



  useEffect(() => {


    head({ title: 'Payment Success | BCN' })


  }, [])



  const isValid = useCallback(async () => {


    if (processing.current) return


    processing.current = true



    setLoading(true)



    const validPayment = await api.publicApi.user.validPayment({


      id: paymentDetails.paymentId


    })



    if (validPayment.code === 201) {


      let data = {


        paymentId: paymentDetails.paymentId,


        method: paymentDetails.method,


        isLoggedIn: paymentDetails.isLoggedIn,


        firstName: validPayment.payload.user.firstName,


        lastName: validPayment.payload.user.lastName,


        email: validPayment.payload.user.email,


        contact: '+91-' + validPayment.payload.user.phoneNo.toString(),


        planDuration: plans.filter(x => x.name === validPayment.payload.user.plan)[0].duration,


        date: validPayment.payload.user.createdAt,


        amount: Number(plans.filter(x => x.name === validPayment.payload.user.plan)[0].price)


      }



      setData(data)


    } else {


      Alert.error('Invalid payment')


      navigate('/home', { replace: true })


    }


    processing.current = false


    setLoading(false)


  }, [paymentDetails.paymentId, paymentDetails.method, paymentDetails.isLoggedIn, navigate])



  useEffect(() => {


    isValid()


  }, [isValid])



  return !!data && !loading ? (


    <div className={s.successPage}>


      <div className={s.successPageInner}>


        <div className={s.header}>


          <div className={s.logo}>


            <img src={images.logo} alt='' />


          </div>


          <div className={s.headerTop}>


            <div className={s.title}>Payment Success</div>


            <div className={s.successIcon}>


              <span className='material-icons'>check_circle</span>


            </div>


          </div>


        </div>


        <div className={s.body}>


          <div className={s.info}>


            <div>Payment Id:</div>


            <div>{data.paymentId}</div>


          </div>


          <div className={s.info + ' ' + s.name}>


            <div>Name:</div>


            <div>{data.firstName + ' ' + data.lastName}</div>


          </div>


          {!!data.email && (


            <div className={s.info}>


              <div>Email:</div>


              <div>{data.email}</div>


            </div>


          )}


          <div className={s.info}>


            <div>Contact:</div>


            <div>{data.contact}</div>


          </div>


          <div className={s.info}>


            <div>Plan Duration:</div>


            <div>{data.planDuration}</div>


          </div>


          <div className={s.info}>


            <div>Date:</div>


            <div>{timeFormat(data.date)}</div>


          </div>


          <div className={s.info}>


            <div>Time:</div>


            <div>{timeFormat(data.date, true).split(', ').pop()}</div>


          </div>


          <div className={s.info + ' ' + s.payMethod}>


            <div>Payment Method:</div>


            <div>{data.method}</div>


          </div>


          <div className={s.info + ' ' + s.amount}>


            <div>Amount:</div>


            <div>INR, {data.amount}</div>


          </div>


        </div>


        {!isDownloading && (


          <div className={s.actionButtons}>


            <div className={s.continue} onClick={() => (data.isLoggedIn ? navigate(-1) : navigate('/login'))}>


              Continue


            </div>


            <div


              className={s.downloadReceipt}


              onClick={async () => {


                setIsDownloading(true)


                Alert.success('Downloading receipt...')


                await print(document.querySelector(`.receipt`), 'Receipt')


                setIsDownloading(false)


                Alert.success('Receipt downloaded successfully...')


              }}


            >


              <span className='material-icons-outlined'>file_download</span>


              Get PDF Receipt


            </div>


          </div>


        )}


      </div>



      <div className={s.printReceipt}>


        <div className={s.successPageInner + ' receipt ' + s.receiptDownload}>


          <div className={s.header}>


            <div className={s.logo}>


              <img src={images.logo} alt='' />


            </div>


            <div className={s.headerTop}>


              <div className={s.title}>Payment Success</div>


              <div className={s.successIcon}>


                <span className='material-icons'>check_circle</span>


              </div>


            </div>


          </div>


          <div className={s.body}>


            <div className={s.info}>


              <div>Payment Id:</div>


              <div>{data.paymentId}</div>


            </div>


            <div className={s.info + ' ' + s.name}>


              <div>Name:</div>


              <div>{data.firstName + ' ' + data.lastName}</div>


            </div>


            {!!data.email && (


              <div className={s.info}>


                <div>Email:</div>


                <div>{data.email}</div>


              </div>


            )}


            <div className={s.info}>


              <div>Contact:</div>


              <div>{data.contact}</div>


            </div>


            <div className={s.info}>


              <div>Plan Duration:</div>


              <div>{data.planDuration}</div>


            </div>


            <div className={s.info}>


              <div>Date:</div>


              <div>{timeFormat(data.date)}</div>


            </div>


            <div className={s.info}>


              <div>Time:</div>


              <div>{timeFormat(data.date, true).split(', ').pop()}</div>


            </div>


            <div className={s.info + ' ' + s.payMethod}>


              <div>Payment Method:</div>


              <div>{data.method}</div>


            </div>


            <div className={s.info + ' ' + s.amount}>


              <div>Amount:</div>


              <div>INR, {data.amount}</div>


            </div>


          </div>


        </div>


      </div>


    </div>


  ) : (


    <div className={s.loader}>


      <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


    </div>


  )


}
