const Service = require('./Service.js')
const spawn = require('child_process').spawn
const exec = require('child_process').exec
const path = require('path')

class DistanceService extends Service {

  constructor(config, io) {
    super(config, io, 'distance')
    this._loop = null
    this._proc = null
    this._queue = []
    this._distance = 0
    this._lastSensorDataTime = 10000
    this._isAwake = false
    this._isPowerOn = false
    this._inactivityTimer = 0
  }

  async start() {
    this._respawn()

    if(this._loop) {
      clearInterval(this._loop)
    }
    this._loop = setInterval(() => this.update(), 300)
    this.update()
  }

  _respawn() {
    try {
      this.logger.log(`spawning distance monitor (${this.config.isDevMode ? 'dev' : 'prod'})...`)
      if(this._proc) {
        this.logger.log("process alrady exists. killing")
        this._proc.noRespawn = true
        this._proc.kill()
      }
      if(this.config.isDevMode) {
        this._proc = spawn('node', [path.resolve(__dirname, '..', 'distance_mock.js')]);
      } else  {
        this._proc = spawn('python', [path.resolve(__dirname, '..', 'distance.py')]);
      }
    } catch(err) {
      this.logger.log('Unable to spawn distance script', err)
      return 
    }
    this._proc.stdout.on('data', (data) => {
      const txt = data.toString()
      if(!isNaN(txt)) {
        this._queue.push(Number(txt))
        this._lastSensorDataTime = performance.now()
      } else {
        this.logger.log('stdout: ' + txt);
      }
    });
    
    this._proc.stderr.on('data', (data) => {
      this.logger.error('stderr: ' + data.toString());
    });
    this._proc.on('error', (data) => {
      this.logger.error('error: ' + data.toString());
    });
    
    let proc = this._proc
    this._proc.on('exit', (code) => {
      this.logger.log('child process exited with code ' + (code || 0).toString());
      if(!proc.noRespawn) {
        this.logger.log('respawn in 5sec...')
        setTimeout(() => this._respawn(), 5000)
      }
    });
  }

  async welcomeClient(socket) {
    const result = await this.fetchAll() || {}
    this.emit({...result, distance: this._distance, sensorDataAge: Math.max(0, performance.now() - this._lastSensorDataTime)}, socket)
  }

  async update() {
    const result = await this.fetchAll()
    if(result) {
      this.emit(result)
    }
  }

  async fetchAll() {
    const dataAge = Math.max(0, performance.now() - this._lastSensorDataTime)
    if(dataAge > 3000) {
      this.logger.log("Sensor data is outdated. skipping")
      this._queue = []
      this._lastSensorDataTime = performance.now()
      this._respawn()
      return null;
    }
    if(this._queue.length === 0) {
      return null
    }
    let sum = 0
    let count = 0
    let max = this._queue[0]
    let min = this._queue[0]
    let val
    while(this._queue.length > 0) {
      count++
      val = this._queue.shift()
      sum += val
      min = Math.min(min, val)
      max = Math.max(max, val)
    }
    for(let i=0; i <this._queue.length; i++) {
      count++
      val = this._queue[i]
      sum += val
      min = Math.min(min, val)
      max = Math.max(max, val)
    }
    if(count <= 0) return null

    const distance = Math.round(sum/count)
    const wakeUpThreshold = this.config.getProp('core.distance.wakeUp')
    const goSleepThreshold = this.config.getProp('core.distance.goSleep')
    if(distance < goSleepThreshold) {
      this._inactivityTimer = 0
    } else {
      this._inactivityTimer+=500
    }
    if(this._isPowerOn  && this._inactivityTimer > this.config.getProp('core.powerOffTime')) {
      // power off
      this._isPowerOn = false
      this.logger.log("Power HDMI off")
      exec('vcgencmd display_power 0', (err) => this.logger.warn('Unable to turn HDMI off', String(err)))
    } else if(!this._isPowerOn && this._inactivityTimer === 0) {
      // power on
      this._isPowerOn = true
      this.logger.log("Power HDMI on")
      exec('vcgencmd display_power 1', (err) => this.logger.warn('Unable to turn HDMI on', String(err)))
    }
    if(distance < wakeUpThreshold && !this._isAwake) {
      // wake up
      this.logger.log("wake up")
      this._isAwake = true
      return {distance, action: 'wakeUp', dataAge}
    } else if(this._inactivityTimer > 10000 && this._isAwake) {
      // go sleep
      this.logger.log("go sleep")
      this._isAwake = false
      this._distance = distance
      return {distance, action: 'goSleep', dataAge}
    } else {
      return {distance, dataAge}
    }
    
  }

  emit(payload, socket=null) {
    (socket || this._io).emit('distance', payload)
  }

}

module.exports = DistanceService