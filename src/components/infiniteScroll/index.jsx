import React from 'react';


import { useCallback, useEffect, useState } from 'react'



export default function Main({ children, filter, currentPage, next, hasMore, loader, inLayout = false }) {


  const [isFetching, setIsFetching] = useState(false)



  const handleScrollLayout = useCallback(() => {


    const scrollableDiv = document.getElementById('scroll')


    if (!scrollableDiv || isFetching) return



    const scrollableDivHeight = scrollableDiv.clientHeight


    const scrollableDivScrollTop = scrollableDiv.scrollTop


    const scrollableDivScrollHeight = scrollableDiv.scrollHeight



    const scrollTriggerOffset = 150 // Adjust this value as needed for your design



    if (scrollableDivHeight + scrollableDivScrollTop <= scrollableDivScrollHeight - scrollTriggerOffset || isFetching)


      return



    setIsFetching(true)


  }, [isFetching])



  const handleScroll = useCallback(() => {


    const footerElement = document.getElementById('footer')


    const footerHeight = footerElement ? footerElement.offsetHeight : 0


    if (


      window.innerHeight + document.documentElement.scrollTop + footerHeight < document.documentElement.offsetHeight ||


      isFetching


    )


      return



    setIsFetching(true)


  }, [isFetching])



  useEffect(() => {


    if (inLayout) {


      const scrollableDiv = document.getElementById('scroll')


      if (scrollableDiv) {


        scrollableDiv.addEventListener('scroll', handleScrollLayout)


      }


      return () => {


        if (scrollableDiv) {


          scrollableDiv.removeEventListener('scroll', handleScrollLayout)


        }


      }


    } else {


      window.addEventListener('scroll', handleScroll)


      return () => window.removeEventListener('scroll', handleScroll)


    }


  }, [inLayout, handleScroll, handleScrollLayout])



  useEffect(() => {


    if (currentPage === 1) setIsFetching(true)


    if (!isFetching) return


    if (currentPage === 1 || hasMore) {


      next(filter, currentPage).then(() => {


        setIsFetching(false)


      })


    }


  }, [isFetching, next, filter, currentPage, hasMore])



  return (


    <>


      {children}


      {hasMore && isFetching && loader}


    </>


  )


}
