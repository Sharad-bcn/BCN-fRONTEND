import React from 'react';


import { Link } from 'react-router-dom'


import s from './styles.module.scss'


import { useSelector } from 'react-redux'


import { useCallback, useEffect, useRef, useState } from 'react'


import * as api from 'api'


import { Alert, ImageTag, Input, Loader, NoData } from 'components'


const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



export default function Main() {


  const [services, setServices] = useState([])


  const [filteredServices, setFilteredServices] = useState([])


  const [searchCategory, setSearchCategory] = useState('')


  const [loading, setLoading] = useState(false)


  const mediaMatch = window.matchMedia('(max-width: 1279px)')


  const [matches, setMatches] = useState(mediaMatch.matches)


  const processing = useRef(false)


  const location = useSelector(state => state.location).location



  const chunkArray = (array, size) => {


    const result = []


    for (let i = 0; i < array.length; i += size) {


      result.push(array.slice(i, i + size))


    }


    return result


  }



  const getServices = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchCategories = await api.publicApi.categories.fetchAllCategories({})



    if (fetchCategories.code === 200) {


      setServices(fetchCategories.payload.categories)


      setFilteredServices(chunkArray(fetchCategories.payload.categories, matches ? 12 : 21))


    } else {


      Alert.error(fetchCategories.message)


    }


    processing.current = false


    setLoading(false)


  }, [matches])



  useEffect(() => {


    getServices()


  }, [getServices])



  useEffect(() => {


    const handler = e => setMatches(e.matches)


    mediaMatch.addEventListener('change', handler)


    return () => mediaMatch.removeEventListener('change', handler)


  })



  useEffect(() => {


    if (filteredServices.length) {


      const swiper = new window.Swiper('.mySwiperService', {


        slidesPerView: 1,


        spaceBetween: 50,


        loop: true,


        autoplay: false,


        pagination: {


          el: '.swiper-pagination',


          clickable: true,


          dynamicBullets: true


        },


        navigation: {


          nextEl: '.swiper-button-next',


          prevEl: '.swiper-button-prev'


        }


      })


      return () => {


        if (swiper) swiper.destroy()


      }


    }


  }, [filteredServices, matches])



  const filterHandler = value => {


    setSearchCategory(value)


    if (!value) setFilteredServices(chunkArray(services, matches ? 12 : 21))


    else {


      let filteredCategories = []


      for (const category of services) {


        const regex = new RegExp(value, 'i')


        if (regex.test(category.category)) filteredCategories.push(category)


      }


      filteredCategories = chunkArray(filteredCategories, matches ? 12 : 21)


      setFilteredServices(filteredCategories)


    }


  }



  return (


    <div className={s.main}>


      {!loading && (


        <div className={s.servicesOuter + ' indent'}>


          <div className={s.title}>Categories</div>


          <div className={s.filter}>


            <Input.Classic


              type='text'


              iconRight='filter_alt'


              placeholder='Search category...'


              value={searchCategory}


              onChange={e => filterHandler(e.target.value)}


            />


          </div>


          {!!filteredServices.length && (


            <div className={s.services}>


              <div className={'swiper mySwiperService ' + s.swiperContainer}>


                <div className={'swiper-wrapper ' + s.swiperWrapper}>


                  {filteredServices.map((service, index) => (


                    <div className={s.swiperSlide + ' swiper-slide'} key={index}>


                      {service.map(({ category, image }, i) => (


                        <Link


                          className={s.serviceField}


                          to={'/' + location + '?category=' + encodeURIComponent(category)}


                          key={i}


                        >


                          <div>


                            <ImageTag src={IMAGE_HOST + image} alt='' />


                          </div>


                          <div>{category}</div>


                        </Link>


                      ))}


                    </div>


                  ))}


                </div>


                <div className='swiper-button-next'></div>


                <div className='swiper-button-prev'></div>


                <div className={'swiper-pagination ' + s.swiperPagination}></div>


              </div>


            </div>


          )}


          {!filteredServices.length && <NoData />}


        </div>


      )}


      {!!loading && (


        <div className={s.loader}>


          <Loader color='var(--c-white)' colorText='var(--c-white)' />


        </div>


      )}


    </div>


  )


}
