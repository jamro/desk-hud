module.exports = {
  apps : [{
    name: "deck-hud",
    script: 'src/backend/index.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'pi',
      host : 'raspberrypi.local',
      ref  : 'origin/main',
      repo : 'https://github.com/jamro/desk-hud.git',
      path : '/var/www',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
