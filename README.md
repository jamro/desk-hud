# desk-hud


# Configuration of Google API

- In the Google Cloud console, go to Menu `APIs & Services` > `Credentials`.
- Click `Create Credentials` > `OAuth client ID`.
- Click `Application type` > `Desktop app`.
- In the `Name` field, type a name for the credential. This name is only shown in the Google Cloud console.
- Click `Create`. The OAuth client created screen appears, showing your new Client ID and Client secret.
- Click `OK`. The newly created credential appears under OAuth 2.0 Client IDs.
- Save the downloaded JSON file as `credentials.json`
- Open `OAuth consent screen` and yourself to `Test users`

# Setup project on local machine

- Clone reporistory `git clone https://github.com/jamro/desk-hud.git`
- Enter project folter `cd desk-hud`
- Install dependencies `init i`
- Move `credentials.json` file downloaded in previous steps to `./desk-hud` folder
- Authorize in Google `node google_auth.js`. The script will create/populate `./.env` file
- Add extra variables to `./.env` file
```
DHUD_OPEN_WEATHER_API_KEY=...
DHUD_GEO_LAT=...
DHUD_GEO_LON=...
DHUD_HA_ACCESS_TOKEN=...
DHUD_GOOGLE_INBOX_TASKLIST_ID=...
DHUD_GOOGLE_ACTION_TASKLIST_ID=...
DHUD_GOOGLE_CALENDAR_IDS=...,...
```

# Configuration of Raspberry PI

- [RPI] Expand filesystem `sudo raspi-config` > `Advanced Options` > `Expand Filesystem`
- [RPI] Enable ssh `sudo raspi-config`
- [RPI] Disable screen saver ` xset s off`
- [RPI] setup env vars and copy them from your local `./.env` file: `sudo nano /etc/environment`
```
DHUD_OPEN_WEATHER_API_KEY=...
DHUD_GEO_LAT=...
DHUD_GEO_LON=...
DHUD_HA_ACCESS_TOKEN=...
DHUD_GOOGLE_INBOX_TASKLIST_ID=...
DHUD_GOOGLE_ACTION_TASKLIST_ID=...
DHUD_GOOGLE_CALENDAR_IDS=...,...
DHUD_GOOGLE_CLIENT_ID=...
DHUD_GOOGLE_CLIENT_SECRET=...
DHUD_GOOGLE_CLIENT_TOKEN=...
```
- [local] generate public and private keys `ssh-keygen`
- [local] copy public key to remote host `ssh-copy-id -i ~/.ssh/id_rsa.pub pi@raspberrypi.local`
- [local] add key to ssh: `ssh-add`
- [local] connect to Raspberry PI: `ssh [username]@[hostname].local`
- [RPI] Install Node.js 
```bash
sudo su
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
sudo apt-get install -y nodejs
```
- [RPI] Install PM2 `sudo npm install pm2@latest -g`
- [RPI] Create app folder
```bash
sudo mkdir /var/www
sudo chown pi /var/www
```
- [local] provision remote host `npm run provision-remote`
- [local] deploy `npm run deploy`
- [RPI] provision remote host `npm run provision-remote`
