module.exports = class Player {
    constructor(socket, playerName) {
        this.socket = socket
        this.playerName = playerName
    }
}
