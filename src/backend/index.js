const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  console.log("Response sent")
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})