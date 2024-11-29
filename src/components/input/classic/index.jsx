import React from 'react';


import s from './styles.module.scss'



export default function Main(props) {


  return (


    <div className={s.field}>


      {!!props.label && <label className={s.label}>{props.label}</label>}


      <div className={s.fieldData}>


        {props.iconLeft && (


          <span


            className={(props.isFilled ? 'material-icons ' : 'material-icons-outlined ') + s.iconLeft}


            onClick={props.onLeftIconClick ? props.onLeftIconClick : () => {}}


            style={{ cursor: props.onLeftIconClick && 'pointer' }}


          >


            {props.iconLeft}


          </span>


        )}


        <input


          className={s.input}


          type={props.type}


          placeholder={props.placeholder}


          value={props.value}


          onChange={props.onChange}


          onFocus={props.onFocus}


          onBlur={props.onBlur}


          autoComplete='off'


          disabled={props.disabled ? true : false}


          onKeyDown={e => {


            if (e.keyCode === 38 || e.keyCode === 40) {


              e.preventDefault()


            }


            props.onKeyDown && props.onKeyDown(e)


          }}


        />


        {props.iconRight && (


          <div className={s.speech} onClick={!props.speechStatus ? props.onRightIconClick : () => {}}>


            {props.iconRight === 'search' && <div className={s.searchText}>search</div>}


            <span


              className={


                (props.isFilled ? 'material-icons ' : 'material-icons-outlined ') +


                s.iconRight +


                (props.iconRight === 'mic' ? ' ' + s.mic : '')


              }


              style={{


                marginLeft: props.iconRight === 'search' ? '0rem' : '0.5rem',


                paddingLeft: props.iconRight === 'search' && '0.25rem'


              }}


            >


              {props.iconRight}


            </span>


            {props.speechStatus && (


              <div className={s.circles}>


                <div className={s.circle1}></div>


                <div className={s.circle2}></div>


                <div className={s.circle3}></div>


              </div>


            )}


          </div>


        )}


      </div>


    </div>


  )


}
