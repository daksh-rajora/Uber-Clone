import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const finishRidePanelRef = useRef(null)
  const location = useLocation()
  const rideData = location.state?.ride
  const [pickupCoords, setPickupCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)

  useGSAP(function () {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(140%)'
      })
    }
  }, [finishRidePanel])

  useEffect(() => {
    if (!rideData) return

    const fetchCoords = async () => {
      try {
        const response1 = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
          params: { address: rideData.pickup },
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
          params: { address: rideData.destination },
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
  }, [rideData])

  return (
    <div className='h-dvh flex flex-col justify-between overflow-hidden relative'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-full z-10'>
        <img className='w-16' src="https://freelogopng.com/images/all_img/1659761100uber-logo-png.png" alt="" />
        <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'>
          <i className='text-lg font-medium ri-logout-box-r-line'></i>
        </Link>
      </div>

      <div className='h-[85%] relative z-0'>
        <LiveTracking pickupCoords={pickupCoords} destinationCoords={destinationCoords} />
      </div>

      <div className='h-[16%] p-5  flex items-center justify-between bg-yellow-300 relative' onClick={() => {
        setFinishRidePanel(true)
      }}>
        <h5 className='top-0 text-center absolute  w-[90%]'>
          <i className='text-3xl text-gray-800 ri-arrow-up-wide-line'></i>
        </h5>
        <h4 className='text-xl font-semibold'>{rideData?.user?.fullname?.firstname}</h4>
        <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>
          Complete Ride
        </button>
      </div>

      <div ref={finishRidePanelRef} className='fixed z-10 w-full bg-white px-3 py-10 pt-12 bottom-0 translate-y-[140%]'>
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  )
}

export default CaptainRiding
