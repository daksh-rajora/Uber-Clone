import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmedRide from '../components/ConfirmedRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import axios from 'axios'
import {SocketContext} from '../context/SocketContext'
import { useContext } from 'react'
import {UserDataContext} from '../context/UserDataContext'
import LiveTracking from '../components/LiveTracking'

const Home = () => {

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('') 
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const panelCloseRef = useRef(null) 
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false)
  const confirmedRidePanelRef = useRef(null)
  const [vehicleFound, setvehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [vehicleType, setVehicleType] = useState('car')
  const [suggestions, setSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [fare, setFare] = useState({})
  const [ride, setRide] = useState(null)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const pickupTimeoutRef = useRef(null)
  const destinationTimeoutRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const {user} = useContext(UserDataContext)

  const navigate = useNavigate()

  const fetchSuggestions = async (value) => {
    if (!value || value.trim().length === 0) {
      setSuggestions([
        'Delhi, India',
        'Mumbai, Maharashtra, India',
        'Bhopal, Madhya Pradesh, India',
        'Indore, Madhya Pradesh, India'
      ])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setSuggestions(response.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch suggestions")
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        navigate('/user-login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePickupChange = (e) => {
    const value = e.target.value
    setPickup(value)
    
    if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current)
    
    if (value.length >= 1) {
      setLoading(true)
      setError(null)
      pickupTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value)
      }, 400)
    } else {
      setSuggestions([
        'Delhi, India',
        'Mumbai, Maharashtra, India',
        'Bhopal, Madhya Pradesh, India',
        'Indore, Madhya Pradesh, India'
      ])
      setLoading(false)
    }
  }

  const handleDestinationChange = (e) => {
    const value = e.target.value
    setDestination(value)
    
    if (destinationTimeoutRef.current) clearTimeout(destinationTimeoutRef.current)
    
    if (value.length >= 1) {
      setLoading(true)
      setError(null)
      destinationTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value)
      }, 400)
    } else {
      setSuggestions([
        'Delhi, India',
        'Mumbai, Maharashtra, India',
        'Bhopal, Madhya Pradesh, India',
        'Indore, Madhya Pradesh, India'
      ])
      setLoading(false)
    }
  }

  const handleSuggestionSelect = async (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion)
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
          params: { address: suggestion },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data) {
          setPickupCoords({ lat: response.data.ltd, lng: response.data.lng })
        }
      } catch (err) {
        console.error(err)
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token')
          navigate('/user-login')
        }
      }
    } else if (activeField === 'destination') {
      setDestination(suggestion)
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
          params: { address: suggestion },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data) {
          setDestinationCoords({ lat: response.data.ltd, lng: response.data.lng })
        }
      } catch (err) {
        console.error(err)
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token')
          navigate('/user-login')
        }
      }
    }
  }

  const submitHandler = (e) =>{
    e.preventDefault()
  }



  useGSAP(function(){
    if (vehiclePanelOpen){
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(0)'
    })
    }else{
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(140%)'
      })
    }
  },[vehiclePanelOpen])

  useGSAP(function(){
    if (confirmedRidePanel){
      gsap.to(confirmedRidePanelRef.current,{
        transform:'translateY(0)'
    })
    }else{
      gsap.to(confirmedRidePanelRef.current,{
        transform:'translateY(140%)'
      })
    }
  },[confirmedRidePanel])

  useGSAP(function(){
    if (vehicleFound){
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(0)'
    })
    }else{
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(140%)'
      })
    }
  },[vehicleFound])

  useGSAP(function(){
    if (waitingForDriver){
      gsap.to(waitingForDriverRef.current,{
        transform:'translateY(0)'
    })
    }else{
      gsap.to(waitingForDriverRef.current,{
        transform:'translateY(140%)'
      })
    }
  },[waitingForDriver])





  async function findTrip(){
    setVehiclePanelOpen(true)
    setPanelOpen(false)

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setFare(response.data)
    } catch (err) {
      console.error("Error fetching fare:", err)
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        navigate('/user-login')
      }
    }
  }

  async function createRide(vehicleType) {
    const backendVehicleType = vehicleType === 'moto' ? 'motorcycle' : vehicleType

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType: backendVehicleType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setvehicleFound(true)
      setConfirmedRidePanel(false)
    } catch (err) {
      console.error("Error creating ride:", err)
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        navigate('/user-login')
      } else {
        alert("Failed to create ride. Please verify the locations and try again.")
      }
    }
  }

  useEffect(() => {
    if (!socket || !user) return

    const handleConnect = () => {
      console.log('User socket connected/reconnected, joining...');
      socket.emit('join', { userType: 'user', userId: user._id })
    }

    if (socket.connected) {
      handleConnect()
    }

    socket.on('connect', handleConnect)

    const handleRideConfirmed = (ride) => {
      setRide(ride)
      setWaitingForDriver(true)
      setvehicleFound(false)
    }

    const handleRideStarted = (ride) => {
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } })
    }

    socket.on('ride-confirmed', handleRideConfirmed)
    socket.on('ride-started', handleRideStarted)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('ride-confirmed', handleRideConfirmed)
      socket.off('ride-started', handleRideStarted)
    }
  }, [user, socket, navigate])

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-16 absolute left-5 top-5 z-10' src="https://freelogopng.com/images/all_img/1659761100uber-logo-png.png" alt="" />

      <div className='h-screen w-screen relative z-0'>
        <LiveTracking pickupCoords={pickupCoords} destinationCoords={destinationCoords} />
      </div>
      <div className={`flex flex-col justify-end h-screen absolute top-0 w-full z-10 transition-transform duration-500 ${waitingForDriver ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className='relative h-[30%] bg-white p-5'>
          <h5 
            ref={panelCloseRef} 
            onClick={()=>{
              setPanelOpen(false)
            }} 
            style={{ opacity: panelOpen ? 1 : 0, pointerEvents: panelOpen ? 'auto' : 'none' }}
            className='absolute right-6 top-6 text-2xl transition-opacity duration-300'
          >
            <i className='ri-arrow-down-wide-line'></i>
          </h5>
          <h4 className='text-2xl font-semibold'>Find a trip</h4>
        <form className='relative' onSubmit={(e) => {
          submitHandler(e)
        }}>
          <div className="line absolute h-16 w-1 top-[33%] left-5 bg-gray-900 rounded"></div>
          <input
          className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5' 
          type="text" 
          placeholder='Add a pick-up location'
          value={pickup} 
          onChange={handlePickupChange}
          onClick={() => {
            setPanelOpen(true)
            setActiveField('pickup')
            fetchSuggestions(pickup)
          }}/>
          
          <input 
          className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3' 
          type="text" 
          placeholder='Enter your destination' 
          value={destination}
          onChange={handleDestinationChange}
          onClick={() => {
            setPanelOpen(true)
            setActiveField('destination')
            fetchSuggestions(destination)
          }}/>
        </form>  
        {pickup.trim() && destination.trim() && (
          <button onClick={findTrip} className='bg-black text-white px-6 py-3 rounded-lg mt-4 w-full'>
            Find Trip
          </button>
        )}
        </div>
        <div 
          ref={panelRef} 
          style={{ 
            height: panelOpen ? '70%' : '0px', 
            padding: panelOpen ? '24px' : '0px' 
          }}
          className='bg-white overflow-hidden transition-all duration-300 ease-in-out'
        >
          <LocationSearchPanel 
            suggestions={suggestions}
            activeField={activeField}
            handleSuggestionSelect={handleSuggestionSelect}
            panelOpen={panelOpen} 
            setPanelOpen={setPanelOpen} 
            vehiclePanelOpen={vehiclePanelOpen} 
            setVehiclePanelOpen={setVehiclePanelOpen}
            loading={loading}
            error={error}
          />
        </div>    
      </div>
      <div ref={vehiclePanelRef} className='fixed z-10 w-full bg-white px-3 py-10 pt-12 translate-y-[140%] bottom-0 '>
        <VehiclePanel 
          fare={fare}
          setVehicleType={setVehicleType} 
          setConfirmedRidePanel={setConfirmedRidePanel} 
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>
      <div ref={confirmedRidePanelRef} className='fixed z-10 w-full bg-white px-3 py-6 pt-12 translate-y-[140%] bottom-0 '>
        <ConfirmedRide 
          fare={fare}
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType} 
          setConfirmedRidePanel={setConfirmedRidePanel} 
          setvehicleFound={setvehicleFound}
          createRide={createRide}
        />
      </div>
      <div ref={vehicleFoundRef} className='fixed z-10 w-full bg-white px-3 py-6 pt-12 translate-y-[140%] bottom-0 '>
        <LookingForDriver 
          fare={fare}
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType} 
          setvehicleFound={setvehicleFound} 
        />
      </div>
      <div ref={waitingForDriverRef} className='fixed z-10 w-full bg-white px-3 py-6 pt-12 translate-y-[140%] bottom-0 '>
        <WaitingForDriver 
          ride={ride}
          fare={fare}
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
          waitingForDriver={waitingForDriver} 
          setWaitingForDriver={setWaitingForDriver} 
        />
      </div>
      
    </div>
  )
}

export default Home
