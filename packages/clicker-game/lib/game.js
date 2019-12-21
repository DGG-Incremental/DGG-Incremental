const defaults = require("lodash/defaults")
const sum = require("lodash/sum")
const toInteger = require("lodash/toInteger")
const maxBy = require("lodash/maxBy")
const { exceedsRateLimit } = require("./validations")

const _ = require("lodash")

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

  pushAction(action, timestamp) {
    const _timestamp = maxBy(
      [timestamp || new Date(), this.state.lastSynced],
      d => d.getTime()
    )
    this.state.actions.push({ action, timestamp: _timestamp })
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

  getCurrentState() {
    return this.getStateAt(new Date())
  }

  getStateAt(timestamp) {
    const { lastSynced, actions } = this.state
    const currentActions = actions.filter(
      a =>
        a.timestamp.getTime() >= lastSynced.getTime() &&
        a.timestamp.getTime() <= timestamp.getTime()
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
    if (exceedsRateLimit(this)) {
      throw "Too many actions"
    }
  }

  fastForward(game, target) {
    // Return a game object that is passed game + actions in current game that
    // have a time stamp after passed game
    const actions = this.state.actions.filter(
      a => a.timestamp > target || game.state.lastSynced
    )
    return new Game({
      ...game.state,
      actions
    })
  }
}

module.exports = Game
