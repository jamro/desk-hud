const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const Config = require('./src/backend/Config.js')

// https://developers.google.com/tasks/quickstart/nodejs

const SCOPES = [
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly'
];

const ENV_PATH = path.join(__dirname, '.env');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const config = new Config()

async function loadSavedCredentialsIfExist() {
  console.log('loading existing settings')
  try {
    await config.load()
   
    const clientId = config.getProp('google.clientId')
    const clientSecret = config.getProp('google.clientSecret')
    const clientToken = config.getProp('google.clientToken')

    if(!clientId || !clientSecret || !clientToken) return null

    return google.auth.fromJSON({
      type: "authorized_user",
      client_id: clientId.substring(22),
      client_secret: clientSecret.substring(26),
      refresh_token: clientToken.substring(25)
    });
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  console.log('updating settings')
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;

  const clientId = key.client_id
  const clientSecret = key.client_secret
  const token = client.credentials.refresh_token

  await config.load()

  config.setProp('google.clientId', clientId)
  config.setProp('google.clientSecret', clientSecret)
  config.setProp('google.clientToken', token)

  await config.save()
}

async function authorize() {
  console.log('Authorization...')
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    console.log('Already authorized')
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

authorize().then(() => console.log('done')).catch(console.error);