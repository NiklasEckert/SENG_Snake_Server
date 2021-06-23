const SnakePart = require("./SnakePart");
module.exports = class SnakeHead extends SnakePart {
    constructor(posX, posY, direction) {
        super(posX, posY)
        this.direction = direction
    }
}
