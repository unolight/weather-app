const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const config = require("./config/api-key");

const app = express();
app.use(index);

console.log(config.key);
const server = http.createServer(app);
const io = socketIo(server);
const getApi = async socket => {
	try {
		const res = await axios.get(
			"https://api.darksky.net/forecast/"+ config.key +"/25.0330,121.5654"
		);

		socket.emit("FromAPI", res.data.currently.temperature);

	} catch (error) {
		console.error(`Error: ${error.code}`);
	}
};

// io event
let interval;
io.on("connection", socket => {
	console.log("New client connected");
	if(interval) { clearInterval(interval); }
	interval = setInterval(() => getApi(socket), 10000);
	socket.on("disconnect", () => console.log(
		"Client disconnected"
	));
});



server.listen(port, ()=>console.log(`Listening on port ${port}`));

