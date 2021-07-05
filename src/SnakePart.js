/**
 * Class representing a part of a snake.
 */
class SnakePart {
    /**
     * Create a part of a snake.
     * @param posX {Number} - x position of the part.
     * @param posY {Number} - y position of the part.
     */
    constructor(posX, posY) {
        /** @member {Number} - The X position of the part. */
        this.posX = posX
        /** @member {Number} - The Y position of the port. */
        this.posY = posY
    }
}

module.exports = SnakePart
