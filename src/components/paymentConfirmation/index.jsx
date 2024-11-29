import React from 'react';


import s from './styles.module.scss'


import images from 'images'



export default function Main(props) {


  const selectedPlan = props.plans.filter(x => x.name === props.plan)[0]



  return (


    <div className={s.part6}>


      <div className={s.personalInfo}>


        <div className={s.firstName}>


          <div className={s.left}>


            <div>First Name</div>


            <div>:</div>


          </div>


          <div className={s.right}>{props.firstName}</div>


        </div>


        <div className={s.lastName}>


          <div className={s.left}>


            <div>Last Name</div>


            <div>:</div>


          </div>


          <div className={s.right}>{props.lastName}</div>


        </div>


        <div className={s.gender}>


          <div className={s.left}>


            <div>Gender</div>


            <div>:</div>


          </div>


          <div className={s.right}>{props.gender}</div>


        </div>


        {props.refId && (


          <>


            <div className={s.refId}>


              <div className={s.left}>


                <div>ReferralId</div>


                <div>:</div>


              </div>


              <div className={s.right}>{props.refId.refId}</div>


            </div>


            <div className={s.referredBy}>


              <div className={s.left}>


                <div>ReferredBy</div>


                <div>:</div>


              </div>


              <div className={s.right}>{props.refId.referredby}</div>


            </div>


          </>


        )}


      </div>


      <div className={s.contactInfo}>


        <div className={s.phoneNo}>


          <div className={s.left}>


            <div>Contact</div>


            <div>:</div>


          </div>


          <div className={s.right}>+91-{props.phoneNo}</div>


        </div>


        {props.email && (


          <div className={s.email}>


            <div className={s.left}>


              <div>Email</div>


              <div>:</div>


            </div>


            <div className={s.right}>{props.email}</div>


          </div>


        )}


      </div>


      <div className={s.addressInfo}>


        <div className={s.address}>


          <div className={s.left}>


            <div>Address</div>


            <div>:</div>


          </div>


          <div className={s.right}>


            <div>{props.address}</div>


          </div>


        </div>


        <div className={s.state}>


          <div className={s.left}>


            <div>State</div>


            <div>:</div>


          </div>


          <div className={s.right}>


            <div>{props.state}</div>


          </div>


        </div>


        <div className={s.city}>


          <div className={s.left}>


            <div>City</div>


            <div>:</div>


          </div>


          <div className={s.right}>


            <div>{props.city}</div>


          </div>


        </div>


        {props.pinCode && (


          <div className={s.pinCode}>


            <div className={s.left}>


              <div>Pincode</div>


              <div>:</div>


            </div>


            <div className={s.right}>


              <div>{props.pinCode}</div>


            </div>


          </div>


        )}


      </div>


      <div className={s.plan}>


        <div className={s.name}>


          <div className={s.left}>


            <div>Plan</div>


            <div>:</div>


          </div>


          <div className={s.right}>


            <div>{selectedPlan.name}</div>


          </div>


        </div>


        <div className={s.duration}>


          <div className={s.left}>


            <div>Validity</div>


            <div>:</div>


          </div>


          <div className={s.right}>


            <div>{selectedPlan.duration}</div>


          </div>


        </div>


        <div className={s.price}>


          <div className={s.left}>


            <div>Price</div>


            <div>:</div>


          </div>


          <div className={s.right}>


            <div>₹{selectedPlan.price}</div>


          </div>


        </div>


      </div>


      <div className={s.choosePaymentMethod}>


        <div className={s.title}>Choose Payment Method</div>


        {props.paymentPlatforms.map(({ name }, i) => (


          <div className={'row ' + s.payPlatform} key={i}>


            <input type='radio' checked={props.payPlatform === name} onChange={() => props.setPayPlatform(name)} />


            <div className={s.payPlatformImage}>


              <img src={images[name]} alt='' />


            </div>


          </div>


        ))}


      </div>


    </div>


  )


}
