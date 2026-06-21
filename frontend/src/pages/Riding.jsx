import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const Riding = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { ride } = location.state || {}
  const { socket } = useContext(SocketContext)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)

  useEffect(() => {
    if (!socket) return

    const handleRideEnded = () => {
      navigate('/home')
    }

    socket.on('ride-ended', handleRideEnded)

    return () => {
      socket.off('ride-ended', handleRideEnded)
    }
  }, [socket, navigate])

  useEffect(() => {
    if (!ride) return

    const fetchCoords = async () => {
      try {
        const response1 = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
          params: { address: ride.pickup },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response1.data) {
          setPickupCoords({ lat: response1.data.ltd, lng: response1.data.lng })
        }
      } catch (err) {
        console.error("Error fetching ride pickup coords:", err)
      }

      try {
        const response2 = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
          params: { address: ride.destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response2.data) {
          setDestinationCoords({ lat: response2.data.ltd, lng: response2.data.lng })
        }
      } catch (err) {
        console.error("Error fetching ride destination coords:", err)
      }
    }

    fetchCoords()
  }, [ride])

  const vehicleImages = {
    car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n",
    moto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq97MoLM1e9bkqxVzPxjC6S4vq8XqIAQ-RpQ&s",
    auto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mYzEwMWZmOC04MWExLTQ2YzMtOTk1YS02N2I0YmJkMmYyYmYuanBn"
  }



  const getVehicleTypeKey = (type) => {
    if (type === 'bike' || type === 'motorcycle') return 'moto'
    return type || 'car'
  }
  const vehicleType = getVehicleTypeKey(ride?.captain?.vehicle?.vehicleType)

  return (
    <div className='h-dvh flex flex-col justify-between overflow-hidden relative'>
      <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-10'>
        <i className='text-lg font-medium ri-home-5-line'></i>
      </Link>
      <div className='h-[48%] relative z-0'>
        <LiveTracking pickupCoords={pickupCoords} destinationCoords={destinationCoords} />
      </div>
      <div className='h-[60%] p-6 flex flex-col justify-between bg-white'>
        <div>
          <div className='flex items-center justify-between'>
            <img className='h-18' src={vehicleImages[vehicleType]} alt="" />
            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{ride?.captain?.fullname?.firstname}</h2>
              <h4 className='font-semibold text-xl -mt-1 -mb-1 '>{ride?.captain?.vehicle?.plate}</h4>
              <p className='text-sm text-gray-600'>{ride?.captain?.vehicle?.color}</p>
            </div>
          </div>
          <div className='flex gap-2 justify-between flex-col items-center'>
            <div className='w-full mt-2'>
              <div className='flex items-center gap-5 p-2 border-b-2 border-gray-200'>
                <i className='ri-map-pin-user-fill text-lg'></i>
                <div>
                  <h3 className='text-lg font-medium'>Pickup</h3>
                  <p className='text-sm -mt-1'>{ride?.pickup}</p>
                </div>
              </div>
              <div className='flex items-center gap-5 p-2 border-b-2 border-gray-200'>
                <i className='ri-map-pin-2-fill text-lg'></i>
                <div>
                  <h3 className='text-lg font-medium'>Destination</h3>
                  <p className='text-sm -mt-1'>{ride?.destination}</p>
                </div>
              </div>
              <div className='flex items-center gap-5 p-2 '>
                <i className='ri-currency-line text-lg'></i>
                <div>
                  <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                  <p className='text-sm -mt-1'>Card/Cash</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className='w-full bg-green-600 text-white font-semibold p-3 rounded-lg mb-5'>Make a Payment</button>
      </div>
    </div>
  )
}

export default Riding
