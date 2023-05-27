require('dotenv').config()

function getEnv(name) {
  const result = process.env[name]
  if(!result) throw new Error(`Env ${name} not found`)
  return result
}

module.exports = getEnv