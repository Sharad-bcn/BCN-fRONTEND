import React from 'react';


import { useEffect, useState } from 'react'


import s from './styles.module.scss'



export default function Main() {


  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false)



  const handleScroll = () => {


    setIsScrollToTopVisible(window.scrollY > 0)


  }



  const scrollToTop = () => {


    window.scrollTo({


      top: 0,


      behavior: 'smooth'


    })


  }



  useEffect(() => {


    window.addEventListener('scroll', handleScroll)



    return () => {


      window.removeEventListener('scroll', handleScroll)


    }


  }, [])



  return (


    !!isScrollToTopVisible && (


      <div className={s.main}>


        <div className={s.topScroll} onClick={scrollToTop}>


          <span className='material-icons-outlined'>expand_less</span>


        </div>


      </div>


    )


  )


}
