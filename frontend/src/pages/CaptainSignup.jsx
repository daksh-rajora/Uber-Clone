import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainDataContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const { setCaptain } = useContext(CaptainDataContext)
  
  
  const submitHandler = async (e) => {
    e.preventDefault()
      
    const captainData=({
      fullname:{
        firstname:firstname,
        lastname:lastname, 
      },
      email:email,
      password:password,
      vehicle:{
        color:vehicleColor,
        plate:vehiclePlate,
        capacity:vehicleCapacity,
        vehicleType:vehicleType
      }
    })

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/register`, captainData)

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (error) {
      console.error('Error during captain signup:', error)
    }
    
    setFirstname('')
    setLastname('')
    setEmail('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }
  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
      <img className='w-20 mb-2' src="https://freelogopng.com/images/all_img/1659761425uber-driver-logo-png.png" alt="" />
      
      <form onSubmit={submitHandler}>

      <h3 className='text-base font-medium mb-2'>What's your name?</h3>
      <div className='flex gap-4 mb-5'>
      <input
      className='text-base w-1/2 placeholder:text-sm bg-[#eeeeee]   rounded px-4 py-2 ' 
      type="text" 
      required 
      placeholder='First name' 
      value={firstname}
      onChange={(e)=>{
        setFirstname(e.target.value)
      }}
      />
      
      <input
      className='text-base w-1/2 placeholder:text-sm bg-[#eeeeee]   rounded px-4 py-2 ' 
      type="text" 
      required 
      placeholder='Last name' 
      value={lastname}
      onChange={(e)=>{
        setLastname(e.target.value)
      }}
      />
      </div>

      <h3 className='text-base font-medium mb-2'> What's your email?</h3>
      <input
      className='text-base placeholder:text-sm bg-[#eeeeee] mb-6 w-full rounded px-4 py-2 ' 
      type="email" 
      required 
      placeholder='email.example.com'
      value={email}
      onChange={(e) => setEmail(e.target.value)} 
      />

      <h3 className='text-base font-medium mb-2'>Enter your password </h3>
      <input 
      className='text-base placeholder:text-sm bg-[#eeeeee] mb-6 w-full rounded px-4 py-2 ' 
      type="password" 
      required 
      placeholder='Enter your password' 
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      />

      <h3 className='text-base font-medium mb-3'>Vehicle Information</h3>
      <div className='flex gap-4 mb-5'>
      <input
      className='text-base w-1/2 placeholder:text-sm bg-[#eeeeee] rounded px-4 py-2 '
      type="text"
      required
      placeholder='Vehicle color'
      value={vehicleColor}
      onChange={(e)=> setVehicleColor(e.target.value)}
      />

      <input
      className='text-base w-1/2 placeholder:text-sm bg-[#eeeeee] rounded px-4 py-2 '
      type="text"
      required
      placeholder='Vehicle plate number'
      value={vehiclePlate}
      onChange={(e)=> setVehiclePlate(e.target.value)}
      />
      </div>

      <div className='flex gap-4 mb-6'>
      <input
      className='text-base w-1/2 placeholder:text-sm bg-[#eeeeee] rounded px-4 py-2 '
      type="number"
      required
      placeholder='Number of seats'
      value={vehicleCapacity}
      onChange={(e)=> setVehicleCapacity(e.target.value)}
      />

      <select
      className='text-base w-1/2 placeholder:text-sm bg-[#eeeeee] rounded px-4 py-2 '
      required
      value={vehicleType}
      onChange={(e)=> setVehicleType(e.target.value)}
      >
        <option value="">Select Vehicle Type</option>
        <option value="car">Car</option>
        <option value="auto">Auto</option>
        <option value="bike">Bike</option>
      </select>
      </div>
      
      <button
      className='text-lg placeholder:text-base bg-[#111] text-white font-semibold mb-3 w-full rounded px-4 py-2 ' 
      > Create Capatin Account</button>
      <p className='text-center'>Already have a account? <Link to={'/captain-login'} className='text-blue-600'>Login here</Link> </p>
     </form>
      </div>
      <div>
        <p className='text-[10px] leading-tight  '>
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply.</span> 
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup
