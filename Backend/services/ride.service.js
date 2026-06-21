const crypto = require('crypto');
const rideModel = require('../models/ride.model')
const mapServices = require('../services/maps.services')

function getOtp(num) {
    if (!num) return '0000';
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < num; i++) {
        OTP += digits[crypto.randomInt(0, 10)];
    }
    return OTP;
}



async function getFare(pickup, destination){

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapServices.getDistanceTime(pickup, destination )

    const baseFares = {
        auto: 30,
        car: 50,
        motorcycle: 20  
    };

    const perKmRate = {
        auto: 5,
        car: 10,
        motorcycle: 4
    };

    const perMinuteRate = {
        auto: 1,
        car: 2,
        motorcycle: 0.5
    };

    const fares = {};
    const distance = distanceTime.distance.value / 1000;
    const duration = distanceTime.duration.value / 60;

    for (const rideType in baseFares) {
        fares[rideType] = Math.round(
            baseFares[rideType] + 
            (distance * perKmRate[rideType]) + 
            (duration * perMinuteRate[rideType])
        );
    }

    return fares;
}

module.exports.getFare = getFare

module.exports.createRide = async ({
    user, pickup, destination, vehicleType,
}) => {
    if (!user || !pickup || !destination || !vehicleType){
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(4),
        fare: fare[vehicleType]
    })

    return ride
}


module.exports.confirmRide = async ({
    rideId,
    captain
})=>{
    if(!rideId){
        throw new Error('Ride id is required')
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    },{
        status:'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).select('+otp').populate('user')

    if(!ride){
        throw new Error('Ride not found')
    }

    return ride
}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).select('+otp').populate('user');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    ride.status = 'ongoing';
    await ride.save();

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOneAndUpdate({
        _id: rideId,
        captain: captain._id
    }, {
        status: 'completed'
    }).populate('user');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}