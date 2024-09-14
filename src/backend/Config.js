const path = require('path')
const fs = require('fs').promises
require('dotenv').config()

class Config {

  constructor(logger) {
    this._logger = logger
    this._json = {}
  }

  get coreLogger() {
    return this._logger
  }

  get isDevMode() {
    return process.env.DHUD_ENV === 'development'
  }

  _getConfigPath() {
    let configPath = process.env.DHUD_CONFIG
    if(!configPath) {
      configPath = path.resolve(__dirname, '..', '..', 'desk-hud-config.json')
    }
    configPath = configPath.trim();
    return configPath
  }

  async load() {
    let configPath = this._getConfigPath()
    this._logger.log(`Config path: ${configPath}`)
    try {
      const rawConfig = await fs.readFile(configPath, "utf-8");
      this._json = JSON.parse(rawConfig)
      this._logger.log('Configuration loaded successfully')
    } catch(err) {
      this._logger.log(`--------------------------------------------------------------------`)
      this._logger.log(`Unable to open configuration file`)
      this._logger.log(`- Make sure that desk-hud-config.json exists in projet root location`)
      this._logger.log(`  or DHUD_CONFIG env var is defined and points to config location`)
      this._logger.log(`- Make sure that config file is a valid JSON`)
      this._logger.log(`- Follow README.md to create a new config file`)
      this._logger.log(`--------------------------------------------------------------------`)
      throw err
    }
  }

  async save() {
    let configPath = this._getConfigPath()
    this._logger.log(`Config path: ${configPath}`)
    await fs.writeFile(configPath, JSON.stringify(this._json, null, 2))
    this._logger.log('Configuration saved successfully')
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