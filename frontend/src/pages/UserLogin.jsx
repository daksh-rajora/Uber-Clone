import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserDataContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    
    const userData = {
      email:email,
      password:password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200){
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setPassword('')
    // Handle login logic here
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
      <img className='w-16 mb-10' src="https://freelogopng.com/images/all_img/1659761100uber-logo-png.png" alt="" />
      
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
      <p className='text-center'>New here? <Link to={'/user-signup'} className='text-blue-600'>Create new Account</Link> </p>
     </form>
      </div>
      <div>
        <Link
        to={'/captain-login'}
        className='flex items-center justify-center text-lg placeholder:text-base bg-[#10b461] text-white font-semibold mb-5 w-full rounded px-4 py-2 '>
          Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin
