import React from 'react';


import { Alert, Filter, Input, Loader, TextArea, UploadImages } from 'components'


import s from './styles.module.scss'


import images from 'images'


import { generateTimeArray } from 'helpers'


const timeFields = generateTimeArray()



export default function Main(props) {


  // const currentDate = new Date()



  // Format the current year and month


  // const currentYear = currentDate.getFullYear()


  // const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based



  return (


    <div className={s.part3}>


      <Input.Classic


        label='Business Name *'


        type='text'


        iconLeft='business'


        placeholder='Enter Business Name'


        value={props.businessName}


        onChange={e => props.setBusinessName(e.target.value)}


      />


      <UploadImages.Multiple


        listingImagesUrls={props.businessImagesUrls}


        oldListingImagesUrls={props.oldBusinessImagesUrls}


        handleListingImagesChange={props.handleBusinessImagesChange}


        handleRemoveImage={props.handleRemoveImage}


        handleRemoveOldImage={props.handleRemoveOldImage}


        max={6}


      />


      {!!props.isUploading && (


        <Loader


          message={props.uploadingProgress + '% uploaded'}


          color='var(--c-primary)'


          colorText='var(--c-primary)'


        />


      )}


      <Input.Classic


        label='Enter Business Keywords'


        type='text'


        iconLeft='local_offer'


        iconRight='add_circle_outline'


        onRightIconClick={props.tags.length <= 6 ? props.addTag : () => {}}


        placeholder='Enter Keywords Related To Business'


        value={props.tag}


        onChange={e => props.setTag(e.target.value)}


        onKeyDown={e => {


          if (e.key === 'Enter') {


            if (e.target.tagName !== 'TEXTAREA') {


              e.preventDefault()


              if (props.tags.length <= 6) props.addTag()


            }


          }


        }}


        disabled={props.tags.length >= 6}


      />


      {props.tags.length !== 0 && (


        <div className={s.tags}>


          <div className={s.tagHeading}>Business Keywords (max 6 allowed)</div>


          <div className={s.addedTags}>


            {props.tags.map((y, i) => (


              <div className={s.tag} key={i}>


                {y}


                <span


                  className='material-icons-outlined'


                  onClick={() => props.setTags(props.tags.filter(x => x !== y))}


                >


                  close


                </span>


              </div>


            ))}


          </div>


        </div>


      )}


      <TextArea.Classic


        label='Business Description *'


        iconLeft='description'


        placeholder='Enter business description 1000 words (Max.)'


        value={props.description}


        onChange={e => {


          const text = e.target.value


          const words = text.trim().split(/\s+/)


          if (words.length <= 1000) {


            props.setDescription(text)


          } else {


            Alert.warn('Max. 1000 words allowed')


          }


        }}


      />


      <Input.Classic


        label='Website'


        type='text'


        iconLeft='http'


        placeholder='Enter Your Website... (optional)'


        value={props.website}


        onChange={e => props.setWebsite(e.target.value)}


      />


      <Input.Classic


        label='Business Contact Number *'


        type='number'


        iconLeft='call'


        placeholder='Enter Business Whatsapp Contact Number...'


        value={props.mobile}


        onChange={e => {


          if (e.target.value.length <= 10) props.setMobile(e.target.value)


        }}


      />


      <Input.Classic


        label='GST'


        type='text'


        iconLeft='verified'


        placeholder='Enter GST No. (optional)'


        value={props.gst}


        onChange={e => props.setGst(e.target.value)}


      />


      <div className={'row ' + s.row}>


        <div className={s.socialPlatform}>


          <div className={s.label}>Facebook Link</div>


          <div className={s.socialPlatformInner}>


            <div className={s.image}>


              <img src={images.facebookAlt} alt='' />


            </div>


            <Input.Classic


              type='text'


              placeholder='Enter Facebook Link...'


              value={props.facebookLink}


              onChange={e => {


                props.setFacebookLink(e.target.value)


              }}


            />


            {!!props.facebookLink &&


              (props.validateFacebookLink(props.facebookLink) ? (


                <span className='material-icons' style={{ color: 'var(--c-green)' }}>


                  check_circle


                </span>


              ) : (


                <span className='material-icons' style={{ color: 'var(--c-red)' }}>


                  cancel


                </span>


              ))}


          </div>


        </div>


        <div className={s.socialPlatform}>


          <div className={s.label}>Instagram Link</div>


          <div className={s.socialPlatformInner}>


            <div className={s.image}>


              <img src={images.instagramAlt} alt='' />


            </div>


            <Input.Classic


              type='text'


              placeholder='Enter Instagram Link...'


              value={props.instagramLink}


              onChange={e => {


                props.setInstagramLink(e.target.value)


              }}


            />


            {!!props.instagramLink &&


              (props.validateInstagramLink(props.instagramLink) ? (


                <span className='material-icons' style={{ color: 'var(--c-green)' }}>


                  check_circle


                </span>


              ) : (


                <span className='material-icons' style={{ color: 'var(--c-red)' }}>


                  cancel


                </span>


              ))}


          </div>


        </div>


      </div>


      <div className={s.dateOfEstablishment}>


        <Input.Classic


          label='Date of Establishment (optional)'


          type='month'


          placeholder='Enter Date of Establishment'


          value={


            props.dateOfEstablishment


            // || `${currentYear}-${currentMonth}`


          }


          onChange={e => props.setDateOfEstablishment(e.target.value)}


        />


      </div>


      <div className={s.workingHours}>


        <div className={s.title}>Working Hours</div>


        <div className={s.middleLabels}>


          <div className={s.isOpen24Hours}>


            Open 24/7


            <span


              className={'material-icons ' + s.iconSpan}


              style={{ color: props.workingHours.isOpen24Hours ? 'var(--c-green)' : 'var(--c-red)' }}


              onClick={() => {


                const updatedWorkingHours = {


                  timings: props.workingHours.timings,


                  isOpen24Hours: !props.workingHours.isOpen24Hours


                }


                props.setWorkingHours(updatedWorkingHours)


              }}


            >


              {props.workingHours.isOpen24Hours ? 'toggle_on' : 'toggle_off'}


            </span>


          </div>


          {!props.workingHours.isOpen24Hours &&


            props.workingHours.timings.find(day => day.day === 'Monday' && day.from && day.to && !day.isClosed) && (


              <div className={s.copyToAll}>


                Copy monday timings to all


                <input


                  type='radio'


                  onChange={() => {


                    let mondayTimings = props.workingHours.timings.find(day => day.day === 'Monday')


                    const updatedWorkingHoursTimings = props.workingHours.timings.map((item, i) => {


                      return { ...item, to: mondayTimings.to, from: mondayTimings.from, isClosed: false }


                    })



                    const updatedWorkingHours = {


                      timings: updatedWorkingHoursTimings,


                      isOpen24Hours: props.workingHours.isOpen24Hours


                    }


                    props.setWorkingHours(updatedWorkingHours)


                  }}


                />


              </div>


            )}


        </div>


        {!props.workingHours.isOpen24Hours && (


          <div className={s.topLabels}>


            <div className={s.label}>Day</div>


            <div className={s.label + ' ' + s.isClosed}>Closed</div>


            <div className={s.labelsRight}>


              <div className={s.label}>Open From</div>


              <div className={s.label}>Open To</div>


            </div>


          </div>


        )}


        {!props.workingHours.isOpen24Hours &&


          props.workingHours.timings.map((day, i) => (


            <div className={s.day} key={i}>


              <div className={s.label + ' ' + s.dayLabel}>{day.day.substring(0, 3)}</div>


              <div className={s.label + ' ' + s.isClosed}>


                <span


                  className={'material-icons ' + s.iconSpan}


                  style={{ color: day.isClosed ? 'var(--c-green)' : 'var(--c-red)' }}


                  onClick={() => {


                    const updatedWorkingHoursTimings = props.workingHours.timings.map((item, index) => {


                      if (index === i) return { ...item, isClosed: !item.isClosed }


                      return item


                    })



                    const updatedWorkingHours = {


                      timings: updatedWorkingHoursTimings,


                      isOpen24Hours: props.workingHours.isOpen24Hours


                    }



                    props.setWorkingHours(updatedWorkingHours)


                  }}


                  title={(day.isClosed ? ' Open on ' : 'Close on ') + day.day}


                >


                  {day.isClosed ? 'toggle_on' : 'toggle_off'}


                </span>


              </div>



              <div className={'row ' + s.row} style={{ opacity: day.isClosed ? '0.2' : '1' }}>


                {/* <Input.Classic


                type='time'


                value={day.from}


                onChange={e => {


                  const updatedWorkingHours = props.workingHours.map((item, index) => {


                    if (index === i) return { ...item, from: e.target.value }


                    return item


                  })


                  props.setWorkingHours(updatedWorkingHours)


                }}


                disabled={day.isClosed}


              /> */}


                <Filter


                  title='From'


                  forcedTitle={day.from}


                  heading={day.from}


                  filterFields={timeFields}


                  filterHandler={field => {


                    const updatedWorkingHoursTimings = props.workingHours.timings.map((item, index) => {


                      if (index === i) return { ...item, from: field }


                      return item


                    })



                    const updatedWorkingHours = {


                      timings: updatedWorkingHoursTimings,


                      isOpen24Hours: props.workingHours.isOpen24Hours


                    }



                    props.setWorkingHours(updatedWorkingHours)


                  }}


                  disabled={day.isClosed}


                  style2


                />


                {/* <Input.Classic


                type='time'


                value={day.to}


                onChange={e => {


                  const updatedWorkingHours = props.workingHours.map((item, index) => {


                    if (index === i) return { ...item, to: e.target.value }


                    return item


                  })


                  props.setWorkingHours(updatedWorkingHours)


                }}


                disabled={day.isClosed}


              /> */}


                <Filter


                  title='To'


                  forcedTitle={day.to}


                  heading={day.to}


                  filterFields={timeFields}


                  filterHandler={field => {


                    const updatedWorkingHoursTimings = props.workingHours.timings.map((item, index) => {


                      if (index === i) return { ...item, to: field }


                      return item


                    })


                    const updatedWorkingHours = {


                      timings: updatedWorkingHoursTimings,


                      isOpen24Hours: props.workingHours.isOpen24Hours


                    }


                    props.setWorkingHours(updatedWorkingHours)


                  }}


                  disabled={day.isClosed}


                  style2


                />


              </div>


            </div>


          ))}


        {props.workingHours.isOpen24Hours &&


          props.workingHours.timings.map((day, i) => (


            <div className={s.day + ' ' + s.dayAlt} key={i}>


              <div className={s.label + ' ' + s.dayLabel} style={{ width: '15%' }}>


                {day.day.substring(0, 3)}


              </div>


              <div className={s.open24Hours}>open 24 hours</div>


            </div>


          ))}


      </div>



      <div className={s.addBusiness} onClick={props.goToNextPart}>


        Next


        <span className='material-icons-outlined' style={{ paddingLeft: '0.25rem' }}>


          arrow_forward


        </span>


      </div>


    </div>


  )


}
