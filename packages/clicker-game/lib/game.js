const defaults = require('lodash/defaults')

class Game {
  constructor(state = {}) {
    this.state = defaults({}, state, {
      initialScore: 0,
      actions: [],
      lastSynced: null
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

  getCurrentState() {
    const score =
      this.state.initialScore +
      this.state.actions.filter(a => a.action === "click").length
    return {
      score
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