const express = require('express')
const router = express.Router()
const fetch = require('node-fetch');
const getEnv = require('../getEnv.js')

router.get(`/`, async (req, res) => {
  const url = `${getEnv('DHUD_HA_URL')}/api/`
  const token = getEnv('DHUD_HA_ACCESS_TOKEN')

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
  if(!response.ok) {
    return res.json({error: response.status, url, content: await response.text()})
  }
  const json = await response.json()

  res.json(json)
})

module.exports = router
