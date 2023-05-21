# desk-hud


# Configuration of Raspberry PI

- Enable ssh `sudo raspi-config`
- connect to Raspberry PI: `ssh [username]@[hostname].local`
- Install Node.js 
```bash
sudo su
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
sudo apt-get install -y nodejs
```
- Install PM2 `npm install pm2@latest -g`
- Create app folder
```bash
sudo mkdir /var/www
sudo chown pi /var/www
```