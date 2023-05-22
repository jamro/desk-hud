const express = require('express')
const path = require('path')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

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

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})