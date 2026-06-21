import React from 'react'

const RidePopUp = (props) => {
  return (
    <div>
      <h5 className='p-3 text-center absolute top-0 w-[93%]' onClick={() => {
        props.setRidePopupPanel(false)
      }}>
        <i className='text-3xl text-gray-400 ri-arrow-down-wide-line'></i>
      </h5>
      <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>
      
      {/* Passenger Profile Section */}
      <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4 w-full'>
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
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm -mt-1'> {props.ride?.pickup}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
            <i className='ri-map-pin-2-fill text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm -mt-1'>{props.ride?.destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 '>
            <i className='ri-currency-line text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>{props.ride?.fare}</h3>
              <p className='text-sm -mt-1'>Card/Cash</p>
            </div>
          </div>
        </div>
        
        <div className='flex w-full items-center justify-between gap-4 mt-5'>
          <button onClick={() => {
            props.setRidePopupPanel(false)
          }} className='w-1/2 bg-gray-200 text-gray-700 font-semibold p-3 rounded-lg'>
            Ignore
          </button>
          <button onClick={() => {
            props.confirmRide()
          }} className='w-1/2 bg-green-600 text-white font-semibold p-3 rounded-lg'>
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default RidePopUp
