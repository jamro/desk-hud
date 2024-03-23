const GoogleService = require('../../backend/services/GoogleService.js')
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
    try {
      this.emit(await this.fetchAll(), socket)
    } catch (err) {
      this.logger.error(err)
    }
  }

  async update() {
    try {
      this.emit(await this.fetchAll())
    } catch (err) {
      this.logger.error(err)
    }
  }

  async fetchAll() {
    try {
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

          const events = result.data.items.map(e => {
            const start = obj2timestamp(e.start)
            const end = obj2timestamp(e.end)
            return {
              id: e.id, 
              summary: e.summary,
              start,
              end,
              allDay: !!e.start.date || ((end - start) > 23*60*60*1000)
            }
          })
          allEvents.push(...events)
        }
      }
      return {
        allEvents: allEvents.sort((a, b) => a.start - b.start),
        error: null
      }
    } catch (error) {
      if (error.response && error.response.data && (error.response.data.error === 'invalid_grant' || error.response.data.error_description.includes('Token has been expired or revoked'))) {
        this.logger.error('Token has been expired or revoked.')
        this.logger.error(error)
        return {
          allEvents: [],
          error: 'token_expired'
        }
      } else {
        throw error
      }
    }
  }

}

module.exports = CalendarService