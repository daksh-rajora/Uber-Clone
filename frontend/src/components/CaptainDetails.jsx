import React, {useContext} from 'react'
import {CaptainDataContext} from '../context/CaptainDataContext'

const CaptainDetails = () => {

  const {captain} = useContext(CaptainDataContext)

  return (
    <div>
      <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start gap-3'>
              <img className='h-10 w-10 rounded-full object-cover' src="https://plus.unsplash.com/premium_photo-1691032016317-639a11f71b85?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwZHJpdmVyfGVufDB8fDB8fHww" alt="" />
              <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
            </div>
            <div>
              <h4 className='text-xl font-semibold'>295.20</h4>
              <p className='text-xl font-medium text-gray-600'>Earned</p>
            </div>
          </div>
          <div className='flex mt-8 p-3 bg-gray-100 rounded-xl  justify-center gap-5 items-start'>
            <div className='text-center'>
               <i className='text-3xl mb-2 font-thin ri-timer-2-line'></i>
               <h5 className='text-lg font-medium'>10.2</h5>
               <p className='text-sm text-gray-600'>Hours online</p>
            </div>
            <div className='text-center'>
              <i className='text-3xl mb-2 font-thin ri-speed-up-line'></i>
              <h5 className='text-lg font-medium'>10.2</h5>
              <p className='text-sm text-gray-600'>Hours online</p>
            </div>
            <div className='text-center'>
              <i className='text-3xl mb-2 font-thin ri-booklet-line'></i>
              <h5 className='text-lg font-medium'>10.2</h5>
              <p className='text-sm text-gray-600'>Hours online</p>
            </div>
          </div>
    </div>
  )
}

export default CaptainDetails
