require('dotenv').config()

module.exports = {
  apps : [{
    name: "desk-hud",
    script: 'src/backend/index.js',
    watch: '.',
    ignore_watch : [
      'src/backend/www/hls',
    ],
    env: {
      DHUD_ENV: "development"
    },
    env_production : {
      DHUD_ENV: "production"
    }
  }],

  deploy : {
    production : {
      user : 'pi',
      host : 'deskhud.local',
      ref  : 'origin/main',
      repo : 'https://github.com/jamro/desk-hud.git',
      path : '/var/www',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
