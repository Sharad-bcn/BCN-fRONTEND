import React from 'react';


import s from './styles.module.scss'


import { ImageTag, Alert } from 'components'


import { useEffect, useRef, useState, useCallback } from 'react'


import * as api from 'api'


import { Link } from 'react-router-dom'


const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST


const REACT_APP_PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL



export default function Main() {


  const [banners, setBanners] = useState([])


  const [links, setLinks] = useState([])


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)


  const swiperRef = useRef(null)


  const [youtubeAPIReady, setYoutubeAPIReady] = useState(false)


  const [youtubePlayers, setYoutubePlayers] = useState([])



  const getBanners = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchBanners = await api.publicApi.landingPage.fetchBanners({})



    if (fetchBanners.code === 200) {


      setBanners(fetchBanners.payload.bannersData.banners)


      setLinks(fetchBanners.payload.bannersData.links)


    } else {


      Alert.error(fetchBanners.message)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getBanners()



    // Check YouTube API readiness when component mounts


    if (window.YT) {


      setYoutubeAPIReady(true)


    } else {


      // Wait for the API to be ready


      window.onYouTubeIframeAPIReady = () => {


        setYoutubeAPIReady(true)


      }


    }


  }, [getBanners])



  // const stopAllVideos = useCallback(


  //   index => {


  //     const iframes = document.querySelectorAll('.swiper-slide iframe')


  //     iframes.forEach((iframe, i) => {


  //       if (index === undefined || i + banners.length !== index) {


  //         iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')


  //       }


  //     })


  //   },


  //   [banners.length]


  // )



  // const playVideo = useCallback(


  //   index => {


  //     stopAllVideos(index)


  //     const iframe = document.querySelector(`.swiper-slide[data-swiper-slide-index="${index}"] iframe`)


  //     // if (iframe) iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')



  //     if (iframe) {


  //       const iframeSrc = iframe.src


  //       const videoId = new URLSearchParams(new URL(iframeSrc.replace(/\/embed\//, '/watch?v=')).search)


  //         .get('v')


  //         .split('?')[0]



  //       const player = new window.YT.Player(iframe, {


  //         videoId,


  //         events: {


  //           onReady: () => {


  //             player.playVideo()


  //           }


  //         }


  //       })



  //       console.log(player)


  //     }


  //   },


  //   [stopAllVideos]


  // )



  // const pauseVideo = index => {


  //   const iframe = document.querySelector(`.swiper-slide[data-swiper-slide-index="${index}"] iframe`)


  //   if (iframe) iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')


  // }



  const stopAllVideos = useCallback(


    index => {


      if (youtubePlayers.length) {


        for (let i = 0; i < youtubePlayers.length; i++) {


          const player = youtubePlayers[i]


          if (index === undefined || player.index !== index) {


            if (player.player && player.player.pauseVideo) {


              player.player.pauseVideo()


            }


          }


        }


      }


    },


    [youtubePlayers]


  )



  // const playVideo = useCallback(


  //   index => {


  //     if (youtubePlayers.length) {


  //       let player = youtubePlayers.find(player => player.index === index)


  //       if (player && player.player && player.player.playVideo) {


  //         player.player.playVideo()


  //       }


  //     }


  //   },


  //   [youtubePlayers]


  // )



  const handleSlideChange = useCallback(() => {


    const activeIndex = swiperRef.current.realIndex


    const isVideoSlide = activeIndex >= banners.length



    if (isVideoSlide) {


      stopAllVideos(activeIndex)


      // playVideo(activeIndex)


      // console.log('playing ', activeIndex, banners.length)



      if (swiperRef.current.autoplay.running) swiperRef.current.autoplay.stop()


    } else {


      // Video slide is being left, pause the video


      stopAllVideos()


      // console.log('paused ', activeIndex, banners.length)



      if (!swiperRef.current.autoplay.running) swiperRef.current.autoplay.start()


    }


  }, [banners.length, stopAllVideos])



  useEffect(() => {


    const setupYouTubePlayers = async () => {


      if (links.length && youtubeAPIReady) {


        const iframes = document.querySelectorAll('.swiper-slide iframe')


        let newPlayers = []



        if (iframes.length) {


          for (let i = 0; i < iframes.length; i++) {


            const iframe = iframes[i]


            const iframeSrc = iframe.src


            const videoId = new URLSearchParams(new URL(iframeSrc.replace(/\/embed\//, '/watch?v=')).search)


              .get('v')


              .split('?')[0]



            if (videoId) {


              const player = new window.YT.Player(iframe, {


                videoId,


                // playerVars: {


                //   autoplay: 1,


                //   controls: 1,


                //   showinfo: 0, // Hide video title and uploader


                //   rel: 0, // Disable related videos


                //   modestbranding: 1, // Reduce YouTube branding


                //   iv_load_policy: 3 // Hide annotations


                // },


                events: {


                  onReady: () => {


                    // Optional: Do something when the player is ready


                    // console.log('Player is ready!')


                  },


                  onStateChange: e => {


                    if (e.data === window.YT.PlayerState.ENDED) {


                      player.playVideo()


                    }


                  }


                }


              })



              newPlayers.push({


                index: i + banners.length, // Adjust index for YouTube videos


                player


              })


            }


          }



          setYoutubePlayers(newPlayers)


        }


      }


    }



    setupYouTubePlayers()



    return () => {


      // Cleanup players on component unmount


      if (youtubePlayers.length) youtubePlayers.forEach(({ player }) => player.destroy())


    }


  }, [links.length, banners.length, youtubeAPIReady])



  useEffect(() => {


    if ((banners.length || links.length) && youtubeAPIReady) {


      swiperRef.current = new window.Swiper('.mySwiper', {


        slidesPerView: 1,


        spaceBetween: 50,


        loop: true,


        autoplay: {


          delay: 5000, // Adjust as needed


          disableOnInteraction: false


        },


        pagination: {


          el: '.swiper-pagination',


          clickable: true,


          dynamicBullets: true


        },


        navigation: {


          nextEl: '.swiper-button-next',


          prevEl: '.swiper-button-prev'


        },


        on: {


          slideChange: handleSlideChange


        }


      })



      return () => {


        if (swiperRef.current) swiperRef.current.destroy()


      }


    }


  }, [links, banners, handleSlideChange, youtubeAPIReady])



  return (


    !loading && (


      <div className={s.main}>


        <div className={s.banners}>


          {(!!banners.length || !!links.length) && (


            <div className={'swiper mySwiper ' + s.swiperContainer}>


              <div className='swiper-wrapper'>


                {banners.map((image, i) => (


                  <Link to='/aboutUs' className={s.slide + ' swiper-slide'} key={i}>


                    <ImageTag src={IMAGE_HOST + image} alt='' />


                  </Link>


                ))}


                {links.map((link, i) => (


                  <YouTubeVideoSlide videoUrl={link} index={i} key={i} />


                ))}


              </div>


              <div className='swiper-button-next'></div>


              <div className='swiper-button-prev'></div>


              <div className='swiper-pagination'></div>


            </div>


          )}


        </div>


      </div>


    )


  )


}



const YouTubeVideoSlide = ({ videoUrl, index }) => {


  const videoId = new URLSearchParams(new URL(videoUrl).search).get('v')



  return (


    <div className={s.slide + ' swiper-slide'}>


      <iframe


        width='100%'


        height='100%'


        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&origin=${REACT_APP_PUBLIC_URL}&rel=0`}


        title={'YouTube Video Slide ' + index}


        id={'YouTube Video Slide ' + index}


        frameBorder='0'


        allow='encrypted-media'


        allowFullScreen


      ></iframe>


    </div>


  )


}
