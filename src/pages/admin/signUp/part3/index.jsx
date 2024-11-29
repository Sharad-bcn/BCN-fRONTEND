import React from 'react';

import { AdvancedSelect, Filter, Input, TextArea } from 'components'

import s from './styles.module.scss'


export default function Main(props) {

  return (

    <div className={s.part3}>

      <div className={s.title}>Create An Account</div>

      <div className={s.info + ' row'}>

        <Filter

          label='Gender *'

          title='Male'

          heading={props.gender}

          filterFields={props.filterFields}

          filterHandler={field => props.setGender(field)}

          style2

        />

        <AdvancedSelect

          defaultField={props.state ? props.state : 'Search State'}

          iconLeft='location_on'

          label='State *'

          fieldName='state'

          list={props.states}

          changeHandler={props.getStates}

          detectLocation

          locationPicker={props.locationPicker}

          listFieldHandler={field => {

            props.setState(field.state)

          }}

        />

      </div>

      <div className={s.info + ' row ' + s.info1}>

        {!!props.state && (

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

          label='Pin Code'

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

        label='Residential Address *'

        iconLeft='location_on'

        placeholder='Enter Residential Address *'

        value={props.address}

        onChange={e => props.setAddress(e.target.value)}

      />

    </div>

  )

}
