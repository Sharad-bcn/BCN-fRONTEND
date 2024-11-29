import React from 'react';


import { Link } from 'react-router-dom'


import s from './styles.module.scss'


import { useSelector } from 'react-redux'


import * as api from 'api'


import { Alert, ImageTag } from 'components'


import { useCallback, useEffect, useRef, useState } from 'react'



export default function Main() {


  const [trendingServices, setTrendingServices] = useState([])


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)


  const location = useSelector(state => state.location).location


  const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



  const getTrendingServices = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchSubCategories = await api.publicApi.categories.fetchAllSubCategories({})



    if (fetchSubCategories.code === 200) {


      setTrendingServices(fetchSubCategories.payload.subCategories)


    } else {


      Alert.error(fetchSubCategories.message)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getTrendingServices()


  }, [getTrendingServices])



  return (


    !loading && (


      <div className={s.main}>


        <div className={s.trending + ' indent'}>


          <div className={s.title}>Trending</div>


          <div className={s.trendingFields}>


            {trendingServices.map(({ category, subCategoriesData }, i) => (


              <div className={s.trendingField} key={i}>


                <Link className={s.fieldHeading} to={'/' + location + '?category=' + encodeURIComponent(category)}>


                  {category}


                </Link>


                <div className={s.subFields}>


                  {subCategoriesData.map(


                    ({ subCategory, image }, j) =>


                      j < 3 && (


                        <Link


                          className={s.subField}


                          key={j}


                          to={


                            '/' +


                            location +


                            '?category=' +


                            encodeURIComponent(category) +


                            '&subCategory=' +


                            encodeURIComponent(subCategory)


                          }


                        >


                          <div>


                            <ImageTag src={IMAGE_HOST + image} alt='' />


                          </div>


                          <div>{subCategory}</div>


                        </Link>


                      )


                  )}


                </div>


              </div>


            ))}


          </div>


        </div>


      </div>


    )


  )


}
