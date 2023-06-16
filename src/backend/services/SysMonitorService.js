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
    this._cpuTempReadFails = 0
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
    let cpuTemp = this._getCpuTemp()
   
    return {
      cpuLoad: os.loadavg(1)/100,
      memLoad: 1-os.freememPercentage(),
      cpuTemp
    }
  }

  _getCpuTemp() {
    const maxFails = 8
    if(this._cpuTempReadFails >= maxFails) {
      return 0
    }
    try {
      const result = Number(fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8'))/1000
      this._cpuTempReadFails = 0
      return result
    } catch(err) {
      this._cpuTempReadFails++
      this.logger.warn(`Unable to read CPU temperature (${this._cpuTempReadFails}/${maxFails})`, String(err))
      if(this._cpuTempReadFails >= maxFails) {
        this.logger.warn('Disabling CPU temperature check due to too many errors')
      }
      return 0
    }
  }

  emit(payload, socket=null) {
    (socket || this._io).emit('system', payload)
  }

}

module.exports = SysMonitorService