const axios = require('axios');
const captainModel = require('../models/captain.model.js')

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

module.exports.getAddressCoordinate = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const googleKey = process.env.GOOGLE_MAPS_API;
    const isGoogleKeyValid = googleKey && googleKey !== 'your_google_maps_api_key_here' && googleKey.trim() !== '';

    if (isGoogleKeyValid) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: googleKey
                }
            });
            if (response.data?.status === 'OK' && response.data.results?.length > 0) {
                const loc = response.data.results[0].geometry.location;
                return {
                    ltd: loc.lat,
                    lng: loc.lng
                };
            } else {
                throw new Error(response.data?.error_message || `Google Geocoding failed with status: ${response.data?.status}`);
            }
        } catch (error) {
            console.warn(`Official Google Geocoding failed for "${address}" (trying RapidAPI fallback):`, error.message);
        }
    }

    if (process.env.RAPIDAPI_HOST && process.env.RAPIDAPI_KEY) {
        const isV2 = process.env.RAPIDAPI_HOST.includes('new-v2');
        const url = isV2 
            ? `https://${process.env.RAPIDAPI_HOST}/v1/places:searchText`
            : `https://${process.env.RAPIDAPI_HOST}/google-find-place-search`;
        
        const headers = {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        };
        if (isV2) {
            headers['X-Goog-FieldMask'] = 'places.id,places.location,places.formattedAddress';
        }

        const requestConfig = {
            method: isV2 ? 'POST' : 'GET',
            url: url,
            headers: headers,
            data: isV2 ? { textQuery: address } : undefined,
            params: isV2 ? undefined : { place: address }
        };

        try {
            const response = await axios.request(requestConfig);
            if (isV2) {
                const places = response.data?.places || [];
                if (places.length > 0) {
                    const loc = places[0].location;
                    if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
                        return {
                            ltd: loc.latitude,
                            lng: loc.longitude
                        };
                    }
                }
            } else {
                const candidates = response.data?.candidates || response.data?.places || [];
                if (candidates.length > 0) {
                    const loc = candidates[0].geometry?.location || candidates[0].location;
                    const lat = loc?.lat !== undefined ? loc.lat : loc?.latitude;
                    const lng = loc?.lng !== undefined ? loc.lng : loc?.longitude;
                    if (typeof lat === 'number' && typeof lng === 'number') {
                        return {
                            ltd: lat,
                            lng: lng
                        };
                    }
                }
            }
            throw new Error('No coordinates found in RapidAPI response');
        } catch (error) {
            console.warn(`RapidAPI Geocoding failed for "${address}" (using fallback mock coordinates):`, error.message);
        }
    }

    // Default fallback coordinates (Delhi)
    return {
        ltd: 28.6139,
        lng: 77.2090
    };
}


