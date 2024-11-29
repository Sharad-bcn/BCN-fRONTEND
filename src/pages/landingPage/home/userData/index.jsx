import React from 'react';


import { useCallback, useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'


import * as api from 'api'


import { Alert } from 'components'



let userData = [


  {


    field: 'Registered Users',


    count: 0


  },


  {


    field: 'Active Across Cities',


    count: 0


  },


  {


    field: 'Registered Businesses',


    count: 0


  },


  {


    field: 'Jobs Posted',


    count: 0


  },


  {


    field: 'Matrimonial Profiles',


    count: 0


  },


  {


    field: 'Leads Generated',


    count: 0


  }


]



export default function Main() {


  const [userCommonData, setUserCommonData] = useState([])


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getUserData = useCallback(async () => {


    if (processing.current) return


    processing.current = true


    setLoading(true)



    const getCommonData = await api.publicApi.landingPage.fetchCommonInfo()



    if (getCommonData.code === 200) {


      let tempUserData = [...userData]


      tempUserData[0].count = getCommonData.payload.usersCount


      tempUserData[1].count = getCommonData.payload.citiesCount > 700 ? '700+' : getCommonData.payload.citiesCount


      tempUserData[2].count = getCommonData.payload.businessesCount


      tempUserData[5].count = getCommonData.payload.leadsCount


      setUserCommonData(tempUserData)


    } else {


      Alert.error(getCommonData.message)


    }



    setLoading(false)


    processing.current = false


  }, [])



  useEffect(() => {


    getUserData()


  }, [getUserData])



  return (


    !loading && (


      <div className={s.main}>


        <div className={s.userData + ' indent'}>


          {userCommonData.map(({ field, count }, i) => (


            <div className={s.userDataField} key={i}>


              <IncrementAnimation maxCount={count} />


              <div>{field}</div>


            </div>


          ))}


        </div>


      </div>


    )


  )


}



const IncrementAnimation = ({ maxCount }) => {


  const [count, setCount] = useState(0)



  useEffect(() => {


    if (count < maxCount) {


      const increment = setInterval(() => {


        setCount(prevCount => Math.min(prevCount + 1, maxCount))


      }, 50) // Adjust the interval duration for faster or slower animation



      return () => clearInterval(increment)


    }


  }, [count, maxCount])



  return <div>{count}</div>


}
