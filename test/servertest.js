const io = require("socket.io-client")

const URL = process.env.URL || "http://niklaseckert.ddns.net"
const PORT = Number(process.env.PORT) || 3000

console.log(`${URL}:${PORT}`)
const socket = io(`${URL}:${PORT}`, {
    withCredentials: false,
    transports: ['websocket']
})

socket.connect()
