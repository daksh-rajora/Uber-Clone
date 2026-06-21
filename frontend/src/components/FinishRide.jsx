import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FinishRide = (props) => {
  const navigate = useNavigate()

  async function endRide() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
        rideId: props.ride?._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.status === 200) {
        props.setFinishRidePanel(false)
        navigate('/captain-home')
      }
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div>
      <h5 className='p-3 text-center absolute top-0 w-[93%]' onClick={() => {
        props.setFinishRidePanel(false)
      }}>
        <i className='text-3xl text-gray-400 ri-arrow-down-wide-line'></i>
      </h5>
      <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
      
      {/* Passenger Details */}
      <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4 w-full'>
        <div className='flex items-center gap-3'>
          <img className='h-12 w-12 rounded-full object-cover' src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Passenger" />
          <h5 className='text-lg font-medium'>{props.ride?.user?.fullname?.firstname + " " + props.ride?.user?.fullname?.lastname}</h5>
        </div>
        <h5 className='text-lg font-semibold'>2.2 km</h5>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
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

        {/* Action Buttons */}
        <div className='mt-10 w-full'>
          <button 
            onClick={endRide}
            to='/captain-home' 
            className='w-full bg-green-600 text-white font-semibold p-3 rounded-lg text-center flex items-center justify-center'
          >
            Finish Ride
          </button>
          <p className='text-red-500 text-xs text-center mt-3'>
            Click finish ride if you have completed the payment collection.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FinishRide
