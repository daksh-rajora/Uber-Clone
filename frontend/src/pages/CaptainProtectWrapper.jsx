import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useState } from 'react'
import axios from 'axios'

const CaptainProtectWrapper = ({ children }) => {

  const { setCaptain } = useContext(CaptainDataContext)
  const [isLoading, setIsLoading] = useState(true)   
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/captain-login')
      return
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      if (response.status === 200) {
        setCaptain(response.data.captain)
        setIsLoading(false)
      }
    }).catch(err => {
      console.log(err)
      localStorage.removeItem('token')
      navigate('/captain-login')
    })
  }, [token, navigate, setCaptain])

  if(isLoading){
    return(
        <div>
            Loading....
        </div>
    )
  }

  return <>{children}</>
}

export default CaptainProtectWrapper
