# desk-hud


# Configuration of Raspberry PI

- [RPI] Expand filesystem `sudo raspi-config` > `Advanced Options` > `Expand Filesystem`
- [RPI] Enable ssh `sudo raspi-config`
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
