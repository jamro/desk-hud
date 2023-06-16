const Service = require('./Service.js')
const spawn = require('child_process').spawn
const exec = require('child_process').exec
const os 	= require('os-utils');
const fs 	= require('fs');
const path = require('path')

class SysMonitorService extends Service {

  constructor(config, io) {
    super(config, io, 'system')
    this._loop = null
  }

  async start() {

    if(this._loop) {
      clearInterval(this._loop)
    }
    this._loop = setInterval(() => this.update(), 3000)
    this.update()
  }


  async welcomeClient(socket) {
    const result = await this.fetchAll()
    if(result) {
      this.emit(result, socket)
    }
  }

  async update() {
    const result = await this.fetchAll()
    if(result) {
      this.emit(result)
    }
  }

  async fetchAll() {
    let cpuTemp = 0
    try {
      cpuTemp = Number(fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8'))/1000
    } catch(err) {
      console.warn(err)
    }
    return {
      cpuLoad: os.loadavg(1)/100,
      memLoad: 1-os.freememPercentage(),
      cpuTemp
    }
  }

  emit(payload, socket=null) {
    (socket || this._io).emit('system', payload)
  }

}

module.exports = SysMonitorService