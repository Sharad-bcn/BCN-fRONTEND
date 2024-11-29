import React from 'react';


import { Link } from 'react-router-dom'


import s from './styles.module.scss'


import { Encrypt } from 'helpers'


import { Modal } from 'components'



export default function Main({ businessesData, deleteHandler }) {


  return (


    <div className={s.main}>


      <div className={s.table}>


        <div className={s.tableHeading}>


          <div className={s.srNo}>S.No.</div>


          <div className={s.businessName}>Business Name</div>


          <div className={s.listingsCount}>Total Offerings</div>


          <div className={s.state}>State</div>


          <div className={s.city}>City</div>


          <div className={s.leads}>Leads</div>


          <div className={s.actions}>Actions</div>


        </div>


        <div className={s.tableBody}>


          {businessesData.map(


            ({ _id, businessName, listingsCount, state, city, leadsCount, isApproved, rejectionMessage }, i) => (


              <div className={s.tableRowOuter} key={i}>


                <div


                  className={s.tableRow}


                  style={{


                    border:


                      !isApproved && (rejectionMessage ? '0.1rem solid var(--c-red)' : '0.1rem solid var(--c-primary)'),


                    marginTop: !isApproved && '1.5rem',


                    borderTopLeftRadius: !isApproved && '0',


                    borderBottomLeftRadius: rejectionMessage && '0',


                    borderBottomRightRadius: rejectionMessage && '0'


                  }}


                >


                  {!isApproved && (


                    <div


                      className={s.pendingStatus}


                      style={{


                        background: rejectionMessage && 'var(--c-red)',


                        borderRight: 'none'


                      }}


                    >


                      Approval {rejectionMessage ? 'Rejected' : 'Pending'}


                    </div>


                  )}


                  <div className={s.srNo}>{i + 1}</div>


                  <div className={s.businessName}>{businessName}</div>


                  <div className={s.listingsCount}>


                    <Link to={'./' + Encrypt({ id: _id }) + '/listings/'} title='View Listings'>


                      {listingsCount}



                      <span>


                        <span className='material-icons-outlined'>


                          {listingsCount < 6 ? 'add_circle_outline' : 'visibility'}


                        </span>


                        {listingsCount < 6 ? 'add more' : 'view all'}


                      </span>


                    </Link>


                  </div>


                  <div className={s.state}>{state}</div>


                  <div className={s.city}>{city}</div>


                  <div className={s.leads}>


                    <Link to={'./viewLeads/' + Encrypt({ businessId: _id, businessName })} title='View Leads'>


                      {leadsCount}


                      <span>


                        <span className='material-icons-outlined'>visibility</span>


                        view all


                      </span>


                    </Link>


                  </div>



                  <div className={s.actions}>


                    <Link to={'./editBusiness/part1/' + Encrypt({ id: _id })} title='Edit Business'>


                      <span className='material-icons-outlined'>edit</span>


                    </Link>


                    <div


                      onClick={() =>


                        Modal.Confirm(


                          'Are u sure u want to delete ' +


                            businessName +


                            ', this action will remove all the offerings under this business?',


                          () => deleteHandler(_id)


                        )


                      }


                      title='Delete Business'


                    >


                      <span className='material-icons-outlined'>delete</span>


                    </div>


                  </div>


                </div>


                {!!rejectionMessage && (


                  <div className={s.rejectionMessage}>


                    <div className={s.title}>


                      This Business is rejected, please comply with the following and update accordingly.


                    </div>


                    {rejectionMessage}


                  </div>


                )}


              </div>


            )


          )}


        </div>


      </div>


    </div>


  )


}
