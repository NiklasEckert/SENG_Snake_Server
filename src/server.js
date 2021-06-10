const Player = require("./player");
const Lobby = require("./lobby");
const httpServer = require("http").createServer()
const io = require("socket.io")(httpServer, {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
})
const PORT = Number(process.env.PORT) || 3000

const players = []
const lobbies = []
let lobbyCount = 0;

io.on("connection", socket => {
    console.log(`${socket.handshake.address} connected.`)
    let player = new Player(socket, "not_received")
    players.push(player)

    socket.on("client:sendPlayerName", playerName => {
        player.playerName = playerName
    })

    socket.on("client:createLobby", options => {
        lobbyCount++
        const lobbyCode = generateLobbyCode()
        let lobby = new Lobby(lobbyCode, JSON.parse(options))
        lobbies.push(lobby)
        console.log(lobby)
        socket.emit("server:lobbyCreated", lobbyCode)
    })

    socket.on("client:joinLobby", lobbyCode => {
        let lobby = lobbies.find(lobby => lobby.code === lobbyCode)
        lobby.joinLobby(player)
    })

    socket.on("disconnect", () => {
        if (players.find(p => p.socket === socket))
            players.splice(players.findIndex(p => p.socket === socket), 1)

        console.log(`${player.socket.handshake.address} / ${player.playerName} disconnecting.`)
    })

    socket.emit("server:requestPlayerName")
})

function generateLobbyCode() {
    return `lobby:${lobbyCount}`
}

httpServer.listen(PORT, () => {
    console.log(`Snake-Server is listening on port ${PORT}`)
})
