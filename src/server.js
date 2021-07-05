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

    socket.on("client:createLobby", options => {
        lobbyCount++
        const lobbyCode = generateLobbyCode()
        let lobby = new Lobby(lobbyCode, JSON.parse(options))
        lobbies.push(lobby)
        console.log(`Lobby ${lobbyCode} created ...`)
        socket.emit("server:lobbyCreated", lobbyCode)
    })

    socket.on("client:joinLobby", (lobbyCode, playerName) => {
        if (lobbies.find(lobby => lobby.players.find(lobbyPlayer => lobbyPlayer === player)))
            return

        player.playerName = playerName
        let lobby = lobbies.find(lobby => lobby.code === lobbyCode)
        if (lobby)
            lobby.joinLobby(player)
    })

    socket.on("disconnect", () => {
        if (players.find(p => p.socket === socket))
            players.splice(players.findIndex(p => p.socket === socket), 1)

        console.log(`${player.socket.handshake.address} / ${player.playerName} disconnecting.`)
    })
})

function generateLobbyCode() {
    return `lobby:${lobbyCount}`
}

// setInterval(() => {
//     const finishedLobbies = lobbies.filter(lobby => lobby.status === 2)
//     // console.log(finishedLobbies)
//
//     // for (const lobbyKey in lobbies.filter(lobby => lobby.status === 2)) {
//     //     console.log(`Removed lobby ${lobbyKey}`)
//     //     lobbies.splice(lobbies.findIndex(l => l.code === lobbyKey.code), 1)
//     // }
// }, 5000)

httpServer.listen(PORT, () => {
    console.log(`Snake-Server is listening on port ${PORT}`)
})
