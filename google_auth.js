const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// https://developers.google.com/tasks/quickstart/nodejs

const SCOPES = [
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly'
];

const ENV_PATH = path.join(__dirname, '.env');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(ENV_PATH);
    if(!content) return null
    const envVars = content.toString().split('\n')
    const clientId = envVars.find(r => r.substring(0, 22) === 'DHUD_GOOGLE_CLIENT_ID=')
    const clientSecret = envVars.find(r => r.substring(0, 26) === 'DHUD_GOOGLE_CLIENT_SECRET=')
    const clientToken = envVars.find(r => r.substring(0, 25) === 'DHUD_GOOGLE_CLIENT_TOKEN=')

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
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;

  const clientId = key.client_id
  const clientSecret = key.client_secret
  const token = client.credentials.refresh_token

  let envContent
  try {
    envContent =  await fs.readFile(ENV_PATH)
    envContent = envContent.toString()
  } catch(err) {
    envContent = ''
  }

  envContent = envContent.replace(/DHUD_GOOGLE_CLIENT_ID=.*(\n|$)/, '')
  envContent = envContent.replace(/DHUD_GOOGLE_CLIENT_SECRET=.*(\n|$)/, '')
  envContent = envContent.replace(/DHUD_GOOGLE_CLIENT_TOKEN=.*(\n|$)/, '')

  envContent += `\nDHUD_GOOGLE_CLIENT_ID=${clientId}`
  envContent += `\nDHUD_GOOGLE_CLIENT_SECRET=${clientSecret}`
  envContent += `\nDHUD_GOOGLE_CLIENT_TOKEN=${token}`

  envContent = envContent.replace(/\n\n/g, '\n')

  await fs.writeFile(ENV_PATH, envContent);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
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