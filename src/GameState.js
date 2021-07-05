/**
 * Class representing a GameState.
 */
class GameState {

    /** @member {Snake[]} - The snakes on the field */
    snakes
    /** @member {boolean} - Indicator if the game is still running. */
    gameIsRunning

    /**
     * Create a GameState
     * @param snakes {Snake[]} - All snakes of the game.
     * @param gameIsRunning {boolean} - Set if the game is still running. (At least 2 players are still playing)
     */
    constructor(snakes, gameIsRunning) {
        this.snakes = snakes
        this.gameIsRunning = gameIsRunning
    }
}

module.exports = GameState
