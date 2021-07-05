const Direction = require("./Direction");

/**
 * Class representing a player.
 */
class Player {

    #snake
    /** @member {Socket} - The socket.io socket of the player. */
    socket

    /**
     * Create a player.
     * @param socket {Socket} - The socket.io socket of the player.
     * @param playerName {String} - The player name.
     */
    constructor(socket, playerName) {
        this.socket = socket
        /** @member {String} - The name of the player */
        this.playerName = playerName
        /** @member {Direction} - The direction the snake of the player is moving next. */
        this.direction = Direction.SOUTH

        this.socket.on("client:changeDirection", direction => {
            this.direction = direction
        })
    }

    /**
     * Returns the snake that the player controls.
     * @returns {Snake}
     */
    get snake() {
        return this.#snake
    }

    /**
     * Set the snake that the player controls.
     * @param snake
     */
    set snake(snake) {
        this.#snake = snake
    }
}

module.exports = Player
