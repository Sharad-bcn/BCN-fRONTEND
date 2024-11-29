import React from 'react';


import { Alert, Input } from 'components'


import s from './styles.module.scss'


import { useState } from 'react'


import { useNavigate } from 'react-router-dom'


import { useSelector } from 'react-redux'



export default function Main({


  placeholder = 'Search for Business/Services...',


  searchHandler = () => {},


  isAdmin = false


}) {


  const [search, setSearch] = useState('')


  const [listening, setListening] = useState(false)


  const navigate = useNavigate()


  const location = useSelector(state => state.location).location



  const startSpeechRecognition = () => {


    const recognition = new window.webkitSpeechRecognition()



    recognition.onstart = () => {


      setListening(true)


      Alert.success('Listening...')


    }



    recognition.onresult = event => {


      const result = event.results[0][0].transcript


      setSearch(result)


      searchHandler(result)


      setListening(false)


      if (!isAdmin) {


        if (window.location.pathname === '/home') {


          navigate('/' + location + (result ? '?searchQuery=' + result : ''))


        } else if (!result) {


          navigate('/' + location)


          window.location.reload()


        } else if (result) {


          navigate('/' + location + '?searchQuery=' + result)


          setSearch('')


        }


      }


      // if (result && !isAdmin) navigate('/' + location + '?searchQuery=' + result, { replace: true })


    }



    recognition.onerror = event => {


      // console.error('Speech recognition error:', event.error)


      Alert.warn('No speech detected')


      setListening(false)


      setSearch('')


    }



    recognition.start()


  }



  return (


    <div className={s.main}>


      <Input.Classic


        isFilled


        // iconLeft='search'


        iconRight='search'


        onRightIconClick={() => {


          searchHandler(search)


          if (!isAdmin) {


            if (window.location.pathname === '/home') {


              navigate('/' + location + (search ? '?searchQuery=' + search : ''))


            } else if (!search) {


              navigate('/' + location)


              window.location.reload()


            } else if (search) {


              navigate('/' + location + '?searchQuery=' + search)


              setSearch('')


            }


          }


        }}


        // onRightIconClick={startSpeechRecognition}


        // speechStatus={listening}


        type='text'


        placeholder={placeholder}


        value={search}


        onChange={e => setSearch(e.target.value)}


        onKeyDown={e => {


          if (e.key === 'Enter') {


            searchHandler(search)


            if (!isAdmin) {


              if (window.location.pathname === '/home') {


                navigate('/' + location + (search ? '?searchQuery=' + search : ''))


              } else if (!search) {


                navigate('/' + location)


                window.location.reload()


              } else if (search) {


                navigate('/' + location + '?searchQuery=' + search)


                setSearch('')


              }


            }


          }


        }}


      />


      <div className={s.speech}>


        <span className={'material-icons ' + s.mic} onClick={!listening ? startSpeechRecognition : () => {}}>


          mic


        </span>


        {listening && (


          <div className={s.circles}>


            <div className={s.circle1}></div>


            <div className={s.circle2}></div>


            <div className={s.circle3}></div>


          </div>


        )}


      </div>


    </div>


  )


}
