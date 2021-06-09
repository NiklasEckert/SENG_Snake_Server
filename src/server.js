const httpServer = require("http").createServer()
const io = require("socket.io")(httpServer, {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
})

const PORT = Number(process.env.PORT) || 3000

io.on("connection", socket => {
    console.log(`${socket.handshake.address} connected.`)
})

httpServer.listen(PORT, () => {
    console.log(`Snake-Server is listening on port ${PORT}`)
})
