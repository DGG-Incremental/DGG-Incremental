const express = require('express')
const app = express()
const port = 3000
const _ = require('lodash')
var bodyParser = require('body-parser')
var cors = require('cors');

const LEADERBOARD = {
}

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/leaderboard', (req, res) => {
	res.send(
		_(LEADERBOARD)
			.chain()
			.toPairs()
			.orderBy(([name, count]) => count)
			.reverse()
			.value()	
	)
})

app.get('/leaderboard/:name', (req, res) => {
	res.send({clicks: LEADERBOARD[req.params.name]})
})
app.put('/leaderboard/:name', (req, res) => {
	LEADERBOARD[req.params.name] = req.body.clicks
	res.send()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))