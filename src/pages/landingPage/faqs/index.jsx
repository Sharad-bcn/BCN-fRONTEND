import React from 'react';


import { useEffect, useState, useRef, useCallback } from 'react'


import s from './styles.module.scss'


import { head } from 'helpers'


import { Loader, NoData } from 'components'


import * as api from 'api'



export default function Main() {


  const [selectedQuestion, setSelectedQuestion] = useState(0)


  const [selectedQuestionClass, setSelectedQuestionClass] = useState(0)


  const [faqs, setFaqs] = useState([])


  const [loading, setLoading] = useState(false)


  const processing = useRef(false)



  const getFaqs = useCallback(async () => {


    if (processing.current) return



    processing.current = true


    setLoading(true)



    const fetchFaqs = await api.publicApi.landingPage.fetchFaqs({})



    if (fetchFaqs.code === 200) {


      setFaqs(fetchFaqs.payload.faqs)


    }


    processing.current = false


    setLoading(false)


  }, [])



  useEffect(() => {


    getFaqs()


  }, [getFaqs])



  useEffect(() => {


    head({ title: "Faq's | BCN" })


  }, [])



  return (


    <div className={s.main}>


      <div className={s.faqsSection + ' indent'}>


        <div className={s.title}>Frequently Asked Questions</div>


        {!loading && !faqs.length && <NoData />}


        {!loading && !!faqs.length && (


          <div className={s.faqs}>


            <div className={s.faqBody}>


              <div className={s.faqColumn}>


                {faqs.map(


                  ({ question, answer }, i) =>


                    faqs.length / 2 > i && (


                      <div


                        className={


                          i === selectedQuestion


                            ? selectedQuestionClass === 1


                              ? `${s.faq} ${s.activeFAQ}`


                              : s.faq


                            : s.faq


                        }


                        onClick={event => {


                          setSelectedQuestion(i)


                          setSelectedQuestionClass(event.currentTarget.classList.length)


                        }}


                        key={i}


                      >


                        <div className={s.question}>


                          {question}


                          <span className='material-icons-outlined'>


                            {i === selectedQuestion ? (selectedQuestionClass === 1 ? 'remove' : 'add') : 'add'}


                          </span>


                        </div>


                        <div className={s.answer}>{answer}</div>


                      </div>


                    )


                )}


              </div>


              <div className={s.faqColumn}>


                {faqs.map(


                  ({ question, answer }, i) =>


                    faqs.length / 2 <= i && (


                      <div


                        className={


                          i === selectedQuestion


                            ? selectedQuestionClass === 1


                              ? `${s.faq} ${s.activeFAQ}`


                              : s.faq


                            : s.faq


                        }


                        onClick={event => {


                          setSelectedQuestion(i)


                          setSelectedQuestionClass(event.currentTarget.classList.length)


                        }}


                        key={i}


                      >


                        <div className={s.question}>


                          {question}


                          <span className='material-icons-outlined'>


                            {i === selectedQuestion ? (selectedQuestionClass === 1 ? 'remove' : 'add') : 'add'}


                          </span>


                        </div>


                        <div className={s.answer}>{answer}</div>


                      </div>


                    )


                )}


              </div>


            </div>


          </div>


        )}


        {!!loading && (


          <div className={s.loader}>


            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />


          </div>


        )}


      </div>


    </div>


  )


}
