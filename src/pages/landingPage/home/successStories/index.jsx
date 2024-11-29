import React from 'react';


import { useEffect, useState, useRef, useCallback } from 'react'


import s from './styles.module.scss'


import images from 'images'


import * as api from 'api'


import { ImageTag, Loader } from 'components'


const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



const successStoriesData = [


  {


    name: 'Ayush Pal',


    designation: 'Entrepruener',


    image: images.Profile,


    testimony:


      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."


  },


  {


    name: 'Ayush Pal',


    designation: 'Entrepruener',


    image: images.Profile,


    testimony:


      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."


  },


  {


    name: 'Ayush Pal',


    designation: 'Entrepruener',


    image: images.Profile,


    testimony:


      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."


  }


]



export default function Main() {


  const [successStories, setSuccessStories] = useState(successStoriesData)


  const [successStoriesFetched, setSuccessStoriesFetched] = useState(false)


  const [loading, setLoading] = useState(false)


  const mediaMatch = window.matchMedia('(max-width: 1279px)')


  const [matches, setMatches] = useState(mediaMatch.matches)


  const processing = useRef(false)



  const getSuccessStories = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchSuccessStories = await api.publicApi.landingPage.fetchSuccessStories({})



    if (fetchSuccessStories.code === 200) {


      setSuccessStories(fetchSuccessStories.payload.successStories)


      setSuccessStoriesFetched(true)


    }



    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    const handler = e => setMatches(e.matches)


    mediaMatch.addEventListener('change', handler)


    return () => mediaMatch.removeEventListener('change', handler)


  })



  useEffect(() => {


    const swiper = new window.Swiper('.mySwiperStory', {


      slidesPerView: matches ? 1 : 3,


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


  }, [successStoriesFetched, successStories, matches])



  useEffect(() => {


    getSuccessStories()


  }, [getSuccessStories])



  return (


    <div className={s.main}>


      {!!successStories.length && (


        <div className={s.successStoriesOuter}>


          {!loading && (


            <div className={s.successStories}>


              <div className={s.title}>Success Stories</div>


              <div className={s.successStoriesData}>


                <div className={'swiper mySwiperStory ' + s.swiperContainer}>


                  <div className='swiper-wrapper'>


                    {successStories.map(({ name, designation, image, testimony }, i) => (


                      <div className={s.successStory + ' swiper-slide'} key={i}>


                        <div className={s.quotes}>


                          <img src={images.quotes} alt='' />


                        </div>


                        <div className={s.story}>{testimony}</div>


                        <div className={s.quotesLast}>


                          <img src={images.quotes} alt='' />


                        </div>


                        <div className={s.storyUser}>


                          <div className={s.userImage}>


                            <ImageTag src={successStoriesFetched ? IMAGE_HOST + image : image} alt='' />


                          </div>


                          <div className={s.user}>


                            <div>{name}</div>


                            <div>{designation}</div>


                          </div>


                        </div>


                      </div>


                    ))}


                  </div>


                  <div className='swiper-button-next'></div>


                  <div className='swiper-button-prev'></div>


                  <div className={'swiper-pagination ' + s.swiperPagination}></div>


                </div>


              </div>


            </div>


          )}


          {!!loading && (


            <div className={s.loader}>


              <Loader color='var(--c-white)' colorText='var(--c-white)' />


            </div>


          )}


        </div>


      )}


    </div>


  )


}
