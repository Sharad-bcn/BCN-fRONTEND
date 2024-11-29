import React from 'react';


import { useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'



function useOutsideAlerter(ref, setOpened, filterToggled, setFilterToggled) {


  useEffect(() => {


    function handleClickOutside(event) {


      if (ref.current && !ref.current.contains(event.target)) {


        setOpened(true)



        setFilterToggled(!filterToggled)


      } else {


        setOpened(false)


      }


    }


    document.addEventListener('mousedown', handleClickOutside)


    return () => document.removeEventListener('mousedown', handleClickOutside)


  }, [ref, filterToggled, setOpened, setFilterToggled])


}



export default function Main(props) {


  const [filterToggled, setFilterToggled] = useState(false)


  const [filterTitle, setFilterTitle] = useState(props.title ? props.title : 'Filter')


  const [opened, setOpened] = useState(false)


  const wrapperRef = useRef(null)



  useOutsideAlerter(wrapperRef, setOpened, filterToggled, setFilterToggled)



  return (


    <div className={s.main}>


      <div className={s.filterOuter}>


        {props.label && <div className={s.label}>{props.label}</div>}


        <div className={s.filterSec}>


          <div


            className={props.style2 ? s.filterAlt : s.filter}


            onClick={props.disabled ? () => {} : () => !opened && setFilterToggled(!filterToggled)}


          >


            {props.forcedTitle ? props.forcedTitle : filterTitle}


            <span className='material-icons-outlined'> {filterToggled ? 'arrow_drop_up' : 'arrow_drop_down'}</span>


          </div>


          {filterToggled && (


            <div


              className={s.filterFields}


              ref={wrapperRef}


              style={{


                left: props.right ? 'unset' : '0',


                right: props.right ? '0' : 'unset'


              }}


            >


              <div className={s.filterFieldsInner + ' innerScroll'}>


                {props.filterFields.map(({ field }, i) => (


                  <div


                    className={props.heading === field ? s.filterField + ' ' + s.active : s.filterField}


                    key={i}


                    onClick={() => {


                      props.filterHandler(field)


                      setFilterToggled(!filterToggled)


                      setFilterTitle(field)


                    }}


                  >


                    {field}


                  </div>


                ))}


              </div>


            </div>


          )}


        </div>


      </div>


    </div>


  )


}
