const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: ["http://localhost:3000", "http://localhost:8080", "http://frontend-nginx"],
		methods: [ "GET", "POST" ],
		credentials: true
	}
})

io.on("connection", (socket) => {
	console.log("New connection:", socket.id);
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		console.log(`${data.from} calling ${data.userToCall}`);
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		console.log(`Call answered, signaling to ${data.to}`);
		io.to(data.to).emit("callAccepted", data.signal)
	})

	socket.on("callEnded", () => {
		console.log("Call ended by user:", socket.id);
		socket.broadcast.emit("callEnded")
	})
})

server.listen(5000, () => console.log("server is running on port 5000"))
