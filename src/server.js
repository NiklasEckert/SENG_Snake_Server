const Player = require("./player");
const httpServer = require("http").createServer()
const io = require("socket.io")(httpServer, {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
})
const PORT = Number(process.env.PORT) || 3000

const players = []

io.on("connection", socket => {
    console.log(`${socket.handshake.address} connected.`)
    let player = new Player(socket, "name")
    players.push(player)

    socket.on("disconnect", () => {
        if (players.find(p => p.socket === socket))
            players.splice(players.findIndex(p => p.socket === socket), 1)

        console.log(`${player.socket.handshake.address} / ${player.playerName} disconnecting.`)
    })

    console.log(players)
})

httpServer.listen(PORT, () => {
    console.log(`Snake-Server is listening on port ${PORT}`)
})
