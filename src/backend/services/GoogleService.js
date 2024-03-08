const Service = require('./Service.js')
const { google } = require('googleapis');

class GoogleService extends Service {

  constructor(config, io, id) {
    super(config, io, id)
    this._loop = null

    this.auth = google.auth.fromJSON({
      type: "authorized_user",
      client_id: this.config.getProp('google.clientId'),
      client_secret: this.config.getProp('google.clientSecret'),
      refresh_token: this.config.getProp('google.clientToken'),
    })

    this.auth.on('tokens', async (tokens) => {
      console.log("new google access token received")
      if (tokens.refresh_token) {
        console.log("Refreshing google token")
        this.config.setProp('google.clientToken', tokens.refresh_token)
        await this.config.save()
      }
    });
    
  }

}

module.exports = GoogleService