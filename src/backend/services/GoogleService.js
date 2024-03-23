const Service = require('./Service.js')
const { google } = require('googleapis');
const process = require('process');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

const SCOPES = [
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/calendar.events.readonly'
];

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

class GoogleService extends Service {

  constructor(config, io, webApp, id) {
    super(config, io, webApp, id)
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

    webApp.get('/oauth2callback', async (req, res) => {
      const oauth2Client = new google.auth.OAuth2(
        this._config.getProp('google.clientId'),
        this._config.getProp('google.clientSecret'),
        'http://localhost:3000/oauth2callback'
      );
      
      const { tokens } = await oauth2Client.getToken(req.query.code);
      if(tokens.refresh_token) {
        this.config.setProp('google.clientToken', tokens.refresh_token)
        await this.config.save()
      }

      res.redirect('/');
    });
    
  }

  async onMessage({action, id}) {
    switch(action) {
      case 'auth': return await this._handleAuth()
      default: return super.onMessage({action, id})
    }
  }

  async _handleAuth() {
    const oauth2Client = new google.auth.OAuth2(
      this._config.getProp('google.clientId'),
      this._config.getProp('google.clientSecret'),
      'http://localhost:3000/oauth2callback'
    );
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/tasks',
        'https://www.googleapis.com/auth/calendar.events.readonly'
      ],
    });
    this.emit({ authUrl })
  }

}

module.exports = GoogleService