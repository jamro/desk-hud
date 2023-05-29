const GoogleService = require('./GoogleService.js')
const { google } = require('googleapis');

class CalendarService extends GoogleService {

  constructor(config, io) {
    super(config, io, 'calendar')
    this._loop = null

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  async start() {
    if(this._loop) {
      clearInterval(this._loop)
    }
    this._loop = setInterval(() => this.update(), 1000*60*5)
    this.update()
  }

  async welcomeClient(socket) {
    this.emit(await this.fetchAll(), socket)
  }

  async update() {
    this.emit(await this.fetchAll())
  }

  async fetchAll() {
    const calIds = this.config.getProp('google.calendars')
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
    for(let calId of calIds) {
      const result = await this.calendar.events.list({...params, calendarId: calId})
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
    return allEvents.sort((a, b) => a.start - b.start)
  
  }

}

module.exports = CalendarService