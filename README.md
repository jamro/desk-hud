# desk-hud


# Configuration of Google API

https://www.geeksforgeeks.org/how-to-integrate-google-calendar-in-node-js

# Configuration of Raspberry PI

- [RPI] Expand filesystem `sudo raspi-config` > `Advanced Options` > `Expand Filesystem`
- [RPI] Enable ssh `sudo raspi-config`
- [RPI] Disable screen saver ` xset s off`
- [RPI] setup env vars `sudo nano /etc/environment`
```
DHUD_OPEN_WEATHER_API_KEY=...
DHUD_GEO_LAT=...
DHUD_GEO_LON=...
DHUD_GOOGLE_CLIENT_EMAIL=...
DHUD_GOOGLE_PRIVATE_KEY=...
DHUD_GOOGLE_PROJECT_NUMBER=...
DHUD_GOOGLE_CALENDAR_IDS=...,...
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
