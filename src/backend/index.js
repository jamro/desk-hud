const express = require('express')
const path = require('path')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const fetch = require('node-fetch');
const { google } = require('googleapis');
const roomRouter = require('./routes/room.js')
const weatherRouter = require('./routes/weather.js')
const calendarRouter = require('./routes/calendar.js')
const tasksRouter = require('./routes/tasks.js')
const getEnv = require('./getEnv.js')

const app = express()
const port = 3000

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());
app.use(express.static(path.join(__dirname, 'www')))

app.use('/api/todo', tasksRouter)
app.use('/api/calendar', calendarRouter)
app.use('/api/weather', weatherRouter)
app.use('/api/room', roomRouter)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

