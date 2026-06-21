import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
        params: {
          rideId: props.ride?._id,
          otp: otp
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false)
        navigate('/captain-riding', { state: { ride: props.ride } })
      }
    } catch (err) {
      setError('Invalid OTP. Please check and try again.')
      console.error(err)
    }
  }

  return (
    <div>
      <h5 className='p-3 text-center absolute top-0 w-[93%]' onClick={() => {
        props.setConfirmRidePopupPanel(false)
      }}>
        <i className='text-3xl text-gray-400 ri-arrow-down-wide-line'></i>
      </h5>
      <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to start</h3>
      
      {/* Passenger Details */}
      <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4 w-full'>
        <div className='flex items-center gap-3'>
          <img className='h-12 w-12 rounded-full object-cover' src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Passenger" />
          <h5 className='text-lg font-medium'>{props.ride?.user?.fullname?.firstname + " " + props.ride?.user?.fullname?.lastname}</h5>
        </div>
        <h5 className='text-lg font-semibold'>2.2 km</h5>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center w-full'>
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
            <i className='ri-map-pin-user-fill text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1'>{props.ride?.pickup}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
            <i className='ri-map-pin-2-fill text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='text-sm -mt-1'>{props.ride?.destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 '>
            <i className='ri-currency-line text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
              <p className='text-sm -mt-1'>Card/Cash</p>
            </div>
          </div>
        </div>

        {/* OTP Form */}
        <div className='w-full mt-5'>
          <form onSubmit={submitHandler}>
            <div className='flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4'>
              <label className='text-sm font-semibold text-gray-600'>Enter OTP to Start Ride</label>
              <input 
                type='text' 
                placeholder='Enter 4-digit OTP' 
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value)
                  setError('')
                }}
                className='bg-white px-4 py-3 text-lg font-mono tracking-widest text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 w-full'
                maxLength={4}
                required
              />
              {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
            </div>

            {/* Action Buttons */}
            <div className='w-full flex gap-4'>
              <button 
                type="button" 
                onClick={() => {
                  props.setConfirmRidePopupPanel(false)
                }} 
                className='w-1/2 bg-red-600 text-white font-semibold p-3 rounded-lg text-center'
              >
                Cancel
              </button>
              <button 
                type="submit"
                className='w-1/2 bg-green-600 text-white font-semibold p-3 rounded-lg text-center flex items-center justify-center'
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConfirmRidePopUp
