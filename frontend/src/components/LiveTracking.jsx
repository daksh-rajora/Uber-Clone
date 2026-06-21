import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issues in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
}

const LiveTracking = ({ pickupCoords, destinationCoords }) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerInstance = useRef(null)
  const pickupMarkerRef = useRef(null)
  const destinationMarkerRef = useRef(null)

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([defaultCenter.lat, defaultCenter.lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current)

      markerInstance.current = L.marker([defaultCenter.lat, defaultCenter.lng]).addTo(mapInstance.current)
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        markerInstance.current = null
        pickupMarkerRef.current = null
        destinationMarkerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return

    if (pickupCoords) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng([pickupCoords.lat, pickupCoords.lng])
      } else {
        pickupMarkerRef.current = L.marker([pickupCoords.lat, pickupCoords.lng])
          .bindPopup('Pickup')
          .addTo(mapInstance.current)
      }
    } else {
      if (pickupMarkerRef.current) {
        mapInstance.current.removeLayer(pickupMarkerRef.current)
        pickupMarkerRef.current = null
      }
    }

    if (destinationCoords) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLatLng([destinationCoords.lat, destinationCoords.lng])
      } else {
        destinationMarkerRef.current = L.marker([destinationCoords.lat, destinationCoords.lng])
          .bindPopup('Destination')
          .addTo(mapInstance.current)
      }
    } else {
      if (destinationMarkerRef.current) {
        mapInstance.current.removeLayer(destinationMarkerRef.current)
        destinationMarkerRef.current = null
      }
    }

    if (pickupCoords && destinationCoords) {
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [destinationCoords.lat, destinationCoords.lng]
      ])
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] })
    } else if (pickupCoords) {
      mapInstance.current.setView([pickupCoords.lat, pickupCoords.lng], 15)
    } else if (destinationCoords) {
      mapInstance.current.setView([destinationCoords.lat, destinationCoords.lng], 15)
    }
  }, [pickupCoords, destinationCoords])

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      
      if (mapInstance.current) {
        mapInstance.current.setView([latitude, longitude], 15)
      }
      if (markerInstance.current) {
        markerInstance.current.setLatLng([latitude, longitude])
      }
    })

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        if (mapInstance.current) {
          mapInstance.current.panTo([latitude, longitude])
        }
        if (markerInstance.current) {
          markerInstance.current.setLatLng([latitude, longitude])
        }
      },
      (error) => {
        console.error('Error watch position:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return (
    <div ref={mapRef} className="h-full w-full" style={{ minHeight: '100%', position: 'relative', zIndex: 0 }}></div>
  )
}

export default LiveTracking
