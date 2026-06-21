import React from 'react'

function LookingForDriver(props) {
  const vehicleImages = {
    car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n",
    moto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq97MoLM1e9bkqxVzPxjC6S4vq8XqIAQ-RpQ&s",
    auto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mYzEwMWZmOC04MWExLTQ2YzMtOTk1YS02N2I0YmJkMmYyYmYuanBn"
  }

  const vehiclePrices = {
    car: `₹${props.fare?.car}`,
    moto: `₹${props.fare?.motorcycle}`,
    auto: `₹${props.fare?.auto}`
  }

  return (
    <div>
     <h5 className='p-3 text-center absolute top-0 w-[93%]' onClick={()=>{
          props.setvehicleFound(false)
        }}><i className='text-3xl text-gray-400 ri-arrow-down-wide-line'></i>
      </h5>
        <h3 className='text-2xl font-semibold mb-5' >Looking for a driver</h3>
        <div className='flex gap-2 justify-between flex-col items-center'>
          <img className='h-20' src={vehicleImages[props.vehicleType]} alt="" />
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
            <i className='ri-map-pin-user-fill text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>{props.pickup}</h3>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
            <i className='ri-map-pin-2-fill text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>{props.destination}</h3>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 '>
            <i className='ri-currency-line text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>{vehiclePrices[props.vehicleType]}</h3>
              <p className='text-sm -mt-1'>Card/Cash</p>
            </div>
          </div>
        </div>
        </div>
    </div>
  )
}

export default LookingForDriver
