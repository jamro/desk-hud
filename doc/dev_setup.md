# Setup of Development Environment

## Setup project on local machine

- Clone reporistory `git clone https://github.com/jamro/desk-hud.git`
- Enter project folter `cd desk-hud`
- Install dependencies `init i`
- Rename `desk-hud-config.default.json` to `desk-hud-config.json` and fill missing data. See detailed instructions in [Configuration section](./configuration.md)

## Run development mode

- start backend services: `npm run deploy-local`
- run build of frontend in watch mode: `npm run watch`
- open [http://localhost:3000](http://localhost:3000)
