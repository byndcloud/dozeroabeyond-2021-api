const axios = require('axios').default
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/affirmations', (req, res) => {
  const affirmationsResponse = await axios.get('https://affirmations.dev')
  res.send(affirmationsResponse.data)
})

app.listen(port, () => {
  console.log(`API Ouvindo em http://localhost:${port}`)
})