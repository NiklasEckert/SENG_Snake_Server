const Direction = require('./Direction')
const SnakeHead = require("./SnakeHead");
const SnakePart = require("./SnakePart");

module.exports = class Snake {

    #playerLost

    constructor(snakeID, snakeColor, startPosition) {
        this.snakeID = snakeID
        this.snakeColor = snakeColor

        this.snakeHead = new SnakeHead(startPosition.posX, startPosition.posY, Direction.SOUTH)

        this.snakeParts = []
        this.snakeParts.push(this.snakeHead)
        for (let i = 1; i <= 3; i++) {
            this.snakeParts.push(new SnakePart(startPosition.posX, startPosition.posY - i))
        }

        this.#playerLost = false
    }

    moveSnake(direction, extend) {
        if (this.#playerLost)
            return

        if ((direction === Direction.NORTH && this.snakeHead.direction === Direction.SOUTH) ||
            (direction === Direction.WEST && this.snakeHead.direction === Direction.EAST) ||
            (direction === Direction.SOUTH && this.snakeHead.direction === Direction.NORTH) ||
            (direction === Direction.EAST && this.snakeHead.direction === Direction.WEST)) {
            direction = this.snakeHead.direction
        }

        let newX = this.snakeHead.posX
        let newY = this.snakeHead.posY
        switch (direction) {
            case 0:
                newY = newY - 1
                break
            case 1:
                newX = newX + 1
                break
            case 2:
                newY = newY + 1
                break
            case 3:
                newX = newX - 1
                break
        }

        let newHead = new SnakeHead(newX, newY, direction)

        let idx = this.snakeParts.findIndex(part => part === this.snakeHead)
        if (idx !== undefined)
            this.snakeParts[idx] = new SnakePart(this.snakeHead.posX, this.snakeHead.posY)

        this.snakeHead = newHead
        this.snakeParts.unshift(newHead)

        if (!extend)
            this.snakeParts.splice(this.snakeParts.length - 1)
    }

    get getPlayerLost() {
        return this.#playerLost
    }

    set setPlayerLost(playerLost) {
        this.#playerLost = playerLost
        if (this.#playerLost) {
            this.snakeParts = undefined
            this.snakeHead = undefined
        }
    }
}
