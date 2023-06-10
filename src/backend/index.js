require('dotenv').config()
const express = require('express')
const path = require('path')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const http = require('http');
const { Server } = require("socket.io");
const Config = require('./Config.js');
const storage = require('node-persist');
const DistanceService = require('./services/DistanceService.js');
const services = require('../widgets/services.js');

(async () => {
  await storage.init()
  
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
  
  const serviceInstances = services.map((Def) => new Def(config, io))
  serviceInstances.push(new DistanceService(config, io))
 
  try{
    await Promise.all(serviceInstances.map(s => s.start()))
  } catch(err) {
    console.error('Unable to start services')
    console.error(err)
  }
  io.on('connection', async (socket) => {
    console.log("Client connected")
    await socket.emit('config', {
      widgets: {
        dateTime: config.getProp('dateTime')
      }
    })
    await Promise.all(serviceInstances.map(s => s.welcomeClient(socket)))
    socket.on('service', async ({serviceId, payload}) => {
      const service = serviceInstances.find(s => s.id === serviceId)
      if(service) {
        await service.onMessage(payload)
      }
    })
  });
  
  server.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
  
})()
