const Service = require('./Service.js')
const { google } = require('googleapis');

class GoogleService extends Service {

  constructor(io, id) {
    super(io, id)
    this._loop = null

    this.auth = google.auth.fromJSON({
      type: "authorized_user",
      client_id: this.getConfig('DHUD_GOOGLE_CLIENT_ID'),
      client_secret: this.getConfig('DHUD_GOOGLE_CLIENT_SECRET'),
      refresh_token: this.getConfig('DHUD_GOOGLE_CLIENT_TOKEN'),
    })
    
  }


}

module.exports = GoogleService