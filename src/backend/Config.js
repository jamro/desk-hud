const path = require('path')
const fs = require('fs').promises
require('dotenv').config()

class Config {

  constructor() {
    this._json = {}
  }

  get isDevMode() {
    return process.env.DHUD_ENV === 'development'
  }

  _getConfigPath() {
    let configPath = process.env.DHUD_CONFIG
    if(!configPath) {
      configPath = path.resolve(__dirname, '..', '..', 'desk-hud-config.json')
    }
    return configPath
  }

  async load() {
    let configPath = this._getConfigPath()
    console.log(`Config path: ${configPath}`)
    try {
      const rawConfig = await fs.readFile(configPath, "utf-8");
      this._json = JSON.parse(rawConfig)
      console.log('Configuration loaded successfully')
    } catch(err) {
      console.log(`--------------------------------------------------------------------`)
      console.log(`Unable to open configuration file`)
      console.log(`- Make sure that desk-hud-config.json exists in projet root location`)
      console.log(`  or DHUD_CONFIG env var is defined and points to config location`)
      console.log(`- Make sure that config file is a valid JSON`)
      console.log(`- Follow README.md to create a new config file`)
      console.log(`--------------------------------------------------------------------`)
      throw err
    }
  }

  async save() {
    let configPath = this._getConfigPath()
    console.log(`Config path: ${configPath}`)
    await fs.writeFile(configPath, JSON.stringify(this._json, null, 2))
    console.log('Configuration saved successfully')
  }

  getProp(propPath) {
    const segments = propPath.split('.')

    let pointer = this._json
    while(segments.length > 0) {
      if(!pointer[segments[0]]) {
        throw new Error(`Config prop not fount at ${propPath}`)
      }
      pointer = pointer[segments.shift()]
    }

    return pointer
  }

  setProp(propPath, value) {
    const segments = propPath.split('.')

    let pointer = this._json
    while(segments.length > 1) {
      if(!pointer[segments[0]]) {
        pointer[segments[0]] = {}
      }
      pointer = pointer[segments.shift()]
    }
    pointer[segments[0]] = value


    return pointer
  }
}

module.exports = Config