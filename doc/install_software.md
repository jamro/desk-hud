# Install Guide - Software

## Setup project on local machine

- Clone reporistory `git clone https://github.com/jamro/desk-hud.git`
- Enter project folter `cd desk-hud`
- Install dependencies `init i`
- Rename `desk-hud-config.default.json` to `desk-hud-config.json` and fill missing data. See detailed instructions in [Configuration section](./configuration.md)

## Configuration of Raspberry PI

- Start Raspberry PI and open Terminal 
- change hostname to `deskhud.local`
- Enable ssh `sudo raspi-config`
- Open terminal on your local machine
  - generate public and private keys `ssh-keygen`
  - copy public key to remote host `ssh-copy-id -i ~/.ssh/id_rsa.pub pi@deskhud.local`
  - add key to ssh: `ssh-add`
  - connect to Raspberry PI: `ssh pi@deskhud.local`
- Install Node.js 
```bash
sudo su
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
sudo apt-get install -y nodejs
```
- Install PM2 `sudo npm install pm2@latest -g`
- Install PM@ log rotate `pm2 install pm2-logrotate`
- Create app folder
```bash
sudo mkdir /var/www
sudo chown pi /var/www
```
- setup env var with path to config file and add it to: `sudo nano /etc/environment`
```
DHUD_CONFIG=/home/pi/desk-hud-config.json 
```
- Expand filesystem `sudo raspi-config` > `Advanced Options` > `Expand Filesystem`
- Edit `/boot/config.txt` and replace `dtoverlay=vc4-kms-v3d` by `dtoverlay=vc4-fkms-v3d` to enable hdmi monitor control
- Disable screen saver `xset s off`
- On you rlocal machine
  - copy config to Raspberry PI: `scp desk-hud-config.json pi@deskhud.local:/home/pi/desk-hud-config.json `
  - provision remote host `npm run provision-remote`
  - deploy `npm run deploy`
- on Raspberry Pi Desktop, open web browser, go to http://localhost:3000 and go full screen


## Enable auto start after boot
  - connect to Raspberry PI: `ssh pi@deskhud.local`
- make sure PM2 starts automatically after boot `pm2 startup`
- edit autostart: `sudo nano /etc/xdg/lxsession/LXDE-pi/autostart` and add following lines
```
@chromium-browser --kiosk http://localhost:3000/
@unclutter -idle 0.1 -root
```
- Reload of the page may be necessary sine Desk-HUD server may not be immediately available 

In order to exit Chromium kiosk mode, press Ctrl+F4