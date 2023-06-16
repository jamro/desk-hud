const HISTORY_TIME = 1000*60*60*3

class SocketLogger {

  constructor(socket) {
    this._socket = socket
    this._moduleName = 'core'
    this._children = []
    this._history = []
  }

  createChild(moduleName) {
    const child = new SocketLogger(this._socket)
    child._moduleName = moduleName
    this._children.push(child)
    return child
  }

  error(...args) {
    const payload = {
      level: 'error',
      timestamp: new Date().getTime(),
      moduleName: this._moduleName,
      args
    }
    this._output(payload)
  }

  warn(...args) {
    const payload = {
      level: 'warn',
      timestamp: new Date().getTime(),
      moduleName: this._moduleName,
      args
    }
    this._output(payload)
  }

  log(...args) {
    const payload = {
      level: 'log',
      timestamp: new Date().getTime(),
      moduleName: this._moduleName,
      args
    }
    this._output(payload)
  }

  info(...args) {
    const payload = {
      level: 'info',
      timestamp: new Date().getTime(),
      moduleName: this._moduleName,
      args
    }
    this._output(payload)
  }

  debug(...args) {
    const payload = {
      level: 'debug',
      timestamp: new Date().getTime(),
      moduleName: this._moduleName,
      args
    }
    this._output(payload)
  }

  getHistory() {
    const history = [...this._history]
    for(let child of this._children) {
      history.push(...child.getHistory())
    }
    const now = new Date().getTime()
    return history
      .filter(e => e.timestamp >= now - HISTORY_TIME )
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  _output(payload) {
    console[payload.level || 'log'](...payload.args)
    this._history.push(payload)
    const now = new Date().getTime()
    while(this._history.length > 0 && this._history[0].timestamp < now - HISTORY_TIME) {
      this._history.shift()
    }
    this.emit(payload)
  }

  emit(payload) {
    this._socket.emit('log', Array.isArray(payload) ? payload :  [payload])
  }

}

module.exports = SocketLogger