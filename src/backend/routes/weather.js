const express = require('express')
const router = express.Router()
const fetch = require('node-fetch');
const getEnv = require('../getEnv.js')

router.get(`/current`, async (req, res) => {
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

router.get(`/forecast`, async (req, res) => {
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
module.exports = router