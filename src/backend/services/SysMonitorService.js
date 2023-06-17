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
    this._cpuFanMode = 'off'
    this._isCpuFanRunning = false
  }

  async start() {

    if(this._loop) {
      clearInterval(this._loop)
    }
    this._loop = setInterval(() => this.update(), 3000)
    this.update()

    exec('raspi-gpio set 14 op dl', (err) => this.logger.warn('Unable turn CPU fan off', String(err)))
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
    if(result && this._cpuFanMode === 'auto') {
      this._adjustCpuFan(result.cpuTemp)
    }
  }

  async fetchAll() {
    let cpuTemp = this._getCpuTemp()
   
    return {
      cpuLoad: os.loadavg(1)/100,
      memLoad: 1-os.freememPercentage(),
      cpuTemp,
      cpuFanMode: this._cpuFanMode
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

  async onMessage(payload) {
    this.logger.log("message received", payload)
    if(payload.action === 'cpuFan' && payload.mode === 'on') {
      this.logger.log("Changing CPU fan mode to " + payload.mode)
      this._cpuFanMode = payload.mode
      this._startCpuFan()
      await this.update()
    } else if(payload.action === 'cpuFan' && payload.mode === 'off') {
      this.logger.log("Changing CPU fan mode to " + payload.mode)
      this._cpuFanMode = payload.mode
      this._stopCpuFan()
      await this.update()
    } else if(payload.action === 'cpuFan' && payload.mode === 'auto') {
      this.logger.log("Changing CPU fan mode to " + payload.mode)
      this._cpuFanMode = payload.mode
      await this.update()
    } 
  }

  _stopCpuFan() {
    exec('raspi-gpio set 14 op dl', (err) => this.logger.warn('Unable turn CPU fan off', String(err)))
    this._isCpuFanRunning = false
  }

  _startCpuFan() {
    exec('raspi-gpio set 14 op dh', (err) => this.logger.warn('Unable turn CPU fan on', String(err)))
    this._isCpuFanRunning = true
  }


  _adjustCpuFan(cpuTemp) {
    if(!this._isCpuFanRunning && cpuTemp > 65) {
      // start
      this._startCpuFan()
    } else if(this._isCpuFanRunning && cpuTemp < 55) {
      // stop
      this._stopCpuFan()
    }

  }

}

module.exports = SysMonitorService