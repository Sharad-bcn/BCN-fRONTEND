import React from 'react';


import { AdvancedSelect, Input, TextArea } from 'components'


import s from './styles.module.scss'



export default function Main(props) {


  return (


    <div className={s.part4}>


      <div className={'row ' + s.locationFields}>


        <AdvancedSelect


          defaultField={props.state ? props.state : 'Search state'}


          iconLeft='location_on'


          label='State *'


          fieldName='state'


          list={props.states}


          changeHandler={props.getStates}


          detectLocation


          locationPicker={props.locationPicker}


          listFieldHandler={field => {


            props.setCity('')


            props.setCities([])


            props.setReRender(true)


            props.setState(field.state)


          }}


        />


        {!!props.state && !props.reRender && (


          <AdvancedSelect


            defaultField={props.city ? props.city : 'Search City'}


            iconLeft='location_on'


            label='City *'


            fieldName='city'


            list={props.cities}


            detectLocation


            locationPicker={props.locationPicker}


            changeHandler={props.getCities}


            listFieldHandler={field => {


              props.setCity(field.city)


            }}


          />


        )}


        <Input.Classic


          label='Pin Code *'


          type='number'


          iconLeft='location_on'


          placeholder='Enter Pin Code'


          value={props.pinCode}


          onChange={e => {


            if (e.target.value.length <= 6) props.setPinCode(e.target.value)


          }}


        />


      </div>


      <TextArea.Classic


        label='Business Address *'


        iconLeft='location_on'


        placeholder='Enter Business Address...'


        value={props.address}


        onChange={e => props.setAddress(e.target.value)}


      />



      {/* {!!props.isBusinessLocation && (


        <div className={s.location}>


          <div className={s.title}>Location</div>


          <GoogleMap.UserSelect


            defaultLocation={props.selectedLocation}


            onLocationSelect={res => props.setSelectedLocation(res)}


          />


        </div>


      )} */}


      <div className={s.postProduct}>


        <span>


          <span className='material-icons-outlined'>add_business</span>


          Add Product / Offering / Services?


        </span>


        <span>


          No


          <span


            className={'material-icons ' + s.iconSpan}


            style={{ color: props.isProductHolder ? 'var(--c-green)' : 'var(--c-red)' }}


            onClick={() => props.setIsProductHolder(!props.isProductHolder)}


          >


            {props.isProductHolder ? 'toggle_on' : 'toggle_off'}


          </span>


          Yes


        </span>


      </div>



      <div className={s.addBusiness} onClick={props.businessId ? props.saveBusiness : props.registerBusiness}>


        {!props.isProductHolder && (


          <span className='material-icons-outlined' style={{ marginRight: '0.25rem' }}>


            {!!props.businessId ? 'save' : 'add_circle_outline'}


          </span>


        )}


        {!props.isProductHolder ? (!!props.businessId ? 'Save' : 'Register') : 'Next'}


        {!!props.isProductHolder && (


          <span className='material-icons-outlined' style={{ marginLeft: '0.25rem', marginRight: '0rem' }}>


            arrow_forward


          </span>


        )}


      </div>


    </div>


  )


}
