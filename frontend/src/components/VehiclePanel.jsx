import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
      <h5 className='p-3 text-center absolute top-0 w-[93%]' onClick={()=>{
          props.setVehiclePanelOpen(false)
        }}><i className='text-3xl text-gray-400 ri-arrow-down-wide-line'></i></h5>
        <h3 className='text-2xl font-semibold mb-5' >Select your ride</h3>
          <div onClick={()=>{
            props.setConfirmedRidePanel(true)
            props.setVehiclePanelOpen(false)
            props.setVehicleType('car')
            }} className='flex w-full border-2 border-gray-200 mb-2 active:border-black rounded-xl p-3 items-center justify-between '>
            <img  className='h-10 ' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n" alt="" />
            <div className=' ml-2 w-1/2'>
              <h4 className='text-lg font-medium'>UberGo <span><i className='ri-user-3-fill'></i>4</span></h4>
              <h5 className='text-sm font-medium'>2 min away</h5>
              <p className='font-medium text-xs text-gray-600'>Affordable, compact rides</p>
            </div>
            <h2 className='text-lg   font-semibold'>₹{props.fare.car}</h2>
          </div>
          <div onClick={()=>{
            props.setConfirmedRidePanel(true)
            props.setVehiclePanelOpen(false)
            props.setVehicleType('moto')
            }} className='flex w-full border-2 border-gray-200 mb-2 active:border-black rounded-xl p-3 items-center justify-between '>
            <img  className='h-10 ' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq97MoLM1e9bkqxVzPxjC6S4vq8XqIAQ-RpQ&s" alt="" />
            <div className='ml-2 w-1/2'>
              <h4 className='text-lg font-medium'>Moto <span><i className='ri-user-3-fill'></i>1</span></h4>
              <h5 className='text-sm font-medium'>3 min away</h5>
              <p className='font-medium text-xs text-gray-600'>Affordable, motorcycle rides</p>
            </div>
            <h2 className='text-lg font-semibold'>₹{props.fare.motorcycle}</h2>
          </div>
          <div onClick={()=>{
            props.setConfirmedRidePanel(true)
            props.setVehiclePanelOpen(false)
            props.setVehicleType('auto')
            }} className='flex w-full border-2 border-gray-200 mb-2 active:border-black rounded-xl p-3 items-center justify-between '>
            <img  className='h-15 ' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mYzEwMWZmOC04MWExLTQ2YzMtOTk1YS02N2I0YmJkMmYyYmYuanBn" alt="" />
            <div className='ml-2 w-1/2'>
              <h4 className='text-lg font-medium'>UberAuto <span><i className='ri-user-3-fill'></i>3</span></h4>
              <h5 className='text-sm font-medium'>2 min away</h5>
              <p className='font-medium text-xs text-gray-600'>Affordable, auto rides</p>
            </div>
            <h2 className='text-lg font-semibold'>₹{props.fare.auto}</h2>
          </div>
    </div>
  )
}

export default VehiclePanel
