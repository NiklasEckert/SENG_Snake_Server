const Direction = require("./Direction");

module.exports = class Player {

    #snake

    constructor(socket, playerName) {
        this.socket = socket
        this.playerName = playerName
        this.direction = Direction.SOUTH

        this.socket.on("client:changeDirection", direction => {
            this.direction = direction
        })
    }

    get snake() {
        return this.#snake
    }

    set snake(snake) {
        this.#snake = snake
    }
}
