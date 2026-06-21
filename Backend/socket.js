const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideService = require('./services/ride.service');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`Socket join request: type=${userType}, id=${userId}, socket=${socket.id}`);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            
            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' })
            }
            
            console.log(`Captain location update: id=${userId}, ltd=${location.ltd}, lng=${location.lng}`);
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            })
        })

        socket.on('confirm-ride', async (data) => {
            const { userId, rideId } = data;
            console.log(`Captain confirming ride: captainId=${userId}, rideId=${rideId}`);
            try {
                const captain = await captainModel.findById(userId);
                if (!captain) {
                    return socket.emit('error', { message: 'Captain not found' });
                }
                const ride = await rideService.confirmRide({ rideId, captain });
                
                console.log(`Sending ride-confirmed to user socket: ${ride.user.socketId}`);
                sendMessageToSocketId(ride.user.socketId, {
                    event: 'ride-confirmed',
                    data: ride
                });
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId, messageObject) {
    console.log(`Emitting event '${messageObject.event}' to socket: ${socketId}`);
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io is not initialized.');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
