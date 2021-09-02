const EventEmitter = require('events');

module.exports = {
    rooms: {},
    join: (roomName) => {
        if (!this.rooms) {
            this.rooms = {};
        }
        if (!this.rooms[roomName]) {

            this.rooms[roomName] = new EventEmitter();
            return this.rooms[roomName];

        } else {
            return this.rooms[roomName];
        }

    },

}