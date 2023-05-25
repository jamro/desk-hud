const express = require('express')
const path = require('path')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const fetch = require('node-fetch');
require('dotenv').config()

function getEnv(name) {
  const result = process.env[name]
  if(!result) throw new Error(`Env ${name} not found`)
  return result
}

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

app.get(`/api/weather/current`, async (req, res) => {
  const apiKey = getEnv('DHUD_OPEN_WEATHER_API_KEY')
  const lon = getEnv('DHUD_GEO_LON')
  const lat = getEnv('DHUD_GEO_LAT')
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

  try {
    const response = await fetch(url)
    const json = await response.json()
    return res.json(json)
  } catch (error) {
    console.log(error);
    res.json({error})
  }
})

app.get(`/api/weather/forecast`, async (req, res) => {
  const apiKey = getEnv('DHUD_OPEN_WEATHER_API_KEY')
  const lon = getEnv('DHUD_GEO_LON')
  const lat = getEnv('DHUD_GEO_LAT')
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

  try {
    const response = await fetch(url)
    const json = await response.json()
    return res.json(json)
  } catch (error) {
    console.log(error);
    res.json({error})
  }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

