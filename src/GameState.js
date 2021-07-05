/**
 * Class representing a GameState.
 */
class GameState {

    /**
     * Create a GameState
     * @param snakes {Snake[]} - All snakes of the game.
     * @param gameIsRunning {boolean} - Set if the game is still running. (At least 2 players are still playing)
     */
    constructor(snakes, gameIsRunning) {
        /** @member {Snake[]} - The snakes on the field */
        this.snakes = snakes
        /** @member {boolean} - Indicator if the game is still running. (At least 2 players are still playing) */
        this.gameIsRunning = gameIsRunning
    }
}

module.exports = GameState
