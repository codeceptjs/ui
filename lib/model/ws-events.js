const WS_URL = 'http://localhost:3000';

const socket = require('socket.io-client')(WS_URL);

module.exports = {
    codeceptjs: {
        scenariosUpdated() {
            // just notify the frontend that scenarios have been changed
            // it's the frontends responsibilty to actually get
            // the updated list of scenarios
            socket.emit('codeceptjs:scenarios.updated');
        },
        started(data) {
            socket.emit('codeceptjs.started', data);
        },
        exit(data) {
            socket.emit('codeceptjs.exit', data);
        },
        error(err) {
            socket.emit('codeceptjs.error', err);
        }
    }
}