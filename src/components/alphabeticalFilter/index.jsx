import React from 'react';


import { useEffect, useRef, useState } from 'react'


import s from './styles.module.scss'



const FilterFields = [


  { field: 'a' },


  { field: 'b' },


  { field: 'c' },


  { field: 'd' },


  { field: 'e' },


  { field: 'f' },


  { field: 'g' },


  { field: 'h' },


  { field: 'i' },


  { field: 'j' },


  { field: 'k' },


  { field: 'l' },


  { field: 'm' },


  { field: 'n' },


  { field: 'o' },


  { field: 'p' },


  { field: 'q' },


  { field: 'r' },


  { field: 's' },


  { field: 't' },


  { field: 'u' },


  { field: 'v' },


  { field: 'w' },


  { field: 'x' },


  { field: 'y' },


  { field: 'z' }


]



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


  const [filterFields, setFilterFields] = useState(FilterFields)


  const [filterTitle, setFilterTitle] = useState(props.title ? props.title : 'Filter')


  const [opened, setOpened] = useState(false)


  const [selectedFilterFields, setSelectedFilterFields] = useState([])


  const wrapperRef = useRef(null)



  useOutsideAlerter(wrapperRef, setOpened, filterToggled, setFilterToggled)



  return (


    <div className={s.main}>


      <div className={s.filterOuter}>


        <div className={s.filterSec}>


          <div


            className={props.style2 ? s.filterAlt : s.filter}


            onClick={props.disabled ? () => {} : () => !opened && setFilterToggled(!filterToggled)}


          >


            {filterTitle}


            <span


              className='material-icons-outlined'


              style={selectedFilterFields.length ? { color: 'var(--c-primary)' } : { color: 'var(--c-font)' }}


            >


              filter_alt


            </span>


          </div>


          {!!filterToggled && (


            <div


              className={s.filterFields}


              ref={wrapperRef}


              style={{


                left: props.right ? 'unset' : '0',


                right: props.right ? '0' : 'unset'


              }}


            >


              <div className={s.filterFieldsInner + ' innerScroll'}>


                {filterFields.map(({ field }, i) => (


                  <div


                    className={selectedFilterFields.includes(field) ? s.filterField + ' ' + s.active : s.filterField}


                    key={i}


                    onClick={() => {


                      // setFilterToggled(!filterToggled)


                      let fields = selectedFilterFields


                      if (fields.includes(field)) {


                        fields = fields.filter(x => x !== field)


                        setSelectedFilterFields(fields)


                      } else {


                        fields.push(field)


                        setSelectedFilterFields(fields)


                      }


                      props.filterHandler(fields)


                    }}


                  >


                    {field}


                  </div>


                ))}


                {!!selectedFilterFields.length && (


                  <div


                    className={s.reset}


                    onClick={() => {


                      setSelectedFilterFields([])


                      props.filterHandler([])


                    }}


                  >


                    <span className='material-icons-outlined'>cancel</span>


                  </div>


                )}


              </div>


            </div>


          )}


        </div>


      </div>


    </div>


  )


}
