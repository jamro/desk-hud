const Service = require('./Service.js')
const fetch = require('node-fetch');
const spawn = require('child_process').spawn
const path = require('path')

class DistanceService extends Service {

  constructor(config, io) {
    super(config, io, 'weather')
    this._loop = null
    this._proc = null
    this._queue = []
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
      this._proc = spawn('python', [path.resolve(__dirname, '..', 'distance.py')]);
    } catch(err) {
      console.log('Unable to spawn distance script', err)
      return 
    }
    this._proc.stdout.on('data', (data) => {
      const txt = data.toString()
      if(!isNaN(txt)) {
        this._queue.push(Number(txt))
      } else {
        console.log('stdout: ' + txt);
      }
    });
    
    this._proc.stderr.on('data', (data) => {
      console.error('stderr: ' + data.toString());
    });
    this._proc.on('error', (data) => {
      console.error('error: ' + data.toString());
    });
    
    this._proc.on('exit', (code) => {
      console.log('child process exited with code ' + code.toString());
      console.log('respawn in 5sec...')
      setTimeout(() => this._respawn(), 5000)
    });
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
    let sum = 0
    let count = 0
    let max = this._queue[0]
    let min = this._queue[0]
    let val
    while(this._queue.length > 10) {
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

    if((max - sum/count) > 10) {
      sum -= max
      count--
    }
    if((sum/count - min) > 10) {
      sum -= min
      count--
    }
    if(count <= 0) return null

    return {distance: Math.round(sum/count)}
  }

  emit(payload, socket=null) {
    (socket || this._io).emit('distance', payload)
  }

}

module.exports = DistanceService