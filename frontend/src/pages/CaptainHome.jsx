import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SocketContext} from '../context/SocketContext'
import { CaptainDataContext  } from '../context/CaptainDataContext'
import { useEffect, useContext } from 'react'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const [ride, setRide] = useState(null)

  const {socket} = useContext(SocketContext)
  const {captain} = useContext(CaptainDataContext)

  useEffect(() => {
    if (!socket || !captain) return

    const handleConnect = () => {
      console.log('Captain socket connected/reconnected, joining...');
      socket.emit('join', {
        userId: captain._id,
        userType: 'captain'
      })
    }

    if (socket.connected) {
      handleConnect()
    }

    socket.on('connect', handleConnect)

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()

    const handleNewRide = (data) => {
      setRide(data)
      setRidePopupPanel(true)
    }

    socket.on('new-ride', handleNewRide)

    return () => {
      clearInterval(locationInterval)
      socket.off('connect', handleConnect)
      socket.off('new-ride', handleNewRide)
    }
  }, [captain, socket])

  async function confirmRide(){

    socket.emit('confirm-ride',{
      userId: captain._id,
      rideId: ride._id
    })

    setRidePopupPanel(false)
    setConfirmRidePopupPanel(true)
  }
 
  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(140%)'
      })
    }
  }, [ridePopupPanel])

  useGSAP(function () {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(140%)'
      })
    }
  }, [confirmRidePopupPanel])

  return (
    <div className='h-dvh flex flex-col justify-between overflow-hidden relative'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10'>
        <img className='w-16' src="https://freelogopng.com/images/all_img/1659761100uber-logo-png.png" alt="" />
        <Link to='/captain-login' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-10'>
          <i className='text-lg font-medium ri-logout-box-r-line'></i>
        </Link>
      </div>
      <div className='h-3/5 relative z-0'>
        <LiveTracking />
      </div>
      <div className='h-2/5 p-6 flex flex-col justify-between bg-white'>
        <CaptainDetails />
      </div>
      <div ref={ridePopupPanelRef} className='fixed z-10 w-full bg-white px-3 py-10 pt-12 bottom-0 translate-y-[140%]'>
        <RidePopUp 
          ride={ride}
          setRidePopupPanel={setRidePopupPanel} 
          setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
          confirmRide={confirmRide}
        />
      </div>
      <div ref={confirmRidePopupPanelRef} className='fixed z-10 w-full bg-white px-3 py-10 pt-12 bottom-0 translate-y-[140%]'>
        <ConfirmRidePopUp 
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
          setRidePopupPanel={setRidePopupPanel} 
          confirmRide={confirmRide}
        />
      </div>
    </div>
  )
}

export default CaptainHome


