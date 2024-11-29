import React from 'react';


import { useState } from 'react'


import s from './styles.module.scss'



const MAX_MESSAGES = 3



var $messages, $setMessages, $delay, $setDelay



const handler = (text = '', color = '', delay = $delay) => {


  const messages = text ? $messages.concat({ text, color, ts: Date.now() }) : $messages



  $setMessages(messages.filter(message => Date.now() <= message.ts + delay).slice(-MAX_MESSAGES))



  setTimeout(() => handler('', '', delay), delay + 1)


}



const Main = {


  error: (text = 'Some Error Occurred!', delay = $delay) => {


    if (text === 'Some Error Occurred!') return


    $setDelay(delay)


    handler(text, 'red', delay)


  },


  info: (text = 'Some Error Occurred!', delay = $delay) => {


    if (text === 'Some Error Occurred!') return


    $setDelay(delay)


    handler(text, 'blue', delay)


  },


  success: (text = 'Some Error Occurred!', delay = $delay) => {


    if (text === 'Some Error Occurred!') return


    $setDelay(delay)


    handler(text, 'green', delay)


  },


  warn: (text = 'Some Error Occurred!', delay = $delay) => {


    if (text === 'Some Error Occurred!') return


    $setDelay(delay)


    handler(text, 'yellow', delay)


  },


  // Set timeout is used to avoid immediate rerendering


  clear: () => ($messages.length ? setTimeout(() => $setMessages([])) : null)


}



Main.Component = function Component() {


  const [messages, setMessages] = useState([])


  const [delay, setDelay] = useState(10000)



  $messages = messages


  $setMessages = setMessages


  $delay = delay


  $setDelay = setDelay



  return (


    <div className={s.main}>


      {$messages.map(message => (


        <div


          key={message.ts}


          className={s.message}


          style={{


            backgroundColor: `var(--message-${message.color})`,


            animationDuration: `${delay / 1000}s`


          }}


        >


          {message.text}


        </div>


      ))}


    </div>


  )


}



export default Main
