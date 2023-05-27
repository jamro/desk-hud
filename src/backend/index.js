const express = require('express')
const path = require('path')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const fetch = require('node-fetch');
const { google } = require('googleapis');
require('dotenv').config()

function getEnv(name) {
  const result = process.env[name]
  if(!result) throw new Error(`Env ${name} not found`)
  return result
}

const auth = google.auth.fromJSON({
  type: "authorized_user",
  client_id: getEnv('DHUD_GOOGLE_CLIENT_ID'),
  client_secret: getEnv('DHUD_GOOGLE_CLIENT_SECRET'),
  refresh_token: getEnv('DHUD_GOOGLE_CLIENT_TOKEN'),
})

const calendar = google.calendar({ version: 'v3', auth });
const tasks = google.tasks({ version: 'v1', auth });

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

app.get(`/api/calendar`, async (req, res) => {

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

app.get(`/api/todo`, async (req, res) => {
  
  const queryTodo = async (id) => {
    const response = await tasks.tasks.list({
      tasklist: getEnv(id)
    });

    return response.data.items
      .map(t => ({
        id: t.id,
        title: t.title,
        updated: new Date(t.updated).getTime(),
        position: t.position,
        status: t.status,
        completed: new Date(t.completed).getTime() || null,
        due: new Date(t.due).getTime() || null,
      }))
      .sort((a, b) => String(a.position).localeCompare(String(b.position)))
  }
  const inbox = await queryTodo('DHUD_GOOGLE_INBOX_TASKLIST_ID')
  const action = await queryTodo('DHUD_GOOGLE_ACTION_TASKLIST_ID')
  const today = Math.floor((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000
  res.json({
    inbox: inbox.filter(t => !t.completed && !t.due),
    action: action.filter(t => !t.due && (!t.completed || t.completed > today)),
  })
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

