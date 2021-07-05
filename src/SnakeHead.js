const SnakePart = require("./SnakePart");

/**
 * Class representing a head of a snake.
 * @extends SnakePart
 */
class SnakeHead extends SnakePart {
    /**
     * Create a SnakeHead
     * @param posX {Number} - x position of the head.
     * @param posY {Number} - y position of the head.
     * @param direction {Direction} - The direction the head is facing.
     */
    constructor(posX, posY, direction) {
        super(posX, posY)
        /** @member {Direction} - The direction the head is facing. */
        this.direction = direction
    }
}

module.exports = SnakeHead
