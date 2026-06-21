import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { SocketContext } from './SocketContext'

const socket = io(`${import.meta.env.VITE_BASE_URL}`)

const SocketProvider = ({ children }) => {
  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected to socket server')
    }

    const handleDisconnect = () => {
      console.log('Disconnected from socket server')
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [])

  const sendMessage = (eventName, data) => {
    socket.emit(eventName, data)
  }

  const receiveMessage = (eventName, callback) => {
    socket.on(eventName, callback)
  }

  return (
    <SocketContext.Provider value={{ socket, sendMessage, receiveMessage }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
