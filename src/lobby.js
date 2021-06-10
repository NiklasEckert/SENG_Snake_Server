const LobbyStatus = {
    WAITING: 0,
    RUNNING: 1,
    FINISHED: 2
}
module.exports = LobbyStatus

module.exports = class Lobby {
    #players = []
    #status = LobbyStatus.WAITING

    constructor(code, options) {
        this.code = code
        this.options = options
    }

    joinLobby(player) {
        if (this.#players.length >= this.options.lobbySize) {
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
        player.socket.emit("lobby:joined")
    }
}