module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const googleKey = process.env.GOOGLE_MAPS_API;
    const isGoogleKeyValid = googleKey && googleKey !== 'your_google_maps_api_key_here' && googleKey.trim() !== '';

    if (isGoogleKeyValid) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                params: {
                    origins: origin,
                    destinations: destination,
                    key: googleKey
                }
            });
            if (response.data?.status === 'OK' && response.data.rows?.[0]?.elements?.[0]?.status === 'OK') {
                const element = response.data.rows[0].elements[0];
                return {
                    distance: {
                        text: element.distance.text,
                        value: element.distance.value
                    },
                    duration: {
                        text: element.duration.text,
                        value: element.duration.value
                    },
                    status: 'OK'
                };
            } else {
                throw new Error(`Google Distance Matrix status: ${response.data?.status}`);
            }
        } catch (error) {
            console.warn('Official Google Distance Matrix API call failed (falling back to coordinate calculation):', error.message);
        }
    }

    try {
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destCoords = await module.exports.getAddressCoordinate(destination);

        // If coordinates are identical but addresses differ, we likely hit geocoding fallback
        if (originCoords.ltd === destCoords.ltd && originCoords.lng === destCoords.lng && origin.toLowerCase().trim() !== destination.toLowerCase().trim()) {
            console.warn('Coordinates match but addresses differ; returning fallback distance/duration.');
            return {
                distance: { text: '12.5 km', value: 12500 },
                duration: { text: '25 mins', value: 1500 },
                status: 'OK'
            };
        }

        const distanceKm = getHaversineDistance(originCoords.ltd, originCoords.lng, destCoords.ltd, destCoords.lng) * 1.3;
        const distanceMeters = Math.round(distanceKm * 1000);
        
        // 30 km/h driving speed: duration (hours) = distance (km) / 30
        // duration (seconds) = duration (hours) * 3600
        const durationSeconds = Math.round((distanceKm / 30) * 3600);

        return {
            distance: {
                text: `${distanceKm.toFixed(1)} km`,
                value: distanceMeters
            },
            duration: {
                text: `${Math.round(durationSeconds / 60)} mins`,
                value: durationSeconds
            },
            status: 'OK'
        };
    } catch (error) {
        console.warn('getDistanceTime failed (using fallback mock data):', error.message);
        return {
            distance: { text: '12.5 km', value: 12500 },
            duration: { text: '25 mins', value: 1500 },
            status: 'OK'
        };
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const googleKey = process.env.GOOGLE_MAPS_API;
    const isGoogleKeyValid = googleKey && googleKey !== 'your_google_maps_api_key_here' && googleKey.trim() !== '';

    if (isGoogleKeyValid) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
                params: {
                    input: input,
                    key: googleKey
                }
            });
            if (response.data?.status === 'OK' && response.data.predictions) {
                return response.data.predictions.map(p => p.description).filter(value => value);
            } else {
                throw new Error(response.data?.error_message || `Google Autocomplete status: ${response.data?.status}`);
            }
        } catch (error) {
            console.warn('Official Google Place Autocomplete failed (trying RapidAPI fallback):', error.message);
        }
    }

    if (process.env.RAPIDAPI_HOST && process.env.RAPIDAPI_KEY) {
        const isV2 = process.env.RAPIDAPI_HOST.includes('new-v2');
        const url = isV2 
            ? `https://${process.env.RAPIDAPI_HOST}/v1/places:autocomplete`
            : `https://${process.env.RAPIDAPI_HOST}/google-autocomplete`;

        const headers = {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        };
        if (isV2) {
            headers['X-Goog-FieldMask'] = 'suggestions.placePrediction.text';
        }

        const requestConfig = {
            method: isV2 ? 'POST' : 'GET',
            url: url,
            headers: headers,
            data: isV2 ? { input: input } : undefined,
            params: isV2 ? undefined : { input: input }
        };

        try {
            const response = await axios.request(requestConfig);
            if (isV2) {
                const predictions = response.data?.suggestions || [];
                return predictions.map(p => p.placePrediction?.text?.text).filter(value => value);
            } else {
                const predictions = response.data?.predictions || response.data?.suggestions || [];
                return predictions.map(p => p.description || p.placePrediction?.text?.text || p).filter(value => value);
            }
        } catch (error) {
            console.warn('Error fetching autocomplete suggestions via RapidAPI (using mock fallback):', error.message);
        }
    }

    // Mock suggestions fallback
    const mockSuggestions = [
        'Bhopal, Madhya Pradesh, India',
        'Indore, Madhya Pradesh, India',
        'Delhi, India',
        'Mumbai, Maharashtra, India',
        'Kankariya Talab, Bhopal, Madhya Pradesh, India',
        'New Market, Bhopal, Madhya Pradesh, India',
        'Gidderbaha, Punjab, India',
        'Bathinda, Punjab, India',
        'IK Gujral Punjab Technical University, Distt, VPO, Ibban, Kapurthala, Punjab, India'
    ];
    const filtered = mockSuggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()));
    return filtered.length > 0 ? filtered : [input];
}

module.exports.getCaptainsInRadius = async (ltd,lng,radius) => {
    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[ltd, lng], radius/3963.2]
                }
            }
        })

        if (captains.length > 0) {
            return captains;
        }
    } catch (error) {
        console.warn("Geospatial query failed (using active captains fallback):", error.message);
    }

    return await captainModel.find({ socketId: { $exists: true, $ne: null } });
}