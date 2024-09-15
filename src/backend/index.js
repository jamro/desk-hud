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
const SysMonitorService = require('./services/SysMonitorService.js');
const services = require('../widgets/services.js');
const SocketLogger = require('./SocketLogger.js');

(async () => {
  await storage.init()
  
  const app = express()
  const server = http.createServer(app);
  const io = new Server(server);

  const config = new Config(new SocketLogger(io))
  await config.load()

  const port = config.getProp('core.port')
  config.coreLogger.log("Desk HUD started")
  
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  
  app.use(connectLiveReload());
  app.use(express.static(path.join(__dirname, 'www')))
  
  const serviceInstances = services.map((Def) => new Def(config, io, app))
  serviceInstances.push(new DistanceService(config, io))
  serviceInstances.push(new SysMonitorService(config, io))
 
  let watchDog
  try{
    const servicesStartingTime  = performance.now()
    watchDog = setInterval(() => {
      const startingDuration = Math.round((performance.now() - servicesStartingTime) / 1000)
      const notStarted = serviceInstances.filter(s => !s.started)
      notStarted.forEach(s => config.coreLogger.warn(`Service ${s.id} did not start after ${startingDuration} seconds`))

    }, 5000)
    await Promise.all(serviceInstances.map(s => s.start()))
  } catch(err) {
    config.coreLogger.error('Unable to start services')
    config.coreLogger.error(err)
  } finally {
    if(watchDog) clearInterval(watchDog)
  }
  io.on('connection', async (socket) => {

    const logHistory = config.coreLogger.getHistory()
    config.coreLogger.emit(logHistory)

    config.coreLogger.log("Client connected")
    await socket.emit('config', {
      widgets: {
        dateTime: config.getProp('dateTime'),
        webcam: {
          name: config.getProp('webcam.name'),
          areas: config.getProp('webcam.areas'),
          stream: {
            buffer: config.getProp('webcam.stream.buffer')
          }
        }
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
    config.coreLogger.log(`app listening on port ${port}`)
  })
  
})()
