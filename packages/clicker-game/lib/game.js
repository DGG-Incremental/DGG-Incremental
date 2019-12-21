const defaults = require("lodash/defaults")
const sum = require("lodash/sum")
const toInteger = require("lodash/toInteger")
const maxBy = require("lodash/maxBy")

class Game {
  constructor(state = {}) {
    this.state = defaults({}, state, {
      pepes: 0,
      yees: 0,
      generators: 0,
      actions: [],
      lastSynced: new Date(0)
    })
    this.state.lastSynced = new Date(this.state.lastSynced)
  }

  pushAction(action) {
    const timestamp = maxBy([new Date(), this.state.lastSynced], d =>
      d.getTime()
    )
    this.state.actions.push({ action, timestamp })
  }

  clickPepe() {
    this.pushAction("clickPepe")
  }

  clickYee() {
    this.pushAction("clickYee")
  }

  addGenerator() {
    this.pushAction("addGenerator")
  }

  getCurrentState(timestamp) {
    timestamp = timestamp || new Date()
    const { lastSynced, actions } = this.state
    const currentActions = actions.filter(
      a =>
        a.timestamp.getTime() >= lastSynced.getTime() && true
        // a.timestamp.getTime() <= timestamp.getTime()
    )

    const pepeClicks = currentActions.filter(a => a.action === "clickPepe")
      .length
    const yeeClicks = currentActions.filter(a => a.action === "clickYee").length

    const pepeScore = this.state.pepes + pepeClicks
    const yeeScore = this.state.yees + yeeClicks
    return {
      pepes: pepeScore,
      yees: yeeScore
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
