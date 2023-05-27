require('dotenv').config()
const express = require('express')
const path = require('path')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const http = require('http');
const { Server } = require("socket.io");
const WeatherService = require('./services/WeatherService.js')
const CalendarService = require('./services/CalendarService.js');
const TodoService = require('./services/TodoService.js');

const app = express()
const server = http.createServer(app);
const io = new Server(server);
const port = 3000

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());
app.use(express.static(path.join(__dirname, 'www')))

const services = [
  new WeatherService(io),
  new CalendarService(io),
  new TodoService(io),
]
services.forEach(s => s.start())

io.on('connection', async (socket) => {
  console.log("Client connected")
  Promise.all(services.map(s => s.welcomeClient(socket)))
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

