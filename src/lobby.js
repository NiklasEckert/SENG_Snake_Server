const Snake = require("./Snake");
const GameState = require("./GameState");

/**
 * Enum representing the status of the lobby.
 *
 * @readonly
 * @enum {Number}
 * @type {{RUNNING: number, WAITING: number, FINISHED: number}}
 */
const LobbyStatus = {
    /** The lobby is waiting for new players */
    WAITING: 0,
    /** The lobby is running */
    RUNNING: 1,
    /** The lobby has finished */
    FINISHED: 2
}
module.exports = LobbyStatus

/**
 * Class representing a game lobby.
 */
class Lobby {
    #players = []
    #status = LobbyStatus.WAITING
    #gameStates = []
    #snakes = []
    /** @member {String} - The unique code of the lobby */
    code
    /** @member {{playerCount: Number, size: { x: Number, y: Number } }} - A object that holds all optional parameters to create the lobby */
    options

    /**
     * Create a lobby.
     *
     * @param code {String} - The unique code of the lobby.
     * @param options {{playerCount: Number, size: { x: Number, y: Number } }} - Optional parameters to create a lobby.
     */
    constructor(code, options) {
        this.code = code
        this.options = options
    }

    /**
     * Join a lobby.
     * When the number of players has been reached, the game starts immediately.
     *
     * @param player {Player} - The player that wants to join.
     */
    joinLobby(player) {
        /**
         * Event that sends error messages to the client.
         *
         * @event lobby:application_error
         * @property {Number} code - The error code.
         * @property {Number} message - the error message.
         */

        if (this.#players.length >= this.options.playerCount) {
            /**
             * Fires the error, that indicates whether the lobby is already full.
             *
             * @method
             * @fires lobby:application_error
             */
            player.socket.emit("application_error", {
                code: 30001,
                message: "Lobby is already full"
            })
            return
        }

        if (this.#status !== LobbyStatus.WAITING) {
            /**
             * Fires the error, that indicates whether the lobby is already running.
             *
             * @method
             * @fires lobby:application_error
             */
            player.socket.emit("application_error", {
                code: 30002,
                message: "Lobby is already running"
            })
            return
        }

        this.#players.push(player)
        let snake = new Snake(
            player.playerName,
            "#" + Math.floor(Math.random()*16777215).toString(16),
            { posX: 5 + (this.#players.length * 2), posY: 5 }
        )

        this.#snakes.push(snake)
        player.snake = snake

        /**
         * Event that lets the client know that it successfully joined a lobby.
         *
         * @event lobby:lobby:joined
         */

        /**
         * Fires the error, that indicates whether the lobby is already running.
         *
         * @method
         * @fires lobby:application_error
         */
        player.socket.emit("lobby:joined")

        if (this.#players.length === this.options.playerCount)
            this.#startGame()
    }

    /**
     * Starts the game.
     *
     * @async
     * @returns {Promise<void>}
     */
    async #startGame() {
        console.log(`Lobby ${this.code} started...`)
        this.#status = LobbyStatus.RUNNING
        let gameState = this.#createFirstGameState()
        this.#sendGameStateToAllPlayers(gameState)
        while (gameState.gameIsRunning) {
            await this.#sleep(1000)
            gameState = this.#createNextGameState()
            this.#sendGameStateToAllPlayers(gameState)
        }
        this.#status = LobbyStatus.FINISHED
        console.log(`Lobby ${this.code} finished`)
    }

    /**
     * Event that sends a game state to a client.
     *
     * @event server:sendGameState
     * @property {GameState} gameState - The game state.
     */

    /**
     * Sends a GameState to all players of the lobby.
     *
     * @method
     * @param gameState {GameState} - The GameState that should be send.
     * @fires server:sendGameState
     */
    #sendGameStateToAllPlayers(gameState) {
        this.#players.forEach(player => {
            player.socket.emit("server:sendGameState", gameState)
        })
    }

    /**
     * Creates the first GameState of the lobby.
     *
     * @returns {GameState}
     */
    #createFirstGameState() {
        const newGameState = new GameState(this.#snakes, true)
        this.#gameStates.push(newGameState)
        return newGameState
    }

    #createNextGameState() {
        this.#players.forEach(player => {
            player.snake.moveSnake(player.direction, this.#gameStates.length % 5 === 0)
        })

        this.#snakes.forEach(snake => {
            if (this.#hasCollisionWithOtherSnakes(snake, this.#snakes.filter(otherSnake => otherSnake !== snake)))
                snake.playerLost = true

            if (this.#hasCollisionWithBounds(snake))
                snake.playerLost = true

            if (this.#hasCollisionWithItself(snake))
                snake.playerLost = true
        })

        let gameIsRunning
        if (this.options.playerCount === 1) {
            gameIsRunning = this.#snakes.filter(snake => !snake.playerLost).length > 0
        } else {
            gameIsRunning = this.#snakes.filter(snake => !snake.playerLost).length > 1
        }
        const newGameState = new GameState(this.#snakes, gameIsRunning)

        this.#gameStates.push(newGameState)
        return newGameState
    }

    #hasCollisionWithOtherSnakes(snake, others) {
        let collision = false
        others.forEach(other => {
            other.snakeParts.forEach(part => {
                if (snake.snakeHead.posX === part.posX && snake.snakeHead.posY === part.posY)
                    collision = true
            })
        })
        return collision
    }

    #hasCollisionWithBounds(snake) {
        return snake.snakeHead.posX < 0 ||
               snake.snakeHead.posX > this.options.size.x ||
               snake.snakeHead.posY < 0 ||
               snake.snakeHead.posY > this.options.size.y
    }

    #hasCollisionWithItself(snake) {
        if (snake.snakeHead == undefined || snake.snakeParts == undefined)
            return

        let collision = false
        snake.snakeParts.filter(part => part !== snake.snakeHead).forEach(part => {
            if (snake.snakeHead.posX === part.posX && snake.snakeHead.posY === part.posY)
                collision = true
        })
        return collision
    }

    #sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    /**
     * Returns a array of all players of the lobby.
     *
     * @returns {Player[]}
     */
    get players() {
        return this.#players
    }

    /**
     * Returns the current status of the lobby.
     *
     * @returns {LobbyStatus|Number}
     */
    get status() {
        return this.#status
    }

}

module.exports = Lobby
