const Snake = require("./Snake");
const GameState = require("./GameState");
const LobbyStatus = {
    WAITING: 0,
    RUNNING: 1,
    FINISHED: 2
}
module.exports = LobbyStatus

module.exports = class Lobby {
    #players = []
    #status = LobbyStatus.WAITING
    #gameStates = []
    #snakes = []

    constructor(code, options) {
        this.code = code
        this.options = options
    }

    joinLobby(player) {
        if (this.#players.length >= this.options.playerCount) {
            player.socket.emit("application_error", {
                code: 30001,
                message: "Lobby is already full"
            })
            return
        }

        if (this.#status !== LobbyStatus.WAITING) {
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
            { posX: 10, posY: 10 }
        )
        this.#snakes.push(snake)
        player.snake = snake
        player.socket.emit("lobby:joined")

        if (this.#players.length === this.options.playerCount)
            this.#startGame()
    }

    async #startGame() {
        let gameState = this.#createFirstGameState()
        this.#players.forEach(player => {
            player.socket.emit("server:sendGameState", gameState)
        })
        while (gameState.gameIsRunning) {
            gameState = this.#createNextGameState()
            await this.#sleep(1000)
        }
    }

    #createFirstGameState() {
        const newGameState = new GameState(this.#snakes, true)
        this.#gameStates.push(newGameState)
        this.#players.forEach(player => {
            player.socket.emit("server:sendGameState", newGameState)
        })
        return newGameState
    }

    #createNextGameState() {
        this.#players.forEach(player => {
            player.snake.moveSnake(player.direction)
        })

        this.#snakes.forEach(snake => {
            if (this.#hasCollisionWithOtherSnakes(snake, this.#snakes.filter(otherSnake => otherSnake !== snake)))
                snake.setPlayerLost(true)

            if (this.#hasCollisionWithBounds(snake))
                snake.setPlayerLost(true)
        })

        const gameIsRunning = this.#snakes.filter(snake => !snake.playerLost).length > 1
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

    #sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

}
