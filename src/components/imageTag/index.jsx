import React from 'react';







import { forwardRef, useState } from 'react'



import images from 'images'







const Main = forwardRef(({ src, style, alt }, ref) => {



  const [hasError, setHasError] = useState(false)







  const handleImageError = () => setHasError(true)







  return (



    <img src={hasError || !src ? images.noImage : src} style={style} onError={handleImageError} alt={alt} ref={ref} />



  )



})







export default Main



