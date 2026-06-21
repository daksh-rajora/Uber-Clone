import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const Captainlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    
    const captain = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/login`, captain)

      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (error) {
      console.error('Error during captain login:', error)
    }

    setEmail('')
    setPassword('')
  }
  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
      <img className='w-20 mb-2' src="https://freelogopng.com/images/all_img/1659761425uber-driver-logo-png.png" alt="" />
      
      <form onSubmit={submitHandler}>
      <h3 className='text-lg font-medium mb-2'> What's your email?</h3>
      <input
      className='text-lg placeholder:text-base bg-[#eeeeee] mb-7 w-full rounded px-4 py-2 ' 
      type="email" 
      required 
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder='email.example.com' 
      />

      <h3 className='text-lg font-medium mb-2'>Enter your password </h3>
      <input 
      className='text-lg placeholder:text-base bg-[#eeeeee] mb-7 w-full rounded px-4 py-2 ' 
      type="password" 
      required 
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder='Enter your password' />
      
      <button
      className='text-lg placeholder:text-base bg-[#111] text-white font-semibold mb-3 w-full rounded px-4 py-2 ' 
      >Login </button>
      <p className='text-center'>Join a fleet? <Link to={'/captain-signup'} className='text-blue-600'>Register as a Captain</Link> </p>
     </form>
      </div>
      <div>
        <Link
        to={'/user-login'}
        className='flex items-center justify-center text-lg placeholder:text-base bg-[#d5622d] text-white font-semibold mb-5 w-full rounded px-4 py-2 '>
          Sign in as User</Link>
      </div>
    </div>
  )
}

export default Captainlogin
