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
const RoomService = require('./services/RoomService.js');
const DistanceService = require('./services/DistanceService.js');
const Config = require('./Config.js');

(async () => {
  const config = new Config()
  await config.load()

  const app = express()
  const server = http.createServer(app);
  const io = new Server(server);
  const port = config.getProp('core.port')
  
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  
  app.use(connectLiveReload());
  app.use(express.static(path.join(__dirname, 'www')))
  
  const services = [
    new WeatherService(config, io),
    new CalendarService(config, io),
    new TodoService(config, io),
    new RoomService(config, io),
    new DistanceService(config, io),
  ]
  try{
    await Promise.all(services.map(s => s.start()))
  } catch(err) {
    console.error('Unable to start services')
    console.error(err)
  }
  io.on('connection', async (socket) => {
    console.log("Client connected")
    await Promise.all(services.map(s => s.welcomeClient(socket)))
    socket.on('service', async ({serviceId, payload}) => {
      const service = services.find(s => s.id === serviceId)
      if(service) {
        await service.onMessage(payload)
      }
    })
  });
  
  server.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
  
})()
