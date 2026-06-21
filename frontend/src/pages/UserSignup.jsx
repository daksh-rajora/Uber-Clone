import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()


  const submitHandler = async (e) => {
    e.preventDefault()
    
    const newUser = {
      fullname:{
        firstname:firstname,
        lastname:lastname, 
      },
      email:email,
      password:password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser)

    if (response.status===201){
      const data = response.data

      setUser(data.user)
      localStorage.setItem('token', data.token)

      navigate('/home')
    }

    setFirstname('')
    setLastname('')
    setEmail('')
    setPassword('')
    // Handle login logic here
  }
  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>
      <img className='w-16 mb-10' src="https://freelogopng.com/images/all_img/1659761100uber-logo-png.png" alt="" />
      
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
      
      <button
      className='text-lg placeholder:text-base bg-[#111] text-white font-semibold mb-3 w-full rounded px-4 py-2 ' 
      >Create Account </button>
      <p className='text-center'>Already have a account? <Link to={'/user-login'} className='text-blue-600'>Login here</Link> </p>
     </form>
      </div>
      <div>
        <p className='text-[10px] leading-tight flex items-center justify-center'>By proceeding, you consent to get calls, WhatsApp or SMS
          messages, including by automated means, from Uber and its affiliates to the number provided. 
        </p>
      </div>
    </div>
  )
}

export default UserSignup
