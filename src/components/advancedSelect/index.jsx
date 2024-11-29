import React from 'react';


import { Input } from 'components'


import s from './styles.module.scss'


import { useState } from 'react'


import { geoLocation } from 'helpers'



export default function Main({


  list,


  listFieldHandler,


  label,


  iconLeft,


  defaultField,


  detectLocation,


  locationPicker,


  fieldName,


  disabled = false,


  allOverIndia = false,


  changeHandler = value => {}


}) {


  const [field, setField] = useState(defaultField ? defaultField : list[0][fieldName])


  const [selectedField, setSelectedField] = useState('')


  const [isFocused, setIsFocused] = useState(false)


  const [focusToBlurField, setFocusToBlurField] = useState('')



  const handleFieldClick = value => {


    setField(value[fieldName])


    setSelectedField(value[fieldName])


    listFieldHandler(value)


  }



  const changeHandlerDefault = e => {


    const value = e.target.value


    setField(value)


    changeHandler(value)


  }



  const locationPickerHandler = async () => {


    const { latitude, longitude } = await geoLocation()


    setField(await locationPicker(latitude, longitude))


  }



  return (


    <div className={s.main}>


      {label && <div className={s.label}>{label}</div>}


      <div className={s.advancedSelect}>


        <Input.Classic


          isFilled


          iconLeft={iconLeft}


          type='text'


          placeholder='Search...'


          value={field}


          onChange={changeHandlerDefault}


          onFocus={() => {


            setFocusToBlurField(field)


            setSelectedField('')


            setField('')


            setIsFocused(true)


          }}


          onBlur={() => {


            if (!selectedField) setField(focusToBlurField)


            setIsFocused(false)


          }}


          disabled={disabled}


        />


        {!!isFocused && (


          <div className={s.suggestions}>


            <div className={s.suggestionsInner + ' innerScroll'}>


              {!!detectLocation && (


                <>


                  <div className={s.detectLocation} onMouseDown={locationPickerHandler}>


                    <span className='material-icons-outlined'>my_location</span>


                    Detect Location


                  </div>


                  {!!allOverIndia && (


                    <div className={s.suggestedField} onMouseDown={() => handleFieldClick({ city: 'All Over India' })}>


                      All Over India


                    </div>


                  )}


                </>


              )}


              {list.map((field, i) => (


                <div key={i} onMouseDown={() => handleFieldClick(field)} className={s.suggestedField}>


                  {field[fieldName]}


                </div>


              ))}


            </div>


          </div>


        )}


      </div>


    </div>


  )


}
