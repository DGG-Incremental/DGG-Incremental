const defaults = require("lodash/defaults")
const sum = require('lodash/sum')
const toInteger = require('lodash/toInteger')

class Game {
  constructor(state = {}) {
    this.state = defaults({}, state, {
	  initialScore: 0,
	  generators: 0,
      actions: [],
      lastSynced: new Date(0)
    })
    this.state.lastSynced = new Date(this.state.lastSynced)
  }

  pushAction(action) {
    const timestamp = new Date()
    this.state.actions.push({ action, timestamp })
  }

  click() {
    this.pushAction("click")
  }

  addGenerator() {
	  this.pushAction('addGenerator')
  }

  getCurrentState(timestamp) {
	timestamp = timestamp || new Date()
	const {lastSynced, actions, initialScore, generators} = this.state	
	const currentActions = actions.filter(a => a.timestamp > lastSynced && a.timestamp <= timestamp)
	const clicks = currentActions.filter(a => a.action === 'click').length

	const addGeneratorActions = currentActions.filter(a => a.action === 'addGenerator') 
	const generatorCount = addGeneratorActions.length + generators

	const generatorClickProduction = sum(addGeneratorActions.map(ga => {
		const interval = timestamp - ga.timestamp
		return toInteger(interval / 1000) // One click per second
	})) + (timestamp - lastSynced) * generators / 1000


	const score = initialScore + clicks + generatorClickProduction
    return {
	  score,
	  generators: generatorCount
    }
  }

  validate() {
    return true
  }

  fastForward(game) {
    // Return a game object that is passed game + actions in current game that
    // have a time stamp after passed game
    const actions = this.state.actions.filter(
      a => a.timestamp > game.state.lastSynced
    )
    return new Game({
      ...game.state,
      actions
    })
  }
}

module.exports = Game
