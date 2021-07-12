const Direction = require('./Direction')
const SnakeHead = require("./SnakeHead");
const SnakePart = require("./SnakePart");

/** Class representing a snake. */
class Snake {

    /** @member {boolean} - Indicates if a player has lost */
    playerLost

    /**
     * Create a snake.
     * @param {String} snakeID - The ID of the snake.
     * @param {String} snakeColor - The color of the snake.
     * @param {{posX: Number, posY: Number}} startPosition - Starting position of the snake.
     */
    constructor(snakeID, snakeColor, startPosition) {
        /** @member {String} - The unique ID of the snake (equals player name) */
        this.snakeID = snakeID
        /** @member {String} - Hexcode of the color of the snake. */
        this.snakeColor = snakeColor

        /**
         * The head of the snake.
         * Gets updated every time the snake is moved.
         * @member {SnakeHead}
         */
        this.snakeHead = new SnakeHead(startPosition.posX, startPosition.posY, Direction.SOUTH)

        /** @member {SnakePart[]} - The parts of the snake. */
        this.snakeParts = []
        this.snakeParts.push(this.snakeHead)
        for (let i = 1; i <= 3; i++) {
            this.snakeParts.push(new SnakePart(startPosition.posX, startPosition.posY - i))
        }

        this.playerLost = false
    }

    /**
     * Move the snake into a direction and extend it by one part.
     * @param direction {Direction} - The direction the snake should move (@link Direction).
     * @param extend {boolean} - Set true if the snake should extend itself by one.
     */
    moveSnake(direction, extend) {
        if (this.playerLost)
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

    /**
     * Returns true then the player has lost.
     * @returns {boolean}
     */
    get playerLost() {
        return this.playerLost
    }

    /**
     * Set if the player hast lost.
     * @param playerLost {boolean}
     */
    set playerLost(playerLost) {
        this.playerLost = playerLost
        if (this.playerLost) {
            this.snakeParts = undefined
            this.snakeHead = undefined
        }
    }
}

module.exports = Snake
