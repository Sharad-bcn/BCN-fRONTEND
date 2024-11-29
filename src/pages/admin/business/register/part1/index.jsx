import React from 'react';


import s from './styles.module.scss'


import CategoryCard from '../categoryCard'


import { Input, NoData } from 'components'


import { useState } from 'react'



const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST



export default function Main({ selectedCategory, setSelectedCategory, categories, goToNextPart, businessId }) {


  const [filteredCategories, setFilteredCategories] = useState(categories)


  const [searchCategory, setSearchCategory] = useState('')



  const filterHandler = value => {


    setSearchCategory(value)


    if (!value) setFilteredCategories(categories)


    else {


      let filteredCategories = []


      for (const category of categories) {


        const regex = new RegExp(value, 'i')


        if (regex.test(category.category)) filteredCategories.push(category)


      }


      setFilteredCategories(filteredCategories)


    }


  }



  return (


    <div className={s.part1}>


      <div className={s.title}>Select Your Business Category</div>


      <div className={s.filter}>


        <Input.Classic


          type='text'


          iconRight='filter_alt'


          placeholder='Search category...'


          value={searchCategory}


          onChange={e => filterHandler(e.target.value)}


        />


      </div>


      {!!filteredCategories.length && (


        <div className={s.services}>


          {filteredCategories.map(({ _id, category, image }, i) => (


            <CategoryCard


              id={_id}


              field={category}


              image={IMAGE_HOST + image}


              selectedField={selectedCategory}


              setSelectedField={() => {


                setSelectedCategory({ _id, category })


                goToNextPart()


              }}


              key={i}


            />


          ))}


        </div>


      )}


      {!filteredCategories.length && <NoData />}



      {!!businessId && !!selectedCategory && (


        <div className={s.addBusiness} onClick={goToNextPart}>


          Next


          <span className='material-icons-outlined' style={{ paddingLeft: '0.25rem' }}>


            arrow_forward


          </span>


        </div>


      )}


    </div>


  )


}
