const express = require('express')
const router = express.Router()
const { google } = require('googleapis');
const getEnv = require('../getEnv.js')

const auth = google.auth.fromJSON({
  type: "authorized_user",
  client_id: getEnv('DHUD_GOOGLE_CLIENT_ID'),
  client_secret: getEnv('DHUD_GOOGLE_CLIENT_SECRET'),
  refresh_token: getEnv('DHUD_GOOGLE_CLIENT_TOKEN'),
})

const calendar = google.calendar({ version: 'v3', auth });


router.get(`/`, async (req, res) => {
  const calIds = getEnv('DHUD_GOOGLE_CALENDAR_IDS').split(',')
  const today = Math.floor((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000
  const params = {
    timeMin: (new Date(today)).toISOString(),
    maxResults: 50,
    singleEvents: true,
    orderBy: 'startTime',
  }

  const obj2timestamp = (obj) => {
    return new Date(obj.dateTime || obj.date || 0).getTime()
  }

  const allEvents = []

  try {
    for(let calId of calIds) {
      const result = await calendar.events.list({...params, calendarId: calId})
      if(result.data.items.length) {
        const events = result.data.items.map(e => ({
          id: e.id,
          summary: e.summary,
          start: obj2timestamp(e.start),
          end: obj2timestamp(e.end),
          allDay: !!e.start.date
        }))
        allEvents.push(...events)
      }
    }
    res.json(allEvents.sort((a, b) => a.start - b.start));
  } catch(err) {
    console.log(err)
    res.json({error: err})
  }

})

module.exports = router